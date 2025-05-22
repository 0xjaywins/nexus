"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { monadTestnet, chainConfig } from "./chains"; // Import from chains.ts
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { injected } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const config = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(chainConfig.rpcUrl), // Use the specific RPC URL
  },
  connectors: [
    injected({ target: "metaMask" }),
    farcasterFrame(), // Re-added for Warpcast Mini App
  ],
  // Ensure the app defaults to Monad Testnet
});

export function WagmiProviderWithConfig({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
