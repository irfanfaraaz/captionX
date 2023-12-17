"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";

const Upload = () => {
    const [isUploading, setIsUploading] = React.useState(false);
    const router = useRouter();
    const upload = async (e: any) => {
        e.preventDefault();
        const file = e.target.files[0];
        setIsUploading(true);
        const res = await axios.postForm("/api/upload", { file });
        setIsUploading(false);
        const newName = res.data.newName;
        router.push(`/${newName}`);
    };

    return (
        <>
            {isUploading && (
                <div className="bg-black/70 text-white fixed inset-0 flex justify-center items-center">
                    <div className="">
                        <h2 className="text-4xl mb-4">Uploading</h2>
                        <h3 className="text-xl">Please wait...</h3>
                    </div>
                </div>
            )}
            <label className="bg-white text-black py-2 px-6 rounded-2xl border-2 border-green-700 inline-flex gap-2 cursor-pointer">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                    />
                </svg>
                <span className="">Choose File</span>
                <input type="file" onChange={upload} className="hidden" />
            </label>
        </>
    );
};

export default Upload;
