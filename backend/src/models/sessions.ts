import { eq } from "drizzle-orm";
import db from "./db";
import { sessions } from "./schema";
import { getUser } from "./users";

export async function addSession(userId: number){
    return await db.insert(sessions).values({
        userId
    }).returning();
}

export async function getSessionUser(sessionId: string){
    const sessionList = await db.select().from(sessions).where(eq(sessions.id, sessionId));

    if(sessionList.length === 0){
        throw new SessionNotFoundError();
    }

    return await getUser(sessionList.at(0)?.userId!);
}

export class SessionNotFoundError extends Error{
    constructor(){
        super("Session not found");
    }
}