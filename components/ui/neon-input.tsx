"use client";

import React, { useState } from "react";
import { cn } from "../../lib/utils";

interface NeonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "cyan" | "magenta";
  label?: string;
  error?: string;
}

export const NeonInput = React.forwardRef<HTMLInputElement, NeonInputProps>(
  ({ variant = "cyan", label, error, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(
      !!props.value || !!props.defaultValue
    );

    // Handle focus/blur
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    // Handle value change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    // Determine input styles based on variant
    const getInputStyles = () => {
      const baseStyles =
        "w-full bg-transparent border rounded-md px-4 py-2 text-text-primary outline-none transition-all duration-300";

      const variantStyles = {
        cyan: "border-white/20 focus:border-neon-cyan focus:neon-border-cyan",
        magenta:
          "border-white/20 focus:border-neon-magenta focus:neon-border-magenta",
      };

      const errorStyles = error ? "border-neon-red neon-border-red" : "";

      return cn(baseStyles, variantStyles[variant], errorStyles, className);
    };

    // Determine label styles
    const getLabelStyles = () => {
      const baseStyles =
        "absolute left-4 transition-all duration-200 pointer-events-none";

      const positionStyles =
        isFocused || hasValue
          ? "-top-2.5 text-xs px-1 bg-void"
          : // : "top-2 text-sm";
            "-top-2.5 text-xs px-1 bg-void";

      const colorStyles = {
        cyan: isFocused ? "text-neon-cyan" : "text-text-secondary",
        magenta: isFocused ? "text-neon-magenta" : "text-text-secondary",
      };

      const errorStyles = error ? "text-neon-red" : "";

      return cn(baseStyles, positionStyles, colorStyles[variant], errorStyles);
    };

    return (
      <div className="relative">
        {label && <label className={getLabelStyles()}>{label}</label>}

        <input
          ref={ref}
          className={getInputStyles()}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />

        {error && <p className="mt-1 text-xs text-neon-red">{error}</p>}
      </div>
    );
  }
);

NeonInput.displayName = "NeonInput";
