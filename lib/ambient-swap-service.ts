// import { createPublicClient, createWalletClient, custom, http } from "viem";
// import { monadTestnet } from "viem/chains";
// import { encodeFunctionData, parseUnits } from "viem";
// import { CrocEnv, toDisplayQty } from "@crocswap-libs/sdk";
// import { erc20Abi } from "./abi/erc20";
// import { config } from "./wagmi-config"; // Import wagmi config

// const ambientDexAbi = [
//   {
//     name: "swap",
//     type: "function",
//     stateMutability: "payable",
//     inputs: [
//       { name: "base", type: "address" },
//       { name: "quote", type: "address" },
//       { name: "poolIdx", type: "uint256" },
//       { name: "isBuy", type: "bool" },
//       { name: "inBaseQty", type: "bool" },
//       { name: "qty", type: "uint128" },
//       { name: "tip", type: "uint16" },
//       { name: "limitPrice", type: "uint128" },
//       { name: "minOut", type: "uint128" },
//       { name: "reserveFlags", type: "uint8" },
//     ],
//     outputs: [],
//   },
// ] as const;

// const crocImpactAbi = [
//   {
//     name: "calcImpact",
//     type: "function",
//     stateMutability: "view",
//     inputs: [
//       { name: "base", type: "address" },
//       { name: "quote", type: "address" },
//       { name: "poolIdx", type: "uint256" },
//       { name: "isBuy", type: "bool" },
//       { name: "inBaseQty", type: "bool" },
//       { name: "qty", type: "uint128" },
//       { name: "tip", type: "uint16" },
//       { name: "limitPrice", type: "uint128" },
//     ],
//     outputs: [
//       { name: "baseFlow", type: "int128" },
//       { name: "quoteFlow", type: "int128" },
//       { name: "finalPrice", type: "uint128" },
//     ],
//   },
// ] as const;

// export class AmbientSwapService {
//   public contractAddress: `0x${string}` =
//     "0x88B96aF200c8a9c35442C8AC6cd3D22695AaE4F0";
//   public crocImpactAddress: `0x${string}` = "0xYourCrocImpactAddressHere"; // Replace with actual address
//   private crocEnv: CrocEnv;
//   private publicClient = createPublicClient({
//     chain: monadTestnet,
//     transport: http(),
//   });
//   private walletClient = createWalletClient({
//     chain: monadTestnet,
//     transport: custom(window.ethereum!),
//   });

//   constructor() {
//     if (!window.ethereum) {
//       throw new Error(
//         "No wallet provider detected. Please install MetaMask or use Warpcast."
//       );
//     }

//     this.crocEnv = new CrocEnv(
//       "https://rpc.testnet.monad.xyz",
//       this.walletClient
//   }

//   async swap(
//     params: {
//       base: `0x${string}`;
//       quote: `0x${string}`;
//       poolIdx: bigint;
//       isBuy: boolean;
//       inBaseQty: boolean;
//       qty: bigint;
//       tip: bigint;
//       limitPrice: bigint;
//       minOut: bigint;
//       reserveFlags: number;
//     },
//     isNative: boolean,
//     gasOptions: { maxPriorityFeePerGas: bigint; gasLimit?: bigint }
//   ): Promise<`0x${string}`> {
//     try {
//       const {
//         base,
//         quote,
//         poolIdx,
//         isBuy,
//         inBaseQty,
//         qty,
//         tip,
//         limitPrice,
//         minOut,
//         reserveFlags,
//       } = params;

//       if (!this.isValidAddress(base) || !this.isValidAddress(quote)) {
//         throw new Error("Invalid base or quote token address");
//       }

//       const impact = await this.calcImpact({
//         base,
//         quote,
//         poolIdx,
//         isBuy,
//         inBaseQty,
//         qty,
//         tip,
//         limitPrice,
//       });
//       if (impact.quoteFlow < minOut) {
//         throw new Error("Price impact too high: insufficient output amount");
//       }

//       const accounts = await window.ethereum.request({
//         method: "eth_requestAccounts",
//       });
//       if (!accounts || accounts.length === 0) {
//         throw new Error("No accounts available. Please connect a wallet.");
//       }
//       const account = accounts[0] as `0x${string}`;

//       const tx = await this.walletClient.writeContract({
//         address: this.contractAddress,
//         abi: ambientDexAbi,
//         functionName: "swap",
//         args: [
//           base,
//           quote,
//           poolIdx,
//           isBuy,
//           inBaseQty,
//           qty,
//           tip,
//           limitPrice,
//           minOut,
//           reserveFlags,
//         ],
//         account,
//         value: isNative ? qty : BigInt(0),
//         chain: monadTestnet,
//         maxPriorityFeePerGas: gasOptions.maxPriorityFeePerGas,
//         gas: gasOptions.gasLimit || BigInt(250000),
//       });

//       return tx;
//     } catch (err) {
//       throw err instanceof Error ? err : new Error("Swap transaction failed");
//     }
//   }

//   async calcImpact(params: {
//     base: `0x${string}`;
//     quote: `0x${string}`;
//     poolIdx: bigint;
//     isBuy: boolean;
//     inBaseQty: boolean;
//     qty: bigint;
//     tip: bigint;
//     limitPrice: bigint;
//   }): Promise<{ baseFlow: bigint; quoteFlow: bigint; finalPrice: bigint }> {
//     try {
//       const { base, quote, poolIdx, isBuy, inBaseQty, qty, tip, limitPrice } =
//         params;
//       const context = await this.crocEnv.context();
//       const [baseFlow, quoteFlow, finalPrice] = await context.dex.query(
//         "calcImpact",
//         [base, quote, poolIdx, isBuy, inBaseQty, qty, tip, limitPrice]
//       );
//       return {
//         baseFlow: BigInt(baseFlow),
//         quoteFlow: BigInt(quoteFlow),
//         finalPrice: BigInt(finalPrice),
//       };
//     } catch (err) {
//       throw new Error("Failed to calculate price impact");
//     }
//   }

//   async getPoolLiquidity(
//     base: string,
//     quote: string,
//     poolIdx: number
//   ): Promise<bigint> {
//     try {
//       const liquidity = await this.crocEnv
//         .pool(base, quote, poolIdx)
//         .xykLiquidity();
//       return BigInt(liquidity.toString());
//     } catch (err) {
//       throw new Error("Failed to fetch pool liquidity");
//     }
//   }

//   async approveToken(
//     tokenAddress: string,
//     amount: bigint
//   ): Promise<`0x${string}`> {
//     try {
//       const data = encodeFunctionData({
//         abi: erc20Abi,
//         functionName: "approve",
//         args: [this.contractAddress, amount],
//       });

//       const accounts = await window.ethereum.request({
//         method: "eth_requestAccounts",
//       });
//       if (!accounts || accounts.length === 0) {
//         throw new Error("No accounts available. Please connect a wallet.");
//       }
//       const account = accounts[0] as `0x${string}`;

//       const tx = await this.walletClient.sendTransaction({
//         account,
//         to: tokenAddress as `0x${string}`,
//         data,
//         chain: monadTestnet,
//         maxPriorityFeePerGas: parseUnits("3", 9),
//         gas: BigInt(100000),
//       });

//       return tx;
//     } catch (err) {
//       throw new Error("Token approval failed");
//     }
//   }

//   async getCurrentGasPrice(): Promise<{
//     slow: bigint;
//     average: bigint;
//     fast: bigint;
//   }> {
//     try {
//       const baseGasPrice = await this.publicClient.getGasPrice();
//       return {
//         slow: baseGasPrice,
//         average: (baseGasPrice * BigInt(120)) / BigInt(100),
//         fast: (baseGasPrice * BigInt(150)) / BigInt(100),
//       };
//     } catch (err) {
//       throw new Error("Failed to fetch gas prices");
//     }
//   }

//   private isValidAddress(address: string): boolean {
//     return /^0x[a-fA-F0-9]{40}$/.test(address);
//   }
// }
