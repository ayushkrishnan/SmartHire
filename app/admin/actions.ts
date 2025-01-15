"use server";

import { addUser } from "@/lib/db/users";

export async function addNewUser({name, role, email}: {name: string, role: string, email: string}){
    return await addUser({
        name, role, email
    })
}