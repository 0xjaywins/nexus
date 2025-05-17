"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useAppState } from "../navigation/navigation-context";
import { CyberpunkButton } from "../ui/cyberpunk-button";
import { GlassmorphicCard } from "../ui/glassmorphic-card";
import { TokenIcon } from "../ui/token-icon";
import { ArrowRight, TrendingUp, Zap } from "lucide-react";

// Dynamically import the NexusLogo component to avoid SSR issues
const NexusLogo = dynamic(() => import("../nexus-logo"), {
  ssr: false,
  loading: () => (
    <div className="h-16 w-full flex items-center justify-center">NEXUS</div>
  ),
});

// Sample data for balances
const sampleBalances = [
  { token: "MON", balance: "125.45" },
  { token: "shMON", balance: "42.69" },
  { token: "USDC", balance: "1,250.00" },
  { token: "USDT", balance: "750.50" },
  { token: "WMON", balance: "10.25" },
  { token: "aprMON", balance: "50.00" },
  { token: "sMON", balance: "25.75" },
  { token: "magmaMON", balance: "15.33" },
];

export function Dashboard() {
  const { isWalletConnected, setWalletConnected } = useAppState();

  const handleConnect = () => {
    setWalletConnected(true);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-void">
      {/* Static background with subtle grid pattern */}
      <div className="fixed inset-0 w-full h-full -z-10 bg-[url('/grid-pattern.png')] opacity-20"></div>

      <GlassmorphicCard variant="gradient" className="w-full max-w-md mx-auto">
        <div className="mb-4">
          <div className="flex-1 text-center">
            <NexusLogo />
          </div>
        </div>

        {!isWalletConnected ? (
          <div className="space-y-6">
            <h1 className="text-2xl font-orbitron text-center neon-cyan">
              Welcome to NEXUS
            </h1>
            <p className="text-text-secondary text-center">
              Swap, Stake and Stay updated effortlessly on Monad Testnet
            </p>
            <div className="flex justify-center mt-6">
              <CyberpunkButton
                variant="gradient"
                size="lg"
                onClick={handleConnect}
              >
                <span className="flex justify-center items-center">
                  Connect Wallet <Zap className="ml-2 h-4 w-4" />
                </span>
              </CyberpunkButton>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Balance display */}
            <div>
              <h2 className="text-lg font-orbitron mb-3 neon-cyan">
                Your Balances
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {sampleBalances.map((item) => (
                  <div
                    key={item.token}
                    className="flex items-center gap-2 p-2 rounded-md border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-colors"
                  >
                    <TokenIcon symbol={item.token} size="sm" />
                    <div className="flex flex-col">
                      <span className="text-xs text-text-secondary">
                        {item.token}
                      </span>
                      <span className="font-medium text-text-primary">
                        {item.balance}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending teaser */}
            <div className="p-2 rounded-md bg-gradient-to-r from-neon-cyan/10 to-neon-magenta/10 border border-foreground/10">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-neon-cyan" />
                <span className="text-sm font-medium text-text-secondary">
                  WMON trending in your network!
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 gap-3">
              <Link href="/staking" passHref>
                <CyberpunkButton variant="cyan" className="w-full">
                  <span className="flex justify-center items-center">
                    Stake <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </CyberpunkButton>
              </Link>

              <Link href="/swap" passHref>
                <CyberpunkButton variant="magenta" className="w-full">
                  <span className="flex justify-center items-center">
                    Swap <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </CyberpunkButton>
              </Link>

              <Link href="/notifications" passHref>
                <CyberpunkButton variant="gradient" className="w-full">
                  <span className="flex justify-center items-center">
                    Notifications <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </CyberpunkButton>
              </Link>
            </div>
          </div>
        )}
      </GlassmorphicCard>
    </div>
  );
}
