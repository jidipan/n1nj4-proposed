import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/useLanguage";
import "./CityLandmarks.css";

/* ====================================================================
 * CityLandmarks · 地图即界面 · 城市地标
 * --------------------------------------------------------------------
 * 改版:按开放状态分层 (而非按城市功能分组) —— 导航只突出能走的路。
 *   NOW OPEN     · Stadium 一张横向入口卡 (内容本体在上方 the Stadium section)
 *   OPENING NEXT · Immigration Hall / Academy 两张预告卡 (不可点, 无假入口)
 *   CITY PLAN    · 其余地标收成一行 chips, 保留「城市随贡献生长」叙事
 * ==================================================================== */

interface Landmark {
  key: string;
  zh: string;
  en: string;
  fnZh: string;
  fnEn: string;
}

/* 已开放 (有真实功能才进这一层)
   to: "#..." = 页内锚点 · "/..." = 路由 (旧 /city-zero/stadium 页是占位内容, 暂锚回页内赛事看板) */
const OPEN: (Landmark & { to: string })[] = [
  {
    key: "stadium",
    zh: "竞技场",
    en: "Stadium",
    fnZh: "活动 · 黑客松 · Demo Day",
    fnEn: "Events · hackathons · Demo Day",
    to: "#stadium",
  },
];

/* 下一批开放 · 预告 */
const NEXT: Landmark[] = [
  {
    key: "passport",
    zh: "移民大厅",
    en: "Immigration Hall",
    fnZh: "开放后:身份注册 · Citizen ID · 徽章",
    fnEn: "When open: identity · Citizen ID · badges",
  },
  {
    key: "academy",
    zh: "学院",
    en: "Academy",
    fnZh: "开放后:新人上手 · 教程 · 导师",
    fnEn: "When open: onboarding · tutorials · mentors",
  },
];

/* 城市规划中 · 仅 chips */
const PLANNED: Landmark[] = [
  { key: "talent", zh: "人才大厦", en: "Talent Tower", fnZh: "项目发布 · 招募 · 任务板", fnEn: "Projects · recruiting · missions" },
  { key: "airesidency", zh: "AI 居民塔", en: "AI Residency", fnZh: "AI 注册 · 部署 Agent · 服务", fnEn: "Register · deploy agents · services" },
  { key: "bank", zh: "中央银行", en: "Central Bank", fnZh: "Grants 申请/发放 · 支付看板", fnEn: "Grants · payouts · treasury" },
  { key: "hall", zh: "市政厅", en: "City Hall", fnZh: "治理投票 · 定地标 · 立法", fnEn: "Voting · landmarks · laws" },
  { key: "monument", zh: "贡献纪念碑", en: "Monument", fnZh: "贡献数据 · 排行榜 · 名人堂", fnEn: "Contribution · leaderboards" },
  { key: "archive", zh: "档案馆", en: "Archive", fnZh: "编年史 · Lore · 历史决议", fnEn: "Chronicle · lore · decisions" },
  { key: "market", zh: "集市", en: "Market", fnZh: "交易 · 持有者授权 · 周边", fnEn: "Trading · licensing · merch" },
];

/* —— 地标 SVG 图标 (统一 stroke 线性) —— */
const ICONS: Record<string, React.ReactNode> = {
  passport: (<><rect x="3.5" y="4.5" width="17" height="15" rx="2.5" /><circle cx="9" cy="11" r="2.2" /><path d="M5.8 16.3c.4-1.6 1.7-2.4 3.2-2.4s2.7.8 3.1 2.4" /><path d="M14.5 9.5h4M14.5 12.5h4M14.5 15.3h3" /></>),
  academy: (<><path d="M12 4 22 9l-10 5L2 9l10-5Z" /><path d="M6 11v5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-5" /><path d="M22 9v4" /></>),
  talent: (<><path d="M3 21h18" /><rect x="6" y="3.5" width="12" height="17.5" rx="1.2" /><path d="M9.5 7h2M12.5 7h2M9.5 11h2M12.5 11h2M9.5 15h2M12.5 15h2" /></>),
  stadium: (<><ellipse cx="12" cy="12" rx="9" ry="5.5" /><ellipse cx="12" cy="12" rx="4" ry="2.4" /><path d="M3 12v3c0 3 4 5.5 9 5.5s9-2.5 9-5.5v-3" /></>),
  airesidency: (<><rect x="5" y="8" width="14" height="11" rx="3" /><path d="M12 8V4.5M12 4.5a1.4 1.4 0 1 0 0-.1Z" /><circle cx="9.3" cy="13" r="1.1" /><circle cx="14.7" cy="13" r="1.1" /><path d="M9.5 16.5h5" /></>),
  bank: (<><path d="M3 9 12 4l9 5" /><path d="M4 9v8M9 9v8M15 9v8M20 9v8" /><path d="M2.5 21h19" /></>),
  hall: (<><path d="M12 3.5 20 8H4l8-4.5Z" /><path d="M5.5 8v9M10 8v9M14 8v9M18.5 8v9" /><path d="M3 21h18M3 17.5h18" /></>),
  monument: (<><path d="M9.5 21h5" /><path d="M10 21l.6-13h2.8l.6 13" /><path d="M9.5 8h5l-2.5-4.5L9.5 8Z" /></>),
  archive: (<><rect x="4" y="3.5" width="13" height="6" rx="1" /><rect x="6" y="9.5" width="13" height="6" rx="1" /><rect x="4" y="15.5" width="13" height="5" rx="1" /></>),
  market: (<><path d="M4 9h16l-1 3H5L4 9Z" /><path d="M3.5 9 5 5h14l1.5 4" /><path d="M5.5 12v8h13v-8" /><path d="M10 20v-5h4v5" /></>),
};

const LandmarkIcon: React.FC<{ k: string }> = ({ k }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {ICONS[k]}
  </svg>
);

const CityLandmarks: React.FC = () => {
  const { language } = useLanguage();
  const t = (zh: string, en: string) => (language === "zh" ? zh : en);

  return (
    <section className="czl-section reveal">
      <div className="czl-container">
        <header className="czl-header">
          <p className="section-kicker">{t("地图即界面", "THE MAP IS THE INTERFACE")}</p>
          <h2 className="czl-title">{t("城市地标", "City Landmarks")}</h2>
          <p className="czl-lead">
            {t(
              "每个地标都是一个功能入口。城市随贡献生长——首座地标已开放,下一批正在建设。",
              "Every landmark is a function you can enter. The city grows with contribution — the first landmark is open, the next are under construction.",
            )}
          </p>
        </header>

        {/* ---- NOW OPEN · 横向入口卡 ---- */}
        <div className="czl-tier czl-tier-open">
          <span className="czl-tier-label">{t("已开放", "NOW OPEN")}</span>
          {OPEN.map((lm) => {
            const inner = (
              <>
                <span className="czl-icon">
                  <LandmarkIcon k={lm.key} />
                </span>
                <div className="czl-open-body">
                  <h4 className="czl-name">{t(lm.zh, lm.en)}</h4>
                  <p className="czl-fn">{t(lm.fnZh, lm.fnEn)}</p>
                </div>
                <span className="czl-open-cta">{t("进入 →", "Enter →")}</span>
              </>
            );
            return lm.to.startsWith("#") ? (
              <a key={lm.key} href={lm.to} className="czl-open-card">{inner}</a>
            ) : (
              <Link key={lm.key} to={lm.to} className="czl-open-card">{inner}</Link>
            );
          })}
        </div>

        {/* ---- OPENING NEXT · 预告卡 (不可点) ---- */}
        <div className="czl-tier czl-tier-next">
          <span className="czl-tier-label">{t("下一批开放", "OPENING NEXT")}</span>
          <div className="czl-next-grid">
            {NEXT.map((lm) => (
              <div key={lm.key} className="czl-card is-soon">
                <span className="czl-icon">
                  <LandmarkIcon k={lm.key} />
                </span>
                <div className="czl-body">
                  <div className="czl-namerow">
                    <h4 className="czl-name">{t(lm.zh, lm.en)}</h4>
                    <span className="czl-status czl-status-soon">
                      🏗 {t("建设中", "In construction")}
                    </span>
                  </div>
                  <p className="czl-fn">{t(lm.fnZh, lm.fnEn)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---- CITY PLAN · chips ---- */}
        <div className="czl-tier czl-tier-plan">
          <span className="czl-tier-label">{t("城市规划中", "ON THE CITY PLAN")}</span>
          <ul className="czl-plan">
            {PLANNED.map((lm) => (
              <li key={lm.key} className="czl-chip" title={t(lm.fnZh, lm.fnEn)}>
                <span className="czl-chip-icon">
                  <LandmarkIcon k={lm.key} />
                </span>
                {t(lm.zh, lm.en)}
              </li>
            ))}
          </ul>
          <p className="czl-plan-note">
            🗳 {t("下一座开放的地标,由公民投票决定。", "Citizens vote on which landmark opens next.")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CityLandmarks;
