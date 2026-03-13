"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface SignOutButtonProps extends React.ComponentProps<typeof Button> {
  label?: string;
}

export function SignOutButton({
  label = "Deconnexion",
  ...props
}: SignOutButtonProps) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <Button onClick={handleSignOut} {...props}>
      <LogOut className="size-4" />
      {label}
    </Button>
  );
}
