import { SignOut } from "@/components/custom/sign-out"
import { auth } from "@/auth"

import { ResumeBuilder } from "@/components/custom/resume-builder"

import { uploadResume, improveResume, scoreResume, applyJob } from "./actions"
import { getJob } from "@/lib/db/jobs";
import { redirect } from "next/navigation";
import BlurFade from "@/components/ui/blur-fade";
import { SignIn } from "@/components/custom/sign-in";

export default async function Jobs({searchParams} : {searchParams?: { [key: string]: string | string[] | undefined }}){
    const session = await auth();
    
    let job: {
        id: number;
        name: string | null;
        description: string | null;
        skills: string | null;
        pay: string | null;
        company: string | null;
    } | undefined;

    if(searchParams && searchParams.job){
        job = await getJob(Number(searchParams.job))
        if(!session) redirect("/");
    }
        
    return (
        <div className="flex flex-col w-screen h-screen bg-white overflow-hidden">
            <nav className="flex flex-row w-full p-6 justify-between items-center">
                <h2 className="text-xl font-bold">SmartHire</h2>
                {
                    session ? <SignOut/> : <SignIn/>
                }
            </nav>
            <BlurFade className="h-full flex w-full overflow-hidden">
                <ResumeBuilder onUpload={uploadResume} onImprove={improveResume} onScore={scoreResume} onApply={applyJob} job={job} userId={session?.user.id}/>
            </BlurFade>
        </div>
    )
}