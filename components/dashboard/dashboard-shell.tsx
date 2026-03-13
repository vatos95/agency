"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardContent } from "@/components/dashboard/content";
import { DashboardDataProvider } from "@/components/dashboard/dashboard-data-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { DashboardData } from "@/lib/dashboard-data";
import type { DashboardView } from "@/mock-data/dashboard";

interface DashboardShellProps {
  data: DashboardData;
}

export function DashboardShell({ data }: DashboardShellProps) {
  const [currentView, setCurrentView] = useState<DashboardView>("overview");

  return (
    <DashboardDataProvider data={data}>
      <SidebarProvider className="bg-sidebar">
        <DashboardSidebar
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        <div className="h-svh overflow-hidden lg:p-2 w-full">
          <div className="lg:border lg:rounded-md overflow-hidden flex flex-col h-full w-full bg-background">
            <DashboardHeader currentView={currentView} />
            <main className="w-full flex-1 overflow-auto">
              <DashboardContent currentView={currentView} />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </DashboardDataProvider>
  );
}
