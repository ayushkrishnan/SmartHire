
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
import { redirect } from "react-router"

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
    const [jobs, setJobs] = useState<Job[]>([])
    const [applications, setApplications] = useState<Application[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [suggestions, setSuggestions] = useState({
        score: 0,
        suggestions: "loading..."
    })

    useEffect(() => {
        (async () => {
            const response = await fetch("http://localhost:8080/job", {
                credentials: "include"
            });

            const applicationResponse = await fetch("http://localhost:8080/application", {
                credentials: "include"
            })

            const userResponse = await fetch("http://localhost:8080/user/current", {
                credentials: "include"
            })

            if(userResponse.ok){
                const user = await userResponse.json();
                if(!user.resume){
                    redirect("/apply/edit");
                }
            }

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

    const handleOpen = async (jobId: number) => {
        const apiSuggestsionsResponse = await fetch("http://localhost:8080/application/suggestions", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                jobId
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        if(apiSuggestsionsResponse.ok){
            setSuggestions(await apiSuggestsionsResponse.json())
        }
    }

    const handleSubmit = async (jobId: number) => {

        await fetch("http://localhost:8080/application", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
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
                                {/* <Separator className="my-4 mt-auto" />
                                <p className="text-sm font-medium">Skills: {job.skills}</p> */}
                            </CardContent>
                            <CardFooter>
                                {
                                    !applications.find(application => application.jobId === job.id) ?
                                        <AlertDialog onOpenChange={(open) => {
                                            if(open){
                                                handleOpen(job.id);
                                            }else{
                                                setSuggestions({
                                                    score: 0,
                                                    suggestions: "loading..."
                                                })
                                            }
                                        }}>
                                            <AlertDialogTrigger asChild>
                                                <Button className="w-full">Apply Now</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Before you apply...</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        See what our AI has to say about your resume!
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <p>
                                                    <b>Score</b>: {suggestions.score}<br/>
                                                    {suggestions.suggestions}
                                                </p>
                                                <AlertDialogFooter>
                                                    <AlertDialogAction onClick={() => handleSubmit(job.id)}>Submit Application</AlertDialogAction>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog> :
                                        <div className="flex flex-row gap-2">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant={"outline"}>Feedback</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Application Feedback</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            {applications.find(application => application.jobId === job.id)?.suggestions}
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogAction>Close</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
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

