import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionHeading } from "./section-heading";
import { MetaTag } from "./meta-tag";
import { useDashboardData } from "./dashboard-data-provider";

export function ClientsView() {
  const { clients } = useDashboardData();

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Clients"
        title="Marques et attentes"
        description="Retrouve ici le ton de chaque client, son niveau d'exigence et les attentes de marque a garder en tete."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {clients.length === 0 ? (
          <Card className="md:col-span-2 xl:col-span-3">
            <CardContent className="pt-6">
              <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
                Aucun client n'est encore attribue a ce designer.
              </div>
            </CardContent>
          </Card>
        ) : (
          clients.map((client) => (
            <Card key={client.name}>
              <CardHeader className="border-b">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle>{client.name}</CardTitle>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <MetaTag label={client.sector} tone="violet" />
                      <MetaTag label={client.expectationLevel} tone="accent" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Ton de marque
                  </p>
                  <div className="mt-2">
                    <MetaTag label={client.tone} tone="warning" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{client.summary}</p>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Attentes
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {client.expectations.map((item) => (
                      <span
                        key={item}
                        className="inline-flex rounded-full border px-3 py-1 text-xs text-muted-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
