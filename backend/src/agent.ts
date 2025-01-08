import { generateObject, embed } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { createOllama } from "ollama-ai-provider";
import { z } from "zod";

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY
})

const ollama = createOllama();

const model = groq("llama-3.3-70b-versatile");

export async function getQualifications(resume: string){
    const system = `
    You are an agent that simply generates a list of skills that can be found within the resume text. Your task is to generate a list of skills that the resume shows a person has. This might be through a skills section, or could be understood from the various projects and jobs they've done. The resume is available as the user prompt.
    `

    const {object} = await generateObject({
        model,
        system,
        prompt: resume,
        schema: z.object({
            skills: z.string().array().describe("This is an array of skills that the resume shows the applicant has.")
        })
    })

    return object;
}

export async function gradeResume(resume: string, jobTitle:string, jobDescription: string, experience: string){
    const system = `
    You are an intelligent resume checker agent. You must provide a score showing how closely the resume provided in the prompt matches a given job description by looking at past experience, skills and projects. When coming up with a score, give the greatest importance to previous work experience, followed by projects and finally skills. Do not give higher scores easily. You must also provide suggestions to improve the resume so it better matches the job requirements. Do not fabricate skills, projects or job experience when generating suggestions. Instead, give more general, but actionable suggestions to improve the resume with the given content. The job experience you will be checking against is as follows.

    Requirements:
    1. Be extremely critical, looking for as close of a match as possible.
    2. Assign low scores by default.
    3. Use both odd and even numbers when generating the score. Do not stick to multiples of ten.
    4. When a resume has a high score, generate only minimal suggestions.
    5. The worse the resume, the lower the score, and the longer the suggestions.
    6. ALWAYS GENERATE SUGGESTIONS IN MARKDOWN
    7. Ensure that the the entire markdown doesn't consist solely of headings. make use of normal text too.

    What to look for in a good resume:
    1. Projects relevant to the job posting.
    2. Previous job experience where the work done is relevant to the job posting.
    4. A higher number of projects.
    5. If certifications are present, they should be relevant to the job posting.

    JOB TITLE:
    ${jobTitle}
    JOB DESCRIPTION:
    ${jobDescription}
    JOB EXPERIENCE:
    ${experience}
    `

    const {object} = await generateObject({
        model,
        system,
        prompt: resume,
        schema: z.object({
            score: z.number().describe("A resume match score from 0 to 100."),
            suggestions: z.string().describe("Suggestions to improve the resume.")
        })
    })

    return object;
}

export async function generateEmbedding(description: string){
    const {embedding} = await embed({
        model: ollama.embedding("nomic-embed-text"),
        value: description
    })

    return embedding;
}