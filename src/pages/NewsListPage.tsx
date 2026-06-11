import { Link } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";
import ImagePlaceholder from "../components/ImagePlaceholder/ImagePlaceholder";
import { NEWS } from "../data/news";
import "../components/NewsTicker/NewsTicker.css";
import "./NewsListPage.css";

/* News List · 城市快报 · 全部 */
function NewsListPage() {
  const { language } = useLanguage();
  const t = (zh: string, en: string) => (language === "zh" ? zh : en);

  return (
    <div className="news-list-page">
      <div className="news-list-shell">
        <Link to="/" className="news-detail-back">← {t("返回首页", "Back home")}</Link>
        <header className="news-list-header">
          <p className="section-kicker">{t("城市快报", "CITY DISPATCH")}</p>
          <h1 className="news-list-h1">{t("全部新闻", "All news")}</h1>
        </header>

        <div className="news-list-grid">
          {NEWS.map((item) => (
            <Link key={item.id} to={`/news/${item.id}`} className="news-tk-card">
              <div className="news-tk-top">
                <div className="news-tk-media">
                  <ImagePlaceholder src={item.image} ratio="16 / 9" label={t(item.imageLabel.zh, item.imageLabel.en)} />
                </div>
                <div className="news-tk-meta">
                  <div className="news-tk-tagrow">
                    <span className={`news-tk-tag news-tk-tag-${item.catKey}`}>{t(item.category.zh, item.category.en)}</span>
                    <span className="news-tk-source">{item.source}{item.date ? ` · ${item.date}` : ""}</span>
                  </div>
                  <h3 className="news-tk-title">{t(item.title.zh, item.title.en)}</h3>
                </div>
              </div>
              <p className="news-tk-desc">{t(item.summary.zh, item.summary.en)}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewsListPage;
