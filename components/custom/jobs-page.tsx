"use client";

import { useState } from "react";
import { Input } from "../ui/input";

import { Button } from "../ui/button";
import Link from "next/link";

import { BriefcaseBusiness, Coins, MapPin, Timer } from "lucide-react";

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
        company: string | null,
        location: string | null,
        workMode: string | null,
        createdOn: string | null,
        deadline: string | null
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
        <div className="flex flex-col w-full h-full p-6 gap-3">
            <h1 className="text-3xl font-bold">Let's find a job, <br />{name ?? "Applicant"}!</h1>
            <Input placeholder="search" className="rounded-full w-60" onChange={(event) => {
                setSearch(event.target.value.toLowerCase());
            }} />
            <div className="flex flex-row flex-wrap gap-3">
                {
                    jobs.filter(job => job.name?.toLowerCase().includes(search)).map((job) => (
                        <div key={job.id} className="flex flex-col p-4 gap-2 rounded-lg w-96 border border-neutral-300 aspect-square">
                            <h1 className="text-3xl font-bold text-blue-600">{job.name}</h1>
                            <p className="text-neutral-600">{job.company}</p>
                            <p className="overflow-auto text-justify">
                                {job.description}
                            </p>
                            <div className="flex flex-row flex-wrap gap-2 mt-auto py-2 h-fit items-center">
                                {
                                    job.skills?.split(",").map((skill, index) => (
                                        <p key={skill} className="text-nowrap px-5 py-1 bg-neutral-100 rounded-full h-fit">{skill}</p>
                                    ))
                                }
                            </div>
                            <p className="flex flex-row gap-2 items-center">
                                <Coins size={16} />
                                {job.pay}
                            </p>
                            <p className="flex flex-row gap-2 items-center">
                                <MapPin size={16} />
                                {job.location ?? "Not given"}
                            </p>
                            <p className="flex flex-row gap-2 items-center">
                                <Timer size={16} />
                                {
                                    Math.ceil((new Date(job.deadline!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) == 0 ? "Closes today" : `${Math.ceil((new Date(job.deadline!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining`
                                }
                            </p>
                            <p className="flex flex-row gap-2 items-center">
                                <BriefcaseBusiness size={16} />
                                {job.workMode}
                            </p>
                            <div className="flex flex-row gap-2">
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