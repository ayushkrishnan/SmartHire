import { InferInsertModel } from "drizzle-orm";
import db from "./index"
import {users} from "./schema"

export async function getUsers(){
    return await db.select().from(users);
}

export async function addUser(user: InferInsertModel<typeof users>){
    return await db.insert(users).values(user).returning();
}