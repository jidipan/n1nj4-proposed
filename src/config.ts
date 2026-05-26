// NFT 项目配置文件 (Injective Mainnet)
export const config = {
  // NFT 合约配置
  nft: {
    contractAddress: "0x816070929010A3D202D8A6B89f92BeE33B7e8769",
    maxSupply: 500,
    maxPerWallet: 1,
    name: "NINJ4",
    symbol: "NINJ4",
    description: "NINJ4 limited collection",
  },

  // Injective 主网配置
  chain: {
    chainId: "injective-1",
    evmChainId: 1776,
    node: "https://sentry.evm-rpc.injective.network/",
    name: "Injective Mainnet",
    explorer: "https://blockscout.injective.network",
  },

  // 应用配置
  app: {
    name: "N1NJ4 NFT",
    description: "N1NJ4 NFT Collection on Injective",
    links: {
      twitter: "https://x.com/ninjalabscn",
      github: "https://github.com/Ninja-Labs-CN",
    },
  },
};

export default config;
