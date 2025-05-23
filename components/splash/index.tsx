// import Image from 'next/image';

// export default function Splash (){
// 	return (
// 		<div className="h-screen w-full flex items-center justify-center">
// 			<Image
// 				src="/splash.png"
// 				alt="NEXUS image"
// 				width={200}
// 				height={200}
// 				className="object-contain"
// 				onError={() => console.error("Logo failed to load")}
// 			/>
// 		</div>
// 	)

// }
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useMiniAppContext } from "../providers/farcaster-provider";

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const { showSplash } = useMiniAppContext();

  // Log initial render and context values
  console.log(
    "SplashScreen render - progress:",
    progress,
    "showSplash:",
    showSplash
  );

  useEffect(() => {
    console.log(
      "useEffect triggered - showSplash:",
      showSplash,
      "progress:",
      progress
    );

    let interval: NodeJS.Timeout | undefined;

    if (showSplash) {
      console.log("showSplash is true, starting progress interval");
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev >= 100 ? 100 : prev + 5;
          console.log(
            "Progress update - prev:",
            prev,
            "newProgress:",
            newProgress,
            "interval active"
          );

          if (newProgress >= 100) {
            console.log("Progress reached 100%, clearing interval");
            clearInterval(interval);
          }

          return newProgress;
        });
      }, 100);
    } else {
      console.log("showSplash is false, resetting progress to 0");
      setProgress(0);
    }

    // Cleanup interval on unmount or showSplash change
    return () => {
      if (interval) {
        console.log("Cleaning up interval");
        clearInterval(interval);
      }
    };
  }, [showSplash]);

  // Log before conditional return
  console.log(
    "Rendering check - showSplash:",
    showSplash,
    "progress:",
    progress
  );

  // If showSplash is false, don't render the splash screen
  if (!showSplash) {
    console.log("Not rendering splash screen - showSplash is false");
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-cyberpunk">
      <div className="relative w-32 h-32 mb-8 animate-float">
        <Image
          src="/logo.png"
          alt="NEXUS Logo"
          width={128}
          height={128}
          className="object-contain"
          onError={() => console.error("Logo failed to load")}
        />
      </div>

      <h1 className="font-orbitron text-4xl font-bold mb-8 neon-text-cyan">
        NEXUS
      </h1>

      <div className="w-64 h-2 bg-background-alt rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-neon animate-pulse-glow"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-2 text-sm text-neon-cyan">Loading: {progress}%</p>

      <div className="mt-8 relative">
        <div className="absolute inset-0 animate-glitch-blur">
          <div className="w-16 h-16 border-2 border-neon-cyan animate-spin rounded-full border-t-transparent" />
        </div>
        <div className="w-16 h-16 border-2 border-neon-cyan animate-spin rounded-full border-t-transparent" />
      </div>
    </div>
  );
}
