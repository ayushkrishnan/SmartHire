import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { toast } from "sonner"
import { FormEvent } from "react"

export default function AdminNewUser(){

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);

        const username = formData.get("username");
        const password = formData.get("password");
        const email = formData.get("email");
        const contact = formData.get("contact");
        const type = formData.get("type");

        const response = await fetch("http://localhost:8080/user/add", {
            method: "POST",
            body: JSON.stringify({
                name: username,
                password,
                email,
                contact,
                type
            }),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })

        if(response.ok){
            toast("User added!");
            (event.target as HTMLFormElement).reset();
        }else{
            toast("Something went wrong");
        }
    }

    return (
        <div className="flex w-full justify-center items-center h-full">
            <form className="flex flex-col gap-2 w-80" onSubmit={handleSubmit}>
                <h1 className="text-2xl font-bold">Add a new user</h1>
                <label>Username</label>
                <Input name="username" placeholder="Username" required/>
                <label>Email</label>
                <Input name="email" type="email" placeholder="john.doe@smarthire.com" required/>
                <label>Contact (Optional)</label>
                <Input name="contact" type="phone"/>
                <label>Password</label>
                <Input name="password" type="password" placeholder="Enter a secure password" required/>
                <label>Type</label>
                <Select name="type" required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select user type"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="applicant">Applicant</SelectItem>
                    </SelectContent>
                </Select>
                <Button type="submit">Add user</Button>
            </form>
        </div>
    )
}