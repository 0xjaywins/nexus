"use client";
import { useState } from "react";

import { GlassmorphicCard } from "../ui/glassmorphic-card";
import { CyberpunkButton } from "../ui/cyberpunk-button";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { BackButton } from "../navigation/back-button";
import { ProtocolCard } from "./protocol-card";
import { TokenIcon } from "../ui/token-icon";
import { NeonInput } from "../ui/neon-input";
import { protocols } from "../../config/tokens";

// Sample data for balances
const sampleBalances = {
  MON: "125.45",
  aprMON: "50.00",
  sMON: "25.75",
  magmaMON: "15.33",
  shMON: "42.69",
};

export function StakingPage() {
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleProtocolSelect = (protocol: string) => {
    setSelectedProtocol(protocol);
    setAmount("");
    setIsSuccess(false);
  };

  const handleStake = () => {
    if (!selectedProtocol || !amount) return;

    setIsStaking(true);

    // Simulate staking process
    setTimeout(() => {
      setIsStaking(false);
      setIsSuccess(true);
      setAmount("");
    }, 2000);
  };

  const handleUnstake = () => {
    if (!selectedProtocol || !amount) return;

    setIsUnstaking(true);

    // Simulate unstaking process
    setTimeout(() => {
      setIsUnstaking(false);
      setIsSuccess(true);
      setAmount("");
    }, 2000);
  };

  const getStakedTokenSymbol = () => {
    if (!selectedProtocol) return null;
    return protocols[selectedProtocol]?.stakedToken;
  };

  // Inside the StakingPage component, add this function to handle back navigation from protocol details
  const handleBackFromProtocol = () => {
    setSelectedProtocol(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-void">
      {/* Static background with subtle grid pattern */}
      <div className="fixed inset-0 w-full h-full -z-10 bg-[url('/grid-pattern.png')] opacity-20"></div>

      <GlassmorphicCard variant="gradient" className="w-full max-w-md mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          {selectedProtocol ? (
            // When in protocol details, back button should return to protocol list
            <CyberpunkButton
              variant="cyan"
              size="sm"
              onClick={handleBackFromProtocol}
            >
              <span className="flex justify-center items-center">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </span>
            </CyberpunkButton>
          ) : (
            // When in protocol list, back button should use the global back button
            <BackButton />
          )}
          <h1 className="text-xl font-orbitron ml-48 neon-magenta">Staking</h1>
        </div>

        {!selectedProtocol ? (
          <div className="space-y-4">
            <h2 className="text-lg font-orbitron mb-3 neon-cyan">
              Select Protocol
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {Object.keys(protocols).map((protocol) => (
                <ProtocolCard
                  key={protocol}
                  protocol={protocol}
                  onClick={() => handleProtocolSelect(protocol)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-orbitron neon-cyan">
                {protocols[selectedProtocol].name}
              </h2>
              <CyberpunkButton
                variant="cyan"
                size="sm"
                onClick={() => setSelectedProtocol(null)}
              >
                Change
              </CyberpunkButton>
            </div>

            <p className="text-sm text-text-secondary">
              {protocols[selectedProtocol].description}
            </p>

            {/* Balance display */}
            <div className="flex justify-between p-3 rounded-md border border-foreground/10 bg-foreground/5">
              <div className="flex items-center gap-2">
                <TokenIcon symbol="MON" size="sm" />
                <span className="text-text-secondary">MON Balance:</span>
              </div>
              <span className="font-medium text-text-primary">
                {sampleBalances.MON}
              </span>
            </div>

            {getStakedTokenSymbol() && (
              <div className="flex justify-between p-3 rounded-md border border-foreground/10 bg-foreground/5">
                <div className="flex items-center gap-2">
                  <TokenIcon symbol={getStakedTokenSymbol()!} size="sm" />
                  <span className="text-text-secondary">
                    {getStakedTokenSymbol()} Balance:
                  </span>
                </div>
                <span className="font-medium text-text-primary">
                  {
                    sampleBalances[
                      getStakedTokenSymbol()! as keyof typeof sampleBalances
                    ]
                  }
                </span>
              </div>
            )}

            {/* Input field */}
            <NeonInput
              variant="magenta"
              label="Amount to stake"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />

            {/* Unbonding info for protocols with unbonding period */}
            {(selectedProtocol === "aPriori" ||
              selectedProtocol === "Shmonad") && (
              <div className="flex items-start gap-2 p-3 rounded-md border border-foreground/10 bg-foreground/5">
                <Info className="h-4 w-4 text-neon-cyan mt-0.5" />
                <div className="text-xs text-text-secondary">
                  <p className="font-medium text-neon-cyan mb-1">
                    Unbonding Period
                  </p>
                  <p>
                    This protocol has a 10min unbonding period. Your tokens will
                    be locked during this time.
                  </p>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <CyberpunkButton
                variant="cyan"
                disabled={!amount || isStaking || isUnstaking}
                onClick={handleStake}
              >
                {isStaking ? (
                  <span className="flex items-center">
                    <span className="animate-pulse mr-2">Staking...</span>
                  </span>
                ) : (
                  <span className="flex items-center">
                    Stake <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </CyberpunkButton>

              <CyberpunkButton
                variant="magenta"
                disabled={!amount || isStaking || isUnstaking}
                onClick={handleUnstake}
              >
                {isUnstaking ? (
                  <span className="flex items-center">
                    <span className="animate-pulse mr-2">Unstaking...</span>
                  </span>
                ) : (
                  <span className="flex items-center">
                    Unstake <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </CyberpunkButton>
            </div>

            {/* Success message */}
            {isSuccess && (
              <div className="p-3 rounded-md border border-neon-green bg-neon-green/10 text-neon-green text-center">
                Transaction successful!
              </div>
            )}
          </div>
        )}
      </GlassmorphicCard>
    </div>
  );
}
