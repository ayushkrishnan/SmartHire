import { Outlet } from "react-router";
import { User, Plus, LayoutDashboard } from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";

export default function AdminLayout() {
    return (
        <SidebarProvider>
            <main className="flex h-screen overflow-hidden w-full">
                <Sidebar>
                    <SidebarContent className="p-4">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="/admin">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Users</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="/admin/users/new">
                                        <Plus className="mr-2 h-4 w-4" />
                                        <span>New User</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter>
                        {/* Add footer content if needed */}
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
            </main>
        </SidebarProvider>
    );
}


