import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./CityZeroPage.css";
import CityZeroTasks from "../components/CityZeroTasks";
import CityZeroInfoCarousel from "../components/CityZeroTasks/CityZeroInfoCarousel";
import AiExperienceProject from "../components/AiExperienceProject";
import AiResidencyEntry from "../components/AiResidencyEntry";
import CityLandmarks from "../components/CityLandmarks";
import StadiumEvents from "../components/StadiumEvents";
import { STADIUM_EVENTS } from "../data/stadiumEvents";
import { useLanguage } from "../context/useLanguage";
import { useRevealObserver } from "../hooks/useRevealObserver";

/* ====================================================================
 * City Zero · 开发者共创社区的城市界面
 * --------------------------------------------------------------------
 * Hero 之下重构为「共创社区」框架:
 *   章节 01 · 展示 (Showcase)  — 精选共建 + 社区项目网格 (合并 GALLERY + AI Experiment)
 *   章节 02 · 接入 (Submit)     — Fork→Build→PR→Featured 接入流程
 *   AI RESIDENCY              — agent 接入 (保留)
 *   City Dossier 城市档案       — What is / 公民 / Stadium (移到最后)
 * 旧版页面备份见 CityZeroPage.tsx.bak
 * ==================================================================== */

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
        const t = setTimeout(() => {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
        return () => clearTimeout(t);
    }, [location.hash]);

    // 滚动公告 · 与 the Stadium section 同源:展示本月真实活动名 (预告 → 详情呼应)
    const announcements = STADIUM_EVENTS.map((ev) =>
        translate(ev.title.zh, ev.title.en),
    );

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
                    {/* Stadium Action Button · 锚点滚到页内赛事看板 (旧 /city-zero/stadium 页仍是占位内容) */}
                    <a href="#stadium" className="stadium-action-btn" title={translate("进入体育场", "Enter Stadium")}>
                        <span className="btn-text">{translate("进入体育场", "ENTER STADIUM")}</span>
                        <div className="btn-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </a>
                </div>
            </section>

            {/* ============ the Stadium · 竞技场赛事看板 (HackQuest 合作) ============ */}
            <StadiumEvents />

            {/* ============ 地图即界面 · 城市地标控制台 ============ */}
            <CityLandmarks />

            {/* ============ 章节 01 · 展示 SHOWCASE (共创社区引导语并入章头) ============ */}
            <div id="community" className="cz-chapter cz-chapter-community">
                <header className="cz-chapter-head reveal">
                    <p className="section-kicker">{translate("共创社区 · 展示", "CO-CREATION COMMUNITY · SHOWCASE")}</p>
                    <h2 className="cz-chapter-title">{translate("社区已经建成的", "What the community has built")}</h2>
                    <p className="cz-chapter-lead">
                        {translate(
                            "City Zero 的样貌由社区的建设决定。先看大家已经建成了什么，再把你自己的项目接入这座城市。",
                            "City Zero is shaped by what the community builds. See what's already been made, then bring your own work into the city.",
                        )}
                    </p>
                </header>

                {/* 社区项目 (原 FEATURED BUILDS / COMMUNITY GALLERY) */}
                <CityZeroTasks titleZh="社区项目" titleEn="COMMUNITY PROJECTS" variant="static" />

                {/* 社区项目网格 (原 AI Experiment Projects · 仅展示) */}
                <AiExperienceProject mode="showcase" />
            </div>

            {/* ============ 章节 02 · 接入 BUILD & SUBMIT ============ */}
            <div id="submit" className="cz-chapter">
                <header className="cz-chapter-head reveal">
                    <p className="section-kicker">{translate("接入", "BUILD & SUBMIT")}</p>
                    <h2 className="cz-chapter-title">{translate("把你的项目接入城市", "Bring your build into the city")}</h2>
                </header>

                {/* 接入流程 (原 COMMUNITY BUILDS 提交流程) */}
                <AiExperienceProject mode="submit" />
            </div>

            {/* ============ AI RESIDENCY (保留 · agent 接入) ============ */}
            <AiResidencyEntry />

            {/* ============ City Dossier 城市档案 (移到最后) ============ */}
            <CityZeroInfoCarousel />
        </div>
    );
};

export default CityZeroPage;
