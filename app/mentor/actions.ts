"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

type MissionStatus = Database["public"]["Enums"]["mission_status"];
type MessageUrgency = Database["public"]["Enums"]["message_urgency"];

function splitList(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildPreview(body: string, objective: string) {
  const source = body.trim() || objective.trim();
  return source.slice(0, 120);
}

function buildRedirect(path: string, message: string, kind: "error" | "success") {
  const params = new URLSearchParams({ [kind]: message });
  return `${path}?${params.toString()}`;
}

export async function createMissionAction(formData: FormData) {
  const designerId = String(formData.get("designer_id") ?? "").trim();
  const clientName = String(formData.get("client_name") ?? "").trim();
  const clientSector = String(formData.get("client_sector") ?? "").trim();
  const clientTone = String(formData.get("client_tone") ?? "").trim();
  const clientSummary = String(formData.get("client_summary") ?? "").trim();
  const expectationLevel = String(formData.get("client_expectation_level") ?? "").trim();
  const senderName = String(formData.get("sender_name") ?? "").trim();
  const missionTitle = String(formData.get("mission_title") ?? "").trim();
  const missionObjective = String(formData.get("mission_objective") ?? "").trim();
  const briefBody = String(formData.get("brief_body") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  const deadlineDate = String(formData.get("deadline_date") ?? "").trim();
  const budgetDollars = Number(String(formData.get("budget_dollars") ?? "0").trim());
  const urgency = (String(formData.get("urgency") ?? "normal").trim() ||
    "normal") as MessageUrgency;
  const missionStatus = (String(formData.get("mission_status") ?? "new").trim() ||
    "new") as MissionStatus;
  const deliverables = splitList(String(formData.get("deliverables") ?? ""));
  const expectations = splitList(String(formData.get("expectations") ?? ""));

  if (
    !designerId ||
    !clientName ||
    !senderName ||
    !missionTitle ||
    !missionObjective ||
    !briefBody ||
    !deadlineDate ||
    !Number.isFinite(budgetDollars)
  ) {
    redirect(
      buildRedirect("/mentor", "Remplis les champs essentiels pour envoyer une mission.", "error")
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const mentorProfileResult = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .single();

  const mentorProfile = mentorProfileResult.data as
    | { id: string; role: Database["public"]["Enums"]["app_role"] }
    | null;

  if (!mentorProfile || mentorProfile.role !== "mentor") {
    redirect("/");
  }

  const designerResult = await supabase
    .from("profiles")
    .select("id, display_name")
    .eq("id", designerId)
    .eq("mentor_id", user.id)
    .single();

  const designer = designerResult.data as { id: string; display_name: string } | null;

  if (!designer) {
    redirect(
      buildRedirect("/mentor", "Ce designer n'est pas relie a ton espace mentor.", "error")
    );
  }

  const existingClientResult = await supabase
    .from("clients")
    .select("id")
    .eq("mentor_id", user.id)
    .eq("designer_id", designerId)
    .eq("name", clientName)
    .limit(1)
    .maybeSingle();

  const existingClient = existingClientResult.data as { id: string } | null;
  let clientId = existingClient?.id ?? null;

  if (!clientId) {
    const insertedClientResult = await ((supabase.from("clients") as unknown as {
      insert: (values: {
        mentor_id: string;
        designer_id: string;
        name: string;
        sector: string;
        tone: string;
        expectation_level: string;
        summary: string;
        expectations: string[];
      }) => {
        select: (columns: string) => {
          single: () => Promise<{ data: { id: string } | null; error: { message: string } | null }>;
        };
      };
    }))
      .insert({
        mentor_id: user.id,
        designer_id: designerId,
        name: clientName,
        sector: clientSector || "Marque digitale",
        tone: clientTone || "Clair et direct",
        expectation_level: expectationLevel || "Cadre",
        summary: clientSummary || missionObjective,
        expectations,
      })
      .select("id")
      .single();

    if (insertedClientResult.error || !insertedClientResult.data) {
      redirect(
        buildRedirect(
          "/mentor",
          insertedClientResult.error?.message ?? "Impossible de creer le client pour cette mission.",
          "error"
        )
      );
    }

    clientId = insertedClientResult.data.id;
  }

  const deadlineAt = new Date(`${deadlineDate}T17:00:00`).toISOString();
  const budgetCents = Math.max(0, Math.round(budgetDollars * 100));
  const deliverySubject = `Livraison mission - ${clientName}`;
  const deliveryBody =
    "Bonjour,\n\nVeuillez trouver ci-joint ma proposition via le lien Figma.\nJe reste disponible pour ajuster la direction si besoin.\n\nBien a vous,";

  const insertedMissionResult = await ((supabase.from("missions") as unknown as {
    insert: (values: {
      mentor_id: string;
      designer_id: string;
      client_id: string;
      title: string;
      status: MissionStatus;
      objective: string;
      deadline_at: string;
      budget_cents: number;
      note: string;
      deliverables: string[];
      expectations: string[];
      figma_link: string;
      delivery_subject: string;
      delivery_body: string;
    }) => {
      select: (columns: string) => {
        single: () => Promise<{ data: { id: string } | null; error: { message: string } | null }>;
      };
    };
  }))
    .insert({
      mentor_id: user.id,
      designer_id: designerId,
      client_id: clientId,
      title: missionTitle,
      status: missionStatus,
      objective: missionObjective,
      deadline_at: deadlineAt,
      budget_cents: budgetCents,
      note,
      deliverables,
      expectations,
      figma_link: "",
      delivery_subject: deliverySubject,
      delivery_body: deliveryBody,
    })
    .select("id")
    .single();

  if (insertedMissionResult.error || !insertedMissionResult.data) {
    redirect(
      buildRedirect(
        "/mentor",
        insertedMissionResult.error?.message ?? "Impossible de creer la mission.",
        "error"
      )
    );
  }

  const missionId = insertedMissionResult.data.id;

  const messageInsertResult = await ((supabase.from("messages") as unknown as {
    insert: (values: {
      mentor_id: string;
      designer_id: string;
      mission_id: string;
      client_id: string;
      sender_name: string;
      subject: string;
      preview: string;
      body: string;
      status: Database["public"]["Enums"]["message_status"];
      urgency: MessageUrgency;
      deadline_at: string;
      budget_cents: number;
      deliverables: string[];
    }) => Promise<{ error: { message: string } | null }>;
  }))
    .insert({
      mentor_id: user.id,
      designer_id: designerId,
      mission_id: missionId,
      client_id: clientId,
      sender_name: senderName,
      subject: missionTitle,
      preview: buildPreview(briefBody, missionObjective),
      body: briefBody,
      status: "new",
      urgency,
      deadline_at: deadlineAt,
      budget_cents: budgetCents,
      deliverables,
    });

  if (messageInsertResult.error) {
    redirect(
      buildRedirect("/mentor", messageInsertResult.error.message, "error")
    );
  }

  await ((supabase.from("activity_events") as unknown as {
    insert: (values: {
      mentor_id: string;
      designer_id: string;
      mission_id: string;
      title: string;
      description: string;
    }) => Promise<unknown>;
  }))
    .insert({
      mentor_id: user.id,
      designer_id: designerId,
      mission_id: missionId,
      title: "Nouveau brief recu",
      description: `${clientName} a envoye une nouvelle mission: ${missionTitle}.`,
    });

  revalidatePath("/mentor");
  revalidatePath("/");
  redirect(
    buildRedirect(
      "/mentor",
      `Mission envoyee a ${designer.display_name}. Elle est maintenant visible dans son espace.`,
      "success"
    )
  );
}
