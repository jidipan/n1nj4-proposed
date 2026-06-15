/* ====================================================================
 * stadiumEvents · 竞技场赛事数据 (HackQuest 合作 · 每月两场)
 * --------------------------------------------------------------------
 * 与 HackQuest (hackquest.io) 的内容同步在此维护:每月更新一次,
 * 替换为当月的两场活动。展示于 City Zero 页 the Stadium section。
 * status 颜色与文案映射见 StadiumEvents 组件。
 * 最近同步:2026-06-10
 * ==================================================================== */

export type StadiumEventStatus =
  | "upcoming" // 即将开始
  | "live" // 报名/进行中
  | "voting" // 社区投票中
  | "reviewing" // 评审中
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
  /** 活动题图 (热链 HackQuest CDN 官方 banner; 失效时组件显示占位块) */
  image?: string;
  /** 关键日期线, 按时间排列 */
  timeline: { zh: string; en: string }[];
  /** N1NJ4 持有者专属权益 (有则展示高亮条) */
  holderPerk?: { zh: string; en: string };
  link: string;
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
    status: "reviewing",
    statusNote: { zh: "6/10 提交截止 · 评审中", en: "Closed Jun 10 · in review" },
    prize: "$500",
    participants: "106",
    summary: {
      zh: "面向 solo builder 的 AI 编程冲刺:用 AI 构建实用工具、Agent 或工作流,可选接入 Injective 链上能力。",
      en: "An AI coding sprint for solo builders — ship useful tools, agents, or workflows powered by AI, with optional on-chain integration on Injective.",
    },
    image: "https://assets.hackquest.io/hackathons/_43LgMJGYr8xC5s9v2Wap.jpg",
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
    accent: "#f68535",
    tint: "rgba(255, 179, 71, 0.14)",
  },
];
