"use client";

import Image from "next/image";
import { tailwindConfig } from "../config/config";

export default function NexusLogo() {
  return (
    <div className="h-16 w-full flex items-center justify-center gap-3 py-2">
      {/* App Logo Image */}
      <div className="relative">
        <Image
          src="/logo.png" // Adjust path to your actual logo image
          alt="NEXUS Logo"
          width={40}
          height={40}
          className="rounded-full border-2 border-neonCyan shadow-neonCyan shadow-sm"
        />
      </div>

      {/* NEXUS Text with Glow Animation */}
      <h1
        className="font-orbitron text-3xl font-bold text-neoncyan animate-glow-pulse"
        style={{
          textShadow: `0 0 8px ${tailwindConfig.colors.neonCyan}, 0 0 12px ${tailwindConfig.colors.neonCyan}`,
        }}
      >
        NEXUS
      </h1>

      {/* Inline styles for custom Tailwind animation */}
      <style jsx global>{`
        @keyframes glowPulse {
          0%,
          100% {
            text-shadow: 0 0 8px ${tailwindConfig.colors.neonCyan},
              0 0 12px ${tailwindConfig.colors.neonCyan};
            opacity: 1;
          }
          50% {
            text-shadow: 0 0 4px ${tailwindConfig.colors.neonCyan},
              0 0 8px ${tailwindConfig.colors.neonCyan};
            opacity: 0.7;
          }
        }
        .animate-glow-pulse {
          animation: glowPulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
