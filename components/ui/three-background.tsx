"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

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

    import("../../lib/threeSetup").then((ThreeSetup) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const backgroundColor = "transparent";

      const themeAdjustedColor =
        color || (theme === "dark" ? "#00FFEE" : "#0088AA");

      const threeColor = new THREE.Color(themeAdjustedColor); // Convert string to THREE.Color

      const { scene, cleanup } = ThreeSetup.createScene({
        canvas,
        backgroundColor,
      });

      let animateElement: () => void;

      if (type === "grid") {
        const { animate } = ThreeSetup.createCyberpunkGrid(scene, threeColor); // Pass THREE.Color
        animateElement = animate;
      } else if (type === "particles") {
        const { animate } = ThreeSetup.createLightParticles(
          scene,
          300,
          new THREE.Color(themeAdjustedColor), // Pass THREE.Color
          0.03
        );
        animateElement = animate;
      } else {
        const { animate } = ThreeSetup.createGradientBackground(scene);
        animateElement = animate;
      }

      const animationLoop = () => {
        animateElement();
        requestAnimationFrame(animationLoop);
      };

      animationLoop();

      return () => {
        cleanup();
      };
    });
  }, [type, color, theme]);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10" />
  );
}
