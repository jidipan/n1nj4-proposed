/* ====================================================================
 * stadiumEvents · 竞技场赛事数据
 * --------------------------------------------------------------------
 * 汇总 City Zero 的重点建设者计划与合作赛事。展示于 City Zero 页
 * the Stadium section；新活动加入后，已完成活动继续作为赛绩保留。
 * status 颜色与文案映射见 StadiumEvents 组件。
 * 最近同步:2026-08-10
 * ==================================================================== */

export type StadiumEventStatus =
  | "upcoming" // 即将开始
  | "live" // 报名/进行中
  | "voting" // 社区投票中
  | "reviewing" // 评审中
  | "done" // 已完成并公布结果
  | "ended"; // 已结束

export interface StadiumEvent {
  id: string;
  title: { zh: string; en: string };
  organizer: { zh: string; en: string };
  status: StadiumEventStatus;
  /** 状态旁的时效提示, 如「6/10 提交截止」 */
  statusNote: { zh: string; en: string };
  prize: string;
  participants?: string;
  summary: { zh: string; en: string };
  results?: {
    label: { zh: string; en: string };
    items: { zh: string; en: string }[];
  };
  /** 活动题图 (热链 HackQuest CDN 官方 banner; 失效时组件显示占位块) */
  image?: string;
  imagePosition?: string;
  /** 关键日期线, 按时间排列 */
  timeline: { zh: string; en: string }[];
  /** N1NJ4 持有者专属权益 (有则展示高亮条) */
  holderPerk?: { zh: string; en: string };
  link: string;
  linkLabel?: { zh: string; en: string };
  /** 卡片强调色 token */
  accent: string;
  tint: string;
}

export const STADIUM_EVENTS: StadiumEvent[] = [
  {
    id: "injective-solo-ai-builder-sprint",
    title: {
      zh: "Injective Solo AI Builder Sprint",
      en: "Injective Solo AI Builder Sprint",
    },
    organizer: { zh: "Injective × Ninja Labs", en: "Injective × Ninja Labs" },
    status: "done",
    statusNote: { zh: "6/22 已公布结果", en: "Results announced Jun 22" },
    prize: "$500",
    participants: "106",
    summary: {
      zh: "面向 solo builder 的 AI 编程冲刺:用 AI 构建实用工具、Agent 或工作流,可选接入 Injective 链上能力。",
      en: "An AI coding sprint for solo builders — ship useful tools, agents, or workflows powered by AI, with optional on-chain integration on Injective.",
    },
    results: {
      label: { zh: "TOP 3", en: "TOP 3" },
      items: [
        { zh: "Signet Markets", en: "Signet Markets" },
        { zh: "iClash", en: "iClash" },
        { zh: "Omnis Router", en: "Omnis Router" },
      ],
    },
    image: "/news/hackquest-dev.png",
    timeline: [
      { zh: "5/11 开赛", en: "Kickoff May 11" },
      { zh: "6/10 提交截止", en: "Submission Jun 10" },
      { zh: "6/22 公布结果", en: "Winners Jun 22" },
    ],
    holderPerk: {
      zh: "N1NJ4 持有者专属:社交互动 Top 3 各得 $100",
      en: "N1NJ4 holders: top 3 by social engagement earn $100 each",
    },
    link: "https://www.hackquest.io/hackathons/Injective-Solo-AI-Builder-Sprint",
    linkLabel: { zh: "查看活动", en: "View event" },
    accent: "#f68535",
    tint: "rgba(255, 179, 71, 0.14)",
  },
  {
    id: "injective-global-cup",
    title: {
      zh: "The Injective Global Cup",
      en: "The Injective Global Cup",
    },
    organizer: {
      zh: "Injective × Ninja Labs × HackQuest",
      en: "Injective × Ninja Labs × HackQuest",
    },
    status: "ended",
    statusNote: { zh: "8/5 已公布赛果", en: "Winners announced Aug 5" },
    prize: "$1,000",
    participants: "127",
    summary: {
      zh: "全球建设者以 Injective 最新开发工具打造 AI 驱动的世界杯链上体验，最终评选出 Broker、Kickoff Protocol 与 GoalGate 三强。",
      en: "Builders worldwide used Injective's latest developer stack to ship AI-powered onchain World Cup experiences, led by Broker, Kickoff Protocol, and GoalGate.",
    },
    results: {
      label: { zh: "TOP 3", en: "TOP 3" },
      items: [
        { zh: "Broker", en: "Broker" },
        { zh: "Kickoff Protocol", en: "Kickoff Protocol" },
        { zh: "GoalGate", en: "GoalGate" },
      ],
    },
    image: "/news/injective-global-cup.webp",
    timeline: [
      { zh: "7/3 开赛", en: "Kickoff Jul 3" },
      { zh: "7/26 构建结束", en: "Build closed Jul 26" },
      { zh: "8/5 公布赛果", en: "Winners Aug 5" },
    ],
    holderPerk: {
      zh: "N1NJ4 持有者专属奖项：Points Contest MVP 与 Goal Battle",
      en: "Exclusive N1NJ4 holder awards: Points Contest MVP and Goal Battle",
    },
    link: "https://x.com/HackQuest_/status/2084915186448867353",
    linkLabel: { zh: "查看赛果", en: "View results" },
    accent: "#c23a6b",
    tint: "rgba(255, 112, 150, 0.14)",
  },
  {
    id: "injective-nova-program",
    title: {
      zh: "Injective 新星计划",
      en: "Injective Nova Program",
    },
    organizer: {
      zh: "Injective × Microsoft × Web3Labs",
      en: "Injective × Microsoft × Web3Labs",
    },
    status: "ended",
    statusNote: { zh: "7/27 决赛完成", en: "Final completed Jul 27" },
    prize: "$10K+",
    participants: "89",
    summary: {
      zh: "面向 AI 原生团队的建设者计划，从项目征集、Top 10 辅导推进至 Final Demo Day，并正式揭晓最终 Top 3。",
      en: "A builder program for AI-native teams that progressed from open applications and Top 10 mentorship to a Final Demo Day and the announcement of its Top 3.",
    },
    results: {
      label: { zh: "获胜团队", en: "WINNERS" },
      items: [
        { zh: "Maneki AI", en: "Maneki AI" },
        { zh: "AlphaPal", en: "AlphaPal" },
        { zh: "桌面 AI 工作伙伴", en: "Desk-Side AI Work Buddy" },
      ],
    },
    image: "/stadium/injective-nova-official.jpg",
    imagePosition: "50% 45%",
    timeline: [
      { zh: "5/23 启动", en: "Kickoff May 23" },
      { zh: "7/13 Top 10", en: "Top 10 Jul 13" },
      { zh: "7/27 决赛", en: "Final Jul 27" },
    ],
    link: "https://x.com/injective/status/2085587748971335968",
    linkLabel: { zh: "查看官方结果", en: "View official results" },
    accent: "#6b46c1",
    tint: "rgba(150, 110, 230, 0.14)",
  },
];
