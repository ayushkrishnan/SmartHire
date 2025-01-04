import { useParams, Link } from "react-router"
import { useEffect, useState } from "react";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface Job {
    id: number
    title: string
    description: string
    experience: string
    department: string
    userId: number
    skills: {
        name: string
    }[]
}

interface Application {
    applications: {
        id: number,
        jobId: number,
        resume: string,
        score: number,
        suggestions: string,
        status: "accepted" | "rejected" | "pending"
    },
    users: {
        email: string,
        name: string
    }
}

export default function DashboardJobStatus(){
    const params = useParams();
    const [job, setJob] = useState<Job | undefined>();
    const [applications, setApplications] = useState<Application[]>([]);

    useEffect(() => {
        (async () => {
            const response = await fetch(`http://localhost:8080/job/${params.id}`, {
                credentials: "include"
            })

            const applicationResponse = await fetch(`http://localhost:8080/application/job/${params.id}`, {
                credentials: "include"
            })

            if(response.ok){
                const apiJob = await response.json();
                console.log(apiJob)
                setJob(apiJob);
            }

            if(applicationResponse.ok){
                const apiApplications = await applicationResponse.json();
                setApplications(apiApplications);
            }
        })();
    }, []);

    const setStatus = async (id: number, status: "accepted" | "rejected") => {
        const response = await fetch(`http://localhost:8080/application/status/${id}`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                status
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        if(response.ok){
            const applicationResponse = await fetch(`http://localhost:8080/application/job/${params.id}`, {
                credentials: "include"
            })

            if(applicationResponse.ok){
                const apiApplications = await applicationResponse.json();
                setApplications(apiApplications);
            }
        }
    }

    return (
        <div className="flex flex-col w-full h-full gap-2 text-neutral-600">
            <div className="p-3 flex flex-col gap-2 rounded-md border border-neutral-200">
                <h1 className="text-xl font-bold text-black">{job?.title}</h1>
                <h2>Department: {job?.department}</h2>
                <p>{job?.description}</p>
                <div className="flex flex-row gap-2 text-neutral-900">
                    {
                        job && job.skills.map((skill, index) => <div className="text-sm px-2 py-1 rounded-full bg-neutral-200" key={index}>{skill.name}</div>)
                    }
                </div>
            </div>
            <div className="p-3 flex flex-col gap-1 rounded-md border border-neutral-200">
                <h1 className="text-xl font-bold text-black">Applicants</h1>
                <h2>List of candidates who have applied for this job</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Resume</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            applications.map(application => (
                                <TableRow key={application.applications.id}>
                                    <TableCell>{application.users.name}</TableCell>
                                    <TableCell>{application.users.email}</TableCell>
                                    <TableCell>{application.applications.score}</TableCell>
                                    <TableCell>
                                        <Link to={`data:application/pdf;base64,${application.applications.resume}`} target="_blank">
                                            <Button variant={"outline"}>View Application</Button>
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {
                                            application.applications.status === "pending" ?
                                            <div className="flex flex-row gap-2 items-center">
                                                <Button variant={"outline"} onClick={() => setStatus(application.applications.id, "accepted")}>
                                                    <Check/>
                                                </Button>
                                                <Button variant={"outline"} onClick={() => setStatus(application.applications.id, "rejected")}>
                                                    <X/>
                                                </Button>
                                            </div>
                                            :
                                            <p>{application.applications.status}</p>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}