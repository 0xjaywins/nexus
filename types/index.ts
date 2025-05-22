// /types/index.ts
export interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number };
  disableForReducedMotion?: boolean;
  [key: string]: any;
}

export type ConfettiFunction = (options?: ConfettiOptions) => void;

export interface EthereumProvider {
  isMetaMask?: boolean;
  isTrust?: boolean;
  isCoinbaseWallet?: boolean;
  [key: string]: any;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider & any; // Make optional to match cbw-sdk
  }
}

export interface Token {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  icon?: string;
  color: string;
}

export interface Protocol {
  name: string;
  address: string;
  stakedToken: string;
  description: string;
  icon?: string;
}

// Farcaster SDK Types
export type FrameNotificationDetails = { url: string; token: string };
export type SafeAreaInsets = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type LocationContext =
  | { type: "cast_embed"; embed: string; cast: { fid: number; hash: string } }
  | {
      type: "notification";
      notification: { notificationId: string; title: string; body: string };
    }
  | { type: "launcher" }
  | {
      type: "channel";
      channel: { key: string; name: string; imageUrl?: string };
    };

export type ClientContext = {
  clientFid: number;
  added: boolean;
  notificationDetails?: FrameNotificationDetails;
  safeAreaInsets?: SafeAreaInsets;
};

export interface WarpcastUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

export interface FrameContext {
  user: WarpcastUser;
  location?: LocationContext;
  client: ClientContext;
}

export interface FarcasterActions {
  ready?: (options?: Record<string, any>) => Promise<void>;
  close?: () => Promise<void>;
  viewProfile?: (fid: number) => Promise<void>;
  viewToken?: (token: string) => Promise<void>;
  sendToken?: (params: {
    token: string;
    amount: string;
    recipientFid: number;
  }) => Promise<{ transaction: `0x${string}` }>;
  swapToken?: (params: {
    tokenIn: string;
    tokenOut: string;
    amount: string;
  }) => Promise<{ transaction: `0x${string}` }>;
}

export interface FarcasterContextResult {
  context: FrameContext;
  actions: FarcasterActions | null;
  isEthProviderAvailable: boolean;
  user: WarpcastUser;
  showSplash: boolean;
}

export interface NoContextResult {
  type: null;
  context: null;
  actions: null;
  isEthProviderAvailable: boolean;
  user: null;
  showSplash: boolean;
}

export type ContextResult = FarcasterContextResult | NoContextResult;

export interface ChainConfig {
  chainId: number;
  chainName: string;
  rpcUrl: string;
  blockExplorer: string;
}

export type WithChildren<T = {}> = T & { children: React.ReactNode };
export type ClassNameProp = { className?: string };
