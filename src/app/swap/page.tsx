"use client";

import type React from "react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useSwap } from "../../../lib/stakingIntegration";
import { ArrowDown, Info, RefreshCw } from "lucide-react";
import { GlassmorphicCard } from "../../../components/ui/glassmorphic-card";
import { CyberpunkButton } from "../../../components/ui/cyberpunk-button";
import { NeonInput } from "../../../components/ui/neon-input";
import { SimpleTokenDropdown } from "../../../components/ui/simple-token-dropdown";
import { BackButton } from "../../../components/navigation/back-button";
import { chainConfig } from "../../../config/config";
import useTokenBalances from "../../../lib/hook/useTokenBalances";

export default function page() {
  const { address } = useAccount();
  const {
    balances,
    isLoading: balancesLoading,
    error: balancesError,
  } = useTokenBalances();
  const [fromToken, setFromToken] = useState("MON");
  const [toToken, setToToken] = useState("USDC");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [swapMessage, setSwapMessage] = useState<{
    type: "success" | "error";
    message: string;
    txHash?: string;
  } | null>(null);

  const {
    swap,
    needsApproval,
    approveError,
    approveStatus,
    txHash: swapTxHash,
    swapError,
    swapStatus,
    expectedOut,
    error: swapHookError,
  } = useSwap(fromToken, toToken, fromAmount);

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromAmount(value);

    if (value && expectedOut) {
      setToAmount(expectedOut);
    } else {
      setToAmount("");
    }
  };

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount("");
    setToAmount("");
  };

  const handleSwap = async () => {
    if (!fromToken || !toToken || !fromAmount || !address) return;

    try {
      await swap();
      console.log("Swap successful:", swapTxHash);

      // setSwapMessage({
      //   type: "success",
      //   message: "Swap successful!",
      //   txHash: swapTxHash,
      // });
      // setFromAmount("");
      // setToAmount("");
    } catch (err) {
      console.error("Swap failed:", err);
      setSwapMessage({
        type: "error",
        message: `Swap failed: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
        txHash: swapTxHash,
      });
    }
  };

  const getExchangeRate = () => {
    // Placeholder: Ambient ABI lacks getAmountsOut, use static rates or integrate oracle
    const rates: Record<string, Record<string, number>> = {
      MON: { USDC: 25.5, USDT: 25.3, WMON: 0.98, shMON: 0.85 },
      USDC: { MON: 0.039, USDT: 0.99, WMON: 0.038, shMON: 0.033 },
      USDT: { MON: 0.04, USDC: 1.01, WMON: 0.039, shMON: 0.034 },
      WMON: { MON: 1.02, USDC: 26.1, USDT: 25.9, shMON: 0.87 },
      shMON: { MON: 1.18, USDC: 30.2, USDT: 29.9, WMON: 1.15 },
    };
    return rates[fromToken]?.[toToken] || 1;
  };

  const getBalance = (token: string) => {
    if (balancesLoading) return "Loading...";
    if (balancesError) return "Error";
    const balance = balances.find((b) => b.token === token)?.balance;
    return balance ? parseFloat(balance).toFixed(2) : "0.00";
  };

  const handleMaxAmount = () => {
    const balance = getBalance(fromToken);
    if (balance && balance !== "Loading..." && balance !== "Error") {
      setFromAmount(balance);
      if (expectedOut) {
        setToAmount(expectedOut);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-void">
      <div className="fixed inset-0 w-full h-full -z-10 bg-[url('/grid-pattern.png')] opacity-20"></div>

      <GlassmorphicCard variant="gradient" className="w-full max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BackButton />
            <h1 className="text-xl font-orbitron ml-60 neon-cyan">Swap</h1>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-text-secondary">From</label>
              <div className="text-xs text-text-secondary">
                Balance: {getBalance(fromToken)}
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
          <div className="flex justify-center">
            <button
              className="w-8 h-8 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-foreground/10 transition-colors"
              onClick={handleSwapTokens}
            >
              <ArrowDown className="h-4 w-4 text-text-secondary" />
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-text-secondary">To</label>
              <div className="text-xs text-text-secondary">
                Balance: {getBalance(toToken)}
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
          <div className="flex justify-between items-center text-xs text-text-secondary p-2 border border-foreground/10 rounded-md bg-foreground/5">
            <span>Exchange Rate</span>
            <span>
              1 {fromToken} = {getExchangeRate().toFixed(6)} {toToken}
            </span>
          </div>
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
                  <span className="text-neon-green">0.5%</span>{" "}
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Estimated Gas</span>
                  <span className="text-neon-green">0.0005 MON</span>
                </div>
              </div>
            )}
          </div>
          <CyberpunkButton
            variant="gradient"
            className="w-full mt-4"
            disabled={
              !fromAmount ||
              !toAmount ||
              swapStatus === "pending" ||
              !address ||
              !!swapHookError
            }
            onClick={handleSwap}
          >
            {swapStatus === "pending" ? (
              <span className="flex items-center justify-center">
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Swapping...
              </span>
            ) : needsApproval ? (
              "Approve " + fromToken
            ) : (
              "Swap"
            )}
          </CyberpunkButton>
          {needsApproval && (
            <p className="text-neon-orange">Approval needed for {fromToken}</p>
          )}
          {approveError && (
            <p className="text-error-red">
              Approval Error: {approveError.message}
            </p>
          )}
          {swapHookError && (
            <p className="text-error-red">Error: {swapHookError}</p>
          )}
          {swapStatus === "success" && swapMessage && (
            <div className="p-3 rounded-md border border-neon-green bg-neon-green/10 text-neon-green text-center">
              {swapMessage.message}
              {swapMessage.txHash && (
                <div className="mt-2">
                  <a
                    href={`${chainConfig.blockExplorer}/tx/${swapMessage.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    View on MonadExplorer
                  </a>
                </div>
              )}
            </div>
          )}
          {swapStatus === "error" && swapMessage && (
            <div className="p-3 rounded-md border border-neon-red bg-neon-red/10 text-neon-red text-center">
              {swapMessage.message}
              {swapMessage.txHash && (
                <div className="mt-2">
                  <a
                    href={`${chainConfig.blockExplorer}/tx/${swapMessage.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    View on MonadExplorer
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </GlassmorphicCard>
    </div>
  );
}
