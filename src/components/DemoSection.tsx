import React from "react";

const DemoSection = () => {
    return (
        <section className="flex justify-around mt-12 items-center">
            <div className="bg-gray-800/50  w-[240px] h-[480px] rounded-xl"></div>
            <div>
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
                        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                    />
                </svg>
            </div>
            <div className="bg-gray-800/50  w-[240px] h-[480px] rounded-xl"></div>
        </section>
    );
};

export default DemoSection;
