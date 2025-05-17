"use client";
import Link from "next/link";
import { TrendingUp, ArrowUpRight, Bell } from "lucide-react";
import { CyberpunkButton } from "../../components/ui/cyberpunk-button";

interface NotificationItemProps {
  notification: {
    id: number;
    type: "price" | "trending";
    title: string;
    description: string;
    timestamp: string;
    actionType: "swap" | "stake";
  };
}

export function NotificationItem({ notification }: NotificationItemProps) {
  return (
    <div
      className={`relative p-3 rounded-md border bg-foreground/5 ${
        notification.type === "price"
          ? "border-neon-cyan neon-border-cyan"
          : "border-neon-magenta neon-border-magenta"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-full ${
            notification.type === "price"
              ? "bg-neon-cyan/10 text-neon-cyan"
              : "bg-neon-magenta/10 text-neon-magenta"
          }`}
        >
          {notification.type === "price" ? (
            <Bell className="h-4 w-4" />
          ) : (
            <TrendingUp className="h-4 w-4" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="font-medium text-text-primary">
            {notification.title}
          </h3>
          <p className="text-sm text-text-secondary">
            {notification.description}
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-text-secondary">
              {notification.timestamp}
            </span>

            <Link
              href={notification.actionType === "swap" ? "/swap" : "/staking"}
              passHref
            >
              <CyberpunkButton
                variant={notification.type === "price" ? "cyan" : "magenta"}
                size="sm"
                className="text-xs py-1"
              >
                {" "}
                <span className="flex justify-center items-center">
                  {notification.actionType === "swap"
                    ? "Swap Now"
                    : "Stake Now"}
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </span>
              </CyberpunkButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
