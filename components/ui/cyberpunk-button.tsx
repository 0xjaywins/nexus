import * as React from "react";
import { useRef, useState } from "react";
import { Button } from "./button";
import { cn } from "../../lib/utils";

interface CyberpunkButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "cyan" | "magenta" | "gradient";
  size?: "default" | "sm" | "lg" | "icon";
  glitch?: boolean;
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

export const CyberpunkButton = React.forwardRef<
  HTMLButtonElement,
  CyberpunkButtonProps
>(
  (
    {
      variant = "cyan",
      size = "default",
      glitch = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    // Handle mouse move for the 3D tilt effect
    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setPosition({ x, y });
    };

    // Handle mouse enter/leave
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    // Determine button styles based on variant
    const getButtonStyles = () => {
      const baseStyles =
        "relative overflow-hidden transition-all duration-300 border";

      // Update the button styles to use more muted colors and remove any white components
      const variantStyles = {
        cyan: "border-neon-cyan text-neon-cyan hover:bg-neon-cyan/5 neon-border-cyan bg-[#081215]",
        magenta:
          "border-neon-magenta text-neon-magenta hover:bg-neon-magenta/5 neon-border-magenta bg-[#150815]",
        gradient:
          "border-neon-cyan bg-gradient-to-r from-[#081215] to-[#150815] text-white hover:from-[#0a1a1e] hover:to-[#1a0a1a] neon-border-cyan",
      };

      return cn(baseStyles, variantStyles[variant], className);
    };

    return (
      <Button
        ref={(el) => {
          // Handle both the forwardRef and our local ref
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
          buttonRef.current = el;
        }}
        className={getButtonStyles()}
        size={size}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Content */}
        <span className={cn("relative z-10", glitch && "glitch-hover")}>
          {children}
        </span>

        {/* 3D tilt effect with light trails (visible only on hover) */}
        {isHovering && (
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                variant === "cyan"
                  ? `radial-gradient(circle 80px at ${position.x}px ${position.y}px, rgba(0, 255, 238, 0.15), transparent)`
                  : variant === "magenta"
                  ? `radial-gradient(circle 80px at ${position.x}px ${position.y}px, rgba(255, 0, 255, 0.15), transparent)`
                  : `radial-gradient(circle 80px at ${position.x}px ${position.y}px, rgba(0, 255, 238, 0.15), rgba(255, 0, 255, 0.15), transparent)`,
            }}
          />
        )}
      </Button>
    );
  }
);

CyberpunkButton.displayName = "CyberpunkButton";
