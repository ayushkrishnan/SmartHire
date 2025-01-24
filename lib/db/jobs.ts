import { desc, eq, InferInsertModel } from "drizzle-orm"
import db from "./index"
import { jobs, resumes, users } from "./schema"

export async function getJobs(){
    return await db.select().from(jobs).orderBy(desc(jobs.createdOn), desc(jobs.deadline));
}

export async function getJob(jobId: number){
    return (await db.select().from(jobs).where(eq(jobs.id, jobId)))[0];
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

export async function addJobApplication(jobId: number, resumeJson: string, userId: string, score: number){
    await db.insert(resumes).values({
        jobId,
        userId,
        data: resumeJson,
        score
    })
}

export async function getJobApplications(){
    return await db.select().from(resumes);
}

export async function getJobApplicationsForJob(jobId: number){
    return await db.select().from(resumes).where(eq(resumes.jobId, jobId)).innerJoin(users, eq(resumes.userId, users.id)).orderBy(desc(resumes.score));
}

export async function updateResumeStatus(resumeId: number, status: string){
    await db.update(resumes).set({
        status
    }).where(eq(resumes.id, resumeId));
}