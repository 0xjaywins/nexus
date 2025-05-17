"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { CyberpunkButton } from "../ui/cyberpunk-button";

interface BackButtonProps {
  fallbackPath?: string;
  className?: string;
}

export function BackButton({ fallbackPath = "/", className }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // Use the browser's native history API to go back
    if (window.history.length > 2) {
      window.history.back();
    } else {
      // If there's no history (e.g., opened directly in a new tab), go to fallback
      router.push(fallbackPath);
    }
  };

  return (
    <CyberpunkButton
      variant="cyan"
      size="sm"
      onClick={handleBack}
      className={`${className} `}
    >
      <div className="flex justify-center w-full items-center whitespace-nowrap">
        <ArrowLeft className="h-4 w-4 mr-1" /> <span>Back</span>
      </div>
    </CyberpunkButton>
  );
}
