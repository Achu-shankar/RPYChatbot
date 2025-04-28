'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PlusIcon, SidebarOpen, SidebarClose, MessageSquare } from 'lucide-react';
import { SidebarHistory } from './sidebar-history';
import { SidebarUserNav } from './sidebar-user-nav';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { createClient } from '@/utils/supabase/client';

import Image from 'next/image';

export function AppSidebar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const { state, toggleSidebar } = useSidebar();

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="pb-0">
        <div className={`flex items-center py-2 gap-2 `}>
          {/* {state !== "collapsed" && */}
          <div className="flex rounded-full items-center gap-2">
            <span className="text-lg bg-white drop-shadow-md border border-gray-200 rounded-full font-semibold"><Image src="/socr_logo.png" alt="logo" width={32} height={32} /></span>
          </div>
          {/* } */}
          {state !== "collapsed" && <span className="text-xl font-bold">DSPA Bot</span>}
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={`h-8 w-8 ${state !== "collapsed" ? "ml-auto" : ""}`}
            aria-label="Toggle sidebar"
          >
            {state === "collapsed" ? <SidebarOpen size={16} /> : <SidebarClose size={16} />}
          </Button> */}
        </div>
      </SidebarHeader>
      
      <SidebarHeader className="pt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="New Chat"
              onClick={() => {
                router.push('/chat');
                router.refresh();
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/20"
            >
              <PlusIcon className="mr-1" />
              <span className="font-medium">New Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarHistory user={user} sidebarState={state} />
      </SidebarContent>
      
      <SidebarFooter>
        {user && <SidebarUserNav user={user} />}
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
}
