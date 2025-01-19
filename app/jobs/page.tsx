import { SignOut } from "@/components/custom/sign-out"
import { auth } from "@/auth"
import { getJobs, getJobApplications } from "@/lib/db/jobs";

import { JobPage } from "@/components/custom/jobs-page";

export default async function Jobs(){
    const session = await auth()
    
    const jobs = await getJobs();
    const jobApplications = await getJobApplications();
    
    return (
        <div className="flex flex-col w-full h-screen bg-white">
            <nav className="flex flex-row w-full p-6 justify-between items-center">
                <h2 className="text-xl font-bold">SmartHire</h2>
                <SignOut/>
            </nav>
            <JobPage name={session?.user.name} jobs={jobs} applications={jobApplications}/>
        </div>
    )
}