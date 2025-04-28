'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppSidebar } from "./components/sidebar/app-sidebar";
import { ThemeProvider } from "next-themes";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeSwitcher } from '@/components/theme-switcher';

export default function ChatLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex justify-between h-16 shrink-0 items-center gap-2">
                <div className="flex  justify-between items-center gap-2 px-4">
                  
                  <SidebarTrigger className="-ml-1" />
                  <ThemeSwitcher />
                </div>
              </header>
              <div className="flex h-[calc(100vh-6rem)] w-full overflow-hidden">
                <div className="flex-1 h-full w-full overflow-hidden">
                  {children}
                </div>
              </div>
            </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
