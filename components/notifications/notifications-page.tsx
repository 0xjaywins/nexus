"use client";

import { useState } from "react";
import { Bell, TrendingUp, ArrowRight } from "lucide-react";
import { GlassmorphicCard } from "../../components/ui/glassmorphic-card";
import { CyberpunkButton } from "../../components/ui/cyberpunk-button";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import { NotificationItem } from "../../components/notifications/notification-item";
import { BackButton } from "../../components/navigation/back-button";

// Sample notifications data
const sampleNotifications = [
  {
    id: 1,
    type: "price",
    title: "USDT up 5%",
    description: "USDT has increased by 5% in the last 24 hours",
    timestamp: "10 min ago",
    actionType: "swap",
  },
  {
    id: 2,
    type: "trending",
    title: "WMON trending",
    description: "WMON is trending among your follows",
    timestamp: "30 min ago",
    actionType: "stake",
  },
  {
    id: 3,
    type: "price",
    title: "MON down 2%",
    description: "MON has decreased by 2% in the last hour",
    timestamp: "1 hour ago",
    actionType: "swap",
  },
  {
    id: 4,
    type: "trending",
    title: "shMON trending",
    description: "shMON is gaining popularity in your network",
    timestamp: "3 hours ago",
    actionType: "stake",
  },
  {
    id: 5,
    type: "price",
    title: "USDC stable",
    description: "USDC has maintained its peg in the last 24 hours",
    timestamp: "5 hours ago",
    actionType: "swap",
  },
];

export function NotificationsPage() {
  const [notificationSettings, setNotificationSettings] = useState({
    warpcast: true,
    inApp: true,
  });

  const handleSettingChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-void">
      {/* Static background with subtle grid pattern */}
      <div className="fixed inset-0 w-full h-full -z-10 bg-[url('/grid-pattern.png')] opacity-20"></div>

      <GlassmorphicCard variant="gradient" className="w-full max-w-md mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-5">
          <BackButton />
          <h1 className="text-xl font-orbitron ml-52 neon-cyan">
            Notifications
          </h1>
        </div>

        <div className="space-y-6">
          {/* Trending marquee - animated version */}
          <div className="relative h-8 rounded-md border border-neon-magenta neon-border-magenta overflow-hidden">
            <div className="absolute inset-y-0 flex items-center animate-marquee">
              <div className="flex items-center gap-2 px-4 whitespace-nowrap">
                <TrendingUp className="h-4 w-4 text-neon-magenta" />
                <span className="text-neon-magenta font-medium">
                  WMON trending in your network!
                </span>
                <TrendingUp className="h-4 w-4 text-neon-magenta" />
                <span className="text-neon-magenta font-medium">
                  shMON gaining popularity!
                </span>
                <TrendingUp className="h-4 w-4 text-neon-magenta" />
                <span className="text-neon-magenta font-medium">
                  USDT up 5% in 24h!
                </span>
              </div>
            </div>
          </div>

          {/* Notification settings */}
          <div className="space-y-3 p-3 rounded-md border border-foreground/10 bg-foreground/5">
            <h2 className="text-sm font-orbitron neon-cyan">
              Notification Settings
            </h2>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-text-secondary" />
                <Label htmlFor="warpcast" className="text-sm text-text-primary">
                  Warpcast Posts/DMs
                </Label>
              </div>
              <Switch
                id="warpcast"
                checked={notificationSettings.warpcast}
                onCheckedChange={() => handleSettingChange("warpcast")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-text-secondary" />
                <Label htmlFor="inApp" className="text-sm text-text-primary">
                  In-App Notifications
                </Label>
              </div>
              <Switch
                id="inApp"
                checked={notificationSettings.inApp}
                onCheckedChange={() => handleSettingChange("inApp")}
              />
            </div>
          </div>

          {/* Notification list */}
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            <h2 className="text-sm font-orbitron neon-cyan sticky top-0 bg-void z-10 py-1">
              Recent Notifications
            </h2>

            {sampleNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={{
                  ...notification,
                  type: notification.type as "price" | "trending",
                  actionType: notification.actionType as "swap" | "stake",
                }}
              />
            ))}
          </div>

          {/* Clear all button */}
          <CyberpunkButton variant="gradient" className="w-full">
            <span className="flex items-center justify-center">
              Clear All Notifications <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </CyberpunkButton>
        </div>
      </GlassmorphicCard>
    </div>
  );
}
