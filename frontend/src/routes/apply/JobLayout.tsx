import { Outlet, Link, useNavigate } from "react-router";
import { useEffect } from "react";

import {
    Sidebar,
    SidebarProvider,
    SidebarTrigger,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

import {
    Binoculars,
    FileBadgeIcon,
    User
} from "lucide-react"

export default function ApplicantLayout(){
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const response = await fetch("http://localhost:8080/user/verify", {
                method: "POST",
                body: JSON.stringify({
                    type: "hr"
                }),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            if(!response.ok){
                navigate("/login");
            }
        })();
    }, [])

    const handleLogout = async () => {
        await fetch("http://localhost:8080/user/logout", {
            credentials: "include"
        });

        navigate("/login");
    }

    return (
        <SidebarProvider>
            <main className="flex w-full h-screen overflow-hidden">
                <Sidebar>
                    <SidebarContent className="p-4">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link to="/apply">
                                        <Binoculars className="mr-2 h-4 w-4" />
                                        <span>Jobs</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link to="/apply/edit">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Edit Profile</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link to="https://rxresu.me/">
                                        <FileBadgeIcon className="mr-2 h-4 w-4" />
                                        <span>Build your resume!</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter>
                        <Button onClick={handleLogout}>Logout</Button>
                    </SidebarFooter>
                </Sidebar>
                <div className="flex flex-col overflow-hidden w-full h-full">
                    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6">
                        <SidebarTrigger />
                        <h2 className="text-lg font-semibold">Applicant Dashboard</h2>
                    </header>
                    <div className="overflow-auto p-4 h-full">
                        <Outlet />
                    </div>
                </div>
            </main>
        </SidebarProvider>
    )
}