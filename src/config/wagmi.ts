import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { defineChain } from "viem";
import config from "../config";

// 定义 Injective EVM 主网
export const injectiveMainnet = defineChain({
  id: config.chain.evmChainId,
  name: config.chain.name,
  nativeCurrency: {
    decimals: 18,
    name: "Injective",
    symbol: "INJ",
  },
  rpcUrls: {
    default: {
      http: [config.chain.node],
    },
  },
  blockExplorers: {
    default: {
      name: "Injective Explorer",
      url: config.chain.explorer,
    },
  },
});

// 创建 wagmi 配置 (仅主网)
export const wagmiConfig = getDefaultConfig({
  appName: config.app.name,
  projectId: "3a8170812b534d0ff9d794f19a901d64",
  chains: [injectiveMainnet],
  ssr: false,
  transports: {
    [injectiveMainnet.id]: http(),
  },
});
