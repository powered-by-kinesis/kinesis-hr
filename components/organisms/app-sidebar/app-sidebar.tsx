"use client"

import * as React from "react"
import {
    HelpCircle,
    Home,
    Settings,
    Bot,
    User,
} from "lucide-react"

import { NavMain } from "@/components/organisms/nav-main"
import { NavSecondary } from "@/components/organisms/nav-secondary"
import { NavUser } from "@/components/organisms/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
} from "@/components/ui/sidebar"

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Home",
            url: "/home",
            icon: Home,
        },
        {
            title: "Hiring",
            url: "/hiring",
            icon: User,
        },
        {
            title: "AI Interviewer",
            url: "/ai-interviewer",
            icon: Bot,
        },
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "/settings",
            icon: Settings,
        },
        {
            title: "Get Help",
            url: "/help",
            icon: HelpCircle,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}
