"use client";
import { tokens } from "../../config/config";
import { cn } from "../../lib/utils";

interface TokenIconProps {
  symbol: string;
  size?: "sm" | "md" | "lg";
  spinning?: boolean;
  className?: string;
}

export function TokenIcon({ symbol, size = "md", className }: TokenIconProps) {
  const token = tokens[symbol];

  // Fallback if token not found
  if (!token) {
    return (
      <div
        className={cn(
          "rounded-full flex items-center justify-center bg-gray-800 text-white font-bold",
          size === "sm" && "w-6 h-6 text-xs",
          size === "md" && "w-8 h-8 text-sm",
          size === "lg" && "w-12 h-12 text-base",
          className
        )}
      >
        ?
      </div>
    );
  }

  // Static icon only
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold border",
        size === "sm" && "w-6 h-6 text-xs",
        size === "md" && "w-8 h-8 text-sm",
        size === "lg" && "w-12 h-12 text-base",
        // spinning && "animate-spin",
        className
      )}
      style={{
        backgroundColor: `${token.color}20`,
        color: token.color,
        borderColor: token.color,
      }}
    >
      {symbol.substring(0, 1)}
    </div>
  );
}
