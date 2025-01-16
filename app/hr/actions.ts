"use server";

import { addJob, getJobs, updateJob, deleteJob } from "@/lib/db/jobs";

export async function createJob(formData: FormData) {
    return await addJob({
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        skills: formData.get('skills') as string,
        pay: formData.get('pay') as string,
        company: formData.get('company') as string
    });
}

export async function editJob(formData: FormData, jobId: number){
    await updateJob(jobId, {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        skills: formData.get('skills') as string,
        pay: formData.get('pay') as string,
        company: formData.get('company') as string
    });
    return await getJobs();
}

export async function removeJob(jobId: number){
    await deleteJob(jobId);
}