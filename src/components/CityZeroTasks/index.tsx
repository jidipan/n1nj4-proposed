import React from 'react';
import './CityZeroTasks.css';

import { Link } from 'react-router-dom';
import { useLanguage } from "../../context/useLanguage";

type TaskCardProps = {
    category: string;
    categoryColor: string; // e.g., '#93c5fd' for blue, '#fde047' for yellow, '#86efac' for green
    imageSrc: string;
    title: string;
    description: string;
    linkUrl?: string; // Made optional
    date?: string;        // 用于 static variant · e.g. "April 15, 2026"
    metaText?: string;    // 用于 static variant · e.g. "7 mins"
    badges?: string[];
    sourceText?: string;
};

const isExternalUrl = (url?: string) => Boolean(url && /^https?:\/\//i.test(url));

/* News Card · static variant 用. 默认只显示图 + meta + 标题 + tag,
   hover 时图片向上平移裁切顶部, body 描述淡入. */
const NewsCard: React.FC<TaskCardProps> = ({ category, imageSrc, title, description, linkUrl, badges = [], sourceText }) => {
    const cardContent = (
        <>
            {/* Top group · 图 + title + tag 整体一起 hover 时上移, 露出底部 desc */}
            <div className="city-news-card-top">
                <div className="city-news-card-image-wrapper">
                    <img src={imageSrc} alt={title} className="city-news-card-image" loading="lazy" decoding="async" />
                </div>
                <div className="city-news-card-meta-block">
                    <h3 className="city-news-card-title">{title}</h3>
                    {sourceText && <span className="city-news-card-source">{sourceText}</span>}
                    <div className="city-news-card-tags" aria-label="Project status">
                        <span className="city-news-card-tag">{category}</span>
                        {badges.map((badge) => (
                            <span className="city-news-card-tag city-news-card-status" key={badge}>{badge}</span>
                        ))}
                    </div>
                </div>
            </div>
            {/* Desc · 绝对定位在卡片底部, 默认 opacity 0; hover 时随 top group 上滑后淡入 */}
            <p className="city-news-card-desc">{description}</p>
        </>
    );

    if (linkUrl) {
        if (isExternalUrl(linkUrl)) {
            return (
                <a href={linkUrl} target="_blank" rel="noreferrer" className="city-news-card">
                    {cardContent}
                </a>
            );
        }
        return (
            <Link
                to={linkUrl}
                state={{ heroImage: imageSrc }}
                className="city-news-card"
            >
                {cardContent}
            </Link>
        );
    }
    return <article className="city-news-card">{cardContent}</article>;
};

const TaskCard: React.FC<TaskCardProps> = ({ category, categoryColor, imageSrc, title, description, linkUrl }) => {
    const cardContent = (
        <>
            <div
                className="task-card-header"
                style={{ backgroundColor: categoryColor }}
            >
                <span className="task-category">{category}</span>
            </div>
            <div className="task-card-image-wrapper">
                <img src={imageSrc} alt={title} className="task-card-image" loading="lazy" decoding="async" />
            </div>
            <div className="task-card-content">
                <h3 className="task-card-title">{title}</h3>
                <p className="task-card-desc">{description}</p>
            </div>
        </>
    );

    if (linkUrl) {
        return (
            <Link
                to={linkUrl}
                state={{ heroImage: imageSrc }}
                className="city-task-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
            >
                {cardContent}
            </Link>
        );
    }

    return (
        <div className="city-task-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            {cardContent}
        </div>
    );
};

// Helper to duplicate data to ensure marquee has enough length to loop
const getDuplicatedData = (data: TaskCardProps[], times: number = 4) => {
    let result: TaskCardProps[] = [];
    for (let i = 0; i < times; i++) {
        // We add an index to the map loop but the data itself is just repeated
        result = [...result, ...data];
    }
    return result;
}


interface CityZeroTasksProps {
    titleZh?: string;
    titleEn?: string;
    variant?: "marquee" | "static";
}

const CityZeroTasks: React.FC<CityZeroTasksProps> = ({
    titleZh = "社区画廊",
    titleEn = "COMMUNITY GALLERY",
    variant = "marquee",
}) => {
    const { language } = useLanguage();
    const isZh = language === "zh";

    const communityData: TaskCardProps[] = [
        {
            category: isZh ? "社区项目" : "Community Project",
            categoryColor: "#57a8d4",
            imageSrc: "/optimized/community/community-page1-900-v1.webp",
            title: "Metaloft",
            description: isZh
                ? "MetaLoft 是一个沉浸式平台，用户可在其中通过创作与社交自然拥有、交易并治理自己的数字空间。我们正在构建一个可居住、可社交、可创作、可变现的数字公寓生态。"
                : "MetaLoft is an immersive platform where users naturally own, trade, and govern their digital worlds through creation and social interaction. We are building a livable, social, creative, and monetizable digital apartment ecosystem, empowering every user to shape and inhabit a world that truly belongs to them, in the future.",
            linkUrl: "/city-zero/metaloft",
            date: isZh ? "2026 年 4 月 15 日" : "April 15, 2026",
            metaText: isZh ? "7 分钟阅读" : "7 mins"
        },
        {
            category: isZh ? "社区项目" : "Community Project",
            categoryColor: "#57a8d4",
            imageSrc: "/optimized/community/inj-pass-900-v1.webp",
            title: "Injective Pass",
            description: isZh
                ? "Injective Pass 通过抽象 Web3 身份流程，搭建 Web2 与 Web3 之间更顺滑的连接路径。"
                : "Injective Pass abstracts Web3 identity, creating the bridge between Web2 and Web3.",
            linkUrl: "/city-zero/injective-pass",
            date: isZh ? "2026 年 3 月 17 日" : "March 17, 2026",
            metaText: isZh ? "5 分钟阅读" : "5 mins"
        },
        {
            category: isZh ? "社区项目" : "Community Project",
            categoryColor: "#57a8d4",
            imageSrc: "/optimized/community/ninja-labs-banner-900-v1.webp",
            title: "N1NJ4",
            description: isZh
                ? "N1NJ4 NFT 旨在构建专属的开发者社区身份系统。这是一个大规模生成艺术计划，也是一种全新的数字所有权与社区贡献激励模式。"
                : "N1NJ4 NFT is building a dedicated identity layer for developer communities. It combines large-scale generative art with digital ownership and contribution-based community incentives.",
            linkUrl: "/city-zero/n1nj4",
            date: isZh ? "2026 年 2 月 9 日" : "February 9, 2026",
            metaText: isZh ? "4 分钟阅读" : "4 mins"
        },
        {
            category: isZh ? "社区项目" : "Community Project",
            categoryColor: "#57a8d4",
            imageSrc: "/optimized/community/adventurex-2026/makebook-960-v2.webp",
            title: "MAKEBOOK",
            description: isZh
                ? "面向实体商品的链上预售清算平台。买家提交最高可接受价格并锁定资金，达到最低生产量后统一清算并启动生产；未达成则自动全额退款。"
                : "An on-chain presale clearing platform for physical goods. Buyers lock funds at their maximum price; orders clear at one price when the minimum production quantity is met, or refund automatically.",
            linkUrl: "https://makebook.hk2048.online",
            badges: [isZh ? "早期项目" : "Early Stage", isZh ? "测试网产品" : "Testnet Demo"],
            sourceText: "AdventureX 2026 · Injective"
        },
        {
            category: isZh ? "社区项目" : "Community Project",
            categoryColor: "#57a8d4",
            imageSrc: "/optimized/community/adventurex-2026/agentland-960-v1.webp",
            title: "Agentland",
            description: isZh
                ? "将任意照片转化为拥有个性、记忆和技能的 AI 宠物。用户可以与 Agent 对话、探索不断演化的世界，并在 Injective 上验证和交易技能。"
                : "Turn any photo into an AI pet with personality, memories, and skills. Chat with agents, explore evolving worlds, and verify or trade agent skills on Injective.",
            linkUrl: "https://agentland.throughtheglass.art",
            badges: [isZh ? "早期项目" : "Early Stage", isZh ? "在线体验" : "Live Demo"],
            sourceText: "AdventureX 2026 · Injective"
        },
        {
            category: isZh ? "社区项目" : "Community Project",
            categoryColor: "#57a8d4",
            imageSrc: "/optimized/community/adventurex-2026/star-aligned-960-v1.webp",
            title: "Star Aligned",
            description: isZh
                ? "帮助用户发现价值观相近的朋友并在线下建立真实连接。Friend Device 会把现实互动转化为链上可验证的关系，为社区协作与奖励提供基础。"
                : "An AI social experience for finding aligned friends and building real-world connections. Friend Device turns in-person interactions into verifiable on-chain relationships for community coordination and rewards.",
            linkUrl: "https://star-aligned.com",
            badges: [isZh ? "早期项目" : "Early Stage", isZh ? "在线体验" : "Live Demo"],
            sourceText: "AdventureX 2026 · Injective"
        },
        {
            category: isZh ? "社区项目" : "Community Project",
            categoryColor: "#57a8d4",
            imageSrc: "/optimized/community/adventurex-2026/injenium-960-v2.webp",
            title: "Injenium",
            description: isZh
                ? "面向具身智能 Agent 的链上技能经济。机器人可将经验提炼为可验证的技能配方，在沙盒中校验，并通过 Injective 托管结算完成技能交易。"
                : "An on-chain skill economy for embodied agents. Robots distill experience into verifiable recipes, validate them in a sandbox, and trade skills through escrow settlement on Injective.",
            linkUrl: "https://x.com/Injeniumszdr/status/2087159118427472355",
            badges: [isZh ? "早期项目" : "Early Stage", isZh ? "演示视频" : "Demo Video"],
            sourceText: "AdventureX 2026 · Injective"
        },
        {
            category: isZh ? "社区项目" : "Community Project",
            categoryColor: "#57a8d4",
            imageSrc: "/optimized/community/adventurex-2026/shiftx-960-v1.webp",
            title: "ShiftX · Night Shift",
            description: isZh
                ? "一款异步侦探叙事游戏：玩家白天分析线索、做出选择，夜晚则把调查交给侦探继续推进，将互动故事、UGC 与链上数字艺术结合。"
                : "An asynchronous detective game where players analyze clues by day and hand the investigation to their detective at night, combining interactive storytelling, UGC, and on-chain digital art.",
            linkUrl: "https://shiftx.top",
            badges: [isZh ? "早期项目" : "Early Stage", isZh ? "在线体验" : "Live Demo"],
            sourceText: "AdventureX 2026 · Injective"
        },
        {
            category: isZh ? "社区项目" : "Community Project",
            categoryColor: "#57a8d4",
            imageSrc: "/optimized/community/adventurex-2026/alphaswipe-960-v1.webp",
            title: "AlphaSwipe",
            description: isZh
                ? "把股票与加密市场信息整理成滑动式决策流：左滑看多、右滑看空、上滑跳过，并可继续查看交易逻辑与上下文分析。"
                : "A swipe-based decision feed for stock and crypto signals: swipe left for long, right for short, or up to skip, then inspect the thesis and contextual analysis behind each idea.",
            linkUrl: "https://alpha-swipe.xiadezhi2001.workers.dev",
            badges: [isZh ? "早期项目" : "Early Stage", isZh ? "在线体验" : "Live Demo"],
            sourceText: "AdventureX 2026 · Injective"
        },
        {
            category: isZh ? "社区项目" : "Community Project",
            categoryColor: "#57a8d4",
            imageSrc: "/optimized/community/adventurex-2026/arena402-960-v1.webp",
            title: "Arena402",
            description: isZh
                ? "让 AI Agent 在真实经济压力下交易、谈判、虚张声势并相互结算的竞技场。项目以回合制市场模拟测试 Agent 的策略与 A2A 支付能力。"
                : "An arena where AI agents trade, negotiate, bluff, and settle with one another under real economic pressure, using round-based market simulations to test strategy and agent-to-agent payments.",
            linkUrl: "https://arena402.com",
            badges: [isZh ? "早期项目" : "Early Stage", isZh ? "在线体验" : "Live Demo"],
            sourceText: "AdventureX 2026 · Injective"
        }
    ];

    const row2Data = getDuplicatedData([communityData[0], communityData[1], communityData[2]]);
    const staticCommunityData = [...communityData.slice(3), ...communityData.slice(0, 3)];

    return (
        <section className="city-tasks-section reveal">
            <div className="city-tasks-container">
                <p className="section-kicker city-tasks-kicker">{isZh ? titleZh : titleEn}</p>

                {variant === "marquee" ? (
                    <div className="tasks-marquee-container">
                        {/* Row 2: Right to Left */}
                        <div className="marquee-row marquee-right-to-left">
                            <div className="marquee-track">
                                {row2Data.map((task, idx) => (
                                    <TaskCard key={`row2-${idx}`} {...task} />
                                ))}
                            </div>
                            {/* Duplicate track for seamless infinite scroll */}
                            <div className="marquee-track">
                                {row2Data.map((task, idx) => (
                                    <TaskCard key={`row2-dup-${idx}`} {...task} />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="tasks-static-grid">
                        {staticCommunityData.map((task, idx) => (
                            <NewsCard key={`news-${idx}`} {...task} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default CityZeroTasks;
