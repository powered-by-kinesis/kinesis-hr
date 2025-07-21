'use client';

import * as React from 'react';
import { Home, Bot, User as LucideUser } from 'lucide-react';

import { NavMain } from '@/components/organisms/nav-main';
import { NavUser } from '@/components/organisms/nav-user';
import { Sidebar, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import { useSession } from 'next-auth/react';

const navMain = [
  {
    title: 'Home',
    url: '/home',
    icon: Home,
  },
  {
    title: 'Hiring',
    url: '/hiring',
    icon: LucideUser,
  },
  {
    title: 'AI Interviewer',
    url: '/ai-interviewer',
    icon: Bot,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const user = {
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    avatar: session?.user?.image || '',
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
