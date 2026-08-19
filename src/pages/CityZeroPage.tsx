import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SubmitProjectModal from "../components/AiExperienceProject/SubmitProjectModal";
import {
  ArrowIcon,
  NumberMark,
  SectionHeading,
  StatusBadge,
  type ProductStatus,
} from "../components/PublicPage/PublicPage";
import "../components/PublicPage/PublicPage.css";
import { useLanguage } from "../context/useLanguage";
import { OPEN_REPOS, type OpenRepoStatus } from "../data/openRepos";
import { STADIUM_EVENTS } from "../data/stadiumEvents";
import "./CityZeroPage.css";

const repoProductStatus: Record<OpenRepoStatus, ProductStatus> = {
  LIVE: "live",
  DEMO: "prototype",
  STARTER: "beta",
  TUTORIAL: "beta",
};

const CITY_ZERO_REPO_PREVIEW_LIMIT = 8;

function CityZeroPage() {
  const { language } = useLanguage();
  const t = (zh: string, en: string) => (language === "zh" ? zh : en);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [featuredRepoIndex, setFeaturedRepoIndex] = useState(0);
  const submissionEnabled = Boolean(import.meta.env.VITE_GOOGLE_SHEET_API);
  const announcements = STADIUM_EVENTS.map((event) => t(event.title.zh, event.title.en));
  const carouselRepos = OPEN_REPOS.slice(0, CITY_ZERO_REPO_PREVIEW_LIMIT);
  const featuredRepo = carouselRepos[featuredRepoIndex];
  const repoCards = carouselRepos;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setFeaturedRepoIndex((current) => (current + 1) % carouselRepos.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [carouselRepos.length]);

  const showPreviousRepo = () => setFeaturedRepoIndex((current) => (current - 1 + carouselRepos.length) % carouselRepos.length);
  const showNextRepo = () => setFeaturedRepoIndex((current) => (current + 1) % carouselRepos.length);
  const repoStatusLabel = (status: OpenRepoStatus | undefined) => {
    if (!status) return "";
    return {
      LIVE: t("已上线", "Live"),
      DEMO: t("演示", "Demo"),
      STARTER: t("启动模板", "Starter"),
      TUTORIAL: t("教程", "Tutorial"),
    }[status];
  };
  const cityPrinciples = [
    {
      number: "01",
      name: "IDENTITY",
      title: t("身份", "Identity"),
      description: t(
        "City Zero 从可验证的身份开始。无论人类还是 AI，居民都应能够清楚说明身份来源、所有权与公开记录。",
        "City Zero begins with verifiable identity. Whether human or AI, residents should be able to make their origin, ownership, and public record clear.",
      ),
      link: true,
    },
    {
      number: "02",
      name: "HABITAT",
      title: t("栖息地", "Habitat"),
      description: t(
        "City Zero 被设计为开发者、创作者与 AI 建设和发布真实项目的共同空间，并在成长过程中保留对作品的所有权。",
        "City Zero is designed as a shared place where developers, creators, and AI build and release real projects while retaining ownership of their work.",
      ),
      link: false,
    },
    {
      number: "03",
      name: "GROWTH SHARING",
      title: t("增长共享", "Growth Sharing"),
      description: t(
        "长期愿景是将可验证的贡献与城市成长联系起来。具体规则、合约与分配机制尚未上线。",
        "The long-term vision is to connect verifiable contribution with the city's growth. Rules, contracts, and distribution mechanisms are not yet live.",
      ),
      link: false,
    },
  ];

  return (
    <div className="public-page city-reframed">
      <section className="public-hero city-reframed__hero">
        <div className="city-hero-marquee" aria-label={t("City Zero 活动公告", "City Zero event announcements")}>
          <div className="city-hero-marquee__track">
            {[0, 1].map((group) => (
              <div key={group} className="city-hero-marquee__group" aria-hidden={group === 1}>
                {announcements.map((announcement, index) => (
                  <span key={`${group}-${announcement}`} className={index % 2 === 0 ? "is-light" : "is-lime"}>{announcement}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="public-hero__media">
          <img src="/optimized/city-zero/city-hero-1920-v2.webp" alt="" decoding="async" fetchPriority="high" />
        </div>
        <div className="public-shell public-hero__content">
          <p className="public-eyebrow public-section-kicker">CITY ZERO · BUILT BY CONTRIBUTORS</p>
          <h1>{t("每一个项目，都在塑造 City Zero", "Every build shapes City Zero")}</h1>
          <p className="public-hero__lead">
            {t(
              "建设真实可用的项目，让它成为 City Zero 的一部分。",
              "Build something real and make it part of City Zero.",
            )}
          </p>
          <div className="public-actions">
            <a href="#build" className="public-button">{t("开始建设", "Start building")} <ArrowIcon /></a>
            <Link to="/#community-projects" className="public-button public-button--ghost">{t("查看已有项目", "See what others built")} <ArrowIcon /></Link>
          </div>
        </div>
      </section>

      <section className="public-section public-section--soft city-about">
        <div className="public-shell">
          <header className="city-about__kicker-heading">
            <p className="public-eyebrow public-section-kicker">WHAT IS CITY ZERO</p>
          </header>
          <div className="city-about__intro">
            <div className="city-about__copy">
              <h2>{t("一座由贡献者共同塑造的城市", "A city shaped by its contributors")}</h2>
              <p className="public-section-lead">
                {t(
                  "City Zero 是 N1NJ4 在 Injective 上建设的数字城市，由可验证的居民身份和建设者公开发布的真实项目共同塑造。它的长期愿景围绕身份、栖息地与增长共享展开。",
                  "City Zero is N1NJ4's digital city on Injective, shaped by verifiable resident identities and real projects released in public. Its long-term vision is built around identity, habitat, and shared growth.",
                )}
              </p>
            </div>
            <figure className="city-about__media">
              <img
                src="/optimized/city-zero/city-dossier-2-1200-v1.webp"
                alt={t("夕阳下的 City Zero 城市与桥梁", "City Zero skyline and bridge at sunset")}
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>
          <div className="public-card-grid public-card-grid--3 city-principles__grid">
            {cityPrinciples.map((principle) => (
              <article key={principle.name} className="public-card city-principle">
                <div className="city-principle__topline">
                  <NumberMark>{principle.number}</NumberMark>
                  <span>{principle.name}</span>
                </div>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
                {principle.link && (
                  <Link className="public-card__link" to="/citizenship">
                    {t("了解 Citizenship", "Explore Citizenship")} <ArrowIcon />
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section public-section--white city-stadium">
        <div className="public-shell">
          <div className="city-stadium__banner">
            <img src="/optimized/city-zero/stadium-card-1200-v1.webp" alt="" loading="lazy" decoding="async" />
            <div className="city-stadium__content">
              <p className="public-eyebrow public-section-kicker">THE STADIUM</p>
              <h2>{t("当前活动与参与机会", "Events and ways to participate")}</h2>
              <p>
                {t(
                  "Stadium 汇集重要赛事、建设者挑战与公开参与机会，让居民能够关注并参与城市正在发生的活动。",
                  "The Stadium brings together major events, builder challenges, and public opportunities for residents to follow and join.",
                )}
              </p>
              <Link to="/#city-highlights" className="public-button">
                {t("查看当前活动", "View current events")} <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="public-section public-section--soft city-repos">
        <div className="public-shell">
          <header className="city-repos__kicker-heading">
            <p className="public-eyebrow public-section-kicker">OPEN REPOS</p>
          </header>
          <div className="city-repos__showcase">
            <div className="city-repos__heading">
              <header className="public-section-heading public-section-heading--left">
                <h2>{t("探索塑造 City Zero 的代码", "Explore the code shaping City Zero")}</h2>
                <p className="public-section-lead">{t(
                  "十个公开仓库，从已经上线的产品和演示项目，到可以直接开始建设的模板与教程。",
                  "Ten public repositories, from live products and demos to starter kits and learning projects you can build from.",
                )}</p>
              </header>
              <a className="city-repos__github" href="https://github.com/Ninja-Labs-Devs" target="_blank" rel="noreferrer">
                {t("查看 GitHub 组织", "View GitHub organization")} <ArrowIcon />
              </a>
            </div>

            <div className="city-repos__featured" aria-label={t("开放仓库轮播", "Open repository carousel")}>
              {featuredRepo && (
                <Link
                  key={featuredRepo.githubRepo}
                  to={`/ai-project/${featuredRepo.githubRepo}`}
                  state={{ imageSrc: featuredRepo.imageSrc }}
                  className="city-repo-feature"
                >
                  <div className="city-repo-feature__media">
                    <img src={featuredRepo.imageSrc} alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="city-repo-feature__body">
                    <div className="city-repo-feature__topline">
                      {featuredRepo.status && <StatusBadge status={repoProductStatus[featuredRepo.status]} language={language} label={repoStatusLabel(featuredRepo.status)} />}
                      <span className="city-repo-feature__arrow" aria-hidden="true"><ArrowIcon /></span>
                    </div>
                    <h3>{featuredRepo.title}</h3>
                    <p>{t(featuredRepo.descriptionZh || featuredRepo.description, featuredRepo.descriptionEn || featuredRepo.description)}</p>
                    <div className="city-repo-feature__tags">
                      {featuredRepo.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                  </div>
                </Link>
              )}
              <div className="city-repos__featured-controls">
                <span>{String(featuredRepoIndex + 1).padStart(2, "0")} / {String(carouselRepos.length).padStart(2, "0")}</span>
                <div>
                  <button type="button" onClick={showPreviousRepo} aria-label={t("上一个仓库", "Previous repository")}>←</button>
                  <button type="button" onClick={showNextRepo} aria-label={t("下一个仓库", "Next repository")}>→</button>
                </div>
              </div>
            </div>
          </div>

          <div className="city-repos__index">
            <div className="city-repos__card-grid">
              {repoCards.map((repo) => (
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
            <div className="city-repos__view-all">
              <Link to="/city-zero/repos" className="public-button public-button--dark">
                {t("查看全部仓库", "View all repos")} <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="build" className="public-section public-section--dark city-build">
        <div className="public-shell">
          <div className="city-build__heading">
            <SectionHeading
              eyebrow={t("建设与提交", "BUILD & SUBMIT")}
              title={t("让一个仓库成为城市的一部分", "Turn a repository into part of the city")}
              description={t(
                "准备一个公开、可运行的项目，清楚介绍它的用途、核心功能与体验入口，并在提交开放时将它带入 City Zero。",
                "Prepare a public, runnable project with a clear purpose, core features, and an accessible demo—then bring it into City Zero when submissions open.",
              )}
            />
          </div>
          <div className="city-build__meta">
            <StatusBadge status={submissionEnabled ? "beta" : "planned"} language={language} label={submissionEnabled ? t("审核队列试运行", "Review queue beta") : t("提交入口未开放", "Intake not open")} />
          </div>

          <ol className="city-build__steps">
            <li><NumberMark>01</NumberMark><h3>{t("准备项目", "Prepare the project")}</h3><p>{t("整理自己的现有项目，或从一个新的公开仓库开始。", "Develop an existing project or begin with a new public repository.")}</p></li>
            <li><NumberMark>02</NumberMark><h3>{t("做出可运行成果", "Ship something runnable")}</h3><p>{t("写清用途、技术栈、核心功能和体验入口。", "Document purpose, stack, key features, and a runnable entry point.")}</p></li>
            <li><NumberMark>03</NumberMark><h3>{t("提交审核", "Submit for review")}</h3><p>{t("团队核对资料、可访问性与展示信息。", "The team reviews project details, accessibility, and listing information.")}</p></li>
            <li><NumberMark>04</NumberMark><h3>{t("进入公开展示", "Enter public discovery")}</h3><p>{t("通过审核的项目将以真实状态公开展示，供社区发现与体验。", "Approved projects are published with their real status for the community to discover and explore.")}</p></li>
          </ol>

          <div className="city-build__actions">
            <div className="city-build__action-buttons">
              <button type="button" className="public-button" onClick={() => setIsSubmitOpen(true)}>
                {t("提交你的项目", "Submit your project")} <ArrowIcon />
              </button>
              <a href="https://github.com/Ninja-Labs-Devs" target="_blank" rel="noreferrer" className="public-button public-button--ghost">
                {t("浏览开源仓库", "Browse repos")} <ArrowIcon />
              </a>
            </div>
            <span>{submissionEnabled ? t("公开仓库 · 简介 · 核心功能 · 技术标签", "Public repo · summary · key features · tech tags") : t("项目提交目前尚未开放。你仍可以提前准备公开仓库、项目简介、体验入口与技术标签。", "Project submissions are currently closed. You can still prepare your public repository, project summary, demo, and technical tags.")}</span>
          </div>
        </div>
      </section>

      <SubmitProjectModal isOpen={isSubmitOpen} onClose={() => setIsSubmitOpen(false)} />
    </div>
  );
}

export default CityZeroPage;
