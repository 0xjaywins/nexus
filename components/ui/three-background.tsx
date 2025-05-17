"use client";

import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

// Dynamically import Three.js to avoid SSR issues
// const ThreeSetup = dynamic(() => import("@/lib/three-setup"), {
//   ssr: false,
// });

interface ThreeBackgroundProps {
  type?: "grid" | "particles" | "gradient";
  color?: string;
}

export function ThreeBackground({
  type = "grid",
  color = "#00FFEE",
}: ThreeBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!canvasRef.current || typeof window === "undefined") return;

    // Import Three.js setup
    import("../../lib/three-setup").then((ThreeSetup) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Adjust background color based on theme
      const backgroundColor = "transparent";

      // Adjust color based on theme if not explicitly provided
      const themeAdjustedColor =
        color || (theme === "dark" ? "#00FFEE" : "#0088AA");

      // Create scene
      const { scene, cleanup } = ThreeSetup.createScene({
        canvas,
        backgroundColor,
      });

      // Create background element based on type
      let animateElement: () => void;

      if (type === "grid") {
        const { animate } = ThreeSetup.createCyberpunkGrid(
          scene,
          Number.parseInt(themeAdjustedColor.replace("#", "0x"))
        );
        animateElement = animate;
      } else if (type === "particles") {
        const { animate } = ThreeSetup.createLightParticles(
          scene,
          300,
          Number.parseInt(themeAdjustedColor.replace("#", "0x")),
          0.03
        );
        animateElement = animate;
      } else {
        const { animate } = ThreeSetup.createGradientBackground(scene);
        animateElement = animate;
      }

      // Animation loop
      const animationLoop = () => {
        animateElement();
        requestAnimationFrame(animationLoop);
      };

      animationLoop();

      // Cleanup on unmount
      return () => {
        cleanup();
      };
    });
  }, [type, color, theme]);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10" />
  );
}
