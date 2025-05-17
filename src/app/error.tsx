"use client";

import { useEffect } from "react";
import { CyberpunkButton } from "../../components/ui/cyberpunk-button";
import { GlassmorphicCard } from "../../components/ui/glassmorphic-card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error.message || "Unknown error");
  }, [error]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-void">
      <div className="fixed inset-0 w-full h-full -z-10 bg-[url('/grid-pattern.png')] opacity-20"></div>

      <GlassmorphicCard variant="gradient" className="w-full max-w-md mx-auto">
        <div className="space-y-6 text-center">
          <h2 className="text-2xl font-orbitron neon-red">
            Something went wrong
          </h2>
          <p className="text-text-secondary">
            {typeof error.message === "string"
              ? error.message
              : "An unexpected error occurred"}
          </p>
          <div className="flex justify-center gap-4">
            <CyberpunkButton variant="cyan" onClick={() => reset()}>
              Try again
            </CyberpunkButton>
            <CyberpunkButton
              variant="magenta"
              onClick={() => (window.location.href = "/")}
            >
              Return home
            </CyberpunkButton>
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );
}
