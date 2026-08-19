export type OpenRepoStatus = "LIVE" | "DEMO" | "STARTER" | "TUTORIAL";

export type OpenRepo = {
  title: string;
  description: string;
  descriptionZh?: string;
  descriptionEn?: string;
  imageSrc: string;
  tags: string[];
  githubRepo: string;
  status?: OpenRepoStatus;
  starCount?: number;
};

// Curated display order. Add future repos at the top so City Zero's limited preview
// remains current while the archive keeps every entry.
export const OPEN_REPOS: OpenRepo[] = [
  {
    title: "N1NJ4 Website",
    description: "Production frontend for N1NJ4 and City Zero, bringing together on-chain identity, the NFT gallery, City Dispatch, events, and community project discovery.",
    descriptionZh: "N1NJ4 与 City Zero 的生产网站前端，整合链上身份、NFT Gallery、City Dispatch、活动与社区项目入口。",
    descriptionEn: "Production frontend for N1NJ4 and City Zero, bringing together on-chain identity, the NFT gallery, City Dispatch, events, and community project discovery.",
    imageSrc: "/optimized/repos/n1nj4-960-v1.webp",
    tags: ["React", "TypeScript", "Injective"],
    githubRepo: "Ninja-Labs-Devs/NinjaNFTFrontend-v2",
    status: "LIVE",
  },
  {
    title: "Star Office UI",
    description: "A pixel office for OpenClaw and AI agents, turning work states into a real-time visual space with multi-agent support and Injective EVM wallet integration.",
    descriptionZh: "面向 OpenClaw 与 AI Agent 的像素办公室，将工作状态转化为实时可视化空间，并支持 Injective EVM 钱包与多 Agent 协作。",
    descriptionEn: "A pixel office for OpenClaw and AI agents, turning work states into a real-time visual space with multi-agent support and Injective EVM wallet integration.",
    imageSrc: "/optimized/repos/star-office-960-v1.webp",
    tags: ["OpenClaw", "Python", "Injective"],
    githubRepo: "Ninja-Labs-Devs/Star-Office-UI-INJ",
    status: "DEMO",
  },
  {
    title: "USDC CCTP Demo",
    description: "A developer education dApp demonstrating native two-way USDC transfers between Injective EVM Testnet and Ethereum Sepolia using Circle CCTP.",
    descriptionZh: "面向开发者的 CCTP 教育型 dApp，演示 USDC 在 Injective EVM Testnet 与 Ethereum Sepolia 之间的双向原生跨链转移。",
    descriptionEn: "A developer education dApp demonstrating native two-way USDC transfers between Injective EVM Testnet and Ethereum Sepolia using Circle CCTP.",
    imageSrc: "/repo-covers/usdc-cctp.svg",
    tags: ["React", "CCTP", "EVM"],
    githubRepo: "Ninja-Labs-Devs/usdc-cctp-injective-demo",
    status: "DEMO",
  },
  {
    title: "React Injective Starter",
    description: "A React starter for Injective EVM dApps with wallet connectivity, USDC vault interactions, wagmi, viem, and an MCP integration path.",
    descriptionZh: "面向 Injective EVM dApp 的 React 启动模板，包含钱包连接、USDC Vault 交互、wagmi、viem 与 MCP 接入路径。",
    descriptionEn: "A React starter for Injective EVM dApps with wallet connectivity, USDC vault interactions, wagmi, viem, and an MCP integration path.",
    imageSrc: "/repo-covers/react-starter.svg",
    tags: ["React", "Wagmi", "USDC"],
    githubRepo: "Ninja-Labs-Devs/react-injective-template",
    status: "STARTER",
  },
  {
    title: "Vue Injective Starter",
    description: "A Vue 3 starter for Injective EVM dApps with wallet connection, network switching, and reusable USDC vault flows.",
    descriptionZh: "面向 Injective EVM dApp 的 Vue 3 启动模板，提供钱包连接、网络切换和可复用的 USDC Vault 交互流程。",
    descriptionEn: "A Vue 3 starter for Injective EVM dApps with wallet connection, network switching, and reusable USDC vault flows.",
    imageSrc: "/repo-covers/vue-starter.svg",
    tags: ["Vue", "Viem", "USDC"],
    githubRepo: "Ninja-Labs-Devs/vue-injective-template",
    status: "STARTER",
  },
  {
    title: "Vibe Code Starter",
    description: "An AI-assisted coding workspace configured for building Injective projects with Roo Code, project context, and reusable development instructions.",
    descriptionZh: "为 Injective 项目配置的 AI 辅助开发工作区，整合 Roo Code、项目上下文与可复用的开发指令。",
    descriptionEn: "An AI-assisted coding workspace configured for building Injective projects with Roo Code, project context, and reusable development instructions.",
    imageSrc: "/repo-covers/vibe-code.svg",
    tags: ["AI", "Roo Code", "Injective"],
    githubRepo: "Ninja-Labs-Devs/vibe-code-inj-starter",
    status: "STARTER",
  },
  {
    title: "AdventureX NFT Demo",
    description: "A cyberpunk NFT demo prepared for AdventureX, pairing an interactive minting frontend with an Injective EVM contract project.",
    descriptionZh: "为 AdventureX 制作的赛博朋克 NFT 演示项目，将交互式铸造前端与 Injective EVM 合约工程组合在一起。",
    descriptionEn: "A cyberpunk NFT demo prepared for AdventureX, pairing an interactive minting frontend with an Injective EVM contract project.",
    imageSrc: "/repo-covers/adventurex-nft.svg",
    tags: ["Next.js", "NFT", "EVM"],
    githubRepo: "Ninja-Labs-Devs/advx-nft-demo",
    status: "DEMO",
  },
  {
    title: "EVM Hello World",
    description: "A guided first project for EVM developers covering funding, compilation, testing, deployment, verification, and contract interaction on Injective.",
    descriptionZh: "面向 EVM 开发者的 Injective 入门项目，覆盖账户准备、编译、测试、部署、验证与合约交互。",
    descriptionEn: "A guided first project for EVM developers covering funding, compilation, testing, deployment, verification, and contract interaction on Injective.",
    imageSrc: "/repo-covers/evm-hello-world.svg",
    tags: ["Hardhat", "Solidity", "EVM"],
    githubRepo: "Ninja-Labs-Devs/evm-hello-world-inj",
    status: "TUTORIAL",
  },
  {
    title: "Hardhat Injective Starter",
    description: "A lean Hardhat scaffold for compiling, testing, deploying, verifying, and interacting with Solidity contracts on Injective EVM Testnet.",
    descriptionZh: "面向 Injective EVM Testnet 的轻量 Hardhat 脚手架，覆盖 Solidity 合约的编译、测试、部署、验证与交互。",
    descriptionEn: "A lean Hardhat scaffold for compiling, testing, deploying, verifying, and interacting with Solidity contracts on Injective EVM Testnet.",
    imageSrc: "/repo-covers/hardhat-starter.svg",
    tags: ["Hardhat", "Solidity", "EVM"],
    githubRepo: "Ninja-Labs-Devs/hardhat-injective-template",
    status: "STARTER",
  },
  {
    title: "Foundry Injective Starter",
    description: "A minimal Foundry workflow for building, testing, deploying, verifying, and interacting with smart contracts on Injective EVM.",
    descriptionZh: "面向 Injective EVM 的精简 Foundry 工作流，支持智能合约构建、测试、部署、验证与交互。",
    descriptionEn: "A minimal Foundry workflow for building, testing, deploying, verifying, and interacting with smart contracts on Injective EVM.",
    imageSrc: "/repo-covers/foundry-starter.svg",
    tags: ["Foundry", "Solidity", "EVM"],
    githubRepo: "Ninja-Labs-Devs/foundry-injective-template",
    status: "STARTER",
  },
];
