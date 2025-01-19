"use client"
import { useState } from "react";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from "@/components/ui/table"
import { Button } from "../ui/button";
import { ResumePDF, ResumeData } from "./resume";
import dynamic from "next/dynamic";
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


const PDFViewer = dynamic(
    () => import("./pdf-viewer"),
    {
        ssr: false,
        loading: () => <p>Loading...</p>,
    },
);

export function HRJobPage({
    applications,
    onStatus
}: {
    applications: {
        resumes: {
            id: number;
            data: unknown;
            userId: string | null;
            score: number | null;
            jobId: number | null;
            status: string | null;
        };
        user: {
            id: string;
            name: string | null;
            email: string | null;
            emailVerified: Date | null;
            image: string | null;
            role: string | null;
        };
    }[],
    onStatus: (resumeId: number, status: "accepted" | "rejected") => Promise<void>
}) {
    const [internalApplications, setInternalApplications] = useState(applications)

    const onAccept = (resumeId: number) => {
        setInternalApplications((prevApplications) => {
            return prevApplications.map((application) => {
                if(application.resumes.id === resumeId){
                    const newApplication = application;
                    newApplication.resumes.status = "accepted"
                    return newApplication
                }else{
                    return application;
                }
            })
        })

        onStatus(resumeId, "accepted")
    }

    const onReject = (resumeId: number) => {
        setInternalApplications((prevApplications) => {
            return prevApplications.map((application) => {
                if(application.resumes.id === resumeId){
                    const newApplication = application;
                    newApplication.resumes.status = "rejected"
                    return newApplication
                }else{
                    return application;
                }
            })
        })

        onStatus(resumeId, "rejected")
    }

    return (
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
                    internalApplications.map(application => (
                        <TableRow key={application.resumes.id}>
                            <TableCell>{application.user.name}</TableCell>
                            <TableCell>{application.user.email}</TableCell>
                            <TableCell>{application.resumes.score}</TableCell>
                            <TableCell>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button className="rounded-full" variant="outline">View Resume</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <PDFViewer className="w-full h-[600px] rounded-md">
                                            <ResumePDF data={application.resumes.data as ResumeData}/>
                                        </PDFViewer>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="rounded-full">Close</AlertDialogCancel>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-row gap-2">
                                    {
                                        application.resumes.status === "pending" ?
                                        <>
                                            <Button className="rounded-full" variant="outline" onClick={() => onAccept(application.resumes.id)}>Accept</Button>
                                            <Button className="rounded-full" variant="outline" onClick={() => onReject(application.resumes.id)}>Reject</Button>
                                        </> :
                                        <p>{application.resumes.status}</p>
                                    }
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}