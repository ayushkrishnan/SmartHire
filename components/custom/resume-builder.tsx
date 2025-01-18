"use client";

import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ResumePDF } from "./resume";
import { PDFViewer } from "@react-pdf/renderer";
import { useState } from "react";
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ShinyButton } from "../ui/shiny-button";

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

export function ResumeBuilder() {
    const [formData, setFormData] = useState<ResumeData>({
        name: "Jane Smith",
        email: "jane.smith@email.com",
        phone: "(555) 123-4567",
        location: "San Francisco, CA",
        introduction: "Results-driven software engineer with 3 years of experience in full-stack development. Passionate about creating scalable web applications and solving complex problems through elegant solutions.",
        workExperience: [
            {
                company: "Tech Solutions Inc.",
                position: "Software Engineer",
                location: "San Francisco, CA",
                duration: "June 2021 - Present",
                details: [
                    "Developed and maintained RESTful APIs serving 100K+ daily users",
                    "Reduced application load time by 40% through code optimization",
                    "Led a team of 3 developers in redesigning the customer dashboard"
                ]
            },
            {
                company: "StartUp Co.",
                position: "Junior Developer",
                location: "Oakland, CA",
                duration: "January 2020 - May 2021",
                details: [
                    "Built responsive web interfaces using React and TypeScript",
                    "Implemented automated testing, achieving 85% code coverage",
                    "Collaborated with UX team to improve user experience"
                ]
            }
        ],
        projects: [
            {
                name: "E-commerce Platform",
                details: [
                    "Built a full-stack e-commerce platform using Next.js and PostgreSQL",
                    "Implemented secure payment processing with Stripe",
                    "Deployed and maintained AWS infrastructure"
                ]
            },
            {
                name: "Task Management App",
                details: [
                    "Created a React Native mobile app for task management",
                    "Integrated real-time updates using Firebase",
                    "Published to both iOS and Android app stores"
                ]
            }
        ],
        skills: [
            "JavaScript/TypeScript",
            "React/Next.js",
            "Node.js",
            "Python",
            "PostgreSQL",
            "AWS",
            "Docker",
            "Git",
            "Agile/Scrum"
        ],
        education: {
            school: "University of California, Berkeley",
            degree: "B.S. Computer Science",
            location: "Berkeley, CA",
            duration: "2016 - 2020"
        }
    });

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

    return (
        <div className="flex flex-row p-6 h-full gap-3 overflow-hidden">
            <div className="flex flex-col gap-4 w-1/2 h-full overflow-auto">
                {/* Basic Information */}
                <div className="flex flex-col gap-2 rounded-md border border-neutral-300 p-10">
                    <div className="flex flex-row gap-2">
                        <ShinyButton className="rounded-full">Improve Resume</ShinyButton>
                        <AlertDialog>
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
                                    <Input type="file" name="resume" accept=".pdf" />
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                                        <AlertDialogAction type="submit" className="rounded-full">Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </form>
                            </AlertDialogContent>
                        </AlertDialog>
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
                <PDFViewer className="w-full rounded-md">
                    <ResumePDF data={formData} />
                </PDFViewer>
            </div>
        </div>
    );
}