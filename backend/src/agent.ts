import { generateObject } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { z } from "zod";

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY
})

const model = groq("llama-3.3-70b-versatile");

export async function gradeResume(resume: string, jobTitle:string, jobDescription: string, experience: string){
    const system = `
    You are an intelligent resume checker agent. You must provide a score showing how closely the resume provided in the prompt matches a given job description by looking at past experience, skills and projects. When coming up with a score, give the greatest importance to previous work experience, followed by projects and finally skills. Do not give higher scores easily. You must also provide suggestions to improve the resume so it better matches the job requirements. Do not fabricate skills, projects or job experience when generating suggestions. Instead, give more general, but actionable suggestions to improve the resume with the given content. The job experience you will be checking against is as follows.

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