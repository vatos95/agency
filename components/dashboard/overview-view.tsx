"use client";

import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDot,
  Eye,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { SectionHeading } from "./section-heading";
import { StatusPill } from "./status-pill";
import { useDashboardData } from "./dashboard-data-provider";

function StatsSection() {
  const { designerStats } = useDashboardData();
  const icons = [BriefcaseBusiness, Sparkles, CheckCircle2, Eye];
  const trendStyles = {
    positive: "text-emerald-600 dark:text-emerald-400",
    negative: "text-rose-600 dark:text-rose-400",
    neutral: "text-muted-foreground",
  } as const;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {designerStats.map((stat, index) => {
        const Icon = icons[index];

        return (
          <Card key={stat.title} className="gap-4">
            <CardContent className="px-6">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className={`text-xs ${trendStyles[stat.trend]}`}>
                    {stat.change}
                  </p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-xl border bg-muted/60">
                  <Icon className="size-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function OverviewView() {
  const { activityFeed, messages, missions, welcomeSummary } = useDashboardData();
  const priorityMission =
    missions.find((mission) => mission.status === "delivery_due") ?? missions[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <SectionHeading
          eyebrow="Accueil"
          title={`Bonjour ${welcomeSummary.userName}`}
          description={welcomeSummary.summary}
        />
      </div>

      <StatsSection />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_360px] gap-4 sm:gap-6 items-start">
        <div className="space-y-4 sm:space-y-6">
          <Card className="self-start">
            <CardHeader className="border-b">
              {priorityMission ? (
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      Mission prioritaire
                    </p>
                    <CardTitle>{priorityMission.title}</CardTitle>
                    <CardDescription>{priorityMission.client}</CardDescription>
                  </div>
                  <StatusPill status={priorityMission.status} />
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Mission prioritaire
                  </p>
                  <CardTitle>Aucune mission pour le moment</CardTitle>
                  <CardDescription>
                    Le mentor n'a pas encore attribue de brief a ce compte.
                  </CardDescription>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {priorityMission ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    {priorityMission.objective}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Deadline
                      </p>
                      <p className="mt-2 font-medium">{priorityMission.deadline}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Budget
                      </p>
                      <p className="mt-2 font-medium">{priorityMission.budget}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Livrable
                      </p>
                      <p className="mt-2 font-medium">
                        {priorityMission.deliverables[0]}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" className="h-9 gap-1.5">
                      Ouvrir la mission
                      <ArrowRight className="size-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-9">
                      Voir le brief client
                    </Button>
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                  Quand un mentor t'attribuera des projets, ils apparaitront ici avec leur priorite.
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Activite recente</CardTitle>
                <CardDescription>
                  Suivi rapide des dernieres actions sur le compte.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activityFeed.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                    Aucune activite recente n'est encore remontee pour ce compte.
                  </div>
                ) : (
                  activityFeed.map((item) => (
                    <div key={item.title} className="flex gap-3">
                      <div className="pt-0.5">
                        <CircleDot className="size-4 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{item.title}</p>
                          <span className="text-xs text-muted-foreground">
                            {item.date}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b">
                <CardTitle>Indicateurs</CardTitle>
                <CardDescription>
                  Vue d'ensemble de la charge et de la satisfaction client.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Reputation client</span>
                    <span className="font-medium">84%</span>
                  </div>
                  <Progress value={84} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Missions actives</span>
                    <span className="font-medium">2 ouvertes</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>
                <div className="rounded-xl border bg-muted/30 p-4">
                  <p className="text-sm font-medium">A faire maintenant</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Finaliser la livraison Brava Coffee avant la fin de journee.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="self-start">
          <CardHeader className="border-b">
            <CardTitle>Boite de reception</CardTitle>
            <CardDescription>
              Les derniers messages qui demandent une action.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {messages.length === 0 ? (
              <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                Aucun message n'est encore visible pour ce designer.
              </div>
            ) : (
              messages.slice(0, 3).map((message) => (
                <div key={message.id} className="space-y-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-sm">{message.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.client}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {message.urgency}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{message.preview}</p>
                  <Separator />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
