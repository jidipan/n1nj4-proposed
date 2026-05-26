import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./CityZeroPage.css";
import CityZeroTasks from "../components/CityZeroTasks";
import CityZeroInfoCarousel from "../components/CityZeroTasks/CityZeroInfoCarousel";
import AiExperienceProject from "../components/AiExperienceProject";
import AiResidencyEntry from "../components/AiResidencyEntry";
import { useLanguage } from "../context/useLanguage";
import { useRevealObserver } from "../hooks/useRevealObserver";

const CityZeroPage: React.FC = () => {
    const { language } = useLanguage();
    const translate = (zh: string, en: string) => (language === "zh" ? zh : en);
    const location = useLocation();
    useRevealObserver();

    // hash 导航 · 支持从 Home 点击 "AI 居民" 卡片跳到 /city-zero#ai-residency 后自动滚动
    useEffect(() => {
        if (!location.hash) return;
        const id = location.hash.slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        // 等首屏渲染稳定一帧, 避免提前 scroll
        const t = setTimeout(() => {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
        return () => clearTimeout(t);
    }, [location.hash]);
    const announcements = [
        translate("City Zero 建设", "City Zero Construction"),
        translate("AI 前沿训练营", "AI Frontier Bootcamp"),
    ];

    return (
        <div className="city-zero-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="scrolling-announcements">
                    <div className={`scrolling-text ${language === "zh" ? "scrolling-text-zh" : ""}`}>
                        {[...announcements, ...announcements].map((text, index) => (
                            <span key={`${text}-${index}`} className={index % 2 === 0 ? "text-color-1" : "text-color-2"}>
                                {text}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="hero-image-container">
                    <img src="/CityZero/city.png" alt="City Zero" className="hero-image" />
                    {/* Stadium Action Button */}
                    <Link to="/city-zero/stadium" className="stadium-action-btn" title={translate("进入体育场", "Enter Stadium")}>
                        <span className="btn-text">{translate("进入体育场", "ENTER STADIUM")}</span>
                        <div className="btn-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Info Section (Carousel) */}
            <CityZeroInfoCarousel />

            {/* AI Residency Entry Section · 静态版, 待后端就位后接入 apply flow */}
            <AiResidencyEntry />

            {/* AI Experience Project Section */}
            <AiExperienceProject />

            {/* Infinite Scrolling Tasks Section · COMMUNITY GALLERY · 已隐藏 (改 false → true 恢复) */}
            {false && <CityZeroTasks />}

            {/* COMMUNITY GALLERY · 静态网格 + hover 揭示交互 (无轮播) */}
            <CityZeroTasks
                titleZh="社区画廊"
                titleEn="COMMUNITY GALLERY"
                variant="static"
            />
        </div>
    );
};

export default CityZeroPage;
