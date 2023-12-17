import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
    GetTranscriptionJobCommand,
    StartTranscriptionJobCommand,
    TranscribeClient,
} from "@aws-sdk/client-transcribe";

function getClient() {
    return new TranscribeClient({
        region: "ap-south-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY || "",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
        },
    });
}
function createTranscriptionCommand(filename: any) {
    return new StartTranscriptionJobCommand({
        TranscriptionJobName: filename,
        OutputBucketName: process.env.BUCKET_NAME,
        OutputKey: filename + ".transcription",
        IdentifyLanguage: true,
        Media: {
            MediaFileUri: "s3://" + process.env.BUCKET_NAME + "/" + filename,
        },
    });
}
async function createTranscriptionJob(filename: any) {
    const transcribeClient = getClient();
    const transcriptionCommand = createTranscriptionCommand(filename);
    return transcribeClient.send(transcriptionCommand);
}

async function getJob(filename: any) {
    const transcribeClient = getClient();
    let jobStatusResult = null;
    try {
        const transcriptionJobStatusCommand = new GetTranscriptionJobCommand({
            TranscriptionJobName: filename,
        });
        jobStatusResult = await transcribeClient.send(
            transcriptionJobStatusCommand
        );
    } catch (e) {}
    return jobStatusResult;
}

async function streamToString(stream: any) {
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
        stream.on("data", (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        stream.on("error", reject);
    });
}

async function getTranscriptionFile(filename: any) {
    const transcriptionFile = filename + ".transcription";
    const s3client = new S3Client({
        region: "ap-south-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY || "",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
        },
    });
    const getObjectCommand = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: transcriptionFile,
    });
    let transcriptionFileResponse = null;
    try {
        transcriptionFileResponse = await s3client.send(getObjectCommand);
    } catch (e) {}
    if (transcriptionFileResponse) {
        const transcriptionFileContent = (await streamToString(
            transcriptionFileResponse.Body
        )) as string;
        return JSON.parse(transcriptionFileContent);
    }
    return null;
}

const transcriptionStatus = {};

export async function GET(req: any) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const filename = searchParams.get("filename");

    // Check if transcription is already completed
    const transcription = await getTranscriptionFile(filename);
    if (transcription) {
        return Response.json({
            status: "COMPLETED",
            transcription,
        });
    }

    // Check if transcription is in progress
    if (
        (transcriptionStatus as { [key: string]: any })[filename as string] ===
        "IN_PROGRESS"
    ) {
        return Response.json({
            status: "IN_PROGRESS",
        });
    }

    // Mark transcription as in progress
    (transcriptionStatus as { [key: string]: any })[filename as string] =
        "IN_PROGRESS";

    try {
        // Check if a transcription job is already scheduled
        const existingJob = await getJob(filename);
        if (existingJob) {
            return Response.json({
                status: existingJob.TranscriptionJob?.TranscriptionJobStatus,
            });
        }

        // Create a new transcription job
        const newJob = await createTranscriptionJob(filename);

        return Response.json({
            status: newJob.TranscriptionJob?.TranscriptionJobStatus,
        });
    } finally {
        // Reset transcription status after completion
        (transcriptionStatus as { [key: string]: any })[filename as string] =
            undefined;
    }
}
