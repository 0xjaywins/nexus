"use client";
// components/StakingProgress.tsx
import { useEffect, useState } from "react";

interface StakingProgressProps {
  remainingBlocks: number | null;
  totalBlocks: number;
}

export default function StakingProgress({
  remainingBlocks,
  totalBlocks,
}: StakingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (remainingBlocks === null) {
      setProgress(0);
      return;
    }
    const completedBlocks = totalBlocks - remainingBlocks;
    const percentage = (completedBlocks / totalBlocks) * 100;
    setProgress(Math.min(100, Math.max(0, percentage)));
  }, [remainingBlocks, totalBlocks]);

  return (
    <div className="mt-4">
      <p className="text-neonCyan mb-2">
        Unbonding Progress:{" "}
        {remainingBlocks !== null
          ? `${remainingBlocks} blocks remaining`
          : "Not started"}
      </p>
      <div className="w-full bg-voidBlack rounded-full h-4 border border-neonPurple">
        <div
          className="bg-neonGreen h-4 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
