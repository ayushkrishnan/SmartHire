import db from "./db";
import { applications } from "./schema";
import { InferSelectModel, InferInsertModel, eq } from "drizzle-orm";

export async function addApplication(application: InferInsertModel<typeof applications>){
    await db.insert(applications).values(application);
}

export async function getApplications(userId: number){
    return await db.select().from(applications).where(eq(applications.userId, userId));
}

export async function getApplication(applicationId: number){
    return (await db.select().from(applications).where(eq(applications.id, applicationId))).at(0);
}