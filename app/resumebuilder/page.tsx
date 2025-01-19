import { SignOut } from "@/components/custom/sign-out"
import { auth } from "@/auth"

import { ResumeBuilder } from "@/components/custom/resume-builder"

import { uploadResume, improveResume, scoreResume, applyJob } from "./actions"
import { getJob } from "@/lib/db/jobs";

export default async function Jobs({searchParams} : {searchParams?: { [key: string]: string | string[] | undefined }}){
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
    }

    const session = await auth();
        
    return (
        <div className="flex flex-col w-full h-screen bg-white">
            <nav className="flex flex-row w-full p-6 justify-between items-center">
                <h2 className="text-xl font-bold">SmartHire</h2>
                <SignOut/>
            </nav>
            <ResumeBuilder onUpload={uploadResume} onImprove={improveResume} onScore={scoreResume} onApply={applyJob} job={job} userId={session?.user.id}/>
        </div>
    )
}