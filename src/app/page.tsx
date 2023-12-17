import DemoSection from "@/components/DemoSection";
import Headers from "@/components/Headers";
import Upload from "@/components/Upload";

export default function Home() {
    return (
        <>
            <Headers
                h1Text={"Add amazing captions to your videos"}
                h2Text={"Just upload the video and we will do the rest"}
            />
            <div className="text-center">
                <Upload />
            </div>
            <DemoSection />
        </>
    );
}
