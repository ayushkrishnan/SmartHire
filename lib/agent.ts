import { createGroq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY!
})

const model = groq("llama-3.3-70b-versatile");

const resumeSchema = z.object({
    name: z.string().describe("The full name of the person"),
    email: z.string().email().describe("Professional email address"),
    phone: z.string().describe("Phone number"),
    location: z.string().describe("Current city and state/country"),
    introduction: z.string().describe("A brief professional summary highlighting key experiences and goals"),
    workExperience: z.array(z.object({
        company: z.string().describe("Name of the employer company"),
        position: z.string().describe("Job title or role"),
        location: z.string().describe("City and state/country where the job was located"),
        duration: z.string().describe("Employment period in format 'Month Year - Month Year' or 'Month Year - Present'"),
        details: z.array(z.string().describe("Bullet points describing achievements and responsibilities"))
    })).describe("List of professional work experiences, ordered from most recent to oldest"),
    projects: z.array(z.object({
        name: z.string().describe("Title of the project"),
        details: z.array(z.string().describe("Bullet points describing project features, technologies, and achievements"))
    })).describe("Significant technical projects or implementations"),
    skills: z.array(z.string().describe("Technical skills, frameworks, languages, and tools"))
        .describe("List of technical competencies and skills"),
    education: z.object({
        school: z.string().describe("Name of the educational institution"),
        degree: z.string().describe("Type and field of degree obtained"),
        location: z.string().describe("City and state/country of the institution"),
        duration: z.string().describe("Education period in format 'Year - Year'")
    }).describe("Academic background and qualifications")
});

export async function extractResumeFields(resume: string) {
    const { object } = await generateObject({
        model,
        system: "Extract the text from the given resume text into the given schema. Preserve as much of the exact words as possible. Do not change anything about the text, only extract it and put it into the given schema.",
        schema: resumeSchema,
        prompt: resume
    })

    return object
}

export async function improveResume(resumeJson: string, jobJson: string){
    const system = `
    You are an intelligent resume improvement agent. You will be given json representing a resume and json representing a job description. Your goal is to improve the resume based on the job information. If the job information is empty, make general improvements to the resume instead.

    Guidelines for improvement:
    1. **Match Keywords**: Identify relevant skills, qualifications, and experience in the job description, and ensure these keywords are integrated into the resume. Use exact or closely related terms that appear in the job description.
    2. **Optimize for Readability**: Ensure the resume is clear, concise, and easily scannable. Use bullet points, short sentences, and proper formatting. Ensure action verbs and impactful words are used throughout.
    3. **Showcase Relevant Skills**: Highlight technical skills, tools, and platforms mentioned in the job description. Tailor the experience section to emphasize the most relevant tasks or projects.
    4. **Include Metrics and Achievements**: Add quantifiable metrics to demonstrate impact. For example, “Improved efficiency by 30%” or “Led a team of 5 engineers to deliver a project ahead of schedule.”
    5. **Tailor Experience and Education**: Align the candidate’s experience and education to the requirements in the job description. If a skill is highly desired, include projects or coursework that reflect that expertise.
    6. **Personalize Summary/Objective**: Modify the resume summary or objective to reflect the goals or qualities the employer is looking for. Be specific about how the candidate's background matches the job role.
    7. **Reformat Sections for ATS Compatibility**: Avoid using graphics, images, or unusual fonts. Use standard section headings like "Work Experience," "Education," "Skills," and "Certifications" to improve ATS compatibility.
    8. **Ensure Accuracy**: Remove any irrelevant information that doesn't support the desired role or is redundant.

    Job Information:
    ${jobJson}
    `

    const {object} = await generateObject({
        model,
        system,
        schema: resumeSchema,
        prompt: resumeJson
    })

    return object
}