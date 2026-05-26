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
};

/* News Card · static variant 用. 默认只显示图 + meta + 标题 + tag,
   hover 时图片向上平移裁切顶部, body 描述淡入. */
const NewsCard: React.FC<TaskCardProps> = ({ category, imageSrc, title, description, linkUrl }) => {
    const cardContent = (
        <>
            {/* Top group · 图 + title + tag 整体一起 hover 时上移, 露出底部 desc */}
            <div className="city-news-card-top">
                <div className="city-news-card-image-wrapper">
                    <img src={imageSrc} alt={title} className="city-news-card-image" />
                </div>
                <div className="city-news-card-meta-block">
                    <h3 className="city-news-card-title">{title}</h3>
                    <span className="city-news-card-tag">{category}</span>
                </div>
            </div>
            {/* Desc · 绝对定位在卡片底部, 默认 opacity 0; hover 时随 top group 上滑后淡入 */}
            <p className="city-news-card-desc">{description}</p>
        </>
    );

    if (linkUrl) {
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
                <img src={imageSrc} alt={title} className="task-card-image" />
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
            imageSrc: "/CityZero/community_page1.png",
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
            imageSrc: "/CityZero/inj_pass.png",
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
            imageSrc: "/Ninja Labs CN-banner-2-2.jpg",
            title: "N1NJ4",
            description: isZh
                ? "N1NJ4 NFT 旨在构建专属的开发者社区身份系统。这是一个大规模生成艺术计划，也是一种全新的数字所有权与社区贡献激励模式。"
                : "N1NJ4 NFT is building a dedicated identity layer for developer communities. It combines large-scale generative art with digital ownership and contribution-based community incentives.",
            linkUrl: "/city-zero/n1nj4",
            date: isZh ? "2026 年 2 月 9 日" : "February 9, 2026",
            metaText: isZh ? "4 分钟阅读" : "4 mins"
        }
    ];

    const row2Data = getDuplicatedData([communityData[0], communityData[1], communityData[2]]);

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
                        {communityData.map((task, idx) => (
                            <NewsCard key={`news-${idx}`} {...task} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default CityZeroTasks;
