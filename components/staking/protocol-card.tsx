"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";
import { protocols } from "../../config/config";
import { Button } from "../ui/button";

interface ProtocolCardProps {
  protocol: string;
  onClick: () => void;
}

export function ProtocolCard({ protocol, onClick }: ProtocolCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const protocolData = protocols[protocol];

  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${
      isFlipped ? "rotateY(180deg)" : ""
    }`;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardRef.current) {
      cardRef.current.style.transform = isFlipped ? "rotateY(180deg)" : "";
    }
  };

  const handleClick = () => {
    setIsFlipped(!isFlipped);

    // If flipping to front, trigger the onClick
    if (isFlipped) {
      onClick();
    }
  };

  // Reset flip state when protocol changes
  useEffect(() => {
    setIsFlipped(false);
  }, [protocol]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative h-32 cursor-pointer rounded-lg border transition-all duration-300",
        "transform-style-preserve-3d",
        isHovered ? "animate-float" : "",
        isFlipped ? "rotate-y-180" : "",
        "border-neon-cyan neon-border-cyan"
      )}
      style={{
        transformStyle: "preserve-3d",
        transition: "transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Front side */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center p-4 rounded-lg backface-hidden",
          "bg-gradient-to-br from-neon-cyan/10 to-transparent"
        )}
        style={{ backfaceVisibility: "hidden" }}
      >
        <h3 className="text-lg font-orbitron text-center neon-cyan mb-2">
          {protocolData.name}
        </h3>
        <div className="text-xs text-text-secondary text-center">
          Click to learn more
        </div>
      </div>

      {/* Back side */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center p-4 rounded-lg backface-hidden rotate-y-180",
          "bg-gradient-to-br from-neon-magenta/10 to-transparent"
        )}
        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
      >
        <p className="text-xs text-text-secondary text-center">
          {protocolData.description}
        </p>
        <div className="mt-2 text-xs text-neon-cyan text-center">
          Click to select
        </div>
      </div>
    </div>
  );
}
