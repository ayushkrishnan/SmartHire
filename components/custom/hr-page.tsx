"use client";
import { useState } from "react";
import NumberTicker from "../ui/number-ticker";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "../ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "../ui/button";
import { FormEvent } from "react";
import Link from "next/link";

import { Coins, MapPin, Timer, BriefcaseBusiness } from "lucide-react";

import { Trash } from "lucide-react";
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "../ui/select";

export function HRPage({
    name,
    jobs,
    onNewJob,
    onEditJob,
    onDeleteJob
}: {
    name: string,
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
    onNewJob: (formData: FormData) => Promise<{
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
    }[]>,
    onEditJob: (formData: FormData, jobId: number) => Promise<{
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
    }[]>,
    onDeleteJob: (jobId: number) => Promise<void>
}) {
    const [jobList, setJobList] = useState(jobs);
    const [isOpen, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);

        const newJobs = await onNewJob(formData);
        setJobList((prevJobs) => prevJobs.concat(newJobs));
        (event.target as HTMLFormElement).reset();

        setOpen(false);
    }

    const handleEdit = async (event: FormEvent, jobId: number) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);

        const newJobs = await onEditJob(formData, jobId);
        setJobList(newJobs);
    }

    const handleDelete = async (jobId: number) => {
        onDeleteJob(jobId);
        setJobList((prevJobs) => prevJobs.filter(job => job.id !== jobId));
    }

    return (
        <div className="flex flex-row gap-4 w-full h-full p-6">
            <div className="flex flex-col gap-2 h-full w-96 border-r border-neutral-300">
                <h1 className="text-4xl font-bold">Welcome back,<br />{name ?? "John Doe"}</h1>
                <p>Let's hire some talent and make some jobs.</p>
                <div className="py-4">
                    {
                        jobList.length ?
                            <NumberTicker value={jobList.length} className="text-4xl font-bold text-blue-600" /> :
                            <h2 className="text-4xl font-bold text-blue-600">0</h2>
                    }
                    <p>Jobs created</p>
                </div>
            </div>
            <div className="flex flex-col w-full h-full gap-4">
                <div className="flex flex-row w-full gap-3">
                    <Dialog open={isOpen} onOpenChange={(open) => setOpen(open)}>
                        <DialogTrigger asChild>
                            <Button className="rounded-full w-fit">New Job</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add a new job</DialogTitle>
                                <DialogDescription>Fill in the job details below</DialogDescription>
                            </DialogHeader>
                            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                                <Label>Job Title</Label>
                                <Input id="name" name="name" placeholder="Enter job title" required />

                                <Label>Description</Label>
                                <Textarea id="description" name="description" placeholder="Enter job description" required />

                                <Label>Required Skills</Label>
                                <Input id="skills" name="skills" placeholder="Enter required skills" required />

                                <Label>Pay Range</Label>
                                <Input id="pay" name="pay" placeholder="Enter pay range" required />

                                <Label>Company</Label>
                                <Input id="company" name="company" placeholder="Enter company name" required />

                                <Label>Location</Label>
                                <Input id="location" name="location" placeholder="Enter job location" required />

                                <Label>Deadline</Label>
                                <Input id="deadline" name="deadline" type="date" required />

                                <Label>Work Mode</Label>
                                <Select name="workMode" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select work mode"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="In office">In office</SelectItem>
                                        <SelectItem value="Remote">Remote</SelectItem>
                                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button type="submit" className="rounded-full w-fit mt-4">Submit</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                    <Input placeholder="Search jobs..." className="max-w-72 rounded-full" onChange={(event) => {
                        setSearch(event.target.value.toLowerCase());
                    }} />
                </div>
                <div className="flex flex-row flex-wrap gap-4">
                    {
                        jobList.filter(job => job.name?.toLowerCase().includes(search)).map((job) => (
                            <div key={job.id} className="flex flex-col p-4 gap-2 rounded-lg w-96 border border-neutral-300 aspect-square">
                                <p className="text-neutral-500">{(new Date(job.createdOn!)).toLocaleDateString("en-IN")}</p>
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
                                        Math.ceil((new Date(job.deadline!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) >= 0 ? `Closes in ${Math.ceil((new Date(job.deadline!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days` : `Closed ${Math.ceil((new Date(job.deadline!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))/-1} days ago`
                                    }
                                </p>
                                <p className="flex flex-row gap-2 items-center">
                                    <BriefcaseBusiness size={16} />
                                    {job.workMode}
                                </p>
                                <div className="flex flex-row gap-2">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button className="rounded-full w-fit">Edit Job</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Add a new job</AlertDialogTitle>
                                                <AlertDialogDescription>Fill in the job details below</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <form className="flex flex-col gap-2" onSubmit={(event) => handleEdit(event, job.id)}>
                                                <Label>Job Title</Label>
                                                <Input id="name" name="name" placeholder="Enter job title" defaultValue={job.name!} required />
                                                <Label>Description</Label>
                                                <Textarea id="description" name="description" placeholder="Enter job description" defaultValue={job.description!} required />
                                                <Label>Required Skills</Label>
                                                <Input id="skills" name="skills" placeholder="Enter required skills" defaultValue={job.skills!} required />
                                                <Label>Pay Range</Label>
                                                <Input id="pay" name="pay" placeholder="Enter pay range" defaultValue={job.pay!} required />
                                                <Label>Company</Label>
                                                <Input id="company" name="company" placeholder="Enter company name" defaultValue={job.company!} required />
                                                <Label>Location</Label>
                                                <Input id="location" name="location" placeholder="Enter job location" defaultValue={job.location!} required />
                                                <Label>Deadline</Label>
                                                <Input id="deadline" name="deadline" type="date" defaultValue={job.deadline!} required />

                                                <Label>Work Mode</Label>
                                                <Select name="workMode" required defaultValue={job.workMode!}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select work mode"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="In office">In office</SelectItem>
                                                        <SelectItem value="Remote">Remote</SelectItem>
                                                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                                                    <AlertDialogAction asChild>
                                                        <Button type="submit" className="rounded-full w-fit">Submit</Button>
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </form>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    <Link href={`/hr/${job.id}`}>
                                        <Button className="rounded-full bg-blue-600 hover:bg-blue-500">View job</Button>
                                    </Link>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" className="ml-auto w-fit rounded-full">
                                                <Trash />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete {job.name}</AlertDialogTitle>
                                                <AlertDialogDescription>This action is irreversible</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                                                <AlertDialogAction className="rounded-full bg-red-600 hover:bg-red-500" onClick={() => handleDelete(job.id)}>Delete Job</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}