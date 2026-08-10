import { Link, useParams } from "react-router-dom";
import ImagePlaceholder from "../components/ImagePlaceholder/ImagePlaceholder";
import { useLanguage } from "../context/useLanguage";
import { getNewsById, NEWS, type NewsStatus } from "../data/news";
import "./NewsDetailPage.css";

const statusLabels: Record<NewsStatus, { zh: string; en: string }> = {
  active: { zh: "进行中", en: "Active" },
  ended: { zh: "已结束", en: "Ended" },
  recap: { zh: "回顾", en: "Recap" },
  evergreen: { zh: "长期阅读", en: "Evergreen" },
};

function NewsDetailPage() {
  const { id } = useParams();
  const { language } = useLanguage();
  const t = (zh: string, en: string) => (language === "zh" ? zh : en);
  const item = id ? getNewsById(id) : undefined;

  if (!item) {
    return (
      <div className="news-detail-page">
        <div className="news-detail-shell">
          <Link to="/news" className="news-detail-back">← {t("返回城市快报", "Back to Dispatch")}</Link>
          <p className="news-detail-missing">{t("未找到该新闻。", "News item not found.")}</p>
        </div>
      </div>
    );
  }

  const related = NEWS.filter(
    (news) => news.id !== item.id && news.sections.some((section) => item.sections.includes(section)),
  )
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);

  return (
    <div className="news-detail-page">
      <article className="news-detail-shell">
        <Link to="/news" className="news-detail-back">← {t("返回城市快报", "Back to Dispatch")}</Link>

        <div className="news-detail-brandline">
          <span>N1NJ4 // {t("城市快报", "CITY DISPATCH")}</span>
          <span className="news-detail-online"><i /> {t("在线", "ONLINE")}</span>
        </div>

        <div className="news-detail-tagrow">
          <span className={`news-detail-status status-${item.status}`}>
            {t(statusLabels[item.status].zh, statusLabels[item.status].en)}
          </span>
          <span>{t(item.category.zh, item.category.en)}</span>
          <time dateTime={item.publishedAt}>{item.date}</time>
        </div>

        <h1 className="news-detail-title">{t(item.title.zh, item.title.en)}</h1>
        <p className="news-detail-byline">
          {t(item.source.zh, item.source.en)}
          {item.originalAuthor && t(item.originalAuthor.zh, item.originalAuthor.en) !== t(item.source.zh, item.source.en)
            ? ` · ${t("原作者", "Original author")}: ${t(item.originalAuthor.zh, item.originalAuthor.en)}`
            : ""}
        </p>

        {item.image ? (
          <ImagePlaceholder
            className="news-detail-hero"
            src={item.image}
            ratio="16 / 9"
            label={t(item.imageLabel.zh, item.imageLabel.en)}
          />
        ) : (
          <div className={`news-detail-hero news-detail-abstract detail-${item.catKey}`} role="img" aria-label={t(item.imageLabel.zh, item.imageLabel.en)}>
            <span>N1NJ4 // {t("城市快报", "CITY DISPATCH")}</span>
            <i aria-hidden="true" />
          </div>
        )}

        <div className="news-detail-copy">
          <p className="news-detail-summary">{t(item.summary.zh, item.summary.en)}</p>
          <p className="news-detail-note">
            {t(
              "这是 CITY DISPATCH 的编辑导读。活动状态、产品参数和监管信息可能变化，请以原始发布方的最新说明为准。",
              "This is a CITY DISPATCH editorial briefing. Event status, product details, and regulatory information may change; consult the original publisher for the latest information.",
            )}
          </p>
        </div>

        {item.url && (
          <a className="news-detail-source-link" href={item.url} target="_blank" rel="noopener noreferrer">
            <span className="news-detail-source-link-label">{t("查看原文", "Read original")}</span>
            <span className="news-detail-source-link-url">{item.url}</span>
            <span className="news-detail-source-link-arrow" aria-hidden="true">↗</span>
          </a>
        )}

        {related.length > 0 && (
          <section className="news-detail-related">
            <h2>{t("继续阅读", "Continue reading")}</h2>
            <div className="news-detail-related-grid">
              {related.map((relatedItem) => (
                <Link key={relatedItem.id} to={`/news/${relatedItem.id}`} className="news-detail-related-card">
                  <span>{relatedItem.date} · {t(relatedItem.category.zh, relatedItem.category.en)}</span>
                  <strong>{t(relatedItem.title.zh, relatedItem.title.en)}</strong>
                  <em>{t("阅读", "Read")} ↗</em>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}

export default NewsDetailPage;
