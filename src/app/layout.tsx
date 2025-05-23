import type React from "react";
import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { FrameProvider } from "../../components/providers/farcaster-provider";
import farcasterFrame from "@farcaster/frame-wagmi-connector";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "NEXUS | Web3 DeFi on Monad",
  description: "Swap, Stake, and Stay updated effortlessly on Monad Testnet",
  openGraph: {
    title: "NEXUS | Web3 DeFi on Monad",
    description: "Swap, Stake, and Stay updated effortlessly on Monad Testnet",
    images: [
      {
        url: "https:https://nexus-ten-sigma.vercel.app/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="fc:frame" content={JSON.stringify(farcasterFrame)} />
      </head>
      <body
        className={`${inter.variable} ${orbitron.variable} font-sans bg-void dark`}
      >
        <FrameProvider>
          <div className="min-h-screen bg-[url('/og-image.png')] bg-cover bg-center bg-no-repeat overflow-hidden relative">
            {children}
          </div>
        </FrameProvider>
      </body>
    </html>
  );
}
