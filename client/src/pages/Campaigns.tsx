import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink, Clock, Users } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AnimatedBackground from "@/components/AnimatedBackground";

interface Campaign {
  id: string;
  title: string;
  description: string;
  project_name?: string;
  project_image?: string;
  participants?: number;
  starts_at?: string;
  ends_at?: string;
  metadata?: string;
  reward?: string | { amount: number; currency: string; pool?: number };
  url?: string;
  status?: string;
}

// Main TASKS card
const TASKS_CARD: Campaign = {
  id: "tasks-card",
  title: "Start Campaign Tasks",
  description: "Complete unique tasks in the Nexura ecosystem and earn rewards",
  project_name: "NEXURA",
  participants: 250,
  reward: { amount: 16, currency: "TRUST", pool: 4000 },
  project_image: "/campaign.png",
  starts_at: new Date("2025-12-05T00:00:00").toISOString(),
  ends_at: undefined,
  metadata: JSON.stringify({ category: "Tasks" }),
};

export default function Campaigns() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [, setLocation] = useLocation();
  const [visitedTasks, setVisitedTasks] = useState<string[]>([]);
  const [claimedTasks, setClaimedTasks] = useState<string[]>([]);

  const { data: campaigns, isLoading } = useQuery<{
    oneTimeCampaigns: Campaign[];
    featuredCampaigns: Campaign[];
    upcomingCampaigns: Campaign[];
  }>({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const res = await fetch(`${backendUrl}/api/campaigns`);
      if (!res.ok) throw new Error("Failed to fetch campaigns");
      return res.json();
    },
  });

  const now = new Date();

  const allCampaigns: Campaign[] = [
    TASKS_CARD,
    ...(campaigns?.oneTimeCampaigns ?? []),
    ...(campaigns?.featuredCampaigns ?? []),
    ...(campaigns?.upcomingCampaigns ?? []),
  ];

  const activeCampaigns = allCampaigns.filter((c) => {
    const start = c.starts_at ? new Date(c.starts_at) : null;
    const end = c.ends_at ? new Date(c.ends_at) : null;

    if (c.status === "active") return true;
    if (start && now >= start) {
      if (end) return now <= end;
      return true;
    }
    return false;
  });

  const upcomingCampaigns = allCampaigns.filter((c) => c.status === "upcoming");

  const renderCampaignCard = (campaign: Campaign, isActive: boolean) => {
    let metadata: any = {};
    try {
      metadata = campaign.metadata ? JSON.parse(campaign.metadata) : {};
    } catch {
      metadata = {};
    }

    const status = isActive ? "Active" : "Coming Soon";

    const startDateFormatted = campaign.starts_at
      ? new Date(campaign.starts_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
      : "";
    const endDateFormatted = campaign.ends_at
      ? new Date(campaign.ends_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
      : "TBA";

    return (
      <Card
        key={campaign.id}
        className="bg-[#0d1117] border border-white/5 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition flex flex-col sm:flex-col"
      >
        {/* Campaign Banner */}
        <div className="relative h-40 sm:h-48 md:h-44 bg-black w-full">
          {campaign.project_image && (
            <img
              src={campaign.project_image}
              alt={campaign.title}
              className="w-full h-full object-cover rounded-t-2xl"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            <Badge
              className={
                isActive
                  ? "bg-green-500/20 text-green-400 border border-green-500/30 text-[0.65rem] sm:text-xs"
                  : "bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[0.65rem] sm:text-xs"
              }
            >
              {status}
            </Badge>
          </div>

          {/* Category */}
          {metadata.category && (
            <div className="absolute top-2 left-2 text-[0.65rem] sm:text-xs text-white/80 font-medium">
              {metadata.category}
            </div>
          )}
        </div>

        {/* Campaign Details */}
        <div className="p-4 sm:p-5 flex flex-col space-y-2">
          <h2 className="text-sm sm:text-base font-semibold text-white">{campaign.title}</h2>
          <p className="text-xs sm:text-sm text-gray-400">{campaign.description}</p>

          {campaign.project_name && (
            <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm gap-1">
              <span className="text-gray-500">Project:</span>
              <span className="text-white">{campaign.project_name}</span>
            </div>
          )}

          {campaign.participants && (
            <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm gap-1 items-start sm:items-center">
              <span className="text-gray-500">Participants:</span>
              <span className="text-white flex items-center gap-1">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                {campaign.participants.toLocaleString()}
              </span>
            </div>
          )}

          {campaign.reward && (
            <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm gap-1 items-start sm:items-center">
              <span className="text-gray-500">Reward:</span>
              <span className="text-white flex items-center gap-1">
                {typeof campaign.reward === "string"
                  ? campaign.reward
                  : `${campaign.reward.amount} ${campaign.reward.currency}`}
              </span>
            </div>
          )}

          {campaign.reward && typeof campaign.reward !== "string" && campaign.reward.pool && (
            <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm gap-1 items-start sm:items-center">
              <span className="text-gray-500">Reward Pool:</span>
              <span className="text-white flex items-center gap-1">
                {campaign.reward.pool} {campaign.reward.currency} (FCFS)
              </span>
            </div>
          )}

          {campaign.starts_at && (
            <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm gap-1 items-start sm:items-center">
              <span className="text-gray-500">Duration:</span>
              <span className="text-white flex items-center gap-1">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                {startDateFormatted} – {endDateFormatted}
              </span>
            </div>
          )}

          <Button
            className={`w-full mt-2 sm:mt-3 font-medium rounded-xl py-2.5 sm:py-3 text-sm sm:text-base ${
              isActive
                ? "bg-[#1f6feb] hover:bg-[#388bfd] text-white"
                : "bg-gray-600 cursor-not-allowed text-gray-300"
            }`}
            onClick={() => {
              if (!isActive) return;
              if (campaign.id === "tasks-card") setLocation("/campaigns/tasks");
              else if (campaign.url) window.open(campaign.url, "_blank");
            }}
            disabled={!isActive}
          >
            {isActive ? (
              <>
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                {campaign.id === "tasks-card" ? "Start Tasks" : "Do Task"}
              </>
            ) : (
              <>
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Coming Soon
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-auto p-4 sm:p-6 relative">
      <AnimatedBackground />
      <div className="max-w-4xl sm:max-w-6xl mx-auto space-y-6 sm:space-y-8 relative z-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Campaigns</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Complete unique tasks and earn rewards in the Nexura ecosystem.
          </p>
        </div>

        {/* Active Campaigns */}
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-lg sm:text-2xl font-semibold text-white">Active Campaigns</h2>
          {isLoading ? (
            <div className="text-center py-6 sm:py-12 text-muted-foreground">Loading campaigns...</div>
          ) : activeCampaigns.length === 0 ? (
            <Card className="glass glass-hover rounded-3xl p-6 sm:p-8 text-center">
              <p className="text-white/60">No active campaigns at the moment. Check back soon!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {activeCampaigns.map((campaign) => renderCampaignCard(campaign, true))}
            </div>
          )}
        </div>

        {/* Upcoming Campaigns */}
        {upcomingCampaigns.length > 0 && (
          <div className="space-y-4 sm:space-y-6 mt-8 sm:mt-12">
            <h2 className="text-lg sm:text-2xl font-semibold text-white">Upcoming Campaigns</h2>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {upcomingCampaigns.map((campaign) => renderCampaignCard(campaign, false))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
