"use client";

import type { DashboardView } from "@/mock-data/dashboard";
import { OverviewView } from "./overview-view";
import { MessagesView } from "./messages-view";
import { MissionsView } from "./missions-view";
import { ClientsView } from "./clients-view";
import { ProfileView } from "./profile-view";

interface DashboardContentProps {
  currentView: DashboardView;
}

export function DashboardContent({ currentView }: DashboardContentProps) {
  return (
    <main className="w-full overflow-y-auto overflow-x-hidden p-4 h-full">
      <div className="mx-auto w-full space-y-6">
        {currentView === "overview" && <OverviewView />}
        {currentView === "messages" && <MessagesView />}
        {currentView === "missions" && <MissionsView />}
        {currentView === "clients" && <ClientsView />}
        {currentView === "profile" && <ProfileView />}
      </div>
    </main>
  );
}
