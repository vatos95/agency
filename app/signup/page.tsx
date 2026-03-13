import Link from "next/link";
import { redirect } from "next/navigation";
import { signUpAction } from "@/app/auth/actions";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";

interface SignupPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
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
      title="Creation de compte"
      description="Choisis ton role et cree ton espace Agency."
      footer={
        <>
          Tu as deja un compte ?{" "}
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            Se connecter
          </Link>
        </>
      }
    >
      <form action={signUpAction} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="display_name" className="text-sm font-medium">
            Nom affiche
          </label>
          <Input
            id="display_name"
            name="display_name"
            placeholder="Leandre"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Mot de passe
          </label>
          <Input id="password" name="password" type="password" required />
        </div>
        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium">
            Role
          </label>
          <select
            id="role"
            name="role"
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none"
            defaultValue="designer"
          >
            <option value="designer">Designer</option>
            <option value="mentor">Mentor</option>
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="mentor_email" className="text-sm font-medium">
            Email du mentor (optionnel)
          </label>
          <Input
            id="mentor_email"
            name="mentor_email"
            type="email"
            placeholder="mentor@agency.app"
          />
        </div>

        {params.error ? (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-400">
            {params.error}
          </div>
        ) : null}

        <Button type="submit" className="w-full">
          Creer le compte
        </Button>
      </form>
    </AuthCard>
  );
}
