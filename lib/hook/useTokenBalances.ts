"use client";

import { useAccount, useBalance, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { tokens } from "../../config/config";

// ERC-20 ABI for balanceOf
const erc20Abi = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export default function useTokenBalances() {
  const { address } = useAccount();

  // Define static token list to ensure consistent hook calls
  const tokenList = Object.keys(tokens).map((token) => ({
    symbol: token,
    address: tokens[token as keyof typeof tokens].address,
    decimals: tokens[token as keyof typeof tokens].decimals,
  }));

  // Fetch native balance (MON)
  const {
    data: nativeBalance,
    error: nativeError,
    isLoading: nativeLoading,
  } = useBalance({
    address,
    chainId: 10143, // Monad Testnet
  });

  // Fetch ERC-20 balances for each token
  const balanceResults = tokenList.map((token) => {
    // Skip native token (MON) or invalid addresses
    if (
      token.address === "0x0000000000000000000000000000000000000000" ||
      token.address === "0x10143MON..." ||
      !token.address
    ) {
      return {
        token: token.symbol,
        balance: "0",
        error: null,
        isLoading: false,
      };
    }

    const {
      data: balance,
      error,
      isLoading,
    } = useReadContract({
      address: token.address as `0x${string}`,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address || "0x"],
      chainId: 10143,
    });

    return {
      token: token.symbol,
      balance: balance
        ? formatUnits(BigInt(balance.toString()), token.decimals)
        : "0",
      error,
      isLoading,
    };
  });

  // Combine native and ERC-20 balances
  const allBalances = [
    {
      token: "MON",
      balance: nativeBalance ? formatUnits(nativeBalance.value, 18) : "0",
      error: nativeError,
      isLoading: nativeLoading,
    },
    ...balanceResults.filter((b) => b.token !== "MON"),
  ];

  // Determine loading and error states
  const isLoading = !address || allBalances.some((b) => b.isLoading);
  const error = !tokens
    ? "Token configuration unavailable"
    : !address
    ? "Wallet address not connected"
    : allBalances.find((b) => b.error)?.error || null;

  return {
    balances: allBalances,
    isLoading,
    error,
  };
}
