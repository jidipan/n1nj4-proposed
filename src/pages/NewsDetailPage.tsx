import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";
import ImagePlaceholder from "../components/ImagePlaceholder/ImagePlaceholder";
import { getNewsById, NEWS } from "../data/news";
import "./NewsDetailPage.css";

/* ====================================================================
 * News Detail · 新闻详情页
 * --------------------------------------------------------------------
 * 框定单条新闻:海报 + 分类 + 来源 + 标题 + 摘要 + 「查看原文」外链。
 * 正文不逐字转载(版权 + 来源为登录墙);以摘要 + 原文出处呈现。
 * ==================================================================== */

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

  const related = NEWS.filter((n) => n.id !== item.id && n.catKey === item.catKey).slice(0, 3);

  return (
    <div className="news-detail-page">
      <div className="news-detail-shell">
        <Link to="/news" className="news-detail-back">← {t("返回城市快报", "Back to Dispatch")}</Link>

        <div className="news-detail-tagrow">
          <span className={`news-tk-tag news-tk-tag-${item.catKey}`}>{t(item.category.zh, item.category.en)}</span>
          <span className="news-detail-source">
            {item.source}{item.date ? ` · ${item.date}` : ""}
          </span>
        </div>

        <h1 className="news-detail-title">{t(item.title.zh, item.title.en)}</h1>

        <ImagePlaceholder
          className="news-detail-hero"
          src={item.image}
          ratio="16 / 9"
          label={t(`${item.imageLabel.zh} · 16:9`, `${item.imageLabel.en} · 16:9`)}
        />

        <p className="news-detail-summary">{t(item.summary.zh, item.summary.en)}</p>

        <div className="news-detail-body-note">
          {t(
            "完整正文请见原文出处。接入真实内容时,在此替换为撰写好的摘要或要点。",
            "Full text lives at the original source. Replace this with a written summary when wiring real content.",
          )}
        </div>

        <a className="news-detail-source-btn" href={item.url} target="_blank" rel="noopener noreferrer">
          {t("查看原文 →", "Read original →")}
        </a>

        {related.length > 0 && (
          <div className="news-detail-related">
            <h2 className="news-detail-related-title">{t("相关快报", "Related")}</h2>
            <div className="news-detail-related-grid">
              {related.map((r) => (
                <Link key={r.id} to={`/news/${r.id}`} className="news-detail-related-card">
                  <ImagePlaceholder src={r.image} ratio="16 / 9" label={t(r.imageLabel.zh, r.imageLabel.en)} />
                  <span className="news-detail-related-cat">{t(r.category.zh, r.category.en)} · {r.source}</span>
                  <span className="news-detail-related-name">{t(r.title.zh, r.title.en)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsDetailPage;
