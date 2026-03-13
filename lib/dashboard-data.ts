import type { SupabaseClient } from "@supabase/supabase-js";
import {
  careerStages,
  clientTiers,
  type ActivityItem,
  type CareerStageKey,
  type ClientItem,
  type DesignerStat,
  type MessageItem,
  type MissionItem,
  type ProgressDriver,
  type ProgressPoint,
} from "@/mock-data/dashboard";
import type { Database } from "@/lib/supabase/database.types";

type AppSupabaseClient = SupabaseClient<Database>;
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type MessageStatus = Database["public"]["Enums"]["message_status"];
type MessageUrgency = Database["public"]["Enums"]["message_urgency"];
type MissionStatus = Database["public"]["Enums"]["mission_status"];

export interface DashboardViewer {
  id: string;
  displayName: string;
  email: string;
  initials: string;
  role: Database["public"]["Enums"]["app_role"];
  careerStage: string;
}

export interface DashboardProfileHighlights {
  currentStage: CareerStageKey;
  nextStage: CareerStageKey | null;
  status: string;
  statusSummary: string;
  nextStatus: string | null;
  nextStatusHint: string;
  progressValue: number;
  reputation: string;
  balance: string;
  accessibleClientTiers: string[];
}

export interface DashboardWelcomeSummary {
  userName: string;
  role: string;
  summary: string;
}

export interface DashboardData {
  viewer: DashboardViewer;
  lastUpdated: string;
  welcomeSummary: DashboardWelcomeSummary;
  designerStats: DesignerStat[];
  activityFeed: ActivityItem[];
  messages: MessageItem[];
  missions: MissionItem[];
  clients: ClientItem[];
  profileHighlights: DashboardProfileHighlights;
  progressDrivers: ProgressDriver[];
  progressChartData: ProgressPoint[];
}

export interface MentorWorkspaceData {
  viewer: DashboardViewer;
  lastUpdated: string;
  counts: {
    designers: number;
    clients: number;
    missions: number;
    deliveries: number;
  };
  designers: Array<{
    id: string;
    displayName: string;
    email: string;
    balance: string;
    reputation: string;
    stage: string;
  }>;
  recentMissions: Array<{
    id: string;
    title: string;
    designerName: string;
    clientName: string;
    status: string;
    deadline: string;
    budget: string;
  }>;
  pendingDeliveries: Array<{
    id: string;
    missionId: string;
    designerId: string;
    missionTitle: string;
    designerName: string;
    clientName: string;
    emailSubject: string;
    emailBody: string;
    figmaLink: string;
    submittedAt: string;
    budget: string;
  }>;
}

function toInitials(displayName: string) {
  return displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDateLabel(dateString: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function formatActivityDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;
  const diff = now.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0);

  if (diff === 0) return "Aujourd'hui";
  if (diff === dayMs) return "Hier";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  }).format(new Date(dateString));
}

function formatDeadline(deadlineAt: string | null, status?: MissionStatus) {
  if (!deadlineAt) {
    return status === "validated" ? "Cloturee" : "Sans deadline";
  }

  const target = new Date(deadlineAt).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    return status === "validated" ? "Cloturee" : "A livrer";
  }

  const hours = Math.ceil(diff / (1000 * 60 * 60));
  if (hours <= 72) {
    return `Sous ${hours}h`;
  }

  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return `Sous ${days}j`;
}

function translateMessageStatus(status: MessageStatus) {
  if (status === "pending") return "En attente";
  if (status === "reply_required") return "Reponse requise";
  if (status === "archived") return "Archive";
  return "Nouveau";
}

function translateUrgency(urgency: MessageUrgency) {
  if (urgency === "priority") return "Prioritaire";
  if (urgency === "today") return "Aujourd'hui";
  return "Normale";
}

function translateMissionStatus(status: MissionStatus) {
  if (status === "active") return "En cours";
  if (status === "delivery_due") return "A livrer";
  if (status === "revision") return "Revision";
  if (status === "validated") return "Validee";
  return "Nouvelle";
}

function getCareerStageKey(value: string): CareerStageKey {
  if (value === "agency") return "agency";
  if (value === "studio") return "studio";
  if (value === "premium") return "premium";
  if (value === "confirmed") return "confirmed";
  return "junior";
}

function getStageSummary(stage: CareerStageKey) {
  if (stage === "agency") {
    return "Ton compte est reconnu comme une structure solide capable de porter des projets prestige.";
  }
  if (stage === "studio") {
    return "Tu peux maintenant absorber plusieurs projets premium en parallele avec plus de credibilite.";
  }
  if (stage === "premium") {
    return "Ton compte commence a attirer des marques plus exigeantes et des budgets plus eleves.";
  }
  if (stage === "confirmed") {
    return "Tu sors du statut debutant et tu accedes a des missions plus structurees.";
  }
  return "Tu construis les bases de ton activite et tu poses ta reputation mission apres mission.";
}

function getAccessibleClientTiers(stage: CareerStageKey) {
  const indexMap: Record<CareerStageKey, number> = {
    junior: 1,
    confirmed: 2,
    premium: 3,
    studio: 4,
    agency: 5,
  };

  return clientTiers.slice(0, indexMap[stage]).map((tier) => tier.title);
}

function calculateProgress(balanceCents: number, reputation: number, stage: CareerStageKey) {
  const currentIndex = careerStages.findIndex((item) => item.key === stage);
  const nextStage = careerStages[currentIndex + 1];

  if (!nextStage) {
    return 100;
  }

  const currentStage = careerStages[currentIndex];
  const balanceFloor = currentStage.minBalance * 100;
  const balanceCeil = nextStage.minBalance * 100;
  const reputationFloor = currentStage.minReputation;
  const reputationCeil = nextStage.minReputation;

  const balanceProgress =
    balanceCeil === balanceFloor
      ? 100
      : ((balanceCents - balanceFloor) / (balanceCeil - balanceFloor)) * 100;
  const reputationProgress =
    reputationCeil === reputationFloor
      ? 100
      : ((reputation - reputationFloor) / (reputationCeil - reputationFloor)) * 100;

  return Math.max(
    0,
    Math.min(100, Math.round((balanceProgress + reputationProgress) / 2))
  );
}

function buildViewer(profile: ProfileRow): DashboardViewer {
  return {
    id: profile.id,
    displayName: profile.display_name,
    email: profile.email,
    initials: toInitials(profile.display_name),
    role: profile.role,
    careerStage: profile.career_stage,
  };
}

export async function getCurrentProfile(supabase: AppSupabaseClient, userId: string) {
  const profileResult = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  return (profileResult.data as ProfileRow | null) ?? null;
}

export async function getDashboardData(
  supabase: AppSupabaseClient,
  userId: string
): Promise<DashboardData | null> {
  const profile = await getCurrentProfile(supabase, userId);

  if (!profile || profile.role !== "designer") {
    return null;
  }

  const [
    messagesResult,
    missionsResult,
    clientsResult,
    activityResult,
    progressResult,
  ] = await Promise.all([
    supabase
      .from("messages")
      .select(
        "id, mission_id, client_id, sender_name, subject, preview, body, status, urgency, deadline_at, budget_cents, deliverables, created_at, client:clients(name)"
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("missions")
      .select(
        "id, mentor_id, client_id, title, status, objective, deadline_at, budget_cents, note, deliverables, expectations, figma_link, delivery_subject, delivery_body, created_at, client:clients(name)"
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("clients")
      .select("id, name, sector, tone, expectation_level, summary, expectations, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("activity_events")
      .select("id, title, description, created_at")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("progress_snapshots")
      .select("label, value, is_highlight, created_at")
      .order("created_at", { ascending: true })
      .limit(6),
  ]);

  const messageRows = (messagesResult.data ?? []) as Array<Record<string, unknown>>;
  const missionRows = (missionsResult.data ?? []) as Array<Record<string, unknown>>;
  const clientRows = (clientsResult.data ?? []) as Array<Record<string, unknown>>;
  const activityRows = (activityResult.data ?? []) as Array<Record<string, unknown>>;
  const progressRows = (progressResult.data ?? []) as Array<Record<string, unknown>>;
  const missionIds = missionRows.map((mission) => String(mission.id));
  const feedbackResult =
    missionIds.length > 0
      ? await supabase
          .from("mission_feedback")
          .select("id, mission_id, title, body, created_at")
          .in("mission_id", missionIds)
          .order("created_at", { ascending: false })
      : { data: [] as Array<Database["public"]["Tables"]["mission_feedback"]["Row"]> };
  const feedbackRows = (feedbackResult.data ?? []) as Array<
    Database["public"]["Tables"]["mission_feedback"]["Row"]
  >;

  const feedbackByMission = new Map<string, MissionItem["feedback"]>();
  for (const entry of feedbackRows) {
    const items = feedbackByMission.get(entry.mission_id) ?? [];
    items.push({
      title: entry.title,
      body: entry.body,
      date: formatActivityDate(entry.created_at),
    });
    feedbackByMission.set(entry.mission_id, items);
  }

  const messages: MessageItem[] = messageRows.map((message) => {
    const clientName =
      typeof message.client === "object" && message.client && "name" in message.client
        ? String(message.client.name ?? "")
        : "";

    return {
      id: String(message.id),
      missionId: String(message.mission_id ?? ""),
      client: clientName,
      clientId: message.client_id ? String(message.client_id) : null,
      sender: String(message.sender_name ?? ""),
      subject: String(message.subject ?? ""),
      preview: String(message.preview ?? "") || String(message.body ?? "").slice(0, 120),
      body: String(message.body ?? ""),
      status: translateMessageStatus(message.status as MessageStatus),
      urgency: translateUrgency(message.urgency as MessageUrgency),
      deadline: formatDeadline((message.deadline_at as string | null) ?? null),
      deadlineAt: (message.deadline_at as string | null) ?? null,
      budget: formatCurrency(Number(message.budget_cents ?? 0)),
      deliverables: ((message.deliverables as string[] | null) ?? []),
    };
  });

  const missions: MissionItem[] = missionRows.map((mission) => {
    const clientName =
      typeof mission.client === "object" && mission.client && "name" in mission.client
        ? String(mission.client.name ?? "")
        : "";

    return {
      id: String(mission.id),
      client: clientName,
      clientId: String(mission.client_id ?? ""),
      mentorId: String(mission.mentor_id ?? ""),
      title: String(mission.title ?? ""),
      status: mission.status as MissionStatus,
      objective: String(mission.objective ?? ""),
      deadline: formatDeadline(
        (mission.deadline_at as string | null) ?? null,
        mission.status as MissionStatus
      ),
      deadlineAt: (mission.deadline_at as string | null) ?? null,
      budget: formatCurrency(Number(mission.budget_cents ?? 0)),
      note: String(mission.note ?? ""),
      deliverables: ((mission.deliverables as string[] | null) ?? []),
      expectations: ((mission.expectations as string[] | null) ?? []),
      figmaLink: String(mission.figma_link ?? ""),
      deliverySubject: String(mission.delivery_subject ?? ""),
      deliveryBody: String(mission.delivery_body ?? ""),
      feedback: feedbackByMission.get(String(mission.id)) ?? [],
    };
  });

  const clients: ClientItem[] = clientRows.map((client) => ({
    id: String(client.id ?? ""),
    name: String(client.name ?? ""),
    sector: String(client.sector ?? ""),
    tone: String(client.tone ?? ""),
    expectationLevel: String(client.expectation_level ?? ""),
    summary: String(client.summary ?? ""),
    expectations: ((client.expectations as string[] | null) ?? []),
  }));

  const activityFeed: ActivityItem[] = activityRows.map((item) => ({
    title: String(item.title ?? ""),
    description: String(item.description ?? ""),
    date: formatActivityDate(String(item.created_at ?? new Date().toISOString())),
  }));

  const progressChartData: ProgressPoint[] =
    progressRows.length > 0
      ? progressRows.map((point) => ({
          day: String(point.label ?? ""),
          value: Number(point.value ?? 0),
          isHighlight: Boolean(point.is_highlight),
        }))
      : [
          { day: "Mon", value: 0 },
          { day: "Tue", value: 0 },
          { day: "Wed", value: 0 },
          { day: "Thu", value: 0 },
          { day: "Fri", value: 0 },
          { day: "Sat", value: 0 },
        ];

  const stageKey = getCareerStageKey(profile.career_stage);
  const currentStage = careerStages.find((item) => item.key === stageKey) ?? careerStages[0];
  const nextStage = careerStages[careerStages.findIndex((item) => item.key === stageKey) + 1] ?? null;
  const progressValue = calculateProgress(profile.balance_cents, profile.reputation, stageKey);
  const activeMissions = missions.filter((mission) => mission.status === "active").length;
  const deliveryDueMissions = missions.filter((mission) => mission.status === "delivery_due").length;
  const validatedMissions = missions.filter((mission) => mission.status === "validated").length;
  const replyRequiredMessages = messages.filter(
    (message) => message.status === "Reponse requise"
  ).length;
  const validationRate =
    missions.length > 0 ? Math.round((validatedMissions / missions.length) * 100) : 0;

  const designerStats: DesignerStat[] = [
    {
      title: "Solde",
      value: formatCurrency(profile.balance_cents),
      change: `Statut actuel ${currentStage.shortLabel}`,
      trend:
        profile.balance_cents >= 200000
          ? "positive"
          : profile.balance_cents >= 90000
            ? "neutral"
            : "negative",
    },
    {
      title: "Reputation",
      value: `${profile.reputation} / 100`,
      change: "Confiance actuelle sur les derniers briefs",
      trend:
        profile.reputation >= 80
          ? "positive"
          : profile.reputation >= 55
            ? "neutral"
            : "negative",
    },
    {
      title: "Missions terminees",
      value: `${validatedMissions}`,
      change: `${activeMissions} mission(s) active(s)`,
      trend: validatedMissions > 0 ? "positive" : "neutral",
    },
    {
      title: "Taux de validation",
      value: `${validationRate}%`,
      change: `${deliveryDueMissions} livraison(s) a finaliser`,
      trend:
        validationRate >= 75 ? "positive" : validationRate >= 45 ? "neutral" : "negative",
    },
  ];

  const welcomeSummary: DashboardWelcomeSummary = {
    userName: profile.display_name,
    role: currentStage.title,
    summary:
      missions.length === 0 && messages.length === 0
        ? "Aucune mission n'est encore associee a ce compte. Le mentor peut maintenant commencer a alimenter l'espace."
        : `${activeMissions} mission(s) active(s), ${replyRequiredMessages} retour(s) a traiter et ${deliveryDueMissions} livraison(s) a finaliser.`,
  };

  const nextStatusHint = nextStage
    ? `Encore ${formatCurrency(Math.max(0, nextStage.minBalance * 100 - profile.balance_cents))} de chiffre et ${Math.max(0, nextStage.minReputation - profile.reputation)} points de reputation pour passer au statut ${nextStage.title}.`
    : "Tu as atteint le niveau le plus eleve actuellement configure pour ce compte.";

  const profileHighlights: DashboardProfileHighlights = {
    currentStage: stageKey,
    nextStage: nextStage?.key ?? null,
    status: currentStage.title,
    statusSummary: getStageSummary(stageKey),
    nextStatus: nextStage?.title ?? null,
    nextStatusHint,
    progressValue,
    reputation: `${profile.reputation} / 100`,
    balance: formatCurrency(profile.balance_cents),
    accessibleClientTiers: getAccessibleClientTiers(stageKey),
  };

  const progressDrivers: ProgressDriver[] = [
    {
      title: "Solde",
      description: `${formatCurrency(profile.balance_cents)} de gains cumules sur le compte.`,
    },
    {
      title: "Reputation",
      description: `${profile.reputation} / 100 de confiance actuelle sur les missions attribuees.`,
    },
    {
      title: "Statut",
      description: `Le compte evolue actuellement au niveau ${currentStage.title.toLowerCase()}.`,
    },
  ];

  return {
    viewer: buildViewer(profile),
    lastUpdated: formatDateLabel(new Date().toISOString()),
    welcomeSummary,
    designerStats,
    activityFeed,
    messages,
    missions,
    clients,
    profileHighlights,
    progressDrivers,
    progressChartData,
  };
}

export async function getMentorWorkspaceData(
  supabase: AppSupabaseClient,
  userId: string
): Promise<MentorWorkspaceData | null> {
  const profile = await getCurrentProfile(supabase, userId);

  if (!profile || profile.role !== "mentor") {
    return null;
  }

  const [
    designersResult,
    clientsResult,
    missionsResult,
    deliveriesCountResult,
    recentMissionsResult,
    pendingDeliveriesResult,
  ] =
    await Promise.all([
    supabase
      .from("profiles")
      .select("id, display_name, email, balance_cents, reputation, career_stage")
      .eq("mentor_id", userId)
      .order("created_at", { ascending: false }),
    supabase.from("clients").select("id", { count: "exact", head: true }),
    supabase.from("missions").select("id", { count: "exact", head: true }),
    supabase
      .from("deliveries")
      .select("id", { count: "exact", head: true })
      .eq("mentor_id", userId)
      .eq("status", "submitted"),
    supabase
      .from("missions")
      .select(
        "id, title, status, deadline_at, budget_cents, client:clients(name), designer:profiles!missions_designer_id_fkey(display_name)"
      )
      .eq("mentor_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("deliveries")
      .select(
        "id, mission_id, designer_id, email_subject, email_body, figma_link, created_at, mission:missions!deliveries_mission_id_fkey(title, budget_cents, client:clients(name)), designer:profiles!deliveries_designer_id_fkey(display_name)"
      )
      .eq("mentor_id", userId)
      .eq("status", "submitted")
      .order("created_at", { ascending: false }),
  ]);

  return {
    viewer: buildViewer(profile),
    lastUpdated: formatDateLabel(new Date().toISOString()),
    counts: {
      designers: designersResult.data?.length ?? 0,
      clients: clientsResult.count ?? 0,
      missions: missionsResult.count ?? 0,
      deliveries: deliveriesCountResult.count ?? 0,
    },
    designers: ((designersResult.data ?? []) as Array<Record<string, unknown>>).map((designer) => ({
      id: String(designer.id ?? ""),
      displayName: String(designer.display_name ?? ""),
      email: String(designer.email ?? ""),
      balance: formatCurrency(Number(designer.balance_cents ?? 0)),
      reputation: `${Number(designer.reputation ?? 0)} / 100`,
      stage: String(designer.career_stage ?? ""),
    })),
    recentMissions: ((recentMissionsResult.data ?? []) as Array<Record<string, unknown>>).map(
      (mission) => ({
        id: String(mission.id ?? ""),
        title: String(mission.title ?? ""),
        designerName:
          typeof mission.designer === "object" &&
          mission.designer &&
          "display_name" in mission.designer
            ? String(mission.designer.display_name ?? "")
            : "",
        clientName:
          typeof mission.client === "object" &&
          mission.client &&
          "name" in mission.client
            ? String(mission.client.name ?? "")
            : "",
        status: translateMissionStatus((mission.status as MissionStatus) ?? "new"),
        deadline: formatDeadline((mission.deadline_at as string | null) ?? null),
        budget: formatCurrency(Number(mission.budget_cents ?? 0)),
      })
    ),
    pendingDeliveries: ((pendingDeliveriesResult.data ?? []) as Array<Record<string, unknown>>).map(
      (delivery) => ({
        id: String(delivery.id ?? ""),
        missionId: String(delivery.mission_id ?? ""),
        designerId: String(delivery.designer_id ?? ""),
        missionTitle:
          typeof delivery.mission === "object" &&
          delivery.mission &&
          "title" in delivery.mission
            ? String(delivery.mission.title ?? "")
            : "",
        designerName:
          typeof delivery.designer === "object" &&
          delivery.designer &&
          "display_name" in delivery.designer
            ? String(delivery.designer.display_name ?? "")
            : "",
        clientName:
          typeof delivery.mission === "object" &&
          delivery.mission &&
          "client" in delivery.mission &&
          typeof delivery.mission.client === "object" &&
          delivery.mission.client &&
          "name" in delivery.mission.client
            ? String(delivery.mission.client.name ?? "")
            : "",
        emailSubject: String(delivery.email_subject ?? ""),
        emailBody: String(delivery.email_body ?? ""),
        figmaLink: String(delivery.figma_link ?? ""),
        submittedAt: formatActivityDate(String(delivery.created_at ?? new Date().toISOString())),
        budget:
          typeof delivery.mission === "object" &&
          delivery.mission &&
          "budget_cents" in delivery.mission
            ? formatCurrency(Number(delivery.mission.budget_cents ?? 0))
            : formatCurrency(0),
      })
    ),
  };
}
