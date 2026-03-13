"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { MissionItem } from "@/mock-data/dashboard";
import { createClient } from "@/lib/supabase/client";

interface DeliverySheetProps {
  mission: MissionItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeliverySheet({
  mission,
  open,
  onOpenChange,
}: DeliverySheetProps) {
  const [figmaLink, setFigmaLink] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (!mission) {
      return;
    }

    setFigmaLink(mission.figmaLink ?? "");
    setEmailSubject(mission.deliverySubject ?? "");
    setEmailBody(mission.deliveryBody ?? "");
  }, [mission]);

  if (!mission) {
    return null;
  }

  function handleSubmit() {
    const currentMission = mission;

    if (!currentMission || !currentMission.mentorId) {
      return;
    }

    const mentorId = currentMission.mentorId;

    startTransition(async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      await (supabase.from("deliveries") as unknown as {
        insert: (values: Record<string, string>) => Promise<unknown>;
      }).insert({
        mission_id: currentMission.id,
        mentor_id: mentorId,
        designer_id: user.id,
        figma_link: figmaLink,
        email_subject: emailSubject,
        email_body: emailBody,
      });

      await ((supabase.from("missions") as unknown as {
        update: (values: Record<string, string>) => {
          eq: (column: string, value: string) => Promise<unknown>;
        };
      }))
        .update({
          figma_link: figmaLink,
          status: "delivery_due",
        })
        .eq("id", currentMission.id);

      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader className="border-b">
          <SheetTitle>Envoyer la livraison</SheetTitle>
          <SheetDescription>
            {mission.client} / {mission.title}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Lien Figma</label>
            <Input
              value={figmaLink}
              onChange={(event) => setFigmaLink(event.target.value)}
              placeholder="https://www.figma.com/file/..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Objet du mail</label>
            <Input
              value={emailSubject}
              onChange={(event) => setEmailSubject(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Message client</label>
            <textarea
              value={emailBody}
              onChange={(event) => setEmailBody(event.target.value)}
              className="min-h-56 w-full rounded-xl border bg-transparent px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <SheetFooter className="border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !figmaLink.trim()}>
            {isPending ? "Envoi..." : "Envoyer la livraison"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
