import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { useEffect, useState, useCallback } from "react";
import { getPublicClient } from "@wagmi/core";
import { config } from "./wagmi-config";
import { monadTestnet } from "./chains";
import {
  tokens,
  protocols,
  AMBIENT_ABI,
  AMBIENT_CONTRACT,
  AMBIENT_TOKENS,
  ZERO_ADDRESS,
  POOL_IDX,
  RESERVE_FLAGS,
  TIP,
  SLIPPAGE,
} from "../config/config";

export const UNBONDING_PERIOD_BLOCKS = 1200;

// Magma ABI
const magmaAbi = [
  {
    type: "function",
    name: "stake",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
    signature: "0xd5575982",
  },
  {
    type: "function",
    name: "withdrawMon",
    inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

// aPriori ABI
const aPrioriAbi = [
  {
    type: "function",
    name: "deposit",
    inputs: [
      { name: "assets", type: "uint96", internalType: "uint96" },
      { name: "receiver", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "shares", type: "uint96", internalType: "uint96" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "requestRedeem",
    inputs: [
      { name: "shares", type: "uint256", internalType: "uint256" },
      { name: "controller", type: "address", internalType: "address" },
      { name: "owner", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "requestId", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "maxRedeem",
    inputs: [{ name: "owner", type: "address", internalType: "address" }],
    outputs: [{ name: "maxShares", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
] as const;

// Shmonad ABI
const shmonadAbi = [
  {
    type: "function",
    name: "deposit",
    inputs: [
      { name: "assets", type: "uint256", internalType: "uint256" },
      { name: "receiver", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "unbond",
    inputs: [
      { name: "policyID", type: "uint64", internalType: "uint64" },
      { name: "amount", type: "uint256", internalType: "uint256" },
      { name: "newMinBalance", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "unbondBlock", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "claim",
    inputs: [
      { name: "policyID", type: "uint64", internalType: "uint64" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "balanceOfBonded",
    inputs: [
      { name: "policyID", type: "uint64", internalType: "uint64" },
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
] as const;

// Kintsu ABI
// const kintsuAbi = [
//   {
//     type: "function",
//     name: "stake",
//     inputs: [],
//     outputs: [{ name: "newShares", type: "uint128", internalType: "uint128" }],
//     stateMutability: "payable",
//   },
//   {
//     type: "function",
//     name: "requestUnlock",
//     inputs: [{ name: "shares", type: "uint128", internalType: "uint128" }],
//     outputs: [],
//     stateMutability: "nonpayable",
//   },
// ] as const;

const kintsuAbi = [
  {
    type: "function",
    name: "deposit",
    inputs: [
      { name: "assets", type: "uint96", internalType: "uint96" },
      { name: "receiver", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "shares", type: "uint96", internalType: "uint96" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "requestUnlock",
    inputs: [{ name: "shares", type: "uint96", internalType: "uint96" }],
    outputs: [],
    stateMutability: "nonpayable",
  },

  {
    type: "function",
    name: "maxRedeem",
    inputs: [{ name: "owner", type: "address", internalType: "address" }],
    outputs: [{ name: "maxShares", type: "uint96", internalType: "uint96" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint96", internalType: "uint96" }],
    stateMutability: "view",
  },
] as const;

// ERC-20 ABI
const erc20Abi = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "spender", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
] as const;

export function useStake(protocolName: string, amount: string) {
  const { address } = useAccount();
  const protocol = protocols[protocolName as keyof typeof protocols];
  const token = tokens[protocol?.stakedToken as keyof typeof tokens];
  const abi =
    protocolName === "Magma"
      ? magmaAbi
      : protocolName === "aPriori"
      ? aPrioriAbi
      : protocolName === "Shmonad"
      ? shmonadAbi
      : kintsuAbi;

  const { data: allowance, error: allowanceError } = useReadContract({
    address: token?.address as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address || "0x"],
  });

  // const {
  //   writeContract: approve,
  //   error: approveError,
  //   status: approveStatus,
  // } = useWriteContract();

  const {
    writeContract,
    data: txHash,
    error: stakeError,
    status: stakeStatus,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    error: awaitingError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const [gasParams, setGasParams] = useState<{
    gasLimit: bigint;
    maxFeePerGas: bigint;
    maxPriorityFeePerGas: bigint;
  } | null>(null);

  useEffect(() => {
    const fetchGasParams = async () => {
      try {
        const publicClient = getPublicClient(config);
        if (!publicClient) throw new Error("Public client not available");

        const [baseFeePerGas, maxPriorityFeePerGas] = await Promise.all([
          publicClient
            .getBlock()
            .then((block) => block.baseFeePerGas || BigInt(0)),
          publicClient.estimateMaxPriorityFeePerGas(),
        ]);

        const maxFeePerGas = baseFeePerGas + maxPriorityFeePerGas;
        const gasLimit = BigInt(protocolName === "MON" ? 250000 : 200000); // Adjust for native vs token swaps

        setGasParams({
          gasLimit,
          maxFeePerGas,
          maxPriorityFeePerGas,
        });
      } catch (error) {
        console.error("Error fetching gas parameters:", error);
        // setError("Failed to fetch gas parameters");
      }
    };

    fetchGasParams();
  }, [protocolName]);
  const parsedAmount = parseUnits(amount, token?.decimals || 18);

  const needsApproval =
    allowance && amount ? BigInt(allowance.toString()) < parsedAmount : false;

  // const handleStake = async () => {
  //   if (!address || !protocol || !amount) return;

  //   if (needsApproval && token?.address) {
  //     await approve({
  //       address: token.address as `0x${string}`,
  //       abi: erc20Abi,
  //       functionName: "approve",
  //       args: [protocol.address, parseUnits(amount, token.decimals || 18)],
  //     });
  //   }

  //   if (protocolName === "Magma" || protocolName === "Kintsu") {
  //     await stake({
  //       address: protocol.address as `0x${string}`,
  //       abi: abi,
  //       functionName: "stake",
  //       value: parseUnits(amount, token?.decimals || 18),
  //     });
  //   } else if (protocolName === "aPriori") {
  //     await stake({
  //       address: protocol.address as `0x${string}`,
  //       abi: abi,
  //       functionName: "deposit",
  //       args: [parseUnits(amount, token?.decimals || 18), address],
  //     });
  //   } else if (protocolName === "Shmonad") {
  //     await stake({
  //       address: protocol.address as `0x${string}`,
  //       abi: abi,
  //       functionName: "deposit",
  //       args: [parseUnits(amount, token?.decimals || 18), address],
  //     });
  //   }
  // };

  const handleStake = async () => {
    if (!address || !protocol || !amount) return;

    try {
      if (protocolName === "Kintsu") {
        writeContract({
          address: protocol.address as `0x${string}`,
          abi: abi,
          functionName: "deposit",
          args: [parsedAmount, address],
          value: parsedAmount,
        });
      } else if (protocolName === "aPriori") {
        writeContract({
          address: protocol.address as `0x${string}`,
          abi: abi,
          functionName: "deposit",
          args: [parsedAmount, address],
          gas: gasParams?.gasLimit,
          maxFeePerGas: gasParams?.maxFeePerGas,
          maxPriorityFeePerGas: gasParams?.maxPriorityFeePerGas,
        });
      } else if (protocolName === "Shmonad") {
        writeContract({
          address: protocol.address as `0x${string}`,
          abi: abi,
          functionName: "deposit",
          args: [parseUnits(amount, token?.decimals || 18), address],
        });
      }
    } catch (error) {
      console.error("Stake error:", error);
      throw new Error(
        "Stake failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };
  return {
    stake: handleStake,
    needsApproval,
    txHash,
    stakeError,
    awaitingError,
    stakeStatus,
    isConfirming,
    isSuccess,
  };
}

export function useUnstake(protocolName: string, amount: string) {
  const { address } = useAccount();
  const protocol = protocols[protocolName as keyof typeof protocols];
  const token = tokens[protocol?.stakedToken as keyof typeof tokens];
  const abi =
    protocolName === "Magma"
      ? magmaAbi
      : protocolName === "aPriori"
      ? aPrioriAbi
      : protocolName === "Shmonad"
      ? shmonadAbi
      : kintsuAbi;

  const {
    writeContract,
    data: txHash,
    error: unstakeError,
    status: unstakeStatus,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    error: awaitingError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });
  const { writeContract: claimUnstaked } = useWriteContract();
  const parsedAmount = parseUnits(amount, token?.decimals || 18);

  const { data: canClaim } = useReadContract({
    address: protocol?.address as `0x${string}`,
    abi: abi,
    functionName: protocolName === "Shmonad" ? "balanceOfBonded" : "maxRedeem",
    args: address
      ? protocolName === "Shmonad"
        ? [BigInt(4), address as `0x${string}`]
        : [address as `0x${string}`]
      : undefined,
  });

  const handleInitiateUnstake = async () => {
    if (!address || !protocol || !amount) return;

    if (protocolName === "Magma") {
      writeContract({
        address: protocol.address as `0x${string}`,
        abi: abi,
        functionName: "withdrawMon",
        args: [parsedAmount],
      });
    } else if (protocolName === "aPriori") {
      writeContract({
        address: protocol.address as `0x${string}`,
        abi: abi,
        functionName: "requestRedeem",
        args: [parseUnits(amount, token?.decimals || 18), address, address],
      });
    } else if (protocolName === "Shmonad") {
      writeContract({
        address: protocol.address as `0x${string}`,
        abi: abi,
        functionName: "unbond",
        args: [BigInt(4), parseUnits(amount, token?.decimals || 18), BigInt(0)],
      });
    } else if (protocolName === "Kintsu") {
      writeContract({
        address: protocol.address as `0x${string}`,
        abi: abi,
        functionName: "requestUnlock",
        args: [parsedAmount],
      });
    }
  };

  const handleClaimUnstaked = async () => {
    if (!address || !protocol) return;

    if (protocolName === "Shmonad") {
      await claimUnstaked({
        address: protocol.address as `0x${string}`,
        abi: abi,
        functionName: "claim",
        args: [BigInt(4), parseUnits(amount, token?.decimals || 18)],
      });
    }
  };

  return {
    initiateUnstake: handleInitiateUnstake,
    claimUnstaked: handleClaimUnstaked,
    canClaim: !!canClaim,
    txHash,
    unstakeError,
    unstakeStatus,
    isConfirming,
    isSuccess,
  };
}

export function useSwap(fromToken: string, toToken: string, amount: string) {
  const { address, chainId } = useAccount();
  const fromTokenInfo = tokens[fromToken as keyof typeof tokens];
  const toTokenInfo = tokens[toToken as keyof typeof tokens];

  // State for gas estimation, expected output, and errors
  const [gasParams, setGasParams] = useState<{
    gasLimit: bigint;
    maxFeePerGas: bigint;
    maxPriorityFeePerGas: bigint;
  } | null>(null);
  const [expectedOut, setExpectedOut] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Ensure wallet is on Monad Testnet
  // if (chainId !== monadTestnet.id) {
  //   console.warn("Please switch to Monad Testnet (chainId: 10143)");
  //   throw new Error("Wrong network: Please switch to Monad Testnet");
  // }

  // Token approval
  const { data: allowance, error: allowanceError } = useReadContract({
    address: fromTokenInfo?.address as `0x${string}`,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address || "0x", AMBIENT_CONTRACT],
  });

  const {
    writeContract: approve,
    error: approveError,
    status: approveStatus,
  } = useWriteContract();

  const {
    writeContract: swap,
    data: txHash,
    error: swapError,
    status: swapStatus,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    error: awaitingError,
    isPending,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });
  const needsApproval =
    allowance && amount && fromTokenInfo?.address !== ZERO_ADDRESS
      ? BigInt(allowance.toString()) <
        parseUnits(amount, fromTokenInfo?.decimals || 18)
      : false;

  // Gas estimation
  useEffect(() => {
    const fetchGasParams = async () => {
      try {
        const publicClient = getPublicClient(config);
        if (!publicClient) throw new Error("Public client not available");

        const [baseFeePerGas, maxPriorityFeePerGas] = await Promise.all([
          publicClient
            .getBlock()
            .then((block) => block.baseFeePerGas || BigInt(0)),
          publicClient.estimateMaxPriorityFeePerGas(),
        ]);

        const maxFeePerGas = baseFeePerGas + maxPriorityFeePerGas;
        const gasLimit = BigInt(fromToken === "MON" ? 250000 : 200000); // Adjust for native vs token swaps

        setGasParams({
          gasLimit,
          maxFeePerGas,
          maxPriorityFeePerGas,
        });
      } catch (error) {
        console.error("Error fetching gas parameters:", error);
        setError("Failed to fetch gas parameters");
      }
    };

    fetchGasParams();
  }, [fromToken]);

  // Price estimation (placeholder, as Ambient ABI lacks getAmountsOut)
  const getPriceEstimate = useCallback(async () => {
    try {
      if (!address || !fromTokenInfo || !toTokenInfo || !amount) {
        setExpectedOut(BigInt(0));
        setError("Missing required inputs for swap");
        return;
      }

      const amountIn = parseUnits(amount, fromTokenInfo.decimals || 18);
      if (amountIn <= BigInt(0)) {
        setExpectedOut(BigInt(0));
        setError("Amount must be greater than 0");
        return;
      }

      // Placeholder: Assume 1:1 rate with slippage, replace with oracle in production
      const amountOut = Number(amount) * (1 - SLIPPAGE / 100);
      const amountOutWei = parseUnits(
        amountOut.toString(),
        toTokenInfo.decimals || 18
      );
      setExpectedOut(amountOutWei);
      setError(null);
    } catch (error) {
      console.error("Error fetching expected output:", error);
      setExpectedOut(BigInt(0));
      setError("Failed to fetch expected output");
    }
  }, [address, fromTokenInfo, toTokenInfo, amount]);

  useEffect(() => {
    getPriceEstimate();
  }, [getPriceEstimate]);

  const handleSwap = async () => {
    if (!address || !fromTokenInfo || !toTokenInfo || !amount || !gasParams) {
      throw new Error("Missing required parameters for swap");
    }

    if (chainId !== monadTestnet.id) {
      throw new Error("Please switch to Monad Testnet (chainId: 10143)");
    }

    if (expectedOut === null) {
      throw new Error("Failed to fetch expected output amount");
    }

    if (expectedOut === BigInt(0)) {
      throw new Error(
        "Expected output is 0. Please check the token pair or amount."
      );
    }

    try {
      const isNativeIn = fromTokenInfo.address === ZERO_ADDRESS;
      const isBuy =
        toTokenInfo.address === ZERO_ADDRESS ||
        (fromTokenInfo.address !== ZERO_ADDRESS &&
          toTokenInfo.address !== ZERO_ADDRESS &&
          fromToken < toToken);
      const amountInWei = parseUnits(amount, fromTokenInfo.decimals || 18);
      const minOutWei = BigInt(
        Math.floor(Number(expectedOut) * (1 - SLIPPAGE / 100))
      );

      // Approve tokens if necessary
      if (needsApproval && fromTokenInfo.address !== ZERO_ADDRESS) {
        approve({
          address: fromTokenInfo.address as `0x${string}`,
          abi: erc20Abi,
          functionName: "approve",
          args: [AMBIENT_CONTRACT, amountInWei],
          gas: gasParams.gasLimit,
          maxFeePerGas: gasParams.maxFeePerGas,
          maxPriorityFeePerGas: gasParams.maxPriorityFeePerGas,
        });
      }

      // Execute swap
      swap({
        address: AMBIENT_CONTRACT as `0x${string}`,
        abi: AMBIENT_ABI,
        functionName: "userCmd",
        args: [
          fromTokenInfo.address as `0x${string}`,
          toTokenInfo.address as `0x${string}`,
          BigInt(POOL_IDX),
          isBuy,
          isNativeIn,
          amountInWei,
          TIP,
          BigInt(0), // limitPrice
          minOutWei,
          RESERVE_FLAGS,
        ],
        value: isNativeIn ? amountInWei : BigInt(0),
        gas: gasParams.gasLimit,
        maxFeePerGas: gasParams.maxFeePerGas,
        maxPriorityFeePerGas: gasParams.maxPriorityFeePerGas,
      });
    } catch (error) {
      console.error("Swap error:", error);
      console.log("Swap error:", error);
      setError("Swap failed: " + (error instanceof Error ? error.message : ""));
      throw new Error(
        "Swap failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  return {
    swap: handleSwap,
    needsApproval,
    approveError,
    approveStatus,
    txHash,
    swapError,
    swapStatus,
    expectedOut:
      expectedOut && toTokenInfo
        ? formatUnits(expectedOut, toTokenInfo.decimals || 18)
        : null,
    error,
    gasParams,
  };
}
