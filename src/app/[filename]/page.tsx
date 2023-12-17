"use client";
import TranscriptionItem from "@/components/TranscriptionItem";
import Result from "@/components/result";
import axios from "axios";
import React, { useEffect, useState } from "react";
import uniqid from "uniqid";

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
    const [isFetchingInfo, setIsFetchingInfo] = useState(false);
    const [awsTranscriptionItems, setAwsTranscriptionItems] = useState<
        TranscriptionItem[]
    >([]);
    const filename = params.filename;
    useEffect(() => {
        getTranscription();
    }, [filename]);

    function getTranscription() {
        setIsFetchingInfo(true);
        axios.get("/api/transcribe?filename=" + filename).then((response) => {
            setIsFetchingInfo(false);
            const status = response.data?.status;
            const transcription = response.data?.transcription;
            if (status === "IN_PROGRESS") {
                setIsTranscribing(true);
                setTimeout(getTranscription, 3000);
            } else {
                setIsTranscribing(false);
                transcription.results.items.forEach(
                    (item: any, key: number) => {
                        if (!item.start_time) {
                            const prev = transcription.results.items[key - 1];
                            prev.alternatives[0].content +=
                                item.alternatives[0].content;
                            delete transcription.results.items[key];
                        }
                    }
                );

                setAwsTranscriptionItems(
                    transcription.results.items.map((item: any) => {
                        const { start_time, end_time } = item;
                        const content = item.alternatives[0].content;
                        return { start_time, end_time, content };
                    })
                );
            }
        });
    }

    if (isTranscribing) {
        return <div>Transcribing your video...</div>;
    }
    if (isFetchingInfo) {
        return <div>Fetching transcription...</div>;
    }
    return (
        <div>
            <div className="grid grid-cols-2 gap-8">
                <div className="">
                    <h2
                        className="Text-2xl font-bold mb-4 text-white/80"
                        style={{ textShadow: "2px 2px 0 #000" }}
                    >
                        Transcription
                    </h2>
                    <div className=" flex justify-around bg-violet-800/80 p-2 rounded-md sticky top-0 ">
                        <div className="">Start</div>
                        <div className="">End</div>
                        <div>Content</div>
                    </div>
                    {awsTranscriptionItems.length > 0 &&
                        awsTranscriptionItems.map((item) => (
                            <TranscriptionItem item={item} key={uniqid()} />
                        ))}
                </div>
                <div>
                    <h2
                        className="Text-2xl font-bold mb-4 text-white/80"
                        style={{ textShadow: "2px 2px 0 #000" }}
                    >
                        Result
                    </h2>
                    <Result filename={filename} />
                </div>
            </div>
        </div>
    );
};

export default FilePage;
