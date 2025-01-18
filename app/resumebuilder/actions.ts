"use server";

import { extractResumeFields, improveResume as AIImproveResume } from "@/lib/agent";
import { getJob } from "@/lib/db/jobs";
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