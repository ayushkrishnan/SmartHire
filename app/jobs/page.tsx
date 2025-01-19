import { SignOut } from "@/components/custom/sign-out"
import { auth } from "@/auth"
import { getJobs, getJobApplications } from "@/lib/db/jobs";

import { JobPage } from "@/components/custom/jobs-page";
import { redirect } from "next/navigation";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Jobs(){
    const session = await auth()

    if(!session){
        redirect("/");
    }
    
    const jobs = await getJobs();
    const jobApplications = await getJobApplications();
    
    return (
        <div className="flex flex-col w-full h-screen bg-white">
            <nav className="flex flex-row w-full p-6 justify-between items-center">
                <h2 className="text-xl font-bold">SmartHire</h2>
                <div className="flex flex-row gap-2 items-center">
                    <Link href="/resumebuilder">
                        <Button className="rounded-full">Resume Builder</Button>
                    </Link>
                    <SignOut/>
                </div>
            </nav>
            <JobPage name={session?.user.name} jobs={jobs} applications={jobApplications} userId={session.user.id}/>
        </div>
    )
}