import React from "react";

interface Props {
    h1Text: string;
    h2Text: string;
}
const Headers = ({ h1Text, h2Text }: Props) => {
    return (
        <section className="text-center mt-24 mb-8">
            <h1
                className="text-3xl font-bold mb-2"
                style={{ textShadow: "3px 3px 0 #000" }}
            >
                {h1Text}
            </h1>
            <h2 className="text-white/75">{h2Text}</h2>
        </section>
    );
};

export default Headers;
