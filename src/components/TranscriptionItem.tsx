import React, { useState } from "react";
import uniqid from "uniqid";
const TranscriptionItem = ({ item }: any) => {
    const [startSeconds, setStartSeconds] = useState(item.start_time);
    const [endSeconds, setEndSeconds] = useState(item.end_time);
    const [content, setContent] = useState(item.content);
    return (
        <div className="my-1 grid grid-cols-3 gap-1 items-center">
            <input
                type="text"
                className="bg-white/20  p-1 rounded-md text-center"
                value={startSeconds}
                onChange={(e) => setStartSeconds(e.target.value)}
            />

            <input
                type="text"
                className="bg-white/20  p-1 rounded-md text-center"
                value={endSeconds}
                onChange={(e) => setEndSeconds(e.target.value)}
            />
            <input
                type="text"
                className="bg-white/20  p-1 rounded-md text-center"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
        </div>
    );
};

export default TranscriptionItem;
