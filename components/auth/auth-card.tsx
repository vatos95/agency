import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  description: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}

export function AuthCard({
  title,
  description,
  footer,
  children,
}: AuthCardProps) {
  return (
    <div className="min-h-svh bg-sidebar px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.1fr)_420px]">
          <div className="hidden rounded-3xl border border-white/10 bg-card/60 p-10 backdrop-blur lg:flex lg:flex-col lg:justify-between">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.32em] text-primary">
                Agency
              </p>
              <div className="space-y-3">
                <h1 className="max-w-xl text-4xl font-semibold leading-tight text-balance">
                  Une plateforme de missions qui reste credibile pour le designer.
                </h1>
                <p className="max-w-xl text-muted-foreground">
                  Briefs, clients, evolution, livraisons et progression personnelle
                  restent lies au bon compte, sans surcharge inutile.
                </p>
              </div>
            </div>
            <div className="grid gap-3 text-sm text-muted-foreground">
              <p>Chaque designer voit uniquement ses clients, ses missions et ses retours.</p>
              <p>Le mentor pilote les briefs et les donnees sans casser l'illusion produit.</p>
              <p>Le travail visuel continue dans le vrai Figma, pas dans la plateforme.</p>
            </div>
          </div>

          <Card className="border-border/80">
            <CardHeader className="space-y-3 border-b">
              <div className="space-y-1">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {children}
              <div className="text-sm text-muted-foreground">{footer}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
