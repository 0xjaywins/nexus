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

export const tokens: Record<string, Token> = {
  MON: {
    name: "Monad",
    symbol: "MON",
    address: "0xMON...",
    decimals: 18,
    color: "#FFD700",
  },
  shMON: {
    name: "Shmonad",
    symbol: "shMON",
    address: "0x3a98250F98Dd388C211206983453837C8365BDc1",
    decimals: 18,
    color: "#FF4D4D",
  },
  USDC: {
    name: "USD Coin",
    symbol: "USDC",
    address: "0xUSDC...",
    decimals: 6,
    color: "#2775CA",
  },
  USDT: {
    name: "Tether",
    symbol: "USDT",
    address: "0xUSDT...",
    decimals: 6,
    color: "#26A17B",
  },
  WMON: {
    name: "Wrapped Monad",
    symbol: "WMON",
    address: "0xWMON...",
    decimals: 18,
    color: "#FFD700",
  },
  aprMON: {
    name: "aPriori MON",
    symbol: "aprMON",
    address: "0xAPRMON...",
    decimals: 18,
    color: "#00FFEE",
  },
  sMON: {
    name: "Kintsu MON",
    symbol: "sMON",
    address: "0xSMON...",
    decimals: 18,
    color: "#FF00FF",
  },
  magmaMON: {
    name: "Magma MON",
    symbol: "magmaMON",
    address: "0xaEef2f6B429Cb59C9B2D7bB2141ADa993E8571c3",
    decimals: 18,
    color: "#FF073A",
  },
};

export const protocols: Record<string, Protocol> = {
  aPriori: {
    name: "aPriori",
    address: "0xb2f82D0f38dc453D596Ad40A37799446Cc89274A",
    stakedToken: "aprMON",
    description: "Liquid staking protocol with unbonding period",
  },
  Kintsu: {
    name: "Kintsu",
    address: "0xE36A24Be4b16aF43c1e2B2c6C7bA6EAC6b1d9A9A",
    stakedToken: "sMON",
    description: "Instant liquid staking with no unbonding",
  },
  Magma: {
    name: "Magma",
    address: "0x8c9CdA9e4aF40bA32F5768D7C42e9bD9e7C2b9A5",
    stakedToken: "magmaMON",
    description: "High yield staking with auto-compounding",
  },
  Shmonad: {
    name: "Shmonad",
    address: "0x3a98250F98Dd388C211206983453837C8365BDc1",
    stakedToken: "shMON",
    description: "Governance staking with unbonding period",
  },
};

export const chainConfig = {
  chainId: 10143,
  chainName: "Monad Testnet",
  rpcUrl: "https://rpc.monad.testnet",
  blockExplorer: "https://explorer.monad.testnet",
};
