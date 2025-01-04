import { cosineDistance, eq, InferInsertModel, InferSelectModel } from "drizzle-orm";
import db from "./db";
import { jobs, skills, users } from "./schema";

export async function addJob(job: InferInsertModel<typeof jobs>, skillList: string[]){
    const dbJob = await db.insert(jobs).values(job).returning();
    return await db.insert(skills).values(skillList.map(skill => ({
        jobId: dbJob.at(0)?.id!,
        name: skill
    }))).returning();
}

export async function getJobs(userId?: number) {
    let dbJobs: (InferSelectModel<typeof jobs> & {skills?: InferSelectModel<typeof skills>[]})[];
    if(userId){
        const user = (await db.select().from(users).where(eq(users.id, userId)))[0];
        dbJobs = await db.select().from(jobs).orderBy(cosineDistance(jobs.embeddings, user.resumeEmbeddings!));
    }else{
        dbJobs = await db.select().from(jobs);
    }

    for(const job of dbJobs){
        const dbSkills = await db.select().from(skills).where(eq(skills.jobId, job.id));
        job.skills = dbSkills;
    }

    return dbJobs;
}

export async function getJob(jobId: number){
    const dbJob: (InferSelectModel<typeof jobs> & {skills?: InferSelectModel<typeof skills>[]}) = (await db.select().from(jobs).where(eq(jobs.id, jobId))).at(0)!;

    const dbSkills = await db.select().from(skills).where(eq(skills.jobId, jobId));
    dbJob.skills = dbSkills;

    return dbJob;
}

export async function deleteJob(jobId: number){
    await db.delete(jobs).where(eq(jobs.id, jobId));
}