import { SignOut } from "@/components/custom/sign-out"
import { auth } from "@/auth"
import { AdminPage } from "@/components/custom/admin-page"
import { getUsers } from "@/lib/db/users"

import { addNewUser, editUser, removeUser } from "./actions"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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
                <div className="flex flex-row items-center gap-2">
                    <Link href="/jobs">
                        <Button className="rounded-full">Jobs dashboard</Button>
                    </Link>
                    <Link href="/hr">
                        <Button className="rounded-full">HR dashboard</Button>
                    </Link>
                    <SignOut/>
                </div>
            </nav>
            <AdminPage name={session?.user.name} users={users} onNewUser={addNewUser} onEditUser={editUser} onDeleteUser={removeUser}/>
        </div>
    )
}