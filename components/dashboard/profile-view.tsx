import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { CircleAlert, Landmark, Star, Wallet } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { careerStages, clientTiers } from "@/mock-data/dashboard";
import { SectionHeading } from "./section-heading";
import { MetaTag } from "./meta-tag";
import { useDashboardData } from "./dashboard-data-provider";

const chartConfig = {
  value: {
    label: "Progression",
  },
};

const profileMetricStyles = {
  positive: {
    value: "text-emerald-600 dark:text-emerald-400",
  },
  medium: {
    value: "text-orange-600 dark:text-orange-400",
  },
  negative: {
    value: "text-rose-600 dark:text-rose-400",
  },
} as const;

function getReputationTone(reputation: string) {
  const score = Number.parseInt(reputation, 10);
  if (score >= 80) return "positive";
  if (score >= 55) return "medium";
  return "negative";
}

function getBalanceTone(balance: string) {
  const amount = Number.parseInt(balance.replace(/[^0-9]/g, ""), 10);
  if (amount >= 2000) return "positive";
  if (amount >= 900) return "medium";
  return "negative";
}

function getStageTone(stageKey?: string) {
  if (stageKey === "agency" || stageKey === "studio") return "positive";
  if (stageKey === "premium" || stageKey === "confirmed") return "medium";
  return "negative";
}

export function ProfileView() {
  const { profileHighlights, progressChartData, progressDrivers } = useDashboardData();
  const chartColors = progressChartData.map((point) =>
    point.isHighlight ? "var(--chart-1)" : "var(--chart-2)"
  );
  const currentStage = careerStages.find(
    (stage) => stage.key === profileHighlights.currentStage
  );
  const nextStage = careerStages.find(
    (stage) => stage.key === profileHighlights.nextStage
  );
  const balanceTone = profileMetricStyles[getBalanceTone(profileHighlights.balance)];
  const reputationTone =
    profileMetricStyles[getReputationTone(profileHighlights.reputation)];
  const stageTone =
    profileMetricStyles[getStageTone(currentStage?.key)];

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Profil"
        title="Evolution du compte"
        description="Une progression simple: plus le solde et la reputation montent, plus le statut evolue et plus les projets deviennent prestigieux."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <Card className="xl:col-span-2">
          <CardHeader className="border-b">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <CardTitle>{currentStage?.title ?? profileHighlights.status}</CardTitle>
                <CardDescription>{profileHighlights.statusSummary}</CardDescription>
              </div>
              {nextStage ? <MetaTag label={`Vers ${nextStage.shortLabel}`} tone="accent" /> : null}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progression vers le prochain statut</span>
                <span className="font-medium">{profileHighlights.progressValue}%</span>
              </div>
              <Progress
                value={profileHighlights.progressValue}
                className="h-2.5 [&_[data-slot=progress-indicator]]:bg-linear-to-r [&_[data-slot=progress-indicator]]:from-violet-400 [&_[data-slot=progress-indicator]]:via-violet-500 [&_[data-slot=progress-indicator]]:to-fuchsia-500"
              />
              <p className="text-sm text-muted-foreground">
                {profileHighlights.nextStatusHint}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Wallet className="size-4" />
                  <p className="text-xs uppercase tracking-[0.18em]">Solde</p>
                </div>
                <p className={`mt-3 text-2xl font-semibold ${balanceTone.value}`}>
                  {profileHighlights.balance}
                </p>
              </div>
              <div className="rounded-xl border p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="size-4" />
                  <p className="text-xs uppercase tracking-[0.18em]">Reputation</p>
                </div>
                <p className={`mt-3 text-2xl font-semibold ${reputationTone.value}`}>
                  {profileHighlights.reputation}
                </p>
              </div>
              <div className="rounded-xl border p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Landmark className="size-4" />
                  <p className="text-xs uppercase tracking-[0.18em]">Statut</p>
                </div>
                <p className={`mt-3 text-2xl font-semibold ${stageTone.value}`}>
                  {currentStage?.shortLabel ?? "Premium"}
                </p>
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <p className="font-medium">Courbe recente</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Evolution de la progression sur la semaine.
              </p>
              <ChartContainer config={chartConfig} className="mt-4 h-[200px] w-full">
                <BarChart data={progressChartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <YAxis hide domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} strokeWidth={0}>
                    {progressChartData.map((entry, index) => (
                      <Cell key={entry.day} fill={chartColors[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Prochaine evolution</CardTitle>
            <CardDescription>
              Une seule etape visible pour garder la lecture simple.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {nextStage ? (
              <div className="rounded-xl border p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-sm">{nextStage.title}</p>
                  <MetaTag label="Objectif" tone="warning" />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {nextStage.unlocks}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Solde requis</p>
                    <p className="font-medium">${nextStage.minBalance}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Reputation requise</p>
                    <p className="font-medium">{nextStage.minReputation}</p>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="space-y-3">
              {progressDrivers.map((item) => (
                <div key={item.title} className="rounded-xl border p-4">
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader className="border-b">
            <CardTitle>Types de clients accessibles</CardTitle>
            <CardDescription>
              La vraie recompense, ce sont les categories de projets qui s'ouvrent.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {clientTiers.map((tier) => {
              const isUnlocked = profileHighlights.accessibleClientTiers.includes(tier.title);

              return (
                <div key={tier.key} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-sm">{tier.title}</p>
                    <MetaTag
                      label={isUnlocked ? "Accessible" : "Verrouille"}
                      tone={isUnlocked ? "success" : "default"}
                    />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {tier.description}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Rappel</CardTitle>
            <CardDescription>
              Une seule regle a garder en tete pour le systeme.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <CircleAlert className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Le solde montre ce que tu gagnes. La reputation debloque la qualite des projets. Les deux ensemble font monter le statut.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
