"use client";

import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ResumePDF } from "./resume";
import { FormEvent, useState } from "react";
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ShinyButton } from "../ui/shiny-button";
import { useSearchParams } from "next/navigation";
import NumberTicker from "../ui/number-ticker";

import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("./pdf-viewer"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
);


import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogFooter
} from "../ui/alert-dialog"


interface WorkExperience {
    company: string;
    position: string;
    location: string;
    duration: string;
    details: string[];
}

interface Project {
    name: string;
    details: string[];
}

interface Education {
    school: string;
    degree: string;
    location: string;
    duration: string;
}

interface ResumeData {
    name: string;
    email: string;
    phone: string;
    location: string;
    introduction: string;
    workExperience: WorkExperience[];
    projects: Project[];
    skills: string[];
    education: Education;
}

export function ResumeBuilder({
    userId,
    job,
    onUpload,
    onImprove,
    onScore,
    onApply
}: {
    userId?: string,
    job?: {
        id: number;
        name: string | null;
        description: string | null;
        skills: string | null;
        pay: string | null;
        company: string | null;
    },
    onUpload: (resumeFile: string) => Promise<ResumeData>,
    onImprove: (resumeJson: string, jobId?: number) => Promise<ResumeData>
    onScore: (resumeJson: string, jobId: number) => Promise<{
        score: number
    }>,
    onApply: (pdfJson: string, jobId: number, userId: string, score: number) => Promise<void>
}) {
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState<ResumeData>({
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "123-456-7890",
        location: "Sample Location",
        introduction: "Sample Introduction",
        workExperience: [],
        projects: [],
        skills: [],
        education: {
            school: "Sample University",
            degree: "B.S. Computer Science",
            location: "Sample City",
            duration: "2016-2020",
        },
    });
    const [score, setScore] = useState(1);

    const [isClient, setIsClient] = useState(false);
    const [uploadedResume, setUploadedResume] = useState<File>()

    useState(() => {
        setIsClient(true);
    })

    const handleBasicChange = (field: keyof ResumeData, value: string | string[]): void => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleWorkChange = (index: number, field: keyof WorkExperience, value: string | string[]): void => {
        setFormData(prev => ({
            ...prev,
            workExperience: prev.workExperience.map((work, i) =>
                i === index ? { ...work, [field]: value } : work
            )
        }));
    };

    const handleProjectChange = (index: number, field: keyof Project, value: string | string[]): void => {
        setFormData(prev => ({
            ...prev,
            projects: prev.projects.map((project, i) =>
                i === index ? { ...project, [field]: value } : project
            )
        }));
    };

    const handleEducationChange = (field: keyof Education, value: string): void => {
        setFormData(prev => ({
            ...prev,
            education: {
                ...prev.education,
                [field]: value
            }
        }));
    };

    const addWorkExperience = (): void => {
        setFormData(prev => ({
            ...prev,
            workExperience: [...prev.workExperience, {
                company: "",
                position: "",
                location: "",
                duration: "",
                details: [""]
            }]
        }));
    };

    const addProject = (): void => {
        setFormData(prev => ({
            ...prev,
            projects: [...prev.projects, {
                name: "",
                details: [""]
            }]
        }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedResume(file);
        }
    };

    const uploadResume = async (event: FormEvent) => {
        event.preventDefault();
        const buffer = await uploadedResume!.arrayBuffer();
        const resumeBuffer = Buffer.from(buffer).toString("base64");

        // Call the onUpload function
        const parsedData = await onUpload(resumeBuffer);
        console.log(parsedData)

        // Update form data with parsed resume data
        setFormData(parsedData);
    }

    const improveResume = async () => {
        const jobId = searchParams.get("job");

        const parsedData = await onImprove(JSON.stringify(formData), jobId ? Number(jobId) : undefined)
        setFormData(parsedData);
    }

    const refreshScore = async () => {
        const jobId = searchParams.get("job");
        const {score} = await onScore(JSON.stringify(formData), Number(jobId));

        console.log(score);

        setScore(score);
    }

    const applyJob = async () => {
        const jobId = searchParams.get("job");
        await onApply(JSON.stringify(formData), Number(jobId), userId!, Math.floor(score));
    }

    return (
        <div className="flex flex-row p-6 h-full gap-3 overflow-hidden">
            <div className="flex flex-col gap-4 w-1/2 h-full overflow-auto">
                {/* Basic Information */}
                <div className="flex flex-col gap-2 rounded-md border border-neutral-300 p-10">
                    <div className="flex flex-row gap-2">
                        <ShinyButton className="rounded-full" onClick={() => improveResume()}>Improve Resume</ShinyButton>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="rounded-full">Upload resume</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Upload your resume</AlertDialogTitle>
                                    <AlertDialogDescription>We'll take care of the rest</AlertDialogDescription>
                                </AlertDialogHeader>
                                <form className="flex flex-col gap-2" onSubmit={uploadResume}>
                                    <label>Upload</label>
                                    <Input type="file" name="resume" accept=".pdf" onChange={handleFileChange} />
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                                        <AlertDialogAction type="submit" className="rounded-full">Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </form>
                            </AlertDialogContent>
                        </AlertDialog>
                        {
                            job &&
                            <AlertDialog onOpenChange={(open) => {
                                if(open) refreshScore();
                            }}>
                                <AlertDialogTrigger asChild>
                                    <Button className="rounded-full bg-blue-600 hover:bg-blue-500">Apply for {job.name}</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>{job.name}</AlertDialogTitle>
                                        <AlertDialogDescription>This is how well your resume matches</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="flex flex-row items-center justify-center">
                                        <NumberTicker value={score} className="text-4xl font-bold text-blue-600"/>
                                        <p className="text-4xl font-bold text-blue-600">/100</p>
                                    </div>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                                        <AlertDialogAction className="rounded-full" onClick={applyJob}>Apply</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        }
                    </div>
                    <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                    <label htmlFor="name">Name</label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleBasicChange('name', e.target.value)}
                    />

                    <label htmlFor="email">Email</label>
                    <Input
                        id="email"
                        value={formData.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleBasicChange('email', e.target.value)}
                    />

                    <label htmlFor="phone">Phone</label>
                    <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleBasicChange('phone', e.target.value)}
                    />

                    <label htmlFor="location">Location</label>
                    <Input
                        id="location"
                        value={formData.location}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleBasicChange('location', e.target.value)}
                    />

                    <label htmlFor="introduction">Introduction</label>
                    <Textarea
                        id="introduction"
                        value={formData.introduction}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            handleBasicChange('introduction', e.target.value)}
                        placeholder="I am a 3rd year cyber security student..."
                    />
                </div>

                {/* Work Experience */}
                <div className="flex flex-col gap-2 rounded-md border border-neutral-300 p-10">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Work Experience</h2>
                        <Button onClick={addWorkExperience} variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" /> Add Experience
                        </Button>
                    </div>

                    {formData.workExperience.map((work, index) => (
                        <div key={index} className="border rounded-md p-4 mb-4">
                            <div className="grid gap-2">
                                <Input
                                    placeholder="Company"
                                    value={work.company}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleWorkChange(index, 'company', e.target.value)}
                                />
                                <Input
                                    placeholder="Position"
                                    value={work.position}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleWorkChange(index, 'position', e.target.value)}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        placeholder="Location"
                                        value={work.location}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            handleWorkChange(index, 'location', e.target.value)}
                                    />
                                    <Input
                                        placeholder="Duration (e.g. April 2023 - Present)"
                                        value={work.duration}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            handleWorkChange(index, 'duration', e.target.value)}
                                    />
                                </div>
                                <Textarea
                                    placeholder="Details (one per line)"
                                    value={work.details.join('\n')}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        handleWorkChange(index, 'details', e.target.value.split('\n'))}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Projects */}
                <div className="flex flex-col gap-2 rounded-md border border-neutral-300 p-10">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Projects</h2>
                        <Button onClick={addProject} variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" /> Add Project
                        </Button>
                    </div>

                    {formData.projects.map((project, index) => (
                        <div key={index} className="border rounded-md p-4 mb-4">
                            <div className="grid gap-2">
                                <Input
                                    placeholder="Project Name"
                                    value={project.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleProjectChange(index, 'name', e.target.value)}
                                />
                                <Textarea
                                    placeholder="Details (one per line)"
                                    value={project.details.join('\n')}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        handleProjectChange(index, 'details', e.target.value.split('\n'))}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Skills */}
                <div className="flex flex-col gap-2 rounded-md border border-neutral-300 p-10">
                    <h2 className="text-xl font-semibold mb-4">Skills</h2>
                    <Textarea
                        placeholder="Enter skills (one per line)"
                        value={formData.skills.join('\n')}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            handleBasicChange('skills', e.target.value.split('\n'))}
                    />
                </div>

                {/* Education */}
                <div className="flex flex-col gap-2 rounded-md border border-neutral-300 p-10">
                    <h2 className="text-xl font-semibold mb-4">Education</h2>
                    <Input
                        placeholder="School Name"
                        value={formData.education.school}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleEducationChange('school', e.target.value)}
                    />
                    <Input
                        placeholder="Degree"
                        value={formData.education.degree}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleEducationChange('degree', e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            placeholder="Location"
                            value={formData.education.location}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleEducationChange('location', e.target.value)}
                        />
                        <Input
                            placeholder="Duration"
                            value={formData.education.duration}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleEducationChange('duration', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex h-full w-1/2">
                {
                    isClient &&
                    <PDFViewer className="w-full rounded-md">
                        <ResumePDF data={formData} />
                    </PDFViewer>
                }
            </div>
        </div>
    );
}