import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { createClient } from "@/lib/supabase/server";
import { getMentorWorkspaceData } from "@/lib/dashboard-data";

export default async function MentorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const data = await getMentorWorkspaceData(supabase, user.id);

  if (!data) {
    redirect("/");
  }

  return (
    <div className="min-h-svh bg-sidebar p-4 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl border bg-card p-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.32em] text-primary">
              Agency mentor
            </p>
            <div>
              <h1 className="text-3xl font-semibold">{data.viewer.displayName}</h1>
              <p className="text-muted-foreground">
                Tu pilotes les designers, les briefs et les espaces qui leur sont attribues.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">Mise a jour {data.lastUpdated}</p>
            <SignOutButton variant="outline" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Designers</CardTitle>
              <CardDescription>Comptes actuellement relies a ce mentor.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 text-3xl font-semibold">
              {data.counts.designers}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Clients</CardTitle>
              <CardDescription>Marques distribuees dans les espaces designer.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 text-3xl font-semibold">
              {data.counts.clients}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Missions</CardTitle>
              <CardDescription>Briefs et livraisons suivis depuis ce compte.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 text-3xl font-semibold">
              {data.counts.missions}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Messages</CardTitle>
              <CardDescription>Messages visibles dans les boites de reception designer.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 text-3xl font-semibold">
              {data.counts.messages}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Designers relies</CardTitle>
            <CardDescription>
              Cet espace mentor reste volontairement simple pour l'instant, mais les liaisons sont deja posees dans la base.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {data.designers.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                Aucun designer n'est encore relie a ce mentor. Les futurs briefs, clients et missions partiront de cet espace.
              </div>
            ) : (
              data.designers.map((designer) => (
                <div
                  key={designer.id}
                  className="grid gap-4 rounded-2xl border p-4 md:grid-cols-[minmax(0,1.4fr)_140px_140px_140px]"
                >
                  <div>
                    <p className="font-medium">{designer.displayName}</p>
                    <p className="text-sm text-muted-foreground">{designer.email}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      Solde
                    </p>
                    <p className="mt-2 font-medium">{designer.balance}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      Reputation
                    </p>
                    <p className="mt-2 font-medium">{designer.reputation}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      Statut
                    </p>
                    <p className="mt-2 font-medium capitalize">{designer.stage}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
