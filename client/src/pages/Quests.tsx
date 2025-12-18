"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, ExternalLink } from "lucide-react";
import { Play, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AnimatedBackground from "@/components/AnimatedBackground";

interface Quest {
  id: string;
  title: string;
  description: string;
  project_name?: string;
  project_image?: string;
  starts_at?: string;
  ends_at?: string;
  metadata?: string;
  reward?: string | { amount: number; currency: string };
  url?: string;
  actionLabel?: string;
  kind?: string;
}

const TASKS_CARD: Quest = {
  id: "tasks-card",
  title: "Start Tasks",
  description: "Complete unique tasks in the Nexura ecosystem and earn rewards",
  project_name: "Intuition Ecosystem",
  reward: "500 XP",
  project_image: "/quest-1.png",
  starts_at: new Date().toISOString(),
  ends_at: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365).toISOString(),
  metadata: JSON.stringify({ category: "Tasks" }),
};

const ONE_TIME_QUESTS: Quest[] = [
  {
    id: "onetime-discord-join",
    title: "Connect Discord",
    description: "Link your Discord account",
    reward: "50 XP",
    kind: "one-time",
    url: "https://discord.gg/caK9kATBya",
    actionLabel: "Connect",
  },
  {
    id: "onetime-join-discord",
    title: "Join Discord",
    description: "Join our Discord server",
    reward: "50 XP",
    kind: "one-time",
    url: "https://discord.gg/caK9kATBya",
    actionLabel: "Join",
  },
];

export default function Quests() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [, setLocation] = useLocation();
  const [visitedTasks, setVisitedTasks] = useState<string[]>([]);
  const [claimedTasks, setClaimedTasks] = useState<string[]>([]);

  const { data: quests, isLoading } = useQuery({
    queryKey: ["/api/quests"],
    queryFn: async () => {
      const res = await fetch(`${backendUrl}/api/quests`);
      if (!res.ok) throw new Error("Failed to fetch quests");
      return res.json();
    },
  });

  const now = new Date();

  const allQuests: Quest[] = [
    TASKS_CARD,
    ...(quests?.oneTimeQuests ?? []),
    ...(quests?.dailyQuests ?? []),
    ...(quests?.featuredQuests ?? []),
  ];

  const activeQuests = allQuests.filter((q) => {
    if (!q.starts_at || !q.ends_at) return true;
    return new Date(q.starts_at) <= now && now <= new Date(q.ends_at);
  });

  const renderQuestCard = (quest: Quest) => {
    const metadata = quest.metadata ? JSON.parse(quest.metadata) : {};
    const isActive = activeQuests.some((q) => q.id === quest.id);

    return (
      <Card
        key={quest.id}
        className="bg-[#0d1117] border border-white/5 rounded-xl overflow-hidden transition hover:shadow-lg"
      >
        <div className="relative h-52 sm:h-44 bg-black">
          {quest.project_image && (
            <img
              src={quest.project_image}
              alt={quest.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          <div className="absolute top-2 right-2">
            <Badge className="text-xs">
              {isActive ? "Active" : "Soon"}
            </Badge>
          </div>
        </div>

        <div className="p-6 sm:p-5 space-y-4 sm:space-y-3">
          <h2 className="text-xl sm:text-lg font-semibold text-white">
            {quest.title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">
            {quest.description}
          </p>

          {quest.reward && (
            <div className="text-xs sm:text-sm text-white/80">
              Reward:{" "}
              {typeof quest.reward === "string"
                ? quest.reward
                : `${quest.reward.amount} ${quest.reward.currency}`}
            </div>
          )}

          <Button
            size="sm"
            className="w-full rounded-lg mt-2"
            onClick={() => isActive && setLocation(`/quests/${quest.id}`)}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            {quest.id === "tasks-card" ? "Start" : "Open"}
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0718] via-[#0a0615] to-black text-white p-4 sm:p-6 relative">
      <AnimatedBackground />

      <div className="mx-auto space-y-8 relative z-10 max-w-full sm:max-w-6xl px-1 sm:px-0">
        <div>
          {isLoading ? (
            <div className="text-center py-12">Loading quests…</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-6">
              {activeQuests.map(renderQuestCard)}
            </div>
          )}
        </div>

        <section>
          <h2 className="text-lg font-semibold">One-Time Quests</h2>
          <p className="text-sm text-white/50 mt-1">
            Complete once. Earn forever.
          </p>

          <div className="mt-4 space-y-3">
            {ONE_TIME_QUESTS.map((quest) => {
              const visited = visitedTasks.includes(quest.id);
              const claimed = claimedTasks.includes(quest.id);

              let label = quest.actionLabel;
              if (visited && !claimed) label = `Claim ${quest.reward}`;
              if (claimed) label = "Completed";

              return (
                <div
                  key={quest.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                      {claimed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="text-sm font-medium">{quest.title}</div>
                      <div className="text-xs text-white/50">
                        {quest.reward}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!visited) {
                        setVisitedTasks([...visitedTasks, quest.id]);
                        window.open(quest.url, "_blank");
                      } else if (!claimed) {
                        setClaimedTasks([...claimedTasks, quest.id]);
                      }
                    }}
                    className={`text-sm font-semibold px-5 py-2.5 rounded-full ${
                      claimed
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-purple-700 hover:bg-purple-800"
                    }`}
                  >
                    {label}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
