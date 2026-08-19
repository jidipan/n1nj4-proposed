import { Link } from "react-router-dom";
import { ArrowIcon, SectionHeading } from "../components/PublicPage/PublicPage";
import "../components/PublicPage/PublicPage.css";
import { useLanguage } from "../context/useLanguage";
import { OPEN_REPOS, type OpenRepoStatus } from "../data/openRepos";
import "./CityZeroPage.css";
import "./OpenReposPage.css";

function OpenReposPage() {
  const { language } = useLanguage();
  const t = (zh: string, en: string) => (language === "zh" ? zh : en);
  const repoStatusLabel = (status: OpenRepoStatus | undefined) => {
    if (!status) return "";
    return {
      LIVE: t("已上线", "Live"),
      DEMO: t("演示", "Demo"),
      STARTER: t("启动模板", "Starter"),
      TUTORIAL: t("教程", "Tutorial"),
    }[status];
  };

  return (
    <div className="public-page repos-archive">
      <section className="public-section public-section--dark repos-archive__hero">
        <div className="public-shell">
          <Link to="/city-zero" className="repos-archive__back">← {t("返回 City Zero", "Back to City Zero")}</Link>
          <p className="public-eyebrow public-section-kicker">OPEN REPOS</p>
          <h1>{t("所有开放仓库", "All open repositories")}</h1>
          <p>{t(
            "完整浏览构成 City Zero 开放建设基础的产品、演示、启动模板与教程。",
            "Browse the complete collection of products, demos, starters, and tutorials supporting open building in City Zero.",
          )}</p>
        </div>
      </section>

      <section className="public-section public-section--soft repos-archive__index">
        <div className="public-shell">
          <div className="repos-archive__heading">
            <SectionHeading
              eyebrow={t("仓库索引", "REPOSITORY INDEX")}
              title={t(`${OPEN_REPOS.length} 个开放仓库`, `${OPEN_REPOS.length} open repositories`)}
              description={t(
                "新发布的仓库会进入 City Zero 的有限预览；所有历史项目都会继续保留在这里。",
                "New repositories enter the limited City Zero preview while the complete project history remains available here.",
              )}
            />
            <a className="repos-archive__github" href="https://github.com/Ninja-Labs-Devs" target="_blank" rel="noreferrer">
              {t("打开 GitHub", "Open GitHub")} <ArrowIcon />
            </a>
          </div>

          <div className="city-repos__card-grid repos-archive__grid">
            {OPEN_REPOS.map((repo) => (
              <Link key={repo.githubRepo} to={`/ai-project/${repo.githubRepo}`} state={{ imageSrc: repo.imageSrc }} className="city-repo-card">
                <div className="city-repo-card__media">
                  <img src={repo.imageSrc} alt="" loading="lazy" decoding="async" />
                  <span>{repoStatusLabel(repo.status)}</span>
                </div>
                <div className="city-repo-card__body">
                  <div className="city-repo-card__topline">
                    <h3>{repo.title}</h3>
                    <span className="city-repo-card__arrow" aria-hidden="true"><ArrowIcon /></span>
                  </div>
                  <p>{t(repo.descriptionZh || repo.description, repo.descriptionEn || repo.description)}</p>
                  <div className="city-repo-card__tags">{repo.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default OpenReposPage;
