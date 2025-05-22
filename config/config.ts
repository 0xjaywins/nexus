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
  unbondingPeriod?: string;
  minStakeAmount?: string;
}

export const appConfig = {
  url: "https://nexus-ten-sigma.vercel.app/",
  name: "NEXUS",
};

export const chainConfig = {
  chainId: 10143,
  chainName: "Monad Testnet",
  rpcUrl: "https://rpc.monad.testnet",
  blockExplorer: "https://explorer.monad.testnet",
};

// Ambient DEX Constants
export const AMBIENT_CONTRACT =
  "0x88B96aF200c8a9c35442C8AC6cd3D22695AaE4F0" as const;
export const ZERO_ADDRESS =
  "0x0000000000000000000000000000000000000000" as const;
export const POOL_IDX = 36000;
export const RESERVE_FLAGS = 0;
export const TIP = 0;
export const SLIPPAGE = 1; // 1%

export const AMBIENT_TOKENS: Record<string, Token> = {
  USDT: {
    name: "Tether",
    symbol: "USDT",
    address: "0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D",
    decimals: 6,
    color: "#26A17B",
  },
  USDC: {
    name: "USD Coin",
    symbol: "USDC",
    address: "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea",
    decimals: 6,
    color: "#2775CA",
  },
  WETH: {
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37",
    decimals: 18,
    color: "#627EEA",
  },
  WBTC: {
    name: "Wrapped Bitcoin",
    symbol: "WBTC",
    address: "0xcf5a6076cfa32686c0Df13aBaDa2b40dec133F1d",
    decimals: 8,
    color: "#F7931A",
  },
  SETH: {
    name: "Synthetic Ether",
    symbol: "SETH",
    address: "0x836047a99e11F376522B447bffb6e3495Dd0637c",
    decimals: 18,
    color: "#00A3FF",
  },
};

export const AMBIENT_ABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "authority",
        type: "address",
      },
    ],
    name: "AuthorityTransfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "bytes", name: "input", type: "bytes" },
    ],
    name: "CrocColdCmd",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "bytes", name: "input", type: "bytes" },
    ],
    name: "CrocColdProtocolCmd",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "bytes", name: "input", type: "bytes" },
      {
        indexed: false,
        internalType: "int128",
        name: "baseFlow",
        type: "int128",
      },
      {
        indexed: false,
        internalType: "int128",
        name: "quoteFlow",
        type: "int128",
      },
    ],
    name: "CrocHotCmd",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "bytes", name: "input", type: "bytes" },
      {
        indexed: false,
        internalType: "int128",
        name: "baseFlow",
        type: "int128",
      },
      {
        indexed: false,
        internalType: "int128",
        name: "quoteFlow",
        type: "int128",
      },
    ],
    name: "CrocKnockoutCmd",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "pool", type: "bytes32" },
      { indexed: true, internalType: "int24", name: "tick", type: "int24" },
      { indexed: false, internalType: "bool", name: "isBid", type: "bool" },
      {
        indexed: false,
        internalType: "uint32",
        name: "pivotTime",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "feeMileage",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint160",
        name: "commitEntropy",
        type: "uint160",
      },
    ],
    name: "CrocKnockoutCross",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "bytes", name: "input", type: "bytes" },
      { indexed: false, internalType: "bytes", name: "output", type: "bytes" },
    ],
    name: "CrocMicroBurnAmbient",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "bytes", name: "input", type: "bytes" },
      { indexed: false, internalType: "bytes", name: "output", type: "bytes" },
    ],
    name: "CrocMicroBurnRange",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "bytes", name: "input", type: "bytes" },
      { indexed: false, internalType: "bytes", name: "output", type: "bytes" },
    ],
    name: "CrocMicroMintAmbient",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "bytes", name: "input", type: "bytes" },
      { indexed: false, internalType: "bytes", name: "output", type: "bytes" },
    ],
    name: "CrocMicroMintRange",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "bytes", name: "input", type: "bytes" },
      { indexed: false, internalType: "bytes", name: "output", type: "bytes" },
    ],
    name: "CrocMicroSwap",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "base", type: "address" },
      {
        indexed: true,
        internalType: "address",
        name: "quote",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "poolIdx",
        type: "uint256",
      },
      { indexed: false, internalType: "bool", name: "isBuy", type: "bool" },
      { indexed: false, internalType: "bool", name: "inBaseQty", type: "bool" },
      { indexed: false, internalType: "uint128", name: "qty", type: "uint128" },
      { indexed: false, internalType: "uint16", name: "tip", type: "uint16" },
      {
        indexed: false,
        internalType: "uint128",
        name: "limitPrice",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "minOut",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "reserveFlags",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "int128",
        name: "baseFlow",
        type: "int128",
      },
      {
        indexed: false,
        internalType: "int128",
        name: "quoteFlow",
        type: "int128",
      },
    ],
    name: "CrocSwap",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "bytes", name: "input", type: "bytes" },
      {
        indexed: false,
        internalType: "int128",
        name: "baseFlow",
        type: "int128",
      },
      {
        indexed: false,
        internalType: "int128",
        name: "quoteFlow",
        type: "int128",
      },
    ],
    name: "CrocWarmCmd",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "poolIdx",
        type: "uint256",
      },
    ],
    name: "DisablePoolTemplate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "bool", name: "", type: "bool" }],
    name: "HotPathOpen",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "unitTickCollateral",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "awayTickTol",
        type: "uint16",
      },
    ],
    name: "PriceImproveThresh",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "recv", type: "address" },
    ],
    name: "ProtocolDividend",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "base", type: "address" },
      {
        indexed: true,
        internalType: "address",
        name: "quote",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "poolIdx",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "takeRate",
        type: "uint8",
      },
    ],
    name: "ResyncTakeRate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "bool", name: "", type: "bool" }],
    name: "SafeMode",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint128", name: "liq", type: "uint128" },
    ],
    name: "SetNewPoolLiq",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "poolIdx",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "feeRate",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "tickSize",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "jitThresh",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "knockout",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "oracleFlags",
        type: "uint8",
      },
    ],
    name: "SetPoolTemplate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "takeRate",
        type: "uint8",
      },
    ],
    name: "SetRelayerTakeRate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "takeRate",
        type: "uint8",
      },
    ],
    name: "SetTakeRate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "treasury",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint64",
        name: "startTime",
        type: "uint64",
      },
    ],
    name: "TreasurySet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "proxy",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "proxyIdx",
        type: "uint16",
      },
    ],
    name: "UpgradeProxy",
    type: "event",
  },
  {
    inputs: [],
    name: "acceptCrocDex",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint16", name: "callpath", type: "uint16" },
      { internalType: "bytes", name: "cmd", type: "bytes" },
      { internalType: "bool", name: "sudo", type: "bool" },
    ],
    name: "protocolCmd",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "slot", type: "uint256" }],
    name: "readSlot",
    outputs: [{ internalType: "uint256", name: "data", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "base", type: "address" },
      { internalType: "address", name: "quote", type: "address" },
      { internalType: "uint256", name: "poolIdx", type: "uint256" },
      { internalType: "bool", name: "isBuy", type: "bool" },
      { internalType: "bool", name: "inBaseQty", type: "bool" },
      { internalType: "uint128", name: "qty", type: "uint128" },
      { internalType: "uint16", name: "tip", type: "uint16" },
      { internalType: "uint128", name: "limitPrice", type: "uint128" },
      { internalType: "uint128", name: "minOut", type: "uint128" },
      { internalType: "uint8", name: "reserveFlags", type: "uint8" },
    ],
    name: "swap",
    outputs: [
      { internalType: "int128", name: "baseFlow", type: "int128" },
      { internalType: "int128", name: "quoteFlow", type: "int128" },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint16", name: "callpath", type: "uint16" },
      { internalType: "bytes", name: "cmd", type: "bytes" },
    ],
    name: "userCmd",
    outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint16", name: "callpath", type: "uint16" },
      { internalType: "bytes", name: "cmd", type: "bytes" },
      { internalType: "bytes", name: "conds", type: "bytes" },
      { internalType: "bytes", name: "relayerTip", type: "bytes" },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "userCmdRelayer",
    outputs: [{ internalType: "bytes", name: "output", type: "bytes" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint16", name: "callpath", type: "uint16" },
      { internalType: "bytes", name: "cmd", type: "bytes" },
      { internalType: "address", name: "client", type: "address" },
    ],
    name: "userCmdRouter",
    outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
    stateMutability: "payable",
    type: "function",
  },
] as const;

export const tokens: Record<string, Token> = {
  MON: {
    name: "Monad",
    symbol: "MON",
    address: ZERO_ADDRESS, // Native token
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
    address: "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea",
    decimals: 6,
    color: "#2775CA",
  },
  kUSDC: {
    name: "Kuru USD Coin",
    symbol: "kUSDC",
    address: "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea",
    decimals: 6,
    color: "#00FFEE",
  },
  USDT: {
    name: "Tether",
    symbol: "USDT",
    address: "0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D",
    decimals: 6,
    color: "#26A17B",
  },
  WMON: {
    name: "Wrapped Monad",
    symbol: "WMON",
    address: "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701",
    decimals: 18,
    color: "#FFD700",
  },
  aprMON: {
    name: "aPriori MON",
    symbol: "aprMON",
    address: "0xb2f82D0f38dc453D596Ad40A37799446Cc89274A",
    decimals: 18,
    color: "#00FFEE",
  },
  sMON: {
    name: "Kintsu MON",
    symbol: "sMON",
    address: "0xe1d2439b75fb9746E7Bc6cB777Ae10AA7f7ef9c5",
    decimals: 18,
    color: "#FF00FF",
  },
  magmaMON: {
    name: "Magma MON",
    symbol: "gMON",
    address: "0xaEef2f6B429Cb59C9B2D7bB2141ADa993E8571c3",
    decimals: 18,
    color: "#FF073A",
  },
  DAK: {
    name: "Molandak",
    symbol: "DAK",
    address: "0x0F0BDEbF0F83cD1EE3974779Bcb7315f9808c714",
    decimals: 18,
    color: "#FF00FF",
  },
  CHOG: {
    name: "Chog",
    symbol: "CHOG",
    address: "0xE0590015A873bF326bd645c3E1266d4db41C4E6B",
    decimals: 18,
    color: "#39FF14",
  },
  YAKI: {
    name: "Moyaki",
    symbol: "YAKI",
    address: "0xfe140e1dCe99Be9F4F15d657CD9b7BF622270C50",
    decimals: 18,
    color: "#A0A0A0",
  },
};

export const protocols: Record<string, Protocol> = {
  aPriori: {
    name: "aPriori",
    address: "0xb2f82D0f38dc453D596Ad40A37799446Cc89274A",
    stakedToken: "aprMON",
    description: "Liquid staking protocol with unbonding period",
    unbondingPeriod: "10 minutes",
    minStakeAmount: "1 MON",
  },
  Kintsu: {
    name: "Kintsu",
    address: "0xe1d2439b75fb9746E7Bc6cB777Ae10AA7f7ef9c5",
    stakedToken: "sMON",
    description: "Instant liquid staking with no unbonding",
    unbondingPeriod: "None",
    minStakeAmount: "0.5 MON",
  },
  Magma: {
    name: "Magma",
    address: "0xaEef2f6B429Cb59C9B2D7bB2141ADa993E8571c3",
    stakedToken: "gMON",
    description: "High yield staking with auto-compounding",
    unbondingPeriod: "None",
    minStakeAmount: "1 MON",
  },
  Shmonad: {
    name: "Shmonad",
    address: "0x3a98250F98Dd388C211206983453837C8365BDc1",
    stakedToken: "shMON",
    description: "Governance staking with unbonding period",
    unbondingPeriod: "10 minutes",
    minStakeAmount: "1 MON",
  },
};

export const tailwindConfig = {
  colors: {
    neonCyan: "#00FFEE",
    neonMagenta: "#FF00FF",
    voidBlack: "#0A0A0A",
    offWhite: "#E0E0E0",
    lightGray: "#A0A0A0",
    successGreen: "#39FF14",
    errorRed: "#FF073A",
  },
};

export const notificationConfig = {
  priceAlert: {
    defaultThreshold: 5,
    defaultEnabled: true,
    supportedTokens: ["MON", "shMON", "USDC", "USDT", "WMON"],
  },
  trendingAlert: {
    defaultEnabled: true,
    minFollows: 10,
  },
};

export const kuruConfig = {
  apiEndpoint: "https://api.testnets.kuru.io/",
};
