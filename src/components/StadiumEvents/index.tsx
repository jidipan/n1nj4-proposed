import React from "react";
import { useLanguage } from "../../context/useLanguage";
import ImagePlaceholder from "../ImagePlaceholder/ImagePlaceholder";
import { STADIUM_EVENTS, type StadiumEventStatus } from "../../data/stadiumEvents";
import "./StadiumEvents.css";

/* ====================================================================
 * StadiumEvents · the Stadium · 竞技场赛事看板
 * --------------------------------------------------------------------
 * City Zero 页 hero 与 CityLandmarks 之间的赛事 section。
 * 与 HackQuest 合作:每月两场活动在此同步展示 (数据见 data/stadiumEvents.ts)。
 * 沿用站点 Variant A:暖奶白底、毛玻璃卡、橙 kicker、居中头部。
 * ==================================================================== */

const STATUS_LABEL: Record<StadiumEventStatus, { zh: string; en: string }> = {
  upcoming: { zh: "即将开始", en: "Upcoming" },
  live: { zh: "进行中", en: "Live" },
  voting: { zh: "投票中", en: "Voting" },
  reviewing: { zh: "评审中", en: "Reviewing" },
  ended: { zh: "已结束", en: "Ended" },
};

const StadiumEvents: React.FC = () => {
  const { language } = useLanguage();
  const t = (zh: string, en: string) => (language === "zh" ? zh : en);
  const eventCount = STADIUM_EVENTS.length;
  const gridMode =
    eventCount === 1
      ? "single"
      : eventCount === 2
        ? "double"
        : eventCount === 3
          ? "triple"
          : "scroll";

  return (
    <section id="stadium" className="se-section reveal">
      <div className="se-container">
        <header className="se-header">
          <p className="section-kicker">{t("竞技场", "THE STADIUM")}</p>
          <h2 className="se-title">
            {t("这座城市正在比什么", "What the city is competing in")}
          </h2>
          <p className="se-lead">
            {t(
              "City Zero 的赛事场馆——与 HackQuest 合作,每月两场活动在此同步。",
              "City Zero's events arena — in partnership with HackQuest, two events land here every month.",
            )}
          </p>
        </header>

        <div
          className={`se-grid se-grid-${gridMode}`}
          tabIndex={gridMode === "scroll" ? 0 : undefined}
          aria-label={
            gridMode === "scroll"
              ? t("横向滚动浏览赛事", "Scroll horizontally to browse events")
              : undefined
          }
        >
          {STADIUM_EVENTS.map((ev) => (
            <article
              key={ev.id}
              className="se-card"
              style={
                {
                  "--se-accent": ev.accent,
                  "--se-tint": ev.tint,
                } as React.CSSProperties
              }
            >
              <div className="se-card-media">
                <ImagePlaceholder
                  src={ev.image}
                  ratio="3 / 1"
                  label={t(ev.title.zh, ev.title.en)}
                  loading="lazy"
                />
              </div>

              <div className="se-card-body">
                <div className="se-card-toprow">
                  <span className={`se-status se-status-${ev.status}`}>
                    <i className="se-status-dot" aria-hidden="true" />
                    {t(STATUS_LABEL[ev.status].zh, STATUS_LABEL[ev.status].en)}
                  </span>
                  <span className="se-status-note">
                    {t(ev.statusNote.zh, ev.statusNote.en)}
                  </span>
                </div>

                <h3 className="se-card-title">{t(ev.title.zh, ev.title.en)}</h3>

                {/* 关键信息一行读完: 主办 · 奖池 · 参与者 */}
                <p className="se-card-meta">
                  <span>{t(ev.organizer.zh, ev.organizer.en)}</span>
                  <span className="se-meta-strong">
                    {ev.prize} {t("奖池", "prize pool")}
                  </span>
                  {ev.participants && (
                    <span>
                      {ev.participants} {t("参与者", "builders")}
                    </span>
                  )}
                </p>

                <ul className="se-timeline">
                  {ev.timeline.map((step, i) => (
                    <li key={i}>{t(step.zh, step.en)}</li>
                  ))}
                </ul>

                <div className="se-card-bottomrow">
                  {ev.holderPerk ? (
                    <p className="se-holder-perk">
                      {t(ev.holderPerk.zh, ev.holderPerk.en)}
                    </p>
                  ) : (
                    <span />
                  )}
                  <a
                    href={ev.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="se-card-cta"
                  >
                    {t("在 HackQuest 查看", "View on HackQuest")} ↗
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* 旧 /city-zero/stadium 页仍是占位内容, 入口暂撤; 待其接入 stadiumEvents 数据后恢复 */}
        <div className="se-footer">
          <span className="se-powered">Powered by HackQuest</span>
        </div>
      </div>
    </section>
  );
};

export default StadiumEvents;
