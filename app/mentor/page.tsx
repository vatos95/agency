import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { createClient } from "@/lib/supabase/server";
import { getMentorWorkspaceData } from "@/lib/dashboard-data";
import { createMissionAction } from "./actions";

function fieldClassName() {
  return "flex h-11 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";
}

function textAreaClassName() {
  return "flex min-h-28 w-full rounded-2xl border border-input bg-transparent px-3 py-3 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";
}

export default async function MentorPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; success?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const data = await getMentorWorkspaceData(supabase, user.id);
  const params = searchParams ? await searchParams : undefined;

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

        {params?.error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {params.error}
          </div>
        ) : null}

        {params?.success ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {params.success}
          </div>
        ) : null}

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

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Envoyer une mission</CardTitle>
            <CardDescription>
              Cree le client si besoin, prepare le brief, puis envoie directement la mission
              dans la boite du designer.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {data.designers.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                Relie d'abord un designer a ce mentor pour commencer a lui attribuer des
                missions.
              </div>
            ) : (
              <form action={createMissionAction} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="space-y-2">
                    <label htmlFor="designer_id" className="text-sm font-medium">
                      Designer
                    </label>
                    <select
                      id="designer_id"
                      name="designer_id"
                      required
                      defaultValue={data.designers[0]?.id ?? ""}
                      className={fieldClassName()}
                    >
                      {data.designers.map((designer) => (
                        <option key={designer.id} value={designer.id}>
                          {designer.displayName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="client_name" className="text-sm font-medium">
                      Client
                    </label>
                    <Input id="client_name" name="client_name" placeholder="Brava Coffee" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="sender_name" className="text-sm font-medium">
                      Contact client
                    </label>
                    <Input id="sender_name" name="sender_name" placeholder="Maya Rocha" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="mission_title" className="text-sm font-medium">
                      Titre de mission
                    </label>
                    <Input
                      id="mission_title"
                      name="mission_title"
                      placeholder="Hero section lancement marque"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  <div className="space-y-2">
                    <label htmlFor="client_sector" className="text-sm font-medium">
                      Secteur
                    </label>
                    <Input id="client_sector" name="client_sector" placeholder="Food & beverage" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="client_tone" className="text-sm font-medium">
                      Ton de marque
                    </label>
                    <Input id="client_tone" name="client_tone" placeholder="Premium et chaleureux" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="client_expectation_level" className="text-sm font-medium">
                      Niveau d'exigence
                    </label>
                    <Input
                      id="client_expectation_level"
                      name="client_expectation_level"
                      placeholder="Cadre"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="budget_dollars" className="text-sm font-medium">
                      Budget ($)
                    </label>
                    <Input
                      id="budget_dollars"
                      name="budget_dollars"
                      type="number"
                      min="0"
                      step="10"
                      placeholder="250"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="deadline_date" className="text-sm font-medium">
                      Deadline
                    </label>
                    <Input id="deadline_date" name="deadline_date" type="date" required />
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                  <div className="space-y-2">
                    <label htmlFor="mission_objective" className="text-sm font-medium">
                      Objectif
                    </label>
                    <textarea
                      id="mission_objective"
                      name="mission_objective"
                      required
                      placeholder="Concevoir une hero section desktop chaleureuse, premium et rassurante pour le lancement de la marque."
                      className={textAreaClassName()}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="client_summary" className="text-sm font-medium">
                      Resume client
                    </label>
                    <textarea
                      id="client_summary"
                      name="client_summary"
                      placeholder="Marque de cafe premium en livraison avec une tonalite accessible."
                      className={textAreaClassName()}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="brief_body" className="text-sm font-medium">
                    Message envoye au designer
                  </label>
                  <textarea
                    id="brief_body"
                    name="brief_body"
                    required
                    placeholder={"Bonjour Leandre,\n\nNous preparons le lancement de Brava Coffee.\nNous avons besoin d'une hero section pour notre page d'accueil.\nNous voulons quelque chose de chaleureux, premium et rassurant.\nMerci de nous faire une premiere proposition sous 24h.\n\nBien a vous,\nMaya"}
                    className="flex min-h-40 w-full rounded-2xl border border-input bg-transparent px-3 py-3 text-sm leading-6 shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  />
                </div>

                <div className="grid gap-4 xl:grid-cols-3">
                  <div className="space-y-2">
                    <label htmlFor="deliverables" className="text-sm font-medium">
                      Livrables
                    </label>
                    <textarea
                      id="deliverables"
                      name="deliverables"
                      placeholder={"Hero desktop\nCTA secondaire\nMail de livraison"}
                      className={textAreaClassName()}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="expectations" className="text-sm font-medium">
                      Attentes client
                    </label>
                    <textarea
                      id="expectations"
                      name="expectations"
                      placeholder={"Promesse comprise en moins de 5 secondes\nDirection premium mais accessible"}
                      className={textAreaClassName()}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="note" className="text-sm font-medium">
                      Note complementaire
                    </label>
                    <textarea
                      id="note"
                      name="note"
                      placeholder="Ajouter un CTA secondaire rassurant pour les nouveaux visiteurs."
                      className={textAreaClassName()}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="space-y-2">
                    <label htmlFor="urgency" className="text-sm font-medium">
                      Priorite du message
                    </label>
                    <select
                      id="urgency"
                      name="urgency"
                      defaultValue="priority"
                      className={fieldClassName()}
                    >
                      <option value="normal">Normale</option>
                      <option value="today">Aujourd'hui</option>
                      <option value="priority">Prioritaire</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="mission_status" className="text-sm font-medium">
                      Statut initial
                    </label>
                    <select
                      id="mission_status"
                      name="mission_status"
                      defaultValue="new"
                      className={fieldClassName()}
                    >
                      <option value="new">Nouvelle</option>
                      <option value="active">En cours</option>
                      <option value="delivery_due">A livrer</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="min-w-44">
                    Envoyer la mission
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Dernieres missions envoyees</CardTitle>
            <CardDescription>
              Un apercu simple des briefs deja distribues depuis ton espace mentor.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {data.recentMissions.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                Aucune mission n'a encore ete envoyee depuis cet espace.
              </div>
            ) : (
              data.recentMissions.map((mission) => (
                <div
                  key={mission.id}
                  className="grid gap-4 rounded-2xl border p-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_120px_120px]"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{mission.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {mission.clientName} pour {mission.designerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      Statut
                    </p>
                    <p className="mt-2 font-medium capitalize">{mission.status}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      Deadline
                    </p>
                    <p className="mt-2 font-medium">{mission.deadline}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      Budget
                    </p>
                    <p className="mt-2 font-medium">{mission.budget}</p>
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
