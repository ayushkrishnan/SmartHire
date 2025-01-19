import { eq, InferInsertModel } from "drizzle-orm";
import db from "./index"
import {users} from "./schema"

export async function getUsers(){
    return await db.select().from(users);
}

export async function addUser(user: InferInsertModel<typeof users>){
    return await db.insert(users).values(user).returning();
}

export async function deleteUser(userId: string){
    await db.delete(users).where(eq(users.id, userId));
}

export async function updateUser(userId: string, user: InferInsertModel<typeof users>){
    await db.update(users).set(user).where(eq(users.id, userId));
}