import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./CityZeroTaskDetailPage.css"; // Reuse the same CSS for now
import { useLanguage } from "../../context/useLanguage";

const MetaloftDetailPage: React.FC = () => {
    const location = useLocation();
    const { language } = useLanguage();
    const translate = (zh: string, en: string) => (language === "zh" ? zh : en);
    const heroImage = (location.state as { heroImage?: string } | null)?.heroImage || "/CityZero/task_board.png";

    useEffect(() => {
        // Scroll to top on mount
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="task-detail-page">
            {/* Hero Section */}
            <section className="task-detail-hero">
                <img src={heroImage} alt={translate("Metaloft 项目图", "Metaloft")} className="task-detail-hero-image" />
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
                            <h1 className="task-title">Metaloft</h1>
                            <h3 className="task-subtitle">{translate("MetaLoft Lab 官方项目", "Official Project by MetaLoft Lab")}</h3>
                            <div className="task-tags">
                                <span className="task-tag">{translate("标签", "Tags")}</span>
                                <span className="task-tag">{translate("社交", "Social")}</span>
                                <span className="task-tag">{translate("数字空间", "Digital Space")}</span>
                                <span className="task-tag">{translate("社区", "Community")}</span>
                            </div>
                        </div>
                        <div className="task-head-right">
                            <a
                                href="https://www.metaloftlab.com/#faq"
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
                                        "MetaLoft 将自己定位为个人记忆空间与沉浸式数字生活社交平台，核心在于帮助用户创建并拥有可长期存在的数字空间，能够持续回访、个性化装饰，并与他人分享互动。",
                                        "MetaLoft positions itself as a personal memory space and an immersive social platform for digital living. The project focuses on helping users create and own persistent spaces they can return to, personalize, and share with others over time."
                                    )}
                                </p>
                                <p>
                                    {translate(
                                        "在 City Zero 中，Metaloft 作为社区项目连接了创作、社交互动与长期参与，目标是让数字空间更可居住、更可协作，而不仅仅是一次性交易场景。",
                                        "In City Zero, Metaloft is presented as a community project that connects creation, social interaction, and long-term participation. The idea is to make digital spaces more livable and collaborative, rather than only transactional."
                                    )}
                                </p>
                                <p>
                                    {translate(
                                        "本页面连接到 MetaLoft 官方网站，你可以在那里查看最新产品动态与 FAQ 说明。若要获取最新路线图和功能进展，请使用上方“项目官网”按钮。",
                                        "This page links to the official MetaLoft website for current product updates and FAQ details. If you want the newest roadmap and feature status, use the Event Website button above."
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

export default MetaloftDetailPage;
