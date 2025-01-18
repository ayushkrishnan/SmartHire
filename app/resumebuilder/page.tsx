import { SignOut } from "@/components/custom/sign-out"
import { auth } from "@/auth"

import { ResumeBuilder } from "@/components/custom/resume-builder"

export default async function Jobs(){
    const session = await auth()
        
    return (
        <div className="flex flex-col w-full h-screen bg-white">
            <nav className="flex flex-row w-full p-6 justify-between items-center">
                <h2 className="text-xl font-bold">SmartHire</h2>
                <SignOut/>
            </nav>
            <ResumeBuilder/>
        </div>
    )
}