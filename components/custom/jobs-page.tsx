"use client";

import { useState } from "react";
import { Input } from "../ui/input";

import { Button } from "../ui/button";
import Link from "next/link";

export function JobPage({
    userId,
    name,
    jobs,
    applications
}: {
    userId?: string,
    name?: string | null,
    jobs: {
        id: number,
        name: string | null,
        description: string | null,
        skills: string | null,
        pay: string | null,
        company: string | null
    }[],
    applications: {
        data: unknown;
        id: number;
        userId: string | null;
        score: number | null;
        jobId: number | null;
        status: string | null
    }[]
}) {

    const [search, setSearch] = useState("");

    return (
        <div className="flex flex-col w-full h-screen p-6 gap-3">
            <h1 className="text-3xl font-bold">Let's find a job, <br />{name ?? "Applicant"}!</h1>
            <Input placeholder="search" className="rounded-full w-60" onChange={(event) => {
                setSearch(event.target.value.toLowerCase());
            }} />
            <div className="flex flex-row gap-3 overflow-auto">
                {
                    jobs.filter(job => job.name?.toLowerCase().includes(search)).map((job) => (
                        <div key={job.id} className="flex flex-col p-4 gap-2 rounded-lg w-72 max-h-72 border border-neutral-300 aspect-square">
                            <h1 className="text-3xl font-bold text-blue-600">{job.name}</h1>
                            <p className="text-neutral-600">{job.company}</p>
                            <p className="overflow-auto">
                                {job.description}
                            </p>
                            <p>{job.pay}</p>
                            <div className="flex flex-row gap-2 mt-auto">
                                {/* <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button className="rounded-full">Upload resume</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Upload your resume</AlertDialogTitle>
                                            <AlertDialogDescription>We'll take care of the rest</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <form className="flex flex-col gap-2">
                                            <label>Upload</label>
                                            <Input type="file" name="resume" accept=".pdf"/>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                                                <AlertDialogAction type="submit" className="rounded-full">Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </form>
                                    </AlertDialogContent>
                                </AlertDialog> */}
                                {
                                    applications.find((value) => value.jobId === job.id && value.userId === userId) ?
                                        <>
                                        {
                                            applications.find((value) => value.jobId === job.id && value.userId === userId)?.status === "pending" ?
                                            <p className="text-neutral-500 italic">Our HR team will contact you. Thank you for your application!</p> :
                                            <p className="text-neutral-500 italic font-bold">{applications.find((value) => value.jobId === job.id && value.userId === userId)?.status}</p>
                                        }
                                        </> :
                                        <Link href={`/resumebuilder?job=${job.id}`}>
                                            <Button className="rounded-full bg-blue-600 hover:bg-blue-500">Apply</Button>
                                        </Link>
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}