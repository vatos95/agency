"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function buildErrorRedirect(path: string, message: string) {
  const params = new URLSearchParams({ error: message });
  return `${path}?${params.toString()}`;
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

  if (data.user && role === "designer" && mentorEmail) {
    const mentorProfileResult = await supabase
      .from("profiles")
      .select("id, role")
      .eq("email", mentorEmail)
      .maybeSingle();

    const mentorProfile = mentorProfileResult.data as
      | { id: string; role: "mentor" | "designer" }
      | null;

    if (mentorProfile?.role === "mentor") {
      await ((supabase.from("profiles") as unknown as {
        update: (values: { mentor_id: string; pending_mentor_email: null }) => {
          eq: (column: string, value: string) => Promise<unknown>;
        };
      }))
        .update({
          mentor_id: mentorProfile.id,
          pending_mentor_email: null,
        })
        .eq("id", data.user.id);
    }
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
