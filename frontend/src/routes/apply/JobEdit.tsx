import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { FormEvent } from "react"
import {Toaster} from "@/components/ui/sonner"

import { useState, useEffect } from "react"

export default function ApplicantEditUser(){
    const [details, setDetails] = useState({
        name: "",
        email: "",
        contact: ""
    })

    useEffect(() => {
        (async () => {
            const response = await fetch("http://localhost:8080/user/current", {
                credentials: "include"
            })

            if(response.ok){
                setDetails(await response.json())
            }
        })()
    })

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);

        const username = formData.get("username");
        const password = formData.get("password");
        const email = formData.get("email");
        const contact = formData.get("contact");

        const response = await fetch("http://localhost:8080/user/edit", {
            method: "POST",
            body: JSON.stringify({
                name: username,
                password,
                email,
                contact
            }),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })

        if(response.ok){
            toast("User Edited!");
            setDetails({
                name: username as string,
                email: email as string,
                contact: contact as string
            });
            (event.target as HTMLFormElement).reset();
        }else{
            toast("Something went wrong");
        }
    }

    return (
        <div className="flex w-full justify-center items-center h-full">
            <form className="flex flex-col gap-2 w-80" onSubmit={handleSubmit}>
                <h1 className="text-2xl font-bold">Edit Profile</h1>
                <label>Username</label>
                <Input name="username" placeholder="Username" defaultValue={details.name} required/>
                <label>Email</label>
                <Input name="email" type="email" placeholder="john.doe@smarthire.com" defaultValue={details.email} required/>
                <label>Contact (Optional)</label>
                <Input name="contact" type="phone" defaultValue={details.contact}/>
                <label>Password</label>
                <Input name="password" type="password" placeholder="Enter a secure password" required/>
                <Button type="submit">Add user</Button>
            </form>
            <Toaster/>
        </div>
    )
}