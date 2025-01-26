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
    achievements: z.array(z.object({
        title: z.string().describe("Title or name of the achievement"),
        details: z.array(z.string().describe("Bullet points describing the achievement and its impact"))
    })).describe("Notable accomplishments, awards, and recognitions"),
    skills: z.array(z.string().describe("Technical skills, frameworks, languages, and tools"))
        .describe("List of technical competencies and skills"),
    education: z.array(z.object({
        school: z.string().describe("Name of the educational institution"),
        degree: z.string().describe("Type and field of degree obtained"),
        location: z.string().describe("City and state/country of the institution"),
        duration: z.string().describe("Education period in format 'Year - Year'")
    })).describe("Academic background and qualifications"),
    languages: z.array(z.string()).describe("Languages spoken")
});

export async function extractResumeFields(resume: string) {
    const { object } = await generateObject({
        model,
        system: "Extract the text from the given resume text into the given schema. Preserve as much of the exact words as possible. Do not change anything about the text, only extract it and put it into the given schema. If there are any certifications, put it under achievements",
        schema: resumeSchema,
        prompt: resume
    })

    return object
}

export async function improveResume(resumeJson: string, jobJson: string){
    const system = `
    You are an intelligent resume optimization agent. You will receive JSON representing a resume and JSON for a job description. Improve the resume using ONLY the information already present in the original resume. Never add new skills, experiences, or qualifications - even if they appear in the job description.

Core Principles:
1. **Absolute Fidelity to Source Material**: Every word in the improved resume must be derived from and supported by the original resume. Never invent new information.
2. **Strategic Repurposing**: Reorganize and rephrase existing content to better match job requirements while maintaining 100% factual accuracy.
3. **Contextual Keyword Alignment**: Use synonyms/exact matches from the original resume to align with job description keywords when possible.

Guidelines:
1. **Keyword Matching** (Using Original Content Only):
   - Match job description terms ONLY with existing resume keywords/phrases.
   - Use synonyms from the original resume when possible (e.g., if job says "JIRA" and resume has "Atlassian tools").

2. **Experience Optimization**:
   - Reprioritize bullet points to highlight job-relevant aspects of existing roles
   - Rephrase existing accomplishments using stronger verbs from the original resume

3. **Skills Section Management**:
   - Reorder skills to match job priority using only the original skill list
   - Combine related skills from the resume when permitted by original context

4. **Metrics Utilization** (If Available in Original):
   - Bring existing quantifiable achievements to more prominent positions
   - Rephrase metrics using job description's preferred units/terminology (if present in original)

5. **Summary/Objective Tailoring**:
   - Recompose using only phrases and concepts explicitly present in other resume sections
   - Mirror language patterns from the job description using the resume's existing vocabulary

6. **ATS Formatting**:
   - Standardize section headers using only those present in original resume
   - Maintain original date formats and naming conventions

<STRICT PROHIBITIONS>
- Never add: New skills, tools, job titles, employers, education entries, or certifications
- Never create: New metrics, team sizes, or accomplishments not explicitly stated
- Never assume: Unstated relationships between resume elements (e.g., don't infer Python from "Django experience" unless explicitly listed)
</STRICT PROHIBITIONS>

Job Description Context (For Guidance Only):
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

export async function generateResumeScore(resumeJson: string, jobJson: string){
    const {object} = await generateObject({
        model,
        system: `
        You are an ATS (Applicant Tracking System) scoring module. Calculate a precise compatibility score between 0-100 for the resume/job match using ONLY these criteria:

**Scoring Priorities**  
1. **Experience & Project Relevance** (40% weight):  
   - Direct overlap between resume roles/projects and JD requirements  
   - Years of experience vs JD expectations  
   - Quantifiable achievements matching JD success metrics  

2. **Skill Alignment** (35% weight):  
   - Hard skills match (exact tool/tech matches)  
   - Soft skills contextual equivalence  
   - Required vs optional skills from JD  

3. **Fundamentals** (25% weight):  
   - Education/certification requirements met  
   - Professional language and ATS-friendly formatting  
   - Conciseness relative to experience level

**Calculation Rules**  
- Start at 20 baseline  
- Add points for matches:  
  - +0.5-2.0 per hard skill match  
  - +3-8 per relevant year of experience  
  - +5-15 for required qualifications  
- Subtract for gaps:  
  - -5 per missing required skill  
  - -10 for missing degree/certification  
  - -7 for no measurable achievements  
- Enforce decimal precision (e.g., 83.7)  
- >90 = Ideal candidate, <40 = Poor fit  

**Job Description**  
${jobJson}
        `,
        prompt: resumeJson,
        schema: z.object({
            score: z.number().describe("The score given to the resume.")
        })
    })

    return object;
}