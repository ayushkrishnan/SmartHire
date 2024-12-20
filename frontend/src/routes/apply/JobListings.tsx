
import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

import { useNavigate } from "react-router"

interface Job {
    id: number
    title: string
    description: string
    experience: string
    department: string
    userId: number
    skills: string[]
}

export default function JobListings() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<Job[]>([])
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        (async () => {
            const response = await fetch("http://localhost:8080/job", {
                credentials: "include"
            });

            if (response.ok) {
                const apiJobs = await response.json();
                setJobs(apiJobs);
            }
        })()
    }, [])

    const handleLogout = async () => {
        await fetch("http://localhost:8080/user/logout", {
            credentials: "include"
        });

        navigate("/login");
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
                    <Button onClick={handleLogout}>Log Out</Button>
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
                                    <CardTitle className="text-xl">{job.title}</CardTitle>
                                    <Badge variant="secondary">{job.experience}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                                <Separator className="my-4" />
                                <p className="text-sm font-medium">Department: {job.department}</p>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full">Apply Now</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

