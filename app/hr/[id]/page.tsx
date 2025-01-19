import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import NumberTicker from "@/components/ui/number-ticker"

import { getJob, getJobApplicationsForJob } from "@/lib/db/jobs"
import { HRJobPage as JobPage } from "@/components/custom/hr-job-page"
import { updateStatus } from "./actions"

import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function HRJobPage({ params }: { params: Promise<{ id: number }> }) {
    const jobId = (await params).id
    const job = await getJob(jobId);
    const applications = await getJobApplicationsForJob(jobId);

    const session = await auth();

    if (session) {
        if (!["admin", "hr"].includes(session.user.role!)) redirect("/");
    } else {
        redirect("/");
    }

    return (
        <div className="flex flex-col w-full h-screen bg-white p-6 gap-4">
            <nav className="flex flex-row gap-3 items-center">
                <Link href="/hr">
                    <ArrowLeft />
                </Link>
                <h2 className="text-2xl font-bold">View job applicants</h2>
            </nav>
            <div className="flex flex-row gap-3 h-full">
                <div className="flex flex-col gap-2 w-fit h-full px-6 border-r border-neutral-300 max-w-96">
                    <h1 className="text-xl font-bold text-blue-600">{job.name}</h1>
                    <p>
                        {job.description}
                    </p>
                    <div className="flex flex-col gap-2 mt-3">
                        <NumberTicker value={applications.length} className="text-3xl font-bold text-blue-600" />
                        <p>Job applicants</p>
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <JobPage applications={applications} onStatus={updateStatus} />
                </div>
            </div>
        </div>
    )
}