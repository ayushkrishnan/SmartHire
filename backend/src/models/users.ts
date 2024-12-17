import db from "./db";
import { users } from "./schema";
import { hash } from "../util";
import { and, eq, InferInsertModel } from "drizzle-orm";

export async function login(email: string, password: string){
    const passwordHash = hash(password);

    const userList = await db.select({
        id: users.id,
        email: users.email,
        name: users.name,
        type: users.type,
        contact: users.contact
    }).from(users).where(and(eq(users.email, email), eq(users.password, passwordHash)));

    if(userList.length === 0){
        throw new UserNotFoundError();
    }

    return userList.at(0);
}

export async function addUser(user: InferInsertModel<typeof users>){
    await db.insert(users).values(user);
}

export async function getUser(userId: number){
    const userList = await db.select({
        id: users.id,
        email: users.email,
        name: users.name,
        type: users.type,
        contact: users.contact
    }).from(users).where(eq(users.id, userId));

    if(userList.length === 0){
        throw new UserNotFoundError();
    }

    return userList.at(0);
}

export async function getUsers(){
    return await db.select({
        id: users.id,
        email: users.email,
        name: users.name,
        type: users.type,
        contact: users.contact
    }).from(users);
}

export class UserNotFoundError extends Error{
    constructor(){
        super("User not found");
    }
}