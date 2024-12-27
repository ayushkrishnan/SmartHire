import db from "./db";
import { applications, users } from "./schema";
import { InferSelectModel, InferInsertModel, eq, desc } from "drizzle-orm";

export async function addApplication(application: InferInsertModel<typeof applications>){
    await db.insert(applications).values(application);
}

export async function getApplications(userId: number){
    return await db.select().from(applications).where(eq(applications.userId, userId));
}

export async function getJobApplications(jobId: number){
    return await db.select().from(applications).where(eq(applications.jobId, jobId)).innerJoin(users, eq(users.id, applications.userId)).orderBy(desc(applications.score));
}

export async function getAllApplications(){
    return await db.select().from(applications);
}

export async function getApplication(applicationId: number){
    return (await db.select().from(applications).where(eq(applications.id, applicationId))).at(0);
}

export async function setApplicationStatus(applicationId: number, status: "accepted" | "rejected"){
    await db.update(applications).set({
        status
    }).where(eq(applications.id, applicationId));
}