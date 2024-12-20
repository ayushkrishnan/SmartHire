import { eq, InferInsertModel } from "drizzle-orm";
import db from "./db";
import { jobs, skills } from "./schema";

export async function addJob(job: InferInsertModel<typeof jobs>, skillList: string[]){
    const dbJob = await db.insert(jobs).values(job).returning();
    return await db.insert(skills).values(skillList.map(skill => ({
        jobId: dbJob.at(0)?.id!,
        name: skill
    }))).returning();
}

export async function getJobs(userId: number) {
    return await db.select().from(jobs).where(eq(jobs.userId, userId));
}