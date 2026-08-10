import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ImagePlaceholder from "../components/ImagePlaceholder/ImagePlaceholder";
import { useLanguage } from "../context/useLanguage";
import { NEWS, type NewsSection, type NewsStatus } from "../data/news";
import "./NewsListPage.css";

type NewsView = "all" | NewsSection;

const views: Array<{ key: NewsView; zh: string; en: string }> = [
  { key: "all", zh: "全部", en: "All" },
  { key: "latest", zh: "最新", en: "Latest" },
  { key: "storyline", zh: "专题", en: "Storylines" },
  { key: "insight", zh: "深度", en: "Insights" },
  { key: "archive", zh: "归档", en: "Archive" },
];

const statusLabels: Record<NewsStatus, { zh: string; en: string }> = {
  active: { zh: "进行中", en: "Active" },
  ended: { zh: "已结束", en: "Ended" },
  recap: { zh: "回顾", en: "Recap" },
  evergreen: { zh: "长期阅读", en: "Evergreen" },
};

function NewsListPage() {
  const { language } = useLanguage();
  const [view, setView] = useState<NewsView>("all");
  const t = (zh: string, en: string) => (language === "zh" ? zh : en);

  const items = useMemo(() => {
    const selected = view === "all" ? NEWS : NEWS.filter((item) => item.sections.includes(view));
    return [...selected].sort((a, b) => {
      const dateOrder = a.publishedAt.localeCompare(b.publishedAt);
      return view === "storyline" ? dateOrder : -dateOrder;
    });
  }, [view]);

  const viewCount = (key: NewsView) =>
    key === "all" ? NEWS.length : NEWS.filter((news) => news.sections.includes(key)).length;

  return (
    <div className="news-list-page">
      <div className="news-list-shell">
        <Link to="/" className="news-list-back">← {t("返回首页", "Back home")}</Link>

        <header className="news-list-header">
          <p className="section-kicker news-list-eyebrow">{t("城市情报", "CITY INTELLIGENCE")}</p>
          <h1>{t("城市快报", "CITY DISPATCH")}</h1>
          <p>
            {t(
              "浏览 Ninja Labs、合作社区与 Injective 生态动态。按内容生命周期寻找最新进展、连续专题、长期阅读与已结束活动。",
              "Follow Ninja Labs, partner communities, and the Injective ecosystem. Browse fresh updates, connected storylines, lasting insights, and completed events by content lifecycle.",
            )}
          </p>
        </header>

        <nav className="news-list-filters" aria-label={t("新闻筛选", "News filters")}>
          {views.map((item) => (
            <button
              key={item.key}
              type="button"
              className={view === item.key ? "active" : ""}
              aria-pressed={view === item.key}
              onClick={() => setView(item.key)}
            >
              {t(item.zh, item.en)}
              <span>{viewCount(item.key)}</span>
            </button>
          ))}
        </nav>

        {view === "storyline" && (
          <section className="news-storyline-intro">
            <span>{t("新星计划专题", "NOVA PROGRAM")}</span>
            <div>
              <h2>{t("Injective 新星计划", "Injective Nova Program")}</h2>
              <p>{t("从线上开营到 Final Demo Day，一条时间线读完整个计划。", "One timeline from kickoff to the Final Demo Day.")}</p>
            </div>
          </section>
        )}

        <div className={`news-library-grid news-library-${view}`} aria-live="polite">
          {items.map((item, index) => (
            <Link key={item.id} to={`/news/${item.id}`} className="news-library-card">
              {view === "storyline" && <span className="news-storyline-index">{String(index + 1).padStart(2, "0")}</span>}
              <div className={`news-library-visual news-library-visual-${item.catKey}`}>
                {item.image ? (
                  <ImagePlaceholder
                    src={item.image}
                    ratio="16 / 9"
                    label={t(item.imageLabel.zh, item.imageLabel.en)}
                    loading="lazy"
                  />
                ) : (
                  <span className="news-library-art" aria-hidden="true" />
                )}
              </div>
              <div className="news-library-body">
                <div className="news-library-meta">
                  <span className={`news-library-status status-${item.status}`}>
                    {t(statusLabels[item.status].zh, statusLabels[item.status].en)}
                  </span>
                  <time dateTime={item.publishedAt}>{item.date}</time>
                  <span>{t(item.category.zh, item.category.en)}</span>
                </div>
                <p className="news-library-source">{t(item.source.zh, item.source.en)}</p>
                <h2>{t(item.title.zh, item.title.en)}</h2>
                <p className="news-library-summary">{t(item.summary.zh, item.summary.en)}</p>
                <div className="news-library-card-foot">
                  {item.series ? (
                    <span>{t("新星计划专题", "NOVA STORYLINE")}</span>
                  ) : (
                    <span>{item.originalAuthor ? t(item.originalAuthor.zh, item.originalAuthor.en) : t(item.source.zh, item.source.en)}</span>
                  )}
                  <span>{t("阅读", "Read")} ↗</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewsListPage;
