
import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
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
} from '@/components/ui/alert-dialog';

import { Link, useNavigate } from "react-router"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Job {
    id: number
    title: string
    description: string
    experience: string
    department: string
    userId: number
    skills: string[]
}

interface Application {
    id: number,
    jobId: number,
    resume: string,
    suggestions: string,
    status: string
}

export default function JobListings() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<Job[]>([])
    const [applications, setApplications] = useState<Application[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    useEffect(() => {
        (async () => {
            const response = await fetch("http://localhost:8080/job", {
                credentials: "include"
            });

            const applicationResponse = await fetch("http://localhost:8080/application", {
                credentials: "include"
            })

            if (response.ok) {
                const apiJobs = await response.json();
                setJobs(apiJobs);
            }

            if (applicationResponse.ok) {
                const apiApplications = await applicationResponse.json();
                setApplications(apiApplications);
            }
        })()
    }, [])

    const handleLogout = async () => {
        await fetch("http://localhost:8080/user/logout", {
            credentials: "include"
        });

        navigate("/login");
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type === "application/pdf") {
                setSelectedFile(file);
            } else {
                e.target.value = '';
            }
        }
    }

    const handleSubmit = (jobId: number, e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const reader = new FileReader();
        reader.readAsDataURL(selectedFile!);

        reader.onload = async () => {
            await fetch("http://localhost:8080/application", {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    resume: reader.result?.toString().replace("data:application/pdf;base64,", ""),
                    jobId
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const applicationResponse = await fetch("http://localhost:8080/application", {
                credentials: "include"
            })

            if (applicationResponse.ok) {
                const apiApplications = await applicationResponse.json();
                setApplications(apiApplications);
            }
        }

    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Job Listings</h1>
                <div className="flex flex-row gap-2">
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Search jobs"
                            className="pl-8 pr-4 py-2 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            {jobs.filter(job =>
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.department.toLowerCase().includes(searchTerm.toLowerCase())
            ).length === 0 ? (
                <p className="text-center text-gray-500">No jobs found matching your search criteria.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.filter(job =>
                        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        job.department.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((job) => (
                        <Card key={job.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-2">
                                        <CardTitle className="text-xl">{job.title}</CardTitle>
                                        {
                                            applications.find(application => application.jobId === job.id) &&
                                            <p>Status: {applications.find(application => application.jobId === job.id)?.status}</p>
                                        }
                                    </div>
                                    <Badge variant="secondary">{job.experience}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col flex-grow">
                                <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                                <Separator className="my-4 mt-auto" />
                                <p className="text-sm font-medium">Department: {job.department}</p>
                            </CardContent>
                            <CardFooter>
                                {
                                    !applications.find(application => application.jobId === job.id) ?
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button className="w-full">Apply Now</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Apply for {job.title}</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Upload your resume to apply for this position
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <form onSubmit={(e) => handleSubmit(job.id, e)} className="space-y-4">
                                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                                        <label htmlFor="resume">Resume</label>
                                                        <Input
                                                            id="resume"
                                                            type="file"
                                                            accept=".pdf"
                                                            onChange={handleFileChange}
                                                            className="cursor-pointer"
                                                        />
                                                        <p className="text-sm text-muted-foreground">
                                                            Please upload your resume in PDF format
                                                        </p>
                                                    </div>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction type="submit">
                                                            Submit Application
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </form>
                                            </AlertDialogContent>
                                        </AlertDialog> :
                                        <div className="flex flex-row gap-2">
                                            <Link to={`data:application/pdf;base64,${applications.find(application => application.jobId === job.id)?.resume}`} target="_blank">
                                                <Button variant={"outline"}>View Application</Button>
                                            </Link>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant={"outline"}>Feedback</Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <p>{applications.find(application => application.jobId === job.id)?.suggestions}</p>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                }
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

