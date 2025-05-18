import type React from "react";
import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "../../components/navigation/navigation-context";

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
  description: "Stake, swap, and get notifications for the Monad testnet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${orbitron.variable} font-sans bg-void dark`}
      >
        <AppStateProvider>
          <div className="min-h-screen bg-void overflow-hidden relative">
            {children}
          </div>
        </AppStateProvider>
      </body>
    </html>
  );
}
