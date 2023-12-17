"use client";
import axios from "axios";
import React, { useEffect } from "react";

interface Props {
    params: {
        filename: string;
    };
}
const FilePage = ({ params }: Props) => {
    const { filename } = params;
    useEffect(() => {
        axios.get("/api/transcribe?filename=" + filename);
    }, [filename]);
    return <div>{filename}</div>;
};

export default FilePage;
