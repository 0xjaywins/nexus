import * as React from "react";
import { cn } from "../../lib/utils";

interface GlassmorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "cyan" | "magenta" | "gradient" | "subtle";
  holographic?: boolean;
  children: React.ReactNode;
}

export const GlassmorphicCard = React.forwardRef<
  HTMLDivElement,
  GlassmorphicCardProps
>(
  (
    { variant = "cyan", holographic = true, className, children, ...props },
    ref
  ) => {
    // Determine card styles based on variant
    const getCardStyles = () => {
      const baseStyles = "rounded-xl glassmorphic p-4 backdrop-blur-md";

      const variantStyles = {
        cyan: "border border-neon-cyan/30 neon-border-cyan",
        magenta: "border border-neon-magenta/30 neon-border-magenta",
        gradient:
          "border border-neon-cyan/30 bg-gradient-to-br from-neon-cyan/5 to-neon-magenta/5",
        subtle: "border border-white/10 bg-white/5",
      };

      return cn(
        baseStyles,
        variantStyles[variant],
        holographic && "holographic",
        className
      );
    };

    return (
      <div ref={ref} className={getCardStyles()} {...props}>
        {children}
      </div>
    );
  }
);

GlassmorphicCard.displayName = "GlassmorphicCard";
