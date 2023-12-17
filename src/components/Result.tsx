import React from "react";
import Sparkles from "./Sparkles";

const Result = ({ filename }: { filename: string }) => {
    return (
        <div>
            <div className="flex">
                <button className="bg-white text-black py-2 px-6 rounded-2xl border-2 border-green-700 inline-flex gap-2 cursor-pointer mb-4">
                    <Sparkles />
                    <span>Put Captions</span>
                </button>
            </div>
            <div className="rounded-xl overflow-hidden">
                <video
                    src={"https://sif-s3-captions.s3.amazonaws.com/" + filename}
                    controls
                ></video>
            </div>
        </div>
    );
};

export default Result;
