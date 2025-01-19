"use client";
import { FormEvent, useState } from "react";
import NumberTicker from "../ui/number-ticker";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogFooter
} from "../ui/alert-dialog"


export function AdminPage({
    name,
    users,
    onNewUser,
    onEditUser,
    onDeleteUser
}: {
    name?: string | null,
    users?: {
        id: string,
        name: string | null,
        role: string | null,
        email: string | null,
        image: string | null
    }[],
    onNewUser: ({ name, email, role }: { name: string, email: string, role: string }) => Promise<{
        id: string,
        name: string | null,
        role: string | null,
        email: string | null,
        image: string | null
    }[]>,
    onEditUser: ({id, name, role, email}: {id: string, name: string, role: string, email: string}) => Promise<{
        id: string,
        name: string | null,
        role: string | null,
        email: string | null,
        image: string | null
    }[]>,
    onDeleteUser: (id: string) => Promise<void>
}) {
    const [userList, setUserList] = useState(users)

    const handleNewUser = async (event: FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const role = formData.get("role") as string;

        const users = await onNewUser({ name, email, role });

        setUserList((prevList) => prevList?.concat(users));

        (event.target as HTMLFormElement).reset();
    }

    const handleEditUser = async (event: FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);

        const id = formData.get("id") as string;
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const role = formData.get("role") as string;

        const users = await onEditUser({ name, email, role, id });
        setUserList(users);
        (event.target as HTMLFormElement).reset();
    }

    const handleDeleteUser = async (userId: string) => {
        setUserList((prevUsers) => prevUsers?.filter(user => user.id !== userId));
        await onDeleteUser(userId);
    }

    return (
        <div className="flex flex-col p-6 gap-4">
            <div className="flex flex-row items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold">Welcome back,<br /> {name ?? "Admin"}</h1>
                    <p>Manage the orgnaization's users</p>
                </div>
                <div className="flex flex-row gap-6">
                    <div className="flex flex-col gap-2 w-24">
                        <NumberTicker value={userList?.length ?? 0} className="text-4xl font-bold" />
                        <p>Total Users</p>
                    </div>
                    <div className="flex flex-col gap-2 w-24">
                        {
                            userList?.filter((user) => user.role === "admin").length === 0 ?
                                <h2 className="text-4xl font-bold">0</h2> :
                                <NumberTicker value={userList?.filter((user) => user.role === "admin").length ?? 0} className="text-4xl font-bold" />
                        }
                        <p>Admins</p>
                    </div>
                    <div className="flex flex-col gap-2 w-24">
                        {
                            userList?.filter((user) => user.role === "hr").length === 0 ?
                                <h2 className="text-4xl font-bold">0</h2> :
                                <NumberTicker value={userList?.filter((user) => user.role === "hr").length ?? 0} className="text-4xl font-bold" />
                        }
                        <p>Human Resources</p>
                    </div>
                    <div className="flex flex-col gap-2 w-24">
                        {
                            userList?.filter((user) => user.role === "user").length === 0 ?
                                <h2 className="text-4xl font-bold">0</h2> :
                                <NumberTicker value={userList?.filter((user) => user.role === "user").length ?? 0} className="text-4xl font-bold" />
                        }
                        <p>Job Applicants</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="rounded-full w-fit">New user</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a new user</DialogTitle>
                            <DialogDescription>We'll handle the rest when they login</DialogDescription>
                        </DialogHeader>
                        <form className="flex flex-col gap-2" onSubmit={handleNewUser}>
                            <label>Name</label>
                            <Input name="name" placeholder="John Doe" required />
                            <label>Email</label>
                            <Input name="email" placeholder="john.doe@acme.com" required />
                            <label>Role</label>
                            <Select name="role" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">Job Applicant</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="hr">Human Resources</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit" className="rounded-full w-fit">Submit</Button>
                        </form>
                    </DialogContent>
                </Dialog>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Avatar</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            userList?.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Avatar>
                                            <AvatarImage src={user.image ?? undefined} />
                                            <AvatarFallback>{user.name?.slice(0, 2)}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-row gap-2">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button className="rounded-full w-fit" variant="outline">Edit</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Edit user</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            We'll handle the rest when they login
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <form className="flex flex-col gap-2" onSubmit={handleEditUser}>
                                                        <input type="hidden" name="id" value={user.id}/>
                                                        <label>Name</label>
                                                        <Input
                                                            name="name"
                                                            placeholder="John Doe"
                                                            required
                                                            defaultValue={user.name!}
                                                        />
                                                        <label>Email</label>
                                                        <Input
                                                            name="email"
                                                            placeholder="john.doe@acme.com"
                                                            required
                                                            defaultValue={user.email!}
                                                        />
                                                        <label>Role</label>
                                                        <Select
                                                            name="role"
                                                            required
                                                            defaultValue={user.role!}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a role" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="user">Job Applicant</SelectItem>
                                                                <SelectItem value="admin">Admin</SelectItem>
                                                                <SelectItem value="hr">Human Resources</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                                                            <AlertDialogAction className="rounded-full" type="submit">Submit</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </form>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button className="rounded-full" variant="outline">Delete</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                                                        <AlertDialogDescription>This action is irreversible</AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                                                        <AlertDialogAction className="rounded-full bg-red-600 hover:bg-red-500" onClick={() => handleDeleteUser(user.id)}>Delete User</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}