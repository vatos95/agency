"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, SendHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";
import { MetaTag } from "./meta-tag";
import { useDashboardData } from "./dashboard-data-provider";
import { createClient } from "@/lib/supabase/client";

function getUrgencyTone(urgency: string): "urgent" | "warning" | "default" {
  if (urgency === "Prioritaire") return "urgent";
  if (urgency === "Aujourd'hui") return "warning";
  return "default";
}

export function MessagesView() {
  const { messages } = useDashboardData();
  const [selectedMessageId, setSelectedMessageId] = useState(messages[0]?.id ?? "");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) {
      return messages;
    }

    const query = searchQuery.toLowerCase();
    return messages.filter(
      (message) =>
        message.subject.toLowerCase().includes(query) ||
        message.client.toLowerCase().includes(query) ||
        message.sender.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const selectedMessage =
    filteredMessages.find((message) => message.id === selectedMessageId) ??
    filteredMessages[0] ??
    messages[0];

  function handleAcceptMission() {
    if (!selectedMessage?.missionId) {
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      await ((supabase.from("missions") as unknown as {
        update: (values: { status: "active" }) => {
          eq: (column: string, value: string) => Promise<unknown>;
        };
      }))
        .update({ status: "active" })
        .eq("id", selectedMessage.missionId);

      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Messages"
          title="Boite de reception"
          description="Consulte les nouveaux briefs, les retours client et les messages qui demandent une reponse."
        />
        <div className="relative w-full lg:w-[260px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Rechercher un message"
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-4 sm:gap-6">
        <Card className="gap-0 overflow-hidden self-start">
          <CardHeader className="border-b">
            <CardTitle>Messages recents</CardTitle>
            <CardDescription>{filteredMessages.length} resultat(s)</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            {filteredMessages.map((message) => (
              <button
                key={message.id}
                type="button"
                onClick={() => setSelectedMessageId(message.id)}
                className={cn(
                  "w-full border-b px-6 py-4 text-left transition-colors hover:bg-muted/40",
                  selectedMessage?.id === message.id && "bg-muted/40"
                )}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MetaTag label={message.urgency} tone={getUrgencyTone(message.urgency)} />
                    <MetaTag label={message.status} tone="accent" />
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{message.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.sender}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {message.preview}
                </p>
              </button>
            ))}
          </CardContent>
        </Card>

        {selectedMessage ? (
          <Card className="gap-0 overflow-hidden min-h-[680px]">
            <CardHeader className="border-b">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {selectedMessage.status}
                  </p>
                  <CardTitle>{selectedMessage.subject}</CardTitle>
                  <CardDescription>
                    {selectedMessage.sender} / {selectedMessage.client}
                  </CardDescription>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Deadline</p>
                    <p className="font-medium">{selectedMessage.deadline}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Budget</p>
                    <p className="font-medium">{selectedMessage.budget}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex min-h-[560px] flex-col justify-between gap-8 pt-6">
              <div className="space-y-6">
                <div className="rounded-xl border bg-muted/20 p-4">
                  <p className="whitespace-pre-line text-sm leading-6">
                    {selectedMessage.body}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Livrables attendus
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedMessage.deliverables.map((item) => (
                      <span
                        key={item}
                        className="inline-flex rounded-full border px-3 py-1 text-xs text-muted-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    className="gap-1.5"
                    onClick={handleAcceptMission}
                    disabled={!selectedMessage.missionId || isPending}
                  >
                    <SendHorizontal className="size-4" />
                    {isPending ? "Mise a jour..." : "Accepter la mission"}
                  </Button>
                  <Button variant="outline">Ouvrir la fiche mission</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
