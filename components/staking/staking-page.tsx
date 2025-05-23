// "use client";
// import { useState } from "react";

// import { GlassmorphicCard } from "../ui/glassmorphic-card";
// import { CyberpunkButton } from "../ui/cyberpunk-button";
// import { ArrowLeft, ArrowRight, Info } from "lucide-react";
// import { BackButton } from "../navigation/back-button";
// import { ProtocolCard } from "./protocol-card";
// import { TokenIcon } from "../ui/token-icon";
// import { NeonInput } from "../ui/neon-input";
// import { protocols } from "../../config/config";
// import { useAccount } from "wagmi";
// import useTokenBalances from "../../lib/hook/useTokenBalances";
// import { useStake, useUnstake } from "../../lib/stakingIntegration";

// export function StakingPage() {
//   const { address } = useAccount();
//   const {
//     balances,
//     isLoading: balancesLoading,
//     error: balancesError,
//   } = useTokenBalances();

//   const {
//     stake,
//     approveError,
//     approveStatus,
//     needsApproval,
//     stakeStatus,
//     txHash,
//     stakeError,
//   } = useStake();
//   const {} = useUnstake();
//   console.log("balances", balances, balancesLoading, balancesError);
//   const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);
//   const [amount, setAmount] = useState("");
//   const [isStaking, setIsStaking] = useState(false);
//   const [isUnstaking, setIsUnstaking] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);

//   const handleProtocolSelect = (protocol: string) => {
//     setSelectedProtocol(protocol);
//     setAmount("");
//     setIsSuccess(false);
//   };

//   const handleStake = () => {
//     if (!selectedProtocol || !amount) return;

//     setIsStaking(true);

//     // Simulate staking process
//     setTimeout(() => {
//       setIsStaking(false);
//       setIsSuccess(true);
//       setAmount("");
//     }, 2000);
//   };

//   const handleUnstake = () => {
//     if (!selectedProtocol || !amount) return;

//     setIsUnstaking(true);

//     // Simulate unstaking process
//     setTimeout(() => {
//       setIsUnstaking(false);
//       setIsSuccess(true);
//       setAmount("");
//     }, 2000);
//   };

//   const getStakedTokenSymbol = () => {
//     if (!selectedProtocol) return null;
//     return protocols[selectedProtocol]?.stakedToken;
//   };

//   // Inside the StakingPage component, add this function to handle back navigation from protocol details
//   const handleBackFromProtocol = () => {
//     setSelectedProtocol(null);
//   };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-void">
//       {/* Static background with subtle grid pattern */}
//       <div className="fixed inset-0 w-full h-full -z-10 bg-[url('/grid-pattern.png')] opacity-20"></div>

//       <GlassmorphicCard variant="gradient" className="w-full max-w-md mx-auto">
//         {/* Header with back button */}
//         <div className="flex items-center mb-6">
//           {selectedProtocol ? (
//             // When in protocol details, back button should return to protocol list
//             <CyberpunkButton
//               variant="cyan"
//               size="sm"
//               onClick={handleBackFromProtocol}
//             >
//               <span className="flex justify-center items-center">
//                 <ArrowLeft className="h-4 w-4 mr-1" /> Back
//               </span>
//             </CyberpunkButton>
//           ) : (
//             // When in protocol list, back button should use the global back button
//             <BackButton />
//           )}
//           <h1 className="text-xl font-orbitron ml-56 neon-magenta">Staking</h1>
//         </div>

//         {!selectedProtocol ? (
//           <div className="space-y-4">
//             <h2 className="text-lg font-orbitron mb-3 neon-cyan">
//               Select Protocol
//             </h2>

//             <div className="grid grid-cols-2 gap-3">
//               {Object.keys(protocols).map((protocol) => (
//                 <ProtocolCard
//                   key={protocol}
//                   protocol={protocol}
//                   onClick={() => handleProtocolSelect(protocol)}
//                 />
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <h2 className="text-lg font-orbitron neon-cyan">
//                 {protocols[selectedProtocol].name}
//               </h2>
//               <CyberpunkButton
//                 variant="cyan"
//                 size="sm"
//                 onClick={() => setSelectedProtocol(null)}
//               >
//                 Change
//               </CyberpunkButton>
//             </div>

//             <p className="text-sm text-text-secondary">
//               {protocols[selectedProtocol].description}
//             </p>

//             {/* Balance display */}
//             <div className="flex justify-between p-3 rounded-md border border-foreground/10 bg-foreground/5">
//               <div className="flex items-center gap-2">
//                 <TokenIcon symbol="MON" size="sm" />
//                 <span className="text-text-secondary">MON Balance:</span>
//               </div>
//               <span className="font-medium text-text-primary">
//                 {balances.find((b) => b.token === "MON")?.balance || "0.00"}
//               </span>
//             </div>

//             {getStakedTokenSymbol() && (
//               <div className="flex justify-between p-3 rounded-md border border-foreground/10 bg-foreground/5">
//                 <div className="flex items-center gap-2">
//                   <TokenIcon symbol={getStakedTokenSymbol()!} size="sm" />
//                   <span className="text-text-secondary">
//                     {getStakedTokenSymbol()} Balance:
//                   </span>
//                 </div>
//                 <span className="font-medium text-text-primary">
//                   {balances.find((b) => b.token === getStakedTokenSymbol())
//                     ?.balance || "0.00"}
//                 </span>
//               </div>
//             )}

//             {/* Input field */}
//             <NeonInput
//               variant="magenta"
//               label="Amount to stake"
//               type="number"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               placeholder="0.00"
//             />

//             {/* Unbonding info for protocols with unbonding period */}
//             {(selectedProtocol === "aPriori" ||
//               selectedProtocol === "Shmonad") && (
//               <div className="flex items-start gap-2 p-3 rounded-md border border-foreground/10 bg-foreground/5">
//                 <Info className="h-4 w-4 text-neon-cyan mt-0.5" />
//                 <div className="text-xs text-text-secondary">
//                   <p className="font-medium text-neon-cyan mb-1">
//                     Unbonding Period
//                   </p>
//                   <p>
//                     This protocol has a 10min unbonding period. Your tokens will
//                     be locked during this time.
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Action buttons */}
//             <div className="grid grid-cols-2 gap-3 mt-6">
//               <CyberpunkButton
//                 variant="cyan"
//                 disabled={!amount || isStaking || isUnstaking}
//                 onClick={handleStake}
//               >
//                 {isStaking ? (
//                   <span className="flex items-center">
//                     <span className="animate-pulse mr-2">Staking...</span>
//                   </span>
//                 ) : (
//                   <span className="flex items-center">
//                     Stake <ArrowRight className="ml-2 h-4 w-4" />
//                   </span>
//                 )}
//               </CyberpunkButton>

//               <CyberpunkButton
//                 variant="magenta"
//                 disabled={!amount || isStaking || isUnstaking}
//                 onClick={handleUnstake}
//               >
//                 {isUnstaking ? (
//                   <span className="flex items-center">
//                     <span className="animate-pulse mr-2">Unstaking...</span>
//                   </span>
//                 ) : (
//                   <span className="flex items-center">
//                     Unstake <ArrowRight className="ml-2 h-4 w-4" />
//                   </span>
//                 )}
//               </CyberpunkButton>
//             </div>

//             {/* Success message */}
//             {isSuccess && (
//               <div className="p-3 rounded-md border border-neon-green bg-neon-green/10 text-neon-green text-center">
//                 Transaction successful!
//               </div>
//             )}
//           </div>
//         )}
//       </GlassmorphicCard>
//     </div>
//   );
// }

// // Sample data for balances
// const sampleBalances = {
//   MON: "125.45",
//   aprMON: "50.00",
//   sMON: "25.75",
//   gMON: "15.33",
//   shMON: "42.69",
// };
"use client";
import { useState, useEffect } from "react";
import { GlassmorphicCard } from "../ui/glassmorphic-card";
import { CyberpunkButton } from "../ui/cyberpunk-button";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { BackButton } from "../navigation/back-button";
import { ProtocolCard } from "./protocol-card";
import { TokenIcon } from "../ui/token-icon";
import { NeonInput } from "../ui/neon-input";
import { protocols } from "../../config/config";
import { useAccount } from "wagmi";
import useTokenBalances from "../../lib/hook/useTokenBalances";
import { useStake, useUnstake } from "../../lib/stakingIntegration";
import { formatUnits, parseUnits } from "viem";

export function StakingPage() {
  const { address } = useAccount();
  const {
    balances,
    isLoading: balancesLoading,
    error: balancesError,
  } = useTokenBalances();
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);
  const [amount, setAmount] = useState("");

  const {
    stake,
    needsApproval,
    isConfirming,
    isSuccess,
    stakeStatus,
    txHash: stakeTxHash,
    stakeError,
  } = useStake(selectedProtocol || "", amount);

  const [isSuccessful, setIsSuccessful] = useState(isSuccess);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    initiateUnstake,
    claimUnstaked,
    canClaim,
    txHash: unstakeTxHash,
    unstakeError,
    unstakeStatus,
    isConfirming: isConfirmingUnstake,
    isSuccess: isSuccessUnstake,
  } = useUnstake(selectedProtocol || "", amount);

  console.log("claimUnstaked", claimUnstaked);
  console.log("claimUnstaked", claimUnstaked);

  const [isUnstakeSuccessful, setIsUnstakeSuccessful] =
    useState(isSuccessUnstake);
  const [unstakeErrorMessage, setUnstakeErrorMessage] = useState<string | null>(
    null
  );

  const handleProtocolSelect = (protocol: string) => {
    setSelectedProtocol(protocol);
    setAmount("");
    setIsSuccessful(false);
    setErrorMessage(null);
  };

  const handleBackFromProtocol = () => {
    setSelectedProtocol(null);
    setAmount("");
    setIsSuccessful(false);
    setErrorMessage(null);
  };

  const handleStake = async () => {
    if (!selectedProtocol || !amount || !address) {
      setErrorMessage(
        "Please select a protocol, enter an amount, and connect your wallet."
      );
      return;
    }
    if (needsApproval && !isConfirming) {
      setErrorMessage("Please approve the token first.");
      return;
    }
    try {
      await stake();
      setIsSuccessful(true);
      setAmount("");
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage("Staking failed. Please try again.");
    }
  };

  const handleUnstake = async () => {
    if (!selectedProtocol || !amount || !address) {
      setUnstakeErrorMessage(
        "Please select a protocol, enter an amount, and connect your wallet."
      );
      return;
    }

    try {
      await initiateUnstake();
      setIsUnstakeSuccessful(true);
      setAmount("");
      setUnstakeErrorMessage(null);
    } catch (error) {
      setUnstakeErrorMessage("Unstaking failed. Please try again.");
    }
  };

  const handleClaim = async () => {
    if (!selectedProtocol || !address || selectedProtocol !== "Shmonad") {
      setErrorMessage("Claiming is only available for Shmonad protocol.");
      return;
    }

    try {
      await claimUnstaked();
      setIsSuccessful(true);
      setAmount("");
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage("Claiming failed. Please try again.");
    }
  };

  // useEffect(() => {
  //   if (approveError) setErrorMessage(approveError.message);
  //   if (stakeError) setErrorMessage(stakeError.message);
  //   if (unstakeError) setErrorMessage(unstakeError.message);
  // }, [approveError, stakeError, unstakeError]);

  const getStakedTokenSymbol = () => {
    if (!selectedProtocol) return null;
    return protocols[selectedProtocol]?.stakedToken;
  };

  const getBalance = (token: string) => {
    const balance = balances.find((b) => b.token === token)?.balance || "0";
    try {
      // Parse the balance as a decimal string to BigInt with 18 decimals
      const parsedBalance = parseUnits(balance.toString(), 18);
      // Format back to a readable string with proper decimals
      return formatUnits(parsedBalance, 18);
    } catch (error) {
      console.error(`Error parsing balance for ${token}:`, error);
      return "0.00";
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-void">
      <div className="fixed inset-0 w-full h-full -z-10 bg-[url('/grid-pattern.png')] opacity-20"></div>

      <GlassmorphicCard variant="gradient" className="w-full max-w-md mx-auto">
        <div className="flex items-center mb-6">
          {selectedProtocol ? (
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
            <BackButton />
          )}
          <h1 className="text-xl font-orbitron ml-56 neon-magenta">Staking</h1>
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

            <div className="flex justify-between p-3 rounded-md border border-foreground/10 bg-foreground/5">
              <div className="flex items-center gap-2">
                <TokenIcon symbol="MON" size="sm" />
                <span className="text-text-secondary">MON Balance:</span>
              </div>
              <span className="font-medium text-text-primary">
                {balancesLoading
                  ? "Loading..."
                  : parseFloat(getBalance("MON")).toFixed(2)}
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
                  {balancesLoading
                    ? "Loading..."
                    : parseFloat(getBalance(getStakedTokenSymbol()!)).toFixed(
                        2
                      )}
                </span>
              </div>
            )}

            {(selectedProtocol === "aPriori" ||
              selectedProtocol === "Shmonad") && (
              <div className="flex justify-between p-3 rounded-md border border-foreground/10 bg-foreground/5">
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary">
                    {selectedProtocol === "aPriori"
                      ? "Max Redeemable:"
                      : "Bonded Balance:"}
                  </span>
                </div>
                <span className="font-medium text-text-primary">
                  {typeof canClaim === "bigint"
                    ? formatUnits(canClaim, 18)
                    : "0.00"}
                </span>
              </div>
            )}

            <NeonInput
              variant="magenta"
              label="Amount to stake/unstake"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />

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

            <div className="grid grid-cols-2 gap-3 mt-6">
              <CyberpunkButton
                variant="cyan"
                disabled={
                  !amount ||
                  !address ||
                  stakeStatus === "pending" ||
                  unstakeStatus === "pending" ||
                  (needsApproval && stakeStatus !== "success")
                }
                onClick={handleStake}
              >
                {stakeStatus === "pending" ? (
                  <span className="flex items-center">
                    <span className="animate-pulse mr-2">Staking...</span>
                  </span>
                ) : needsApproval && stakeStatus !== "success" ? (
                  <span className="flex items-center">
                    Approve <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                ) : (
                  <span className="flex items-center">
                    Stake <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </CyberpunkButton>

              <CyberpunkButton
                variant="magenta"
                disabled={
                  !amount ||
                  !address ||
                  stakeStatus === "pending" ||
                  unstakeStatus === "pending"
                }
                onClick={handleUnstake}
              >
                {unstakeStatus === "pending" ? (
                  <span className="flex items-center">
                    <span className="animate-pulse mr-2">Unstaking...</span>
                  </span>
                ) : (
                  <span className="flex items-center">
                    Unstake <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </CyberpunkButton>

              {selectedProtocol === "Shmonad" && (
                <CyberpunkButton
                  variant="gradient"
                  disabled={
                    !address ||
                    !canClaim ||
                    stakeStatus === "pending" ||
                    unstakeStatus === "pending"
                  }
                  onClick={handleClaim}
                >
                  {unstakeStatus === "pending" ? (
                    <span className="flex items-center">
                      <span className="animate-pulse mr-2">Claiming...</span>
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Claim <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </CyberpunkButton>
              )}
            </div>
            {/* stake starts here */}
            {stakeStatus === "success" && (stakeTxHash || unstakeTxHash) && (
              <div className="p-3 rounded-md border border-neon-green bg-neon-green/10 text-neon-green text-center">
                <p className="font-medium text-neon-cyan mb-1">
                  Transaction successful! Tx:{" "}
                </p>
                <div className="p-3 truncate line-clamp-1 text-ellipsis rounded-md border border-neon-green bg-neon-green/10 text-neon-green text-center">
                  <a
                    href={`https://testnet.monadexplorer.com/tx/${
                      stakeTxHash || unstakeTxHash
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate underline"
                  >
                    {stakeTxHash || unstakeTxHash}
                  </a>{" "}
                </div>
              </div>
            )}

            {stakeStatus === "error" && (stakeTxHash || unstakeTxHash) && (
              <div className="p-3 rounded-md border  border-neon-red bg-neon-red/10 text-neon-red text-center">
                Transaction successful! Tx:{" "}
                <a
                  href={`https://testnet.monadexplorer.com/tx/${
                    stakeTxHash || unstakeTxHash
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate hover:underline"
                >
                  {stakeTxHash || unstakeTxHash}
                </a>{" "}
              </div>
            )}
            {/* stake ends here */}

            {/* unstake starts here */}
            {unstakeStatus === "success" && (stakeTxHash || unstakeTxHash) && (
              <div className="p-3 rounded-md border border-neon-green bg-neon-green/10 text-neon-green text-center">
                <p className="font-medium text-neon-cyan mb-1">
                  Transaction successful! Tx:{" "}
                </p>
                <div className="p-3 truncate line-clamp-1 text-ellipsis rounded-md border border-neon-green bg-neon-green/10 text-neon-green text-center">
                  <a
                    href={`https://testnet.monadexplorer.com/tx/${
                      stakeTxHash || unstakeTxHash
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate underline"
                  >
                    {stakeTxHash || unstakeTxHash}
                  </a>{" "}
                </div>
              </div>
            )}

            {unstakeStatus === "error" && (stakeTxHash || unstakeTxHash) && (
              <div className="p-3 rounded-md border  border-neon-red bg-neon-red/10 text-neon-red text-center">
                Transaction successful! Tx:{" "}
                <a
                  href={`https://testnet.monadexplorer.com/tx/${
                    stakeTxHash || unstakeTxHash
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate hover:underline"
                >
                  {stakeTxHash || unstakeTxHash}
                </a>{" "}
              </div>
            )}

            {/* unstake ends here */}
            {/* stake message starts here */}
            {errorMessage && (
              <div className="p-3 rounded-md border border-neon-red bg-neon-red/10 text-neon-red text-center">
                {errorMessage}
              </div>
            )}
            {/* stake message ends here */}
            {/* unstake message starts here */}
            {unstakeErrorMessage && (
              <div className="p-3 rounded-md border border-neon-red bg-neon-red/10 text-neon-red text-center">
                {unstakeErrorMessage}
              </div>
            )}
            {/* unstake message ends here */}
          </div>
        )}
      </GlassmorphicCard>
    </div>
  );
}
