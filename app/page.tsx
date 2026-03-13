import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile, getDashboardData } from "@/lib/dashboard-data";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getCurrentProfile(supabase, user.id);

  if (!profile) {
    redirect("/login");
  }

  if (profile.role === "mentor") {
    redirect("/mentor");
  }

  const dashboardData = await getDashboardData(supabase, user.id, profile);

  if (!dashboardData) {
    redirect("/login");
  }

  return <DashboardShell data={dashboardData} />;
}
