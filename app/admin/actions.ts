"use server";

import { addUser, deleteUser, getUsers, updateUser } from "@/lib/db/users";

export async function addNewUser({name, role, email}: {name: string, role: string, email: string}){
    return await addUser({
        name, role, email
    })
}

export async function editUser({id, name, role, email}: {id: string, name: string, role: string, email: string}){
    await updateUser(id, {
        name,
        email,
        role
    })

    return await getUsers();
}

export async function removeUser(id: string){
    await deleteUser(id);
}