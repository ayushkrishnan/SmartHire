import { SignOut } from "@/components/custom/sign-out"
import { auth } from "@/auth"
import { HRPage } from "@/components/custom/hr-page"

import { getJobs } from "@/lib/db/jobs"
import { createJob, editJob, removeJob } from "./actions"
import { redirect } from "next/navigation"

import BlurFade from "@/components/ui/blur-fade"

export default async function HRDashboard() {
    const session = await auth()

    const jobs = await getJobs();

    if (session) {
        if (!["admin", "hr"].includes(session.user.role!)) redirect("/");
    } else {
        redirect("/");
    }

    return (
        <div className="flex flex-col w-full h-screen bg-white">
            <nav className="flex flex-row w-full p-6 justify-between items-center">
                <h2 className="text-xl font-bold">SmartHire</h2>
                <SignOut />
            </nav>
            <BlurFade className="h-full">
                <HRPage name={session?.user.name!} jobs={jobs} onNewJob={createJob} onEditJob={editJob} onDeleteJob={removeJob} />
            </BlurFade>
        </div>
    )
}