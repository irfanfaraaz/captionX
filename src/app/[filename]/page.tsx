"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface Props {
    params: {
        filename: string;
    };
}

interface TranscriptionItem {
    start_time: string;
    end_time: string;
}

const FilePage = ({ params }: Props) => {
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [awsTranscriptionItems, setAwsTranscriptionItems] = useState<
        TranscriptionItem[]
    >([]);
    const { filename } = params;
    useEffect(() => {
        getTranscription();
    });
    const getTranscription = () => {
        axios.get("/api/transcribe?filename=" + filename).then((response) => {
            const status = response.data?.status;
            const transcription = response.data?.transcription;
            if (status === "IN_PROGRESS") {
                setIsTranscribing(true);
                setTimeout(() => {
                    getTranscription();
                }, 3000);
            } else {
                setIsTranscribing(false);
                setAwsTranscriptionItems(transcription.results.items);
            }
        });
    };
    return (
        <div>
            {filename}
            <div>Is Transcribing: {JSON.stringify(isTranscribing)}</div>
            {awsTranscriptionItems.length > 0 &&
                awsTranscriptionItems.map((item) => (
                    <div key={""}>
                        <span className="text-white/50 mr-2">
                            {item.start_time} - {item.end_time}
                        </span>
                        <span>{(item as any).alternatives[0].content}</span>
                    </div>
                ))}
        </div>
    );
};

export default FilePage;
