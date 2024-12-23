import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { JobCard } from "@/components/custom/JobCard"

interface Job {
    id: number
    title: string
    description: string
    experience: string
    department: string
    userId: number
    skills: string[]
}

export default function DashboardJobs() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [open, setOpen] = useState(false)

    useEffect(() => {
        (async () => {
            const response = await fetch("http://localhost:8080/job", {
                credentials: "include"
            });

            if (response.ok) {
                const apiJobs = await response.json();
                setJobs(apiJobs);
            }
        })();
    }, [])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.target as HTMLFormElement)
        const newJob: Partial<Job> = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            experience: formData.get('experience') as string,
            department: formData.get('department') as string,
            skills: (formData.get("skills") as string).split(",").map(skill => skill.trim())
        }

        await fetch("http://localhost:8080/job", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(newJob),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const response = await fetch("http://localhost:8080/job", {
            credentials: "include"
        });

        if (response.ok) {
            const apiJobs = await response.json()
            setJobs((prevJobs) => prevJobs.concat(apiJobs))
        }

        setOpen(false);
        (event.target as HTMLFormElement).reset()
    }

    const handleDelete = async (id: number) => {
        await fetch(`http://localhost:8080/job/${id}`, {
            method: "DELETE",
            credentials: "include"
        });

        const response = await fetch("http://localhost:8080/job", {
            credentials: "include"
        });

        if (response.ok) {
            const apiJobs = await response.json();
            setJobs(apiJobs);
        }
    }

    return (
        <div className="flex flex-col gap-2 w-full h-full">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Job Listings</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">Add New Job</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Job</DialogTitle>
                            <DialogDescription>
                                Fill in the details for the new job posting.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" placeholder="Job title" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" placeholder="Job description" rows={10} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="experience">Experience</Label>
                                <Select name="experience" defaultValue="Entry level">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select experience level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Entry level">Entry level</SelectItem>
                                        <SelectItem value="Mid level">Mid level</SelectItem>
                                        <SelectItem value="Senior">Senior</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Input id="department" name="department" placeholder="Department" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="skills">Skills (comma-separated)</Label>
                                <Input id="skills" name="skills" placeholder="e.g. React, TypeScript, CSS" required />
                            </div>
                            <Button type="submit" className="w-full">Add Job</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="flex flex-row flex-wrap gap-4 h-full">
                {jobs.map((job, index) => (
                    <JobCard key={index} {...job} onDelete={handleDelete}/>
                ))}
            </div>
        </div>
    )
}