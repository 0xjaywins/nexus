"use client";

import type React from "react";
import { useState } from "react";
import { ArrowDown, Info, RefreshCw } from "lucide-react";
import { GlassmorphicCard } from "../../components/ui/glassmorphic-card";
import { CyberpunkButton } from "../../components/ui/cyberpunk-button";
import { NeonInput } from "../../components/ui/neon-input";
import { SimpleTokenDropdown } from "../../components/ui/simple-token-dropdown";
import { BackButton } from "../../components/navigation/back-button";

// Sample data for balances
const sampleBalances = {
  MON: "125.45",
  shMON: "42.69",
  USDC: "1,250.00",
  USDT: "750.50",
  WMON: "10.25",
};

export function SwapPage() {
  const [fromToken, setFromToken] = useState("MON");
  const [toToken, setToToken] = useState("USDC");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Handle from amount change
  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromAmount(value);

    // Simulate price calculation
    if (value) {
      const calculatedValue = Number.parseFloat(value) * getExchangeRate();
      setToAmount(calculatedValue.toFixed(6));
    } else {
      setToAmount("");
    }
  };

  // Handle token swap
  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);

    // Recalculate amounts
    if (fromAmount) {
      const calculatedValue =
        Number.parseFloat(fromAmount) * (1 / getExchangeRate());
      setFromAmount(toAmount);
      setToAmount(calculatedValue.toFixed(6));
    }
  };

  // Handle swap action
  const handleSwap = () => {
    if (!fromToken || !toToken || !fromAmount) return;

    setIsSwapping(true);

    // Simulate swap process
    setTimeout(() => {
      setIsSwapping(false);
      setIsSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false);
        setFromAmount("");
        setToAmount("");
      }, 3000);
    }, 2000);
  };

  // Get exchange rate between tokens (simulated)
  const getExchangeRate = () => {
    const rates: Record<string, Record<string, number>> = {
      MON: { USDC: 25.5, USDT: 25.3, WMON: 0.98, shMON: 0.85 },
      USDC: { MON: 0.039, USDT: 0.99, WMON: 0.038, shMON: 0.033 },
      USDT: { MON: 0.04, USDC: 1.01, WMON: 0.039, shMON: 0.034 },
      WMON: { MON: 1.02, USDC: 26.1, USDT: 25.9, shMON: 0.87 },
      shMON: { MON: 1.18, USDC: 30.2, USDT: 29.9, WMON: 1.15 },
    };

    return rates[fromToken]?.[toToken] || 1;
  };

  // Get max amount for selected token
  const handleMaxAmount = () => {
    const balance = sampleBalances[fromToken as keyof typeof sampleBalances];
    if (balance) {
      const numericBalance = balance.replace(/,/g, "");
      setFromAmount(numericBalance);

      // Calculate to amount
      const calculatedValue =
        Number.parseFloat(numericBalance) * getExchangeRate();
      setToAmount(calculatedValue.toFixed(6));
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-void">
      {/* Static background with subtle grid pattern */}
      <div className="fixed inset-0 w-full h-full -z-10 bg-[url('/grid-pattern.png')] opacity-20"></div>

      <GlassmorphicCard variant="gradient" className="w-full max-w-md mx-auto">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BackButton />
            <h1 className="text-xl font-orbitron ml-52 neon-cyan">Swap</h1>
          </div>
        </div>

        <div className="space-y-4">
          {/* From token section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-text-secondary">From</label>
              <div className="text-xs text-text-secondary">
                Balance:{" "}
                {sampleBalances[fromToken as keyof typeof sampleBalances] ||
                  "0.00"}
              </div>
            </div>

            <div className="flex gap-2">
              <SimpleTokenDropdown
                value={fromToken}
                onValueChange={setFromToken}
                excludeTokens={[toToken]}
                className="w-1/3"
              />

              <div className="relative flex-1">
                <NeonInput
                  variant="cyan"
                  type="number"
                  value={fromAmount}
                  onChange={handleFromAmountChange}
                  placeholder="0.00"
                  className="pr-16"
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-neon-cyan px-2 py-1 rounded border border-neon-cyan/30 hover:bg-neon-cyan/10"
                  onClick={handleMaxAmount}
                >
                  MAX
                </button>
              </div>
            </div>
          </div>

          {/* Swap direction button */}
          <div className="flex justify-center">
            <button
              className="w-8 h-8 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-foreground/10 transition-colors"
              onClick={handleSwapTokens}
            >
              <ArrowDown className="h-4 w-4 text-text-secondary" />
            </button>
          </div>

          {/* To token section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-text-secondary">To</label>
              <div className="text-xs text-text-secondary">
                Balance:{" "}
                {sampleBalances[toToken as keyof typeof sampleBalances] ||
                  "0.00"}
              </div>
            </div>

            <div className="flex gap-2">
              <SimpleTokenDropdown
                value={toToken}
                onValueChange={setToToken}
                excludeTokens={[fromToken]}
                className="w-1/3"
              />

              <NeonInput
                variant="magenta"
                type="number"
                value={toAmount}
                readOnly
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Exchange rate */}
          <div className="flex justify-between items-center text-xs text-text-secondary p-2 border border-foreground/10 rounded-md bg-foreground/5">
            <span>Exchange Rate</span>
            <span>
              1 {fromToken} = {getExchangeRate().toFixed(6)} {toToken}
            </span>
          </div>

          {/* Swap details (collapsible) */}
          <div>
            <button
              className="flex items-center text-xs text-text-secondary w-full justify-between"
              onClick={() => setShowDetails(!showDetails)}
            >
              <span>Swap Details</span>
              <Info className="h-3 w-3" />
            </button>

            {showDetails && (
              <div className="mt-2 p-2 border border-foreground/10 rounded-md text-xs space-y-1 bg-foreground/5">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Price Impact</span>
                  <span className="text-neon-green">0.05%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">
                    Slippage Tolerance
                  </span>
                  <span>0.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Estimated Gas</span>
                  <span>0.0005 MON</span>
                </div>
              </div>
            )}
          </div>

          {/* Swap button */}
          <CyberpunkButton
            variant="gradient"
            className="w-full mt-4"
            disabled={!fromAmount || !toAmount || isSwapping}
            onClick={handleSwap}
          >
            {isSwapping ? (
              <span className="flex items-center justify-center">
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Swapping...
              </span>
            ) : (
              "Swap"
            )}
          </CyberpunkButton>

          {/* Success message */}
          {isSuccess && (
            <div className="p-3 rounded-md border border-neon-green bg-neon-green/10 text-neon-green text-center">
              Swap successful!
            </div>
          )}
        </div>
      </GlassmorphicCard>
    </div>
  );
}
