import { eq, InferInsertModel } from "drizzle-orm"
import db from "./index"
import { jobs } from "./schema"

export async function getJobs(){
    return await db.select().from(jobs);
}

export async function addJob(job: InferInsertModel<typeof jobs>){
    return await db.insert(jobs).values(job).returning();
}

export async function updateJob(jobId: number, job: InferInsertModel<typeof jobs>){
    return await db.update(jobs).set(job).where(eq(jobs.id, jobId))
}

export async function deleteJob(jobId: number){
    return await db.delete(jobs).where(eq(jobs.id, jobId));
}