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
    await db.insert(users).values({
        name: user.name,
        email: user.email,
        password: hash(user.password),
        type: user.type,
        contact: user.contact
    });
}

export async function editUser(user: InferInsertModel<typeof users>){
    await db.update(users).set({
        name: user.name,
        email: user.email,
        password: hash(user.password),
        type: user.type,
        contact: user.contact,
        resume: user.resume ?? null,
        resumeEmbeddings: user.resumeEmbeddings
    }).where(eq(users.id, user.id!));
}

export async function getUser(userId: number){
    const userList = await db.select({
        id: users.id,
        email: users.email,
        name: users.name,
        type: users.type,
        contact: users.contact,
        resume: users.resume
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