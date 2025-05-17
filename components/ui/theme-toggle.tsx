"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { CyberpunkButton } from "./cyberpunk-button";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <CyberpunkButton
      asChild
      variant={theme === "dark" ? "cyan" : "magenta"}
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden w-10 h-10"
      aria-label="Toggle theme"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-5 h-5">
          {/* Sun icon with animation */}
          <Sun
            className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
              theme === "dark"
                ? "opacity-0 rotate-90 scale-0"
                : "opacity-100 rotate-0 scale-100"
            }`}
          />
          {/* Moon icon with animation */}
          <Moon
            className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
              theme === "dark"
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 rotate-90 scale-0"
            }`}
          />
        </div>
      </div>
    </CyberpunkButton>
  );
}
