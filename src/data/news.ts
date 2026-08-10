/* ====================================================================
 * News data · CITY DISPATCH
 * --------------------------------------------------------------------
 * Bilingual editorial summaries for Ninja Labs, partner communities,
 * and the wider Injective ecosystem. Full articles remain at source.
 * ==================================================================== */

export type NewsCat =
  | "dev"
  | "trading"
  | "content"
  | "media"
  | "news"
  | "event"
  | "research"
  | "story";

export type NewsSection = "latest" | "storyline" | "insight" | "archive";
export type NewsStatus = "active" | "ended" | "recap" | "evergreen";

export interface NewsItem {
  id: string;
  catKey: NewsCat;
  category: { zh: string; en: string };
  source: { zh: string; en: string };
  date: string;
  publishedAt: string;
  url?: string;
  title: { zh: string; en: string };
  summary: { zh: string; en: string };
  image?: string;
  imageLabel: { zh: string; en: string };
  sections: NewsSection[];
  status: NewsStatus;
  series?: "nova-program";
  featuredRank?: 1 | 2 | 3;
  originalLanguage?: "zh" | "en";
  originalAuthor?: { zh: string; en: string };
}

const cat = {
  dev: { zh: "开发", en: "Dev" },
  trading: { zh: "交易", en: "Trading" },
  content: { zh: "内容", en: "Content" },
  media: { zh: "媒体", en: "Media" },
  news: { zh: "生态", en: "Ecosystem" },
  event: { zh: "活动", en: "Event" },
  research: { zh: "研究", en: "Research" },
  story: { zh: "故事", en: "Story" },
} as const;

export const NEWS: NewsItem[] = [
  {
    id: "injective-co-learning-camps-2026",
    catKey: "dev",
    category: cat.dev,
    source: { zh: "HackQuest × Injective", en: "HackQuest × Injective" },
    date: "2026.07 – 08",
    publishedAt: "2026-08-10",
    url: "https://www.hackquest.io/co-learning",
    title: {
      zh: "Injective 共学营扩展至印度、印度尼西亚与非洲",
      en: "Injective Co-Learning Camps Expand Across India, Indonesia, and Africa",
    },
    summary: {
      zh: "HackQuest 与 Injective 在印度、印度尼西亚和非洲陆续开展区域共学营，带领开发者从 Web3 基础进入 Solidity、Rust、CosmWasm、Injective SDK 与测试网项目实践。三地课程现已进入毕业展示或阶段性收官。",
      en: "HackQuest and Injective brought regional co-learning camps to India, Indonesia, and Africa, guiding developers from Web3 fundamentals through Solidity, Rust, CosmWasm, the Injective SDK, and testnet projects. The three cohorts have reached their graduation showcases or closing stages.",
    },
    image: "/optimized/news/hackquest-co-learning-camps-1280-v1.webp",
    imageLabel: { zh: "HackQuest 共学营", en: "HackQuest Co-Learning Camps" },
    sections: ["latest", "storyline"],
    status: "recap",
    featuredRank: 2,
    originalLanguage: "en",
    originalAuthor: { zh: "HackQuest", en: "HackQuest" },
  },
  {
    id: "injective-global-cup-project-showcase",
    catKey: "event",
    category: cat.event,
    source: {
      zh: "HackQuest × Injective × Ninja Labs",
      en: "HackQuest × Injective × Ninja Labs",
    },
    date: "2026.08.06",
    publishedAt: "2026-08-06",
    url: "https://x.com/HackQuest_/status/2085285455990346114",
    title: {
      zh: "Injective Global Cup：127 位建设者把世界杯带上链",
      en: "Injective Global Cup: 127 Builders Took the World Cup Onchain",
    },
    summary: {
      zh: "HackQuest 发布 Global Cup 赛后专题，回顾 127 位参与者在 24 天内围绕 x402、CCTP、MCP Server 与 Agent Skills 打造的世界杯链上产品，并集中展示获奖项目与代表性作品。",
      en: "HackQuest's Global Cup retrospective covers 127 participants building World Cup products over 24 days with x402, CCTP, MCP Server, and Agent Skills, while spotlighting the winners and other notable submissions.",
    },
    image: "/optimized/news/hackquest-global-cup-projects-1280-v1.webp",
    imageLabel: { zh: "Injective Global Cup 赛后专题", en: "Injective Global Cup retrospective" },
    sections: ["latest", "storyline"],
    status: "recap",
    featuredRank: 1,
    originalLanguage: "en",
    originalAuthor: { zh: "HackQuest", en: "HackQuest" },
  },
  {
    id: "global-cup-ama-champions-playbook",
    catKey: "event",
    category: cat.event,
    source: { zh: "HackQuest × HackQuest India", en: "HackQuest × HackQuest India" },
    date: "2026.07.24",
    publishedAt: "2026-07-23",
    url: "https://x.com/HackQuest_/status/2080099568289751386",
    title: {
      zh: "Global Cup AMA：iClash 与 InjectOS 分享冠军构建手册",
      en: "Global Cup AMA: iClash and InjectOS Share the Champions' Playbook",
    },
    summary: {
      zh: "HackQuest 围绕 Global Cup 举办技术 AMA，邀请 iClash 与 InjectOS 建设者分享选择 Injective 的原因、参赛策略和产品经验，并讲解 x402、CCTP、MCP Server、Agent Skills 及评审关注点。",
      en: "HackQuest's Global Cup AMA brought together the builders of iClash and InjectOS to discuss why they build on Injective, their competition strategy, product lessons, and the judging considerations around x402, CCTP, MCP Server, and Agent Skills.",
    },
    image: "/optimized/news/hackquest-champions-playbook-1280-v1.webp",
    imageLabel: { zh: "Injective Global Cup AMA", en: "Injective Global Cup AMA" },
    sections: ["latest", "storyline"],
    status: "recap",
    originalLanguage: "en",
    originalAuthor: { zh: "HackQuest", en: "HackQuest" },
  },
  {
    id: "nova-final-demo-day",
    catKey: "event",
    category: cat.event,
    source: { zh: "Web3Labs × Injective", en: "Web3Labs × Injective" },
    date: "2026.07.27",
    publishedAt: "2026-07-27",
    url: "https://mp.weixin.qq.com/s/M1CiWEGdZlmNL7s8s21XaA",
    title: {
      zh: "Injective 新星计划 Final Demo Day 圆满落幕，TOP3 团队揭晓",
      en: "Injective Nova Final Demo Day Concludes with the Top 3 Teams Announced",
    },
    summary: {
      zh: "Injective 新星计划在 Final Demo Day 完成最终展示。入围团队围绕 AI 与 Web3 的结合展示产品原型，TOP3 团队正式揭晓，也为从五月启动的开发者计划画下阶段性句点。",
      en: "The Injective Nova Program concluded its Final Demo Day with product demonstrations from teams building across AI and Web3. The Top 3 teams were announced, closing the first chapter of the builder program launched in May.",
    },
    image: "/optimized/news/nova-final-demo-day-1280-v1.webp",
    imageLabel: { zh: "Injective 新星计划", en: "Injective Nova Program" },
    sections: ["latest", "storyline"],
    status: "recap",
    series: "nova-program",
    featuredRank: 3,
    originalLanguage: "zh",
    originalAuthor: { zh: "web3labs.club", en: "web3labs.club" },
  },
  {
    id: "adventurex-2026",
    catKey: "event",
    category: cat.event,
    source: { zh: "INJ建设者", en: "INJ Builders" },
    date: "2026.07.21",
    publishedAt: "2026-07-21",
    url: "https://mp.weixin.qq.com/s/08Tdyz4bFgECO3DbGSDANg",
    title: {
      zh: "Injective × AdventureX 2026：当创新遇见年轻",
      en: "Injective × AdventureX 2026: When Innovation Meets Youth",
    },
    summary: {
      zh: "Injective 以首席赞助方身份参与 AdventureX 2026，支持年轻开发者探索 Injective、AI 与链上应用的创意边界。Ninja Labs 发起人 Vincent Jin 参与现场技术指导与生态对接。",
      en: "Injective joined AdventureX 2026 as a lead sponsor, backing young developers exploring the intersection of Injective, AI, and onchain applications. Ninja Labs founder Vincent Jin took part in technical guidance and ecosystem connections on site.",
    },
    image: "/optimized/news/adventurex-2026-1280-v1.webp",
    imageLabel: { zh: "AdventureX 2026 活动现场", en: "AdventureX 2026" },
    sections: ["latest", "archive"],
    status: "recap",
    originalLanguage: "zh",
    originalAuthor: { zh: "INJ建设者", en: "INJ Builders" },
  },
  {
    id: "injective-mint-rwa",
    catKey: "trading",
    category: cat.trading,
    source: { zh: "INJ建设者", en: "INJ Builders" },
    date: "2026.07.19",
    publishedAt: "2026-07-19",
    url: "https://mp.weixin.qq.com/s/76n1VAd4NRR8gCszoP6j1w",
    title: {
      zh: "Injective 推出 RWA 平台 Injective Mint",
      en: "Injective Introduces the RWA Platform Injective Mint",
    },
    summary: {
      zh: "INJ建设者文章介绍了面向现实世界资产的 Injective Mint，并提及相关主体向美国 SEC 递交转让代理人注册申请。注册状态及平台细节应以 Injective 与监管机构后续公开信息为准。",
      en: "An INJ Builders briefing introduces Injective Mint for real-world assets and reports that a related entity submitted a transfer-agent registration application to the U.S. SEC. Registration status and product details remain subject to subsequent official disclosures.",
    },
    image: "/optimized/news/injective-mint-rwa-1280-v1.webp",
    imageLabel: { zh: "Injective Mint RWA 平台", en: "Injective Mint RWA platform" },
    sections: ["latest"],
    status: "active",
    originalLanguage: "zh",
    originalAuthor: { zh: "INJ建设者", en: "INJ Builders" },
  },
  {
    id: "nova-top-10",
    catKey: "event",
    category: cat.event,
    source: { zh: "Web3Labs × Injective", en: "Web3Labs × Injective" },
    date: "2026.07.13",
    publishedAt: "2026-07-13",
    url: "https://mp.weixin.qq.com/s/M7OLN-06F-H0Jn4zKMOr2Q",
    title: { zh: "新星已点亮：Injective 新星计划 Top 10 正式公布", en: "Nova Ignites: The Injective Nova Top 10" },
    summary: {
      zh: "新星计划从参赛项目中选出十支入围团队，进入最终展示与后续辅导阶段。本条作为专题节点保留，完整结果请查看 Final Demo Day 更新。",
      en: "Ten teams advanced from the Nova Program into the final showcase and mentorship stage. This update is retained as a storyline milestone; see the Final Demo Day dispatch for the final results.",
    },
    image: "/optimized/news/nova-top-10-1280-v1.webp",
    imageLabel: { zh: "新星计划 Top 10", en: "Nova Program Top 10" },
    sections: ["storyline"],
    status: "recap",
    series: "nova-program",
    originalLanguage: "zh",
    originalAuthor: { zh: "web3labs.club", en: "web3labs.club" },
  },
  {
    id: "builderup-shanghai",
    catKey: "event",
    category: cat.event,
    source: { zh: "BuilderUp × Ninja Labs", en: "BuilderUp × Ninja Labs" },
    date: "2026.07.08",
    publishedAt: "2026-07-07",
    url: "https://mp.weixin.qq.com/s/wtUpjTZDWCsp34Ypme8wDw",
    title: { zh: "BuilderUp 上海站 · 7.8", en: "BuilderUp Shanghai · July 8" },
    summary: {
      zh: "BuilderUp 上海站聚集开发者与生态伙伴，围绕 Web3 构建、产品实践和社区协作展开交流。活动已经结束，本条保留为 Ninja Labs 中文社区的线下活动记录。",
      en: "BuilderUp Shanghai brought developers and ecosystem partners together for conversations around Web3 building, product practice, and community collaboration. The event has ended and is retained as a record of Ninja Labs CN community activity.",
    },
    image: "/optimized/news/builderup-shanghai-1280-v1.webp",
    imageLabel: { zh: "BuilderUp 上海站", en: "BuilderUp Shanghai" },
    sections: ["archive"],
    status: "ended",
    originalLanguage: "zh",
  },
  {
    id: "injective-global-cup",
    catKey: "event",
    category: cat.event,
    source: { zh: "HackQuest × INJ建设者", en: "HackQuest × INJ Builders" },
    date: "2026.07.03 – 07.19",
    publishedAt: "2026-07-04",
    url: "https://mp.weixin.qq.com/s/0o5LqcmzNUkpXMTaiag_jg",
    title: { zh: "The Injective Global Cup 创意挑战赛开赛", en: "The Injective Global Cup Creative Challenge Kicks Off" },
    summary: {
      zh: "Injective Global Cup 面向全球建设者征集结合足球文化、AI 与链上体验的创意项目。活动由 HackQuest 协作运营，现已结束并转入活动档案。",
      en: "The Injective Global Cup invited builders worldwide to combine football culture, AI, and onchain experiences in creative projects. Operated in collaboration with HackQuest, the challenge has ended and now lives in the event archive.",
    },
    image: "/optimized/news/injective-global-cup-1280-v1.webp",
    imageLabel: { zh: "Injective Global Cup", en: "Injective Global Cup" },
    sections: ["archive"],
    status: "ended",
    originalLanguage: "zh",
    originalAuthor: { zh: "HackQuest", en: "HackQuest" },
  },
  {
    id: "nova-registration-closed",
    catKey: "event",
    category: cat.event,
    source: { zh: "INJ建设者", en: "INJ Builders" },
    date: "2026.07.02",
    publishedAt: "2026-07-02",
    url: "https://mp.weixin.qq.com/s/0mtYrvp-b-CenjnLH0hj1A",
    title: { zh: "Injective 新星计划截止报名，新星诞生于年轻", en: "Injective Nova Applications Close" },
    summary: {
      zh: "新星计划完成项目征集并进入评审阶段。这篇以视觉海报为主的更新现作为 Nova 专题时间线节点保留，不再作为独立首页新闻。",
      en: "The Nova Program closed submissions and moved into judging. This primarily visual update is preserved as a milestone in the Nova storyline rather than as a standalone homepage dispatch.",
    },
    image: "/optimized/news/nova-registration-closed-1280-v1.webp",
    imageLabel: { zh: "新星计划截止报名", en: "Nova applications close" },
    sections: ["storyline"],
    status: "recap",
    series: "nova-program",
    originalLanguage: "zh",
    originalAuthor: { zh: "INJ建设者", en: "INJ Builders" },
  },
  {
    id: "onchain-nasdaq",
    catKey: "media",
    category: cat.media,
    source: { zh: "0xMedia", en: "0xMedia" },
    date: "2026.07.01",
    publishedAt: "2026-07-01",
    url: "https://mp.weixin.qq.com/s/CTKQP5DsNZUDBfYZD6099w",
    title: { zh: "两轮周期百倍之后，Injective 正在成为链上纳斯达克？", en: "Is Injective Becoming the Onchain Nasdaq?" },
    summary: {
      zh: "0xMedia 从金融基础设施、衍生品、代币化现实资产和生态扩展等角度观察 Injective，并以“链上纳斯达克”讨论其市场定位。该内容属于媒体分析，并非项目承诺。",
      en: "0xMedia examines Injective through financial infrastructure, derivatives, tokenized real-world assets, and ecosystem expansion, using the idea of an “onchain Nasdaq” to frame its positioning. It is media analysis rather than a project commitment.",
    },
    image: "/optimized/news/onchain-nasdaq-1280-v1.webp",
    imageLabel: { zh: "0xMedia 行业分析", en: "0xMedia analysis" },
    sections: ["insight"],
    status: "evergreen",
    originalLanguage: "zh",
    originalAuthor: { zh: "0xMedia", en: "0xMedia" },
  },
  {
    id: "injective-vulcan",
    catKey: "news",
    category: cat.news,
    source: { zh: "Injective", en: "Injective" },
    date: "2026.06.09",
    publishedAt: "2026-06-09",
    url: "https://x.com/injective/status/2064336299494940797",
    title: { zh: "Injective Vulcan 主网升级正式上线", en: "Injective Vulcan Mainnet Upgrade Is Live" },
    summary: {
      zh: "Injective Vulcan v1.20.0 主网升级引入新一代预言机引擎、面向 EVM 应用的统一数据访问，以及原生 USDC 和 RWA 市场所需的基础设施优化。兼容要求以官方版本说明为准。",
      en: "Injective's Vulcan v1.20.0 mainnet upgrade introduced a next-generation oracle engine, unified data access for EVM applications, and infrastructure improvements for native USDC and RWA markets. Consult the official release notes for compatibility details.",
    },
    image: "/optimized/news/foresight-105585-1280-v1.webp",
    imageLabel: { zh: "Vulcan 主网升级", en: "Vulcan mainnet upgrade" },
    sections: ["latest"],
    status: "active",
    originalLanguage: "en",
  },
  {
    id: "anthropic-alignment",
    catKey: "research",
    category: cat.research,
    source: { zh: "INJ建设者", en: "INJ Builders" },
    date: "2026.06.03",
    publishedAt: "2026-06-03",
    url: "https://mp.weixin.qq.com/s/vniY5paeDKJZ9umYUy9nzw",
    title: { zh: "教 Claude 理解“为什么”，将勒索行为概率从 96% 降到 0%", en: "Teaching Claude “Why”: Reducing Blackmail Behavior from 96% to 0%" },
    summary: {
      zh: "INJ建设者整理 Anthropic 对齐研究，讨论在训练中加入对行为原因的解释，如何显著减少模型在模拟场景中的有害策略。文章是社区研究导读，实验方法与结论应回到原论文核对。",
      en: "INJ Builders reviews Anthropic alignment research on how adding explanations for behavioral constraints can sharply reduce harmful strategies in simulated scenarios. It is a community research guide; methodology and conclusions should be checked against the original paper.",
    },
    image: "/optimized/news/anthropic-alignment-1280-v1.webp",
    imageLabel: { zh: "Anthropic 对齐研究", en: "Anthropic alignment research" },
    sections: ["insight"],
    status: "evergreen",
    originalLanguage: "zh",
    originalAuthor: { zh: "INJ建设者", en: "INJ Builders" },
  },
  {
    id: "nova-kickoff",
    catKey: "event",
    category: cat.event,
    source: { zh: "Injective × Microsoft × Web3Labs", en: "Injective × Microsoft × Web3Labs" },
    date: "2026.05.23",
    publishedAt: "2026-05-23",
    url: "https://mp.weixin.qq.com/s/D38YbhxjM0XtixWdBSin7w",
    title: { zh: "Injective 新星计划线上开营启动", en: "The Injective Nova Program Begins" },
    summary: {
      zh: "Injective、Microsoft 与 Web3Labs 联合启动新星计划，为 AI 原生团队提供奖金、Azure 云资源、导师辅导与展示机会。这是 Nova 专题时间线的起点。",
      en: "Injective, Microsoft, and Web3Labs launched the Nova Program, offering AI-native teams prizes, Azure resources, mentorship, and showcase opportunities. This marks the beginning of the Nova storyline.",
    },
    image: "/optimized/news/nova-kickoff-1280-v1.webp",
    imageLabel: { zh: "新星计划启动", en: "Nova Program launch" },
    sections: ["storyline"],
    status: "recap",
    series: "nova-program",
    originalLanguage: "zh",
    originalAuthor: { zh: "INJ建设者", en: "INJ Builders" },
  },
  {
    id: "injective-policy-institute",
    catKey: "news",
    category: cat.news,
    source: { zh: "Injective", en: "Injective" },
    date: "2026.05.21",
    publishedAt: "2026-05-21",
    url: "https://injective.com/blog/injective-policy-institute",
    title: { zh: "Injective Policy Institute 在华盛顿成立", en: "Injective Policy Institute Launches in Washington, DC" },
    summary: {
      zh: "Injective 在华盛顿成立政策与研究机构 IPI，计划围绕美国链上金融政策开展研究，并与监管者、立法者及其他利益相关方交流。机构成立不意味着任何监管结果已经确定。",
      en: "Injective established the Washington, DC-based IPI to research U.S. onchain-finance policy and engage regulators, lawmakers, and other stakeholders. Its launch does not predetermine any regulatory outcome.",
    },
    image: "/optimized/news/foresight-105748-1280-v1.webp",
    imageLabel: { zh: "Injective Policy Institute", en: "Injective Policy Institute" },
    sections: ["latest", "insight"],
    status: "evergreen",
    originalLanguage: "en",
  },
  {
    id: "hackquest-dev",
    catKey: "dev",
    category: cat.dev,
    source: { zh: "Injective × Ninja Labs × HackQuest", en: "Injective × Ninja Labs × HackQuest" },
    date: "2026.05.11 – 06.10",
    publishedAt: "2026-05-11",
    url: "https://hackquest.io/en/hackathons/Injective-Solo-AI-Builder-Sprint",
    title: { zh: "Injective Solo AI Builder Sprint", en: "Injective Solo AI Builder Sprint" },
    summary: {
      zh: "Injective、Ninja Labs 与 HackQuest 面向独立开发者发起 AI Builder Sprint，征集可运行的 AI 工具、智能体与自动化工作流。活动已结束，页面作为合作项目记录保留。",
      en: "Injective, Ninja Labs, and HackQuest launched an AI Builder Sprint for independent developers building functional AI tools, agents, and automated workflows. The sprint has ended and remains as a partner-program record.",
    },
    image: "/optimized/news/hackquest-dev-1280-v1.webp",
    imageLabel: { zh: "AI Builder Sprint", en: "AI Builder Sprint" },
    sections: ["archive"],
    status: "ended",
    originalLanguage: "en",
  },
  {
    id: "builderup-hangzhou",
    catKey: "event",
    category: cat.event,
    source: { zh: "BuilderUp × Ninja Labs", en: "BuilderUp × Ninja Labs" },
    date: "2026.04.25",
    publishedAt: "2026-04-23",
    url: "https://mp.weixin.qq.com/s/jMhNXmzKQIM7r-2pfzLduA",
    title: { zh: "Ninja Labs 加入 BuilderUp 杭州站", en: "Ninja Labs Joins BuilderUp Hangzhou" },
    summary: {
      zh: "Ninja Labs 参与 BuilderUp 杭州站，与本地开发者交流 Injective 生态、产品构建与社区协作。活动已经结束，本条作为线下社区足迹保留。",
      en: "Ninja Labs joined BuilderUp Hangzhou to connect with local developers around the Injective ecosystem, product building, and community collaboration. The event has ended and is retained as part of the community record.",
    },
    image: "/optimized/news/builderup-hangzhou-1280-v1.webp",
    imageLabel: { zh: "BuilderUp 杭州站", en: "BuilderUp Hangzhou" },
    sections: ["archive"],
    status: "ended",
    originalLanguage: "zh",
  },
  {
    id: "injective-jpn-trading",
    catKey: "trading",
    category: cat.trading,
    source: { zh: "Injective JPN", en: "Injective JPN" },
    date: "2026.05.14 – 05.18",
    publishedAt: "2026-05-14",
    url: "https://x.com/InjectiveJPN/status/2054758604327317739",
    title: { zh: "Injective Japan 举办 INJ 价格预测挑战", en: "Injective Japan Hosts an INJ Price Prediction Challenge" },
    summary: {
      zh: "Injective 日本社区曾在 Telegram 举办 INJ 收盘价预测挑战。这是一项已经结束的轻量社区互动活动，不构成投资建议。",
      en: "The Injective Japan community hosted a Telegram challenge around predicting an INJ closing price. The lightweight community activity has ended and should not be read as investment guidance.",
    },
    image: "/optimized/news/injective-jpn-trading-1280-v1.webp",
    imageLabel: { zh: "Injective JPN 活动", en: "Injective JPN activity" },
    sections: ["archive"],
    status: "ended",
    originalLanguage: "en",
  },
  {
    id: "usdc-on-injective",
    catKey: "trading",
    category: cat.trading,
    source: { zh: "INJ建设者", en: "INJ Builders" },
    date: "2026.05",
    publishedAt: "2026-05-01",
    url: "https://mp.weixin.qq.com/s/KXkxb23pbrV8NZMWklehcA",
    title: { zh: "USDC 正式登陆 Injective", en: "USDC Arrives on Injective" },
    summary: {
      zh: "原生 USDC 与 Circle CCTP V2 接入 Injective，为受支持网络之间的美元稳定币流动性提供更直接的路径，并服务交易、支付、结算及其他链上金融场景。",
      en: "Native USDC and Circle CCTP V2 arrived on Injective, creating a more direct route for dollar-denominated liquidity between supported networks and supporting trading, payments, settlement, and other onchain-finance use cases.",
    },
    image: "/optimized/news/wechat-2-1280-v1.webp",
    imageLabel: { zh: "USDC on Injective", en: "USDC on Injective" },
    sections: ["latest"],
    status: "active",
    originalLanguage: "zh",
    originalAuthor: { zh: "INJ建设者", en: "INJ Builders" },
  },
  {
    id: "injective-founder-story",
    catKey: "story",
    category: cat.story,
    source: { zh: "INJ建设者", en: "INJ Builders" },
    date: "2025.11.27",
    publishedAt: "2025-11-27",
    url: "https://mp.weixin.qq.com/s/Zd_rjauyInMPY-40lP7ERg",
    title: { zh: "20 平出租屋里启动的知名公链：INJ 创始人的创业故事", en: "From a 20-Square-Meter Apartment: The Injective Founder Story" },
    summary: {
      zh: "这篇长文回顾 Injective 创始团队早期创业经历，以及项目如何从有限条件下起步并逐渐形成面向链上金融的基础设施愿景。它不属于时效新闻，因此作为长期人物故事保留。",
      en: "This long-form story revisits Injective's early founder journey, tracing how the project began with limited resources and developed a broader infrastructure vision for onchain finance. It is retained as an evergreen founder profile rather than time-sensitive news.",
    },
    image: "/optimized/news/injective-founder-story-1280-v1.webp",
    imageLabel: { zh: "Injective 创始人故事", en: "Injective founder story" },
    sections: ["insight"],
    status: "evergreen",
    originalLanguage: "zh",
    originalAuthor: { zh: "白丁 & Adam / 仙壤", en: "Bai Ding & Adam / Xianrang" },
  },
];

export const FEATURED_NEWS = NEWS.filter((item) => item.featuredRank).sort(
  (a, b) => (a.featuredRank ?? 99) - (b.featuredRank ?? 99),
);

export const getNewsById = (id: string) => NEWS.find((item) => item.id === id);
