"use client";

import {
  BriefcaseBusiness,
  ChevronDown,
  CircleUserRound,
  Files,
  LayoutDashboard,
  Mail,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navigationLabels, type DashboardView } from "@/mock-data/dashboard";
import { cn } from "@/lib/utils";
import { useDashboardData } from "./dashboard-data-provider";

const navItems: Array<{
  key: DashboardView;
  icon: typeof LayoutDashboard;
  iconColor: string;
}> = [
  { key: "overview", icon: LayoutDashboard, iconColor: "text-primary" },
  { key: "messages", icon: Mail, iconColor: "text-cyan-500" },
  { key: "missions", icon: Files, iconColor: "text-emerald-500" },
  { key: "clients", icon: Users, iconColor: "text-orange-500" },
  { key: "profile", icon: CircleUserRound, iconColor: "text-violet-500" },
];

interface DashboardSidebarProps
  extends React.ComponentProps<typeof Sidebar> {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

export function DashboardSidebar({
  currentView,
  onViewChange,
  ...props
}: DashboardSidebarProps) {
  const { missions, messages } = useDashboardData();
  const priorityMission = missions.find((mission) => mission.status === "delivery_due");
  const activeMissionCount = missions.filter((mission) => mission.status === "active").length;
  const replyCount = messages.filter(
    (message) => message.status === "Reponse requise"
  ).length;

  return (
    <Sidebar collapsible="offcanvas" className="!border-r-0" {...props}>
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center w-full">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 outline-none w-full justify-start">
              <div className="size-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground shrink-0">
                <BriefcaseBusiness className="size-4" />
              </div>
              <div className="min-w-0 text-left">
                <span className="font-semibold text-sidebar-foreground truncate block">
                  Agency
                </span>
                <span className="text-xs text-muted-foreground">
                  Designer workspace
                </span>
              </div>
              <ChevronDown className="size-3 text-muted-foreground shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel className="text-muted-foreground text-xs font-medium">
                Espace
              </DropdownMenuLabel>
              <DropdownMenuItem>Compte designer</DropdownMenuItem>
              <DropdownMenuItem>Archives missions</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Plus className="size-4 mr-2" />
                Nouvelle mission
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="size-4 mr-2" />
                Preferences
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={currentView === item.key}
                    className="h-10"
                    onClick={() => onViewChange(item.key)}
                  >
                    <item.icon className={cn("size-4 shrink-0", item.iconColor)} />
                    <span className="text-sm">{navigationLabels[item.key]}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 pb-3 group-data-[collapsible=icon]:hidden">
        <div className="flex flex-col gap-2 rounded-lg border p-4 text-sm w-full bg-background">
          <div className="text-base font-semibold leading-tight">
            Session active
          </div>
          <div className="text-muted-foreground">
            {priorityMission ? "1 livraison a envoyer" : "0 livraison urgente"},{" "}
            {activeMissionCount} mission(s) active(s) et {replyCount} retour(s) a
            traiter.
          </div>
          <Button
            size="sm"
            className="w-full"
            onClick={() => onViewChange("missions")}
          >
            Ouvrir la mission prioritaire
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
