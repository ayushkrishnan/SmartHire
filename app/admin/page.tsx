import { SignOut } from "@/components/custom/sign-out"
import { auth } from "@/auth"
import { AdminPage } from "@/components/custom/admin-page"
import { getUsers } from "@/lib/db/users"

import { addNewUser } from "./actions"
import { redirect } from "next/navigation"

export default async function Admin(){
    const session = await auth()
    const users = await getUsers();

    if(session){
        if(session.user.role !== "admin") redirect("/");
    }else{
        redirect("/");
    }

    return (
        <div className="flex flex-col w-full h-screen bg-white">
            <nav className="flex flex-row w-full p-6 justify-between items-center">
                <h2 className="text-xl font-bold">SmartHire</h2>
                <SignOut/>
            </nav>
            <AdminPage name={session?.user.name} users={users} onNewUser={addNewUser}/>
        </div>
    )
}