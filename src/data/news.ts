/* ====================================================================
 * News data · 城市快报数据源
 * --------------------------------------------------------------------
 * 收录 Ninja Labs、合作社区及 Injective 生态的公开动态。
 * 标题和摘要均为本站导读,完整信息以 url 指向的原始发布为准。
 * ==================================================================== */

export type NewsCat = "dev" | "trading" | "content" | "media" | "news";

export interface NewsItem {
  id: string;
  catKey: NewsCat;
  category: { zh: string; en: string };
  source: string;
  date: string;
  url?: string;
  title: { zh: string; en: string };
  summary: { zh: string; en: string };
  /** 真实海报路径 (放 public/news/);留空则显示灰色占位块 */
  image?: string;
  imageLabel: { zh: string; en: string };
}

const cat = {
  dev: { zh: "开发", en: "Dev" },
  trading: { zh: "交易", en: "Trading" },
  content: { zh: "内容", en: "Content" },
  media: { zh: "媒体", en: "Media" },
  news: { zh: "公告", en: "News" },
} as const;

export const NEWS: NewsItem[] = [
  {
    id: "hackquest-dev",
    catKey: "dev",
    category: cat.dev,
    source: "Injective × Ninja Labs × HackQuest",
    date: "2026.05.11 – 06.10",
    url: "https://hackquest.io/en/hackathons/Injective-Solo-AI-Builder-Sprint",
    title: { zh: "Injective Solo AI Builder Sprint", en: "Injective Solo AI Builder Sprint" },
    summary: {
      zh: "Injective、Ninja Labs 与 HackQuest 联合发起 Solo AI Builder Sprint,面向独立开发者征集可实际运行的 AI 工具、智能体和自动化工作流。参与者可以围绕开发效率、链上交互或日常应用提交作品,活动设置 500 美元奖励池。征集期从 5 月 11 日开始,延期后的最终提交截止日为 6 月 10 日。",
      en: "Injective, Ninja Labs, and HackQuest launched the Solo AI Builder Sprint for independent developers building functional AI tools, agents, and automated workflows. Entries could address developer productivity, onchain interaction, or practical everyday use cases, with a $500 reward pool available. The sprint opened on May 11 and the final submission deadline was extended to June 10.",
    },
    image: "/news/hackquest-dev.png",
    imageLabel: { zh: "AI Builder Sprint 海报", en: "AI Builder Sprint poster" },
  },
  {
    id: "injective-jpn-trading",
    catKey: "trading",
    category: cat.trading,
    source: "Injective JPN",
    date: "2026.05.14 – 05.18",
    url: "https://x.com/InjectiveJPN/status/2054758604327317739",
    title: { zh: "Injective Japan 举办 INJ 价格预测挑战", en: "Injective Japan Hosts INJ Price Prediction Challenge" },
    summary: {
      zh: "Injective 日本社区在 Telegram 举办了一场 INJ 收盘价预测挑战,邀请社区成员提交对 5 月 19 日市场价格的判断。活动在 5 月 14 日至 18 日期间接受预测,最终以最接近实际收盘价的提交者为获胜者。这是一项轻量的社区互动活动,不构成任何投资建议。",
      en: "The Injective Japan community hosted a Telegram challenge inviting members to predict INJ's May 19 closing price. Forecasts were accepted from May 14 through May 18, with the closest submission selected as the winner. It was a lightweight community activity and should not be read as investment guidance.",
    },
    image: "/news/injective-jpn-trading.png",
    imageLabel: { zh: "Injective JPN 推文海报", en: "Injective JPN post poster" },
  },
  {
    id: "wechat-1",
    catKey: "news",
    category: cat.news,
    source: "微信公众号 · INJ建设者",
    date: "2026.05.25",
    url: "https://injective.com/blog/nova-program",
    title: { zh: "Injective 新星计划 · 今日正式启航", en: "Injective Nova Program · Now Live" },
    summary: {
      zh: "Injective、Microsoft 与 Web3Labs 联合推出 Nova Program,希望帮助 AI 原生项目从早期概念推进到可验证的产品。计划为入选团队提供奖金、Microsoft Azure 云资源、导师辅导和阶段性展示机会,优秀项目还可能进入后续孵化与融资支持流程。项目周期从 2026 年 5 月延续至 7 月,具体申请条件与节点以官方网站为准。",
      en: "Injective, Microsoft, and Web3Labs launched the Nova Program to help AI-native teams move from early concepts toward validated products. Selected teams receive access to prizes, Microsoft Azure credits, mentorship, and milestone demonstrations, with further incubation and funding opportunities available to standout projects. The program runs from May into July 2026, with eligibility and deadlines maintained on the official site.",
    },
    image: "/news/wechat-1.png",
    imageLabel: { zh: "新星计划海报", en: "Nova Program poster" },
  },
  {
    id: "wechat-2",
    catKey: "trading",
    category: cat.trading,
    source: "微信公众号 · INJ建设者",
    date: "2026.05",
    url: "https://mp.weixin.qq.com/s/KXkxb23pbrV8NZMWklehcA",
    title: { zh: "USDC 正式登陆 Injective", en: "USDC on Injective" },
    summary: {
      zh: "原生 USDC 与 Circle 的跨链传输协议 CCTP V2 已接入 Injective,用户和应用可以通过更直接的方式在支持的网络之间转移美元稳定币流动性。对生态开发者而言,这减少了对封装资产和第三方桥接路径的依赖,并可用于交易、支付、结算及其他链上金融场景。实际支持范围、费用和到账时间应以 Circle 与 Injective 的最新说明为准。",
      en: "Native USDC and Circle's CCTP V2 are now available on Injective, creating a more direct route for moving dollar-denominated liquidity between supported networks. For ecosystem developers, this reduces reliance on wrapped assets and third-party bridge routes while supporting trading, payments, settlement, and other onchain financial applications. Current network support, fees, and transfer timing should be checked against the latest Circle and Injective documentation.",
    },
    image: "/news/wechat-2.jpg",
    imageLabel: { zh: "USDC on Injective 配图", en: "USDC on Injective image" },
  },
  {
    id: "wechat-3",
    catKey: "content",
    category: cat.content,
    source: "微信公众号 · INJ建设者",
    date: "2026.05",
    url: "https://mp.weixin.qq.com/s/-VYuoXgQvSBJwDOehXLOow",
    title: { zh: "Anthropic 研究 · 教 Claude 理解对齐", en: "Anthropic Research · Teaching Claude Alignment" },
    summary: {
      zh: "INJ 建设者社区整理了一篇 Anthropic 对齐研究的中文解读,讨论模型在强化学习训练中为何可能出现与预期目标不一致的行为。文章关注训练步数、奖励信号和对齐失败率之间的变化,帮助非研究背景的读者理解相关实验在观察什么。该内容属于社区研究导读,完整方法、数据与结论仍应回到原研究材料核对。",
      en: "The INJ Builders community published a Chinese-language guide to Anthropic alignment research, examining why model behavior can diverge from intended goals during reinforcement-learning training. It looks at the relationship between training steps, reward signals, and observed alignment failures to make the experiment more accessible to non-specialist readers. This is a community research briefing, so methodology, data, and conclusions should still be checked against the original research.",
    },
    image: "/news/wechat-3.png",
    imageLabel: { zh: "对齐研究图表", en: "Alignment research chart" },
  },
  {
    id: "0xmediaco",
    catKey: "media",
    category: cat.media,
    source: "0xMediaCo",
    date: "2026.05.31",
    url: "https://x.com/0xmediaco/status/2060996336665940161?s=20",
    title: { zh: "0xMedia：Injective 正在成为链上纳斯达克？", en: "0xMedia: Is Injective Becoming an Onchain Nasdaq?" },
    summary: {
      zh: "0xMedia 从金融基础设施、链上资产交易和生态扩展等角度观察 Injective,并以“链上纳斯达克”作为讨论其市场定位的切入点。文章关注 Injective 如何承载衍生品、代币化现实资产与其他全球市场产品,以及这些模块能否形成统一的交易与结算环境。这是一篇媒体分析而非项目承诺,相关判断应结合实际产品采用情况阅读。",
      en: "0xMedia examines Injective through its financial infrastructure, onchain asset markets, and ecosystem expansion, using the idea of an 'onchain Nasdaq' as a framing device. The piece considers how derivatives, tokenized real-world assets, and other global market products could share a unified trading and settlement environment. It is media analysis rather than a project commitment, and its conclusions should be weighed against actual product adoption.",
    },
    image: "/news/0xmediaco.png",
    imageLabel: { zh: "0xMediaCo 推文海报", en: "0xMediaCo post poster" },
  },
  {
    id: "injective-vulcan",
    catKey: "news",
    category: cat.news,
    source: "Injective",
    date: "2026.06.09",
    url: "https://x.com/injective/status/2064336299494940797",
    title: { zh: "Injective Vulcan 主网升级正式上线", en: "Injective Vulcan Mainnet Upgrade Is Live" },
    summary: {
      zh: "Injective Vulcan v1.20.0 主网升级已正式上线,重点更新包括新一代预言机引擎、面向 EVM 应用的统一数据访问,以及原生 USDC 和 RWA 市场所需的基础设施优化。升级旨在降低预言机与链上交易成本,同时改善稳定币结算和代币化资产市场的开发体验。节点、开发者和应用方应以官方版本说明确认具体兼容要求。",
      en: "Injective's Vulcan v1.20.0 mainnet upgrade is live, introducing a next-generation oracle engine, unified data access for EVM applications, and infrastructure improvements for native USDC and RWA markets. The release is designed to reduce oracle and transaction costs while improving the development environment for stablecoin settlement and tokenized asset markets. Node operators, developers, and applications should consult the official release notes for compatibility requirements.",
    },
    image: "/news/foresight-105585.png",
    imageLabel: { zh: "Vulcan 主网升级配图", en: "Vulcan mainnet upgrade image" },
  },
  {
    id: "injective-policy-institute",
    catKey: "news",
    category: cat.news,
    source: "Injective",
    date: "2026.05.21",
    url: "https://injective.com/blog/injective-policy-institute",
    title: { zh: "Injective Policy Institute 在华盛顿成立", en: "Injective Policy Institute Launches in Washington, DC" },
    summary: {
      zh: "Injective 在华盛顿成立政策与研究机构 Injective Policy Institute（IPI）,计划围绕美国链上金融政策开展研究与行业沟通。该机构将与监管者、立法者及其他利益相关方交流,议题覆盖去中心化金融、链上衍生品、稳定币和开发者政策环境。IPI 的成立代表 Injective 开始更系统地参与政策讨论,并不意味着任何监管结果已经确定。",
      en: "Injective established the Washington, DC-based Injective Policy Institute (IPI) to conduct research and participate in policy discussions around onchain finance in the United States. The institute intends to engage regulators, lawmakers, and other stakeholders on decentralized finance, onchain derivatives, stablecoins, and the policy environment for developers. Its launch represents more structured participation in the policy process, not a guarantee of any regulatory outcome.",
    },
    image: "/news/foresight-105748.png",
    imageLabel: { zh: "Injective Policy Institute 配图", en: "Injective Policy Institute image" },
  },
];

export const getNewsById = (id: string) => NEWS.find((n) => n.id === id);
