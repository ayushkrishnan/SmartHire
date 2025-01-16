import { SignOut } from "@/components/custom/sign-out"
import { auth } from "@/auth"
import { HRPage } from "@/components/custom/hr-page"

import { getJobs } from "@/lib/db/jobs"
import { createJob, editJob, removeJob } from "./actions"

export default async function HRDashboard(){
    const session = await auth()

    const jobs = await getJobs();

    return (
        <div className="flex flex-col w-full h-screen bg-white">
            <nav className="flex flex-row w-full p-6 justify-between items-center">
                <h2 className="text-xl font-bold">SmartHire</h2>
                <SignOut/>
            </nav>
            <HRPage name={session?.user.name!} jobs={jobs} onNewJob={createJob} onEditJob={editJob} onDeleteJob={removeJob}/>
        </div>
    )
}