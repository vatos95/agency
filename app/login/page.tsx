import Link from "next/link";
import { redirect } from "next/navigation";
import { signInAction } from "@/app/auth/actions";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";

interface LoginPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <AuthCard
      title="Connexion"
      description="Retrouve ton espace Agency et tes missions en cours."
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
            Creer un compte
          </Link>
        </>
      }
    >
      <form action={signInAction} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input id="email" name="email" type="email" placeholder="you@agency.app" required />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Mot de passe
          </label>
          <Input id="password" name="password" type="password" required />
        </div>

        {params.error ? (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-400">
            {params.error}
          </div>
        ) : null}

        {params.message ? (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
            {params.message}
          </div>
        ) : null}

        <Button type="submit" className="w-full">
          Se connecter
        </Button>
      </form>
    </AuthCard>
  );
}
