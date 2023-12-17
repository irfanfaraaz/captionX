import Headers from "@/components/Headers";
import React from "react";

const page = () => {
    return (
        <div>
            <Headers
                h1Text="Pricing"
                h2Text="Choose a plan that works for you."
            />
            <div className="bg-white text-slate-700 rounded-md p-4 text-center max-w-xs mx-auto">
                <h3 className="font-bold text-3xl">Free</h3>
                <h4>Free Forever</h4>
            </div>
        </div>
    );
};

export default page;
