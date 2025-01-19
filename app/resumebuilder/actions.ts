"use server";

import { extractResumeFields, improveResume as AIImproveResume, generateResumeScore } from "@/lib/agent";
import { addJobApplication, getJob } from "@/lib/db/jobs";
import { redirect } from "next/navigation";
import pdf from "pdf-parse"

export async function uploadResume(pdfBuffer: string){
    const {text} = await pdf(Buffer.from(pdfBuffer, "base64"));
    return await extractResumeFields(text);
}

export async function improveResume(pdfJson: string, jobId?: number){
    let job;
    if(jobId){
        job = await getJob(jobId);
    }

    return await AIImproveResume(pdfJson, JSON.stringify(job) ?? "{}")
}

export async function scoreResume(pdfJson: string, jobId: number){
    const job = await getJob(jobId);
    return await generateResumeScore(pdfJson, JSON.stringify(job));
}

export async function applyJob(pdfJson: string, jobId: number, userId: string, score: number){
    await addJobApplication(jobId, pdfJson, userId, score);
    redirect("/jobs");
}