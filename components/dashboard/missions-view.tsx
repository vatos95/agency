"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  FileText,
  Flag,
  Search,
  SendHorizontal,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type MissionStatus } from "@/mock-data/dashboard";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";
import { MetaTag } from "./meta-tag";
import { DeliverySheet } from "./delivery-sheet";
import { useDashboardData } from "./dashboard-data-provider";

function getMissionTone(status: MissionStatus): "accent" | "warning" | "urgent" | "success" | "default" {
  if (status === "delivery_due") return "warning";
  if (status === "revision") return "urgent";
  if (status === "validated") return "success";
  if (status === "active") return "accent";
  return "default";
}

function getMissionLabel(status: MissionStatus) {
  if (status === "delivery_due") return "A livrer";
  if (status === "active") return "En cours";
  if (status === "revision") return "Revision";
  if (status === "validated") return "Validee";
  return "Nouveau";
}

export function MissionsView() {
  const { missions } = useDashboardData();
  const [selectedMissionId, setSelectedMissionId] = useState(missions[0]?.id ?? "");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | MissionStatus>("all");
  const [deliveryOpen, setDeliveryOpen] = useState(false);

  const filteredMissions = useMemo(() => {
    return missions.filter((mission) => {
      const matchesSearch =
        !searchQuery.trim() ||
        mission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mission.client.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || mission.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const selectedMission =
    filteredMissions.find((mission) => mission.id === selectedMissionId) ??
    filteredMissions[0] ??
    missions[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <SectionHeading
          eyebrow="Missions"
          title="Brief et livraison"
          description="Consulte le brief, prepare ta proposition puis envoie ta livraison avec le lien Figma et ton message client."
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative w-full sm:w-[220px]">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Rechercher une mission"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ["all", "Toutes"],
              ["active", "En cours"],
              ["delivery_due", "A livrer"],
              ["revision", "Revisions"],
            ].map(([value, label]) => (
              <Button
                key={value}
                variant={statusFilter === value ? "default" : "outline"}
                size="sm"
                className="h-9"
                onClick={() => setStatusFilter(value as "all" | MissionStatus)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)_360px] gap-4 sm:gap-6">
        <Card className="gap-0 overflow-hidden self-start">
          <CardHeader className="border-b">
            <CardTitle>Missions</CardTitle>
            <CardDescription>
              {filteredMissions.length} mission(s) visible(s)
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            {filteredMissions.map((mission) => (
              <button
                key={mission.id}
                type="button"
                onClick={() => setSelectedMissionId(mission.id)}
                className={cn(
                  "w-full border-b px-6 py-4 text-left transition-colors hover:bg-muted/40",
                  selectedMission?.id === mission.id && "bg-muted/40"
                )}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MetaTag label={mission.client} tone="violet" />
                    <MetaTag label={getMissionLabel(mission.status)} tone={getMissionTone(mission.status)} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{mission.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {mission.objective}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {selectedMission ? (
          <>
            <Card className="gap-0 overflow-hidden">
              <CardHeader className="border-b">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <MetaTag label={selectedMission.client} tone="violet" />
                    <MetaTag
                      label={getMissionLabel(selectedMission.status)}
                      tone={getMissionTone(selectedMission.status)}
                    />
                  </div>
                  <div className="space-y-1">
                    <CardTitle>{selectedMission.title}</CardTitle>
                    <CardDescription>{selectedMission.objective}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Deadline
                    </p>
                    <p className="mt-2 font-medium">{selectedMission.deadline}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Budget
                    </p>
                    <p className="mt-2 font-medium">{selectedMission.budget}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Note complementaire
                    </p>
                    <p className="mt-2 font-medium">{selectedMission.note}</p>
                  </div>
                </div>

                <div className="rounded-xl border bg-muted/20 p-4">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-muted-foreground" />
                    <p className="font-medium">Brief client</p>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-6">
                    {selectedMission.objective}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border p-4">
                    <p className="text-sm font-medium">Livrables</p>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {selectedMission.deliverables.map((item) => (
                        <li key={item} className="flex gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border p-4">
                    <p className="text-sm font-medium">Attentes client</p>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {selectedMission.expectations.map((item) => (
                        <li key={item} className="flex gap-2">
                          <Flag className="mt-0.5 size-4 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    className="gap-1.5"
                    onClick={() => setDeliveryOpen(true)}
                  >
                    <SendHorizontal className="size-4" />
                    Envoyer la livraison
                  </Button>
                  <Button
                    variant="outline"
                    asChild={Boolean(selectedMission.figmaLink)}
                    disabled={!selectedMission.figmaLink}
                  >
                    {selectedMission.figmaLink ? (
                      <a href={selectedMission.figmaLink} target="_blank" rel="noreferrer">
                        Ouvrir Figma
                      </a>
                    ) : (
                      <span>Ouvrir Figma</span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Historique client</CardTitle>
                  <CardDescription>
                    Commentaires et retours associes a la mission.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  {selectedMission.feedback.map((entry) => (
                    <div key={`${entry.title}-${entry.date}`} className="rounded-xl border p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-sm">{entry.title}</p>
                        <span className="text-xs text-muted-foreground">
                          {entry.date}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {entry.body}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}
      </div>

      <DeliverySheet
        mission={selectedMission ?? null}
        open={deliveryOpen}
        onOpenChange={setDeliveryOpen}
      />
    </div>
  );
}
