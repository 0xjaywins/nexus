import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { createConfig, http, WagmiProvider } from "wagmi";
import { monadTestnet } from "wagmi/chains";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { injected, walletConnect } from "wagmi/connectors";
export const config = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(),
  },
  connectors: [farcasterFrame()],
});

// export const config = createConfig({
//   chains: [monadTestnet],
//   transports: {
//     [monadTestnet.id]: http(),
//   },
//   connectors: [
//     farcasterFrame(),
//     injected({ target: "metaMask" }),
//     walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID }),
//   ],
// });

const queryClient = new QueryClient();

export default function FrameWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
