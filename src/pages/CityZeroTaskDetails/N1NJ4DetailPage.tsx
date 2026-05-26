import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./CityZeroTaskDetailPage.css";
import { useLanguage } from "../../context/useLanguage";

const N1NJ4DetailPage: React.FC = () => {
    const location = useLocation();
    const { language } = useLanguage();
    const translate = (zh: string, en: string) => (language === "zh" ? zh : en);
    const heroImage = (location.state as { heroImage?: string } | null)?.heroImage || "/CityZero/grants_hub.png";

    useEffect(() => {
        // Scroll to top on mount
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="task-detail-page">
            {/* Hero Section */}
            <section className="task-detail-hero">
                <img src={heroImage} alt={translate("N1NJ4 项目图", "N1NJ4")} className="task-detail-hero-image" />
            </section>

            {/* Content Section */}
            <section className="task-detail-content-section">
                <div className="task-detail-content">

                    {/* Return Navigation */}
                    <Link to="/city-zero" className="back-link">
                        {translate("← 返回 City Zero", "← Back to City Zero")}
                    </Link>

                    {/* Header Info Route */}
                    <div className="task-head-info">
                        <div className="task-head-left">
                            <h1 className="task-title">N1NJ4</h1>
                            <h3 className="task-subtitle">
                                {translate(
                                    "面向开发者、建设者与 AI 的去中心化城市",
                                    "A decentralized city for developers, builders, and AI"
                                )}
                            </h3>
                            <div className="task-tags">
                                <span className="task-tag">{translate("标签", "Tags")}</span>
                                <span className="task-tag">{translate("City Zero", "City Zero")}</span>
                                <span className="task-tag">{translate("链上身份", "On-Chain Identity")}</span>
                                <span className="task-tag">{translate("治理", "Governance")}</span>
                            </div>
                        </div>
                        <div className="task-head-right">
                            <a
                                href="https://n1nj4.mintlify.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="event-website-btn"
                            >
                                {translate("项目官网", "Event Website")}
                            </a>
                        </div>
                    </div>

                    <hr className="task-divider" />

                    {/* Split Body Layout */}
                    <div className="task-body-layout">
                        {/* Left Content */}
                        <div className="task-main-content">
                            <h4 className="task-section-title">{translate("项目详情", "Event Detail Description")}</h4>
                            <div className="task-description">
                                <p>
                                    {translate(
                                        "N1NJ4 是由 Ninja Labs 发起、面向开发者原生的去中心化生态。其首个核心基础设施是 City Zero：一个构建在 Injective 上的数字城市，让开发者、创作者和 AI 代理从第一天就能以“拥有者”身份参与建设，而不是把价值沉淀到中心化平台。",
                                        "N1NJ4 is a developer-native decentralized ecosystem initiated by Ninja Labs. Its first major infrastructure layer is City Zero, a digital city built on Injective where developers, creators, and AI agents can build with ownership from day one instead of contributing value to a centralized platform."
                                    )}
                                </p>
                                <p>
                                    {translate(
                                        "核心基础单元是 N1NJ4 链上身份。持有 N1NJ4 身份凭证即获得 City Zero 市民资格，并解锁治理参与、生态资源与经济活动入口。该身份层强调自我主权、长期可持续、可组合，并可同时服务于人类居民与 AI 居民。",
                                        "The core primitive is N1NJ4 on-chain identity. Holding the N1NJ4 identity credential establishes citizenship in City Zero and unlocks participation in governance, ecosystem resources, and economic activity. The identity layer is designed to be self-sovereign, persistent, composable, and usable by both human citizens and AI residents."
                                    )}
                                </p>
                                <p>
                                    {translate(
                                        "City Zero 通过两套机制构建实用型建设者经济：社区资助（Grants）与孵化（Incubation）。资助以里程碑为导向、由社区治理并保持链上透明；孵化则在此基础上提供持续资金、技术协作、导师支持与分发资源，且不强制股权绑定或排他条款。",
                                        "City Zero also defines a practical builder economy through two programs: community grants and incubation. Grants are milestone-based, community-governed, and on-chain transparent. Incubation extends this with sustained funding, technical collaboration, mentorship, and distribution support without mandatory equity or exclusivity requirements."
                                    )}
                                </p>
                                <p>
                                    {translate(
                                        "长期目标是“增长共享”：所有为 City Zero 建设做出贡献的人，都应分享生态增长红利。治理与金库方向将逐步由市民驱动，并将信誉与贡献记录沉淀在链上，以便长期可验证、可衡量、可激励。",
                                        "The long-term thesis is growth sharing: contributors who help construct City Zero should share in its upside. Governance and treasury direction are intended to be citizen-led, with reputation and contribution records preserved on-chain so participation can be verified and rewarded over time."
                                    )}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default N1NJ4DetailPage;
