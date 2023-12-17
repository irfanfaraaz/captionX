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
        stream.on("data", (chunk: any) => chunks.push(Buffer.from(chunk)));
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
        const transcriptionFileString = (await streamToString(
            transcriptionFileResponse.Body
        )) as string;
        return JSON.parse(transcriptionFileString);
    }
    return null;
}

export async function GET(req: any) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const filename = searchParams.get("filename");

    // find ready transcription
    const transcription = await getTranscriptionFile(filename);
    if (transcription) {
        return Response.json({
            status: "COMPLETED",
            transcription,
        });
    }

    // check if already transcribing
    const existingJob = await getJob(filename);

    if (existingJob) {
        return Response.json({
            status: existingJob.TranscriptionJob?.TranscriptionJobStatus,
        });
    }

    // creating new transcription job
    if (!existingJob) {
        const newJob = await createTranscriptionJob(filename);
        return Response.json({
            status: newJob.TranscriptionJob?.TranscriptionJobStatus,
        });
    }

    return Response.json(null);
}
