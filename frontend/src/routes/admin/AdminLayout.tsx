import { Outlet, useNavigate, Link } from "react-router";
import { User, Plus } from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AdminLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const response = await fetch("http://localhost:8080/user/verify", {
                method: "POST",
                body: JSON.stringify({
                    type: "admin"
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
            <main className="flex h-screen overflow-hidden w-full">
                <Sidebar>
                    <SidebarContent className="p-4">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link to="/admin">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Users</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link to="/admin/users/new">
                                        <Plus className="mr-2 h-4 w-4" />
                                        <span>New User</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter>
                        <Button onClick={handleLogout}>Logout</Button>
                    </SidebarFooter>
                </Sidebar>
                <div className="flex flex-col flex-1 overflow-hidden w-full">
                    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6">
                        <SidebarTrigger />
                        <h2 className="text-lg font-semibold">Admin Dashboard</h2>
                    </header>
                    <div className="flex-1 overflow-auto p-6">
                        <Outlet />
                    </div>
                </div>
                <Toaster/>
            </main>
        </SidebarProvider>
    );
}


