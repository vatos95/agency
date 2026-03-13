"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, BriefcaseBusiness, SendHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navigationLabels, type DashboardView } from "@/mock-data/dashboard";
import { useDashboardData } from "./dashboard-data-provider";
import { SignOutButton } from "@/components/auth/sign-out-button";

interface DashboardHeaderProps {
  currentView: DashboardView;
}

export function DashboardHeader({ currentView }: DashboardHeaderProps) {
  const { lastUpdated, viewer } = useDashboardData();

  return (
    <header className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3 border-b bg-card sticky top-0 z-10 w-full shrink-0">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-2" />
        <div className="flex items-center gap-2 text-muted-foreground">
          <BriefcaseBusiness className="size-4" />
          <span className="text-sm font-medium">{navigationLabels[currentView]}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-xs text-muted-foreground hidden sm:inline">
          Mise a jour {lastUpdated}
        </span>
        <Button variant="outline" size="sm" className="h-8 gap-1.5">
          <Bell className="size-3.5" />
          <span className="hidden sm:inline">Notifications</span>
        </Button>
        <Button size="sm" className="h-8 gap-1.5">
          <SendHorizontal className="size-3.5" />
          <span className="hidden sm:inline">Nouvelle livraison</span>
        </Button>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="size-8">
              <AvatarFallback>{viewer.initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="space-y-1">
                <p className="text-sm font-medium">{viewer.displayName}</p>
                <p className="text-xs text-muted-foreground">{viewer.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs text-muted-foreground">
              {viewer.role === "mentor" ? "Compte mentor" : "Compte designer"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="p-2">
              <SignOutButton
                variant="outline"
                className="w-full justify-start"
                label="Se deconnecter"
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
