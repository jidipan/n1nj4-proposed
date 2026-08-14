import type { Builder, ContributionEvent } from "../domain/types";

export const INITIAL_BUILDERS: Builder[] = [
  { id: "ada", displayName: "Ada Lin", handle: "ada.injective", score: 140, status: "active", accentColor: 0xf47e58, specialty: "Smart contracts" },
  { id: "akira", displayName: "Akira", handle: "akira.zero", score: 820, status: "active", accentColor: 0x5576d9, specialty: "Protocol design" },
  { id: "echo", displayName: "Echo", handle: "echo.agent", score: 72, status: "active", accentColor: 0x50a69b, specialty: "AI agents" },
  { id: "hana", displayName: "Hana Mori", handle: "hana.docs", score: 320, status: "active", accentColor: 0xc96f9c, specialty: "Developer education" },
  { id: "jin", displayName: "Jin", handle: "jin.inj", score: 48, status: "dormant", accentColor: 0xd19743, specialty: "Data tooling" },
  { id: "kaze", displayName: "Kaze", handle: "kaze.n1nj4", score: 480, status: "active", accentColor: 0xe75f48, specialty: "Frontend systems" },
  { id: "luna", displayName: "Luna Park", handle: "luna.research", score: 55, status: "active", accentColor: 0x9c74c7, specialty: "Protocol research" },
  { id: "marek", displayName: "Marek", handle: "marek.index", score: 275, status: "active", accentColor: 0x3e91a8, specialty: "Indexing" },
  { id: "mika", displayName: "Mika", handle: "mika.builds", score: 1160, status: "active", accentColor: 0x566bb8, specialty: "Infrastructure" },
  { id: "noa", displayName: "Noa", handle: "noa.city", score: 210, status: "active", accentColor: 0x6f9d57, specialty: "Community tools" },
  { id: "nova", displayName: "Nova Chen", handle: "nova.wallet", score: 530, status: "active", accentColor: 0xdc6f86, specialty: "Wallet UX" },
  { id: "omar", displayName: "Omar", handle: "omar.security", score: 1080, status: "dormant", accentColor: 0x8a704e, specialty: "Security reviews" },
  { id: "priya", displayName: "Priya Shah", handle: "priya.nodes", score: 760, status: "active", accentColor: 0x4d8f7a, specialty: "Node operations" },
  { id: "quinn", displayName: "Quinn", handle: "quinn.tools", score: 25, status: "dormant", accentColor: 0xd39d55, specialty: "CLI tooling" },
  { id: "rei", displayName: "Rei", handle: "rei.cityzero", score: 690, status: "dormant", accentColor: 0x8f68b8, specialty: "Identity" },
  { id: "riku", displayName: "Riku Tan", handle: "riku.compute", score: 1450, status: "active", accentColor: 0x3f79b5, specialty: "ZK compute" },
  { id: "sora", displayName: "Sora", handle: "sora.evm", score: 1510, status: "active", accentColor: 0x2d7894, specialty: "EVM tooling" },
  { id: "tala", displayName: "Tala", handle: "tala.design", score: 95, status: "active", accentColor: 0xea8f70, specialty: "Product design" },
  { id: "yuki", displayName: "Yuki", handle: "yuki.ops", score: 295, status: "active", accentColor: 0x699e8b, specialty: "Automation" },
  { id: "zane", displayName: "Zane Wu", handle: "zane.runtime", score: 1850, status: "active", accentColor: 0x385f86, specialty: "Runtime engineering" },
];

export const DEMO_EVENTS: ContributionEvent[] = [
  { id: "event-1", builderId: "ada", projectName: "Identity SDK", description: "Merged the first public identity query helper.", points: 40 },
  { id: "event-2", builderId: "kaze", projectName: "City Interface", description: "Shipped the responsive builder profile panel.", points: 60 },
  { id: "event-3", builderId: "yuki", projectName: "Agent Ops", description: "Completed the verified deployment workflow.", points: 35 },
  { id: "event-4", builderId: "echo", projectName: "AI Residency", description: "Registered an agent capability manifest.", points: 85 },
];
