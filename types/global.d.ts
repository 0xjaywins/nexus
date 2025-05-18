interface EthereumProvider {
  isMetaMask?: boolean;
  isTrust?: boolean;
  isCoinbaseWallet?: boolean;
  [key: string]: any;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}
