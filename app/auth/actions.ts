"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function buildErrorRedirect(path: string, message: string) {
  const params = new URLSearchParams({ error: message });
  return `${path}?${params.toString()}`;
}

async function resolvePendingMentorLink() {
  const supabase = await createClient();
  await supabase.rpc("link_current_designer_to_pending_mentor");
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect(buildErrorRedirect("/login", "Renseigne ton email et ton mot de passe."));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(buildErrorRedirect("/login", error.message));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(buildErrorRedirect("/login", "Connexion impossible pour le moment."));
  }

  const profileResult = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const profile = profileResult.data as { role: "mentor" | "designer" } | null;

  if (profile?.role === "designer") {
    await resolvePendingMentorLink();
  }

  redirect(profile?.role === "mentor" ? "/mentor" : "/");
}

export async function signUpAction(formData: FormData) {
  const displayName = String(formData.get("display_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = formData.get("role") === "mentor" ? "mentor" : "designer";
  const mentorEmail = String(formData.get("mentor_email") ?? "").trim();

  if (!displayName || !email || !password) {
    redirect(buildErrorRedirect("/signup", "Tous les champs obligatoires doivent etre renseignes."));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
        role,
        mentor_email: role === "designer" ? mentorEmail : "",
      },
    },
  });

  if (error) {
    redirect(buildErrorRedirect("/signup", error.message));
  }

  if (data.user && role === "designer" && mentorEmail && data.session) {
    await resolvePendingMentorLink();
  }

  if (!data.session) {
    const params = new URLSearchParams({
      message:
        "Compte cree. Verifie ta boite mail si une confirmation est demandee.",
    });
    redirect(`/login?${params.toString()}`);
  }

  redirect(role === "mentor" ? "/mentor" : "/");
}
