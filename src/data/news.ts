/* ====================================================================
 * News data · 城市快报数据源
 * --------------------------------------------------------------------
 * 来源链接、分类、媒体均为真实;标题/摘要为占位骨架 (X 与微信为登录墙,
 * 无法程序化抓取正文,且不逐字转载受版权保护的全文)。
 *
 * 接入真实内容时,逐条替换 title / summary / date / image:
 *   - 把海报图存到 public/news/ 下,设 image: "/news/xxx.png"
 *   - title / summary 填原文标题与你撰写的简短摘要
 *   - 始终保留 url 指向原文出处
 * ==================================================================== */

export type NewsCat = "dev" | "trading" | "content" | "media" | "news";

export interface NewsItem {
  id: string;
  catKey: NewsCat;
  category: { zh: string; en: string };
  source: string;
  date: string;
  url: string;
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
    date: "2026.05.11 – 05.31",
    url: "https://x.com/HackQuest_/status/2052808267328544890",
    title: { zh: "Injective Solo AI Builder Sprint", en: "Injective Solo AI Builder Sprint" },
    summary: {
      zh: "Injective × Ninja Labs × HackQuest 联合发起的 Solo AI Builder Sprint:奖池 $500,征集期 5/11–5/31。",
      en: "A Solo AI Builder Sprint by Injective × Ninja Labs × HackQuest — $500 reward pool, May 11–31.",
    },
    image: "/news/hackquest-dev.png",
    imageLabel: { zh: "AI Builder Sprint 海报", en: "AI Builder Sprint poster" },
  },
  {
    id: "injective-jpn-trading",
    catKey: "trading",
    category: cat.trading,
    source: "Injective JPN",
    date: "",
    url: "https://x.com/InjectiveJPN/status/2054758604327317739",
    title: { zh: "Injective JPN · 交易动态", en: "Injective JPN · Trading update" },
    summary: {
      zh: "来自 Injective JPN 的交易相关动态 —— 摘要待补,点击查看原文。",
      en: "Trading-related update from Injective JPN — summary TBD, open original.",
    },
    image: "/news/injective-jpn-trading.png",
    imageLabel: { zh: "Injective JPN 推文海报", en: "Injective JPN post poster" },
  },
  {
    id: "wechat-1",
    catKey: "news",
    category: cat.news,
    source: "微信公众号 · INJ建设者",
    date: "2026.05.21",
    url: "https://mp.weixin.qq.com/s/chwWHe0ELqwZP-lIhcnpmg?scene=1",
    title: { zh: "Injective 新星计划 · 今日正式启航", en: "Injective Nova Program · Now Live" },
    summary: {
      zh: "Injective × Microsoft × Web3Labs 联合发起「新星计划 / Nova Program」,2026/5/21 启航,聚焦 AI 原生创造。",
      en: "Injective × Microsoft × Web3Labs launch the Nova Program on 2026/5/21, focused on AI-native creation.",
    },
    image: "/news/wechat-1.png",
    imageLabel: { zh: "新星计划海报", en: "Nova Program poster" },
  },
  {
    id: "wechat-2",
    catKey: "trading",
    category: cat.trading,
    source: "微信公众号 · INJ建设者",
    date: "",
    url: "https://mp.weixin.qq.com/s/KXkxb23pbrV8NZMWklehcA",
    title: { zh: "USDC 正式登陆 Injective", en: "USDC on Injective" },
    summary: {
      zh: "原生 USDC 登陆 Injective —— The Future Starts Here。",
      en: "Native USDC arrives on Injective — the future starts here.",
    },
    image: "/news/wechat-2.jpg",
    imageLabel: { zh: "USDC on Injective 配图", en: "USDC on Injective image" },
  },
  {
    id: "wechat-3",
    catKey: "content",
    category: cat.content,
    source: "微信公众号 · INJ建设者",
    date: "",
    url: "https://mp.weixin.qq.com/s/-VYuoXgQvSBJwDOehXLOow",
    title: { zh: "Anthropic 研究 · 教 Claude 理解对齐", en: "Anthropic Research · Teaching Claude Alignment" },
    summary: {
      zh: "一篇对齐研究解读:对齐失败率如何随 RL 训练步数变化。",
      en: "A read on alignment research — how alignment-failure rates shift over RL training steps.",
    },
    image: "/news/wechat-3.png",
    imageLabel: { zh: "对齐研究图表", en: "Alignment research chart" },
  },
  {
    id: "0xmediaco",
    catKey: "media",
    category: cat.media,
    source: "0xMediaCo",
    date: "",
    url: "https://x.com/0xmediaco/status/2060996336665940161?s=20",
    title: { zh: "0xMediaCo · 媒体报道", en: "0xMediaCo · Media coverage" },
    summary: {
      zh: "来自 0xMediaCo 的媒体报道 —— 摘要待补,点击查看原文。",
      en: "Media coverage from 0xMediaCo — summary TBD, open original.",
    },
    image: "/news/0xmediaco.png",
    imageLabel: { zh: "0xMediaCo 推文海报", en: "0xMediaCo post poster" },
  },
  {
    id: "foresight-105585",
    catKey: "media",
    category: cat.media,
    source: "Foresight News",
    date: "",
    url: "https://a.foresightnews.pro/news/detail/105585",
    title: { zh: "Foresight News 报道 ①", en: "Foresight News ①" },
    summary: {
      zh: "Foresight News 行业报道 —— 摘要待补,点击查看原文。",
      en: "Industry coverage on Foresight News — summary TBD, open original.",
    },
    image: "/news/foresight-105585.png",
    imageLabel: { zh: "Foresight News 配图", en: "Foresight News image" },
  },
  {
    id: "foresight-105748",
    catKey: "media",
    category: cat.media,
    source: "Foresight News",
    date: "",
    url: "https://a.foresightnews.pro/news/detail/105748",
    title: { zh: "Foresight News 报道 ②", en: "Foresight News ②" },
    summary: {
      zh: "Foresight News 行业报道 —— 摘要待补,点击查看原文。",
      en: "Industry coverage on Foresight News — summary TBD, open original.",
    },
    image: "/news/foresight-105748.png",
    imageLabel: { zh: "Foresight News 配图", en: "Foresight News image" },
  },
];

export const getNewsById = (id: string) => NEWS.find((n) => n.id === id);
