import { useParams } from "react-router"
import { useEffect, useState } from "react";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow
} from "@/components/ui/table";

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

export default function DashboardJobStatus(){
    const params = useParams();
    const [job, setJob] = useState<Job | undefined>();

    useEffect(() => {
        (async () => {
            const response = await fetch(`http://localhost:8080/job/${params.id}`, {
                credentials: "include"
            })

            if(response.ok){
                const apiJob = await response.json();
                console.log(apiJob)
                setJob(apiJob);
            }
        })();
    }, []);

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
                            <TableHead>Suggestions</TableHead>
                            <TableHead>Resume</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}