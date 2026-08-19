import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowIcon,
  SectionHeading,
  StatusBadge,
  type ProductStatus,
} from "../components/PublicPage/PublicPage";
import "../components/PublicPage/PublicPage.css";
import { useLanguage } from "../context/useLanguage";
import { NEWS, type NewsStatus } from "../data/news";
import { PUBLIC_PROJECTS } from "../data/publicProjects";
import { STADIUM_EVENTS, type StadiumEventStatus } from "../data/stadiumEvents";
import "./HomePage.css";

type ProjectCardData = {
  id: string;
  title: string;
  summary: string;
  image: string;
  href: string;
  external?: boolean;
  status: ProductStatus;
  statusLabel: string;
  meta: string;
};

const HOME_DISPATCH_PREVIEW_LIMIT = 6;
const COMMUNITY_TILE_SHAPES = ["wide", "standard", "standard", "standard", "standard", "wide", "standard", "standard", "standard", "standard"] as const;

const eventStatus: Record<StadiumEventStatus, { status: ProductStatus; zh: string; en: string }> = {
  live: { status: "live", zh: "进行中", en: "Live" },
  upcoming: { status: "beta", zh: "即将开始", en: "Upcoming" },
  voting: { status: "beta", zh: "投票中", en: "Voting" },
  reviewing: { status: "beta", zh: "评审中", en: "Reviewing" },
  done: { status: "live", zh: "结果已公布", en: "Results published" },
  ended: { status: "live", zh: "已结束", en: "Ended" },
};

const newsStatus: Record<NewsStatus, { status: ProductStatus; zh: string; en: string }> = {
  active: { status: "live", zh: "进行中", en: "Active" },
  ended: { status: "live", zh: "已结束", en: "Ended" },
  recap: { status: "live", zh: "回顾", en: "Recap" },
  evergreen: { status: "live", zh: "长期阅读", en: "Evergreen" },
};

function CommunityProjectTile({ card, language, shape }: { card: ProjectCardData; language: "zh" | "en"; shape: (typeof COMMUNITY_TILE_SHAPES)[number] }) {
  const content = (
    <>
      <img src={card.image} alt="" loading="lazy" />
      <div className="home-community-tile__shade" aria-hidden="true" />
      <div className="home-community-tile__content">
        <div className="home-community-tile__topline">
          <span>{card.meta}</span>
          <StatusBadge status={card.status} language={language} label={card.statusLabel} />
        </div>
        <h3>{card.title}</h3>
        <p>{card.summary}</p>
        <span className="home-community-tile__open">{language === "zh" ? "查看项目" : "View project"} <ArrowIcon /></span>
      </div>
    </>
  );

  const className = `home-community-tile home-community-tile--${shape}`;
  return card.external ? (
    <a href={card.href} target="_blank" rel="noreferrer" className={className}>{content}</a>
  ) : (
    <Link to={card.href} className={className}>{content}</Link>
  );
}

function HomePage() {
  const { language } = useLanguage();
  const t = (zh: string, en: string) => (language === "zh" ? zh : en);
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const scrollToTarget = () => document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: "start" });
    const frame = window.requestAnimationFrame(scrollToTarget);
    const timers = [300, 1000].map((delay) => window.setTimeout(scrollToTarget, delay));
    return () => {
      window.cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [location.hash]);

  const highlightEvents = STADIUM_EVENTS.slice(0, 3);
  const leadHighlight = highlightEvents.find((event) => event.id === "injective-global-cup") ?? highlightEvents[0];
  const supportingHighlights = highlightEvents.filter((event) => event.id !== leadHighlight?.id);

  const projectCards: ProjectCardData[] = PUBLIC_PROJECTS.filter((project) => project.kind !== "repo").map((project) => ({
    id: `project-${project.id}`,
    title: project.title,
    summary: t(project.descriptionZh, project.descriptionEn),
    image: project.image,
    href: project.href,
    external: project.external,
    status: project.status,
    statusLabel: project.statusZh ? t(project.statusZh, project.statusEn ?? "") : t("已开放", "Live"),
    meta: project.tags.join(" · "),
  }));

  const dispatchPreview = NEWS.slice(0, HOME_DISPATCH_PREVIEW_LIMIT);
  const [activeDispatchId, setActiveDispatchId] = useState(dispatchPreview[0]?.id ?? "");
  const activeDispatch = dispatchPreview.find((item) => item.id === activeDispatchId) ?? dispatchPreview[0];

  const faqs = [
    {
      q: t("Origins 与 City Zero 是什么关系？", "How are Origins and City Zero related?"),
      a: t("Origins 是目前已经上线的 N1NJ4 身份 NFT 系列，也是 Citizenship 页面中的链上身份起点。City Zero 是 N1NJ4 在 Injective 上建设的数字城市，承载建设者、项目与长期城市机制。", "Origins is N1NJ4's live identity NFT collection and the on-chain starting point presented in Citizenship. City Zero is N1NJ4's digital city on Injective, bringing together builders, projects, and its longer-term city framework."),
    },
    {
      q: t("N1NJ4 是 Injective 官方项目吗？", "Is N1NJ4 an official Injective project?"),
      a: t("不是。N1NJ4 是由 Ninja Labs 独立发起的项目，并使用 Injective EVM 作为底层网络。它不代表 Injective Labs 或 Injective Foundation。", "No. N1NJ4 is an independent project initiated by Ninja Labs and uses Injective EVM as its underlying network. It does not represent Injective Labs or the Injective Foundation."),
    },
  ];

  const roadmap = [
    {
      phase: "PHASE 1 · FOUNDATIONS",
      title: t("City Zero 部署", "City Zero Deployment"),
      description: t(
        "身份合约与 City Zero 核心合约上线，500 位 Origins 创世公民入驻。Grants 与 AI Residency 同步启动。",
        "Identity and City Zero core contracts go live, with 500 Origins citizens onboarded. Grants and AI Residency open in parallel.",
      ),
      status: "live",
      statusLabel: t("进行中", "In Progress"),
    },
    {
      phase: "PHASE 2 · EXPANSION",
      title: t("城市扩张 · Cyber Ronin", "City Expansion · Cyber Ronin"),
      description: t(
        "500 位 Cyber Ronin 加入，公民人口扩展至 1000。贡献系统与链上任务上线，新城市分区同步解锁。",
        "500 Cyber Ronin arrive, expanding citizenship to 1,000. The contribution system and on-chain missions launch as new city sectors unlock.",
      ),
      status: "coming",
      statusLabel: t("即将到来", "Coming Soon"),
    },
    {
      phase: "PHASE 3 · GROWTH",
      title: t("生态扩展", "Ecosystem Growth"),
      description: t(
        "跨链身份桥与 SDK 开放，外部 builders 加入孵化。首次 Growth Sharing 分配启动，AI 经济原语开启 agent 间结算。",
        "Cross-chain bridges and the City Zero SDK open up, drawing builders into incubation. The first Growth Sharing kicks off, and AI primitives let agents transact.",
      ),
      status: "planned",
      statusLabel: t("已规划", "Planned"),
    },
    {
      phase: "PHASE 4 · AUTONOMY",
      title: t("DAO · 链上治理", "DAO · On-Chain Governance"),
      description: t(
        "Ninja Labs 让渡治理权，社区 DAO 接管 —— 持有者链上投票，合约自动执行。AI 处理日常运营，City Zero 架构开放给其他城市复用。",
        "Ninja Labs cedes governance to a community DAO — holders vote on-chain, smart contracts execute. AI runs operations, and the City Zero stack opens up for others to fork.",
      ),
      status: "future",
      statusLabel: t("未来阶段", "Future Phase"),
    },
  ];

  return (
    <div className="public-page home-reframed">
      <section className="public-hero home-reframed__hero">
        <div className="public-hero__media"><img src="/optimized/home/home-hero-2048-v1.webp" alt="" decoding="async" fetchPriority="high" /></div>
        <div className="public-shell public-hero__content">
          <p className="public-eyebrow public-section-kicker">N1NJ4 · NINJA LABS</p>
          <h1>{t("为建设者而生。", "For those who build.")}</h1>
          <p className="public-hero__lead">{t("拥有你的链上身份，带上你的作品，共同塑造一座数字城市。", "Own your on-chain identity, bring your work, and help shape a digital city.")}</p>
          <div className="public-actions">
            <a href="#city-dispatch" className="public-button">{t("查看最新动态", "Explore what is happening")} <ArrowIcon /></a>
            <Link to="/city-zero" className="public-button public-button--ghost">{t("进入 City Zero", "Enter City Zero")} <ArrowIcon /></Link>
          </div>
        </div>
      </section>

      <section className="public-section public-section--soft home-about">
        <div className="public-shell">
          <header className="home-about__heading">
            <p className="public-eyebrow public-section-kicker">ABOUT N1NJ4</p>
            <h2>{t("身份，是共同建设一座城市的起点。", "Identity for a city built by contributors.")}</h2>
          </header>
          <div className="home-about__grid">
            <div className="home-about__content">
            <div className="home-about__copy">
              <p>
                {t(
                  "N1NJ4 是 Ninja Labs 在 Injective 上建设的数字城市项目。Origins 为居民提供可验证的链上身份；在 City Zero，建设者通过真实发布的项目共同塑造城市。",
                  "N1NJ4 is a digital-city project built by Ninja Labs on Injective. Origins gives residents a verifiable on-chain identity, while City Zero is shaped by the real projects builders bring into public life.",
                )}
              </p>
              <a className="public-button" href="https://n1nj4.mintlify.app/" target="_blank" rel="noreferrer">
                {t("阅读白皮书", "Read the Whitepaper")} <ArrowIcon />
              </a>
            </div>
            </div>
            <div className="home-about__media" aria-hidden="true">
              <video src="/live1.mp4" autoPlay loop muted playsInline preload="metadata" />
            </div>
          </div>
        </div>
      </section>

      <section className="public-section public-section--white home-start">
        <div className="public-shell">
          <SectionHeading eyebrow={t("从这里开始", "START HERE")} title={t("发现、归属、建设与收藏", "Discover, belong, build, and collect")} description={t("选择你的入口：了解 N1NJ4 的身份体系，探索建设者正在塑造的 City Zero，或浏览 500 位 Origins 忍者。", "Choose your path: discover the identities behind N1NJ4, explore the City Zero builders are shaping, or browse all 500 Origins ninjas.")} />
          <div className="home-paths">
            <Link to="/citizenship" className="home-path-card home-path-card--identity">
              <div className="home-path-card__copy"><span className="home-path-card__index">01</span><p className="public-eyebrow">CITIZENSHIP</p><h3>{t("身份与归属", "Identity and belonging")}</h3><p>{t("认识 Origins 与 Cyber Ronin，并了解人类和 AI 居民共享的身份原则。", "Meet Origins and Cyber Ronin, and discover the identity principles shared by human and AI residents.")}</p><span className="home-path-card__cta">{t("进入 Citizenship", "Open Citizenship")} →</span></div>
              <img src="/optimized/home/cyber-ronin-card-1200-v1.webp" alt="Cyber Ronin" loading="lazy" />
            </Link>
            <Link to="/city-zero" className="home-path-card home-path-card--city">
              <div className="home-path-card__copy"><span className="home-path-card__index">02</span><p className="public-eyebrow">CITY ZERO</p><h3>{t("共建与接入", "Community building")}</h3><p>{t("探索建设者正在塑造的数字城市，并了解如何让你的项目成为其中一部分。", "Explore the digital city builders are shaping and learn how your project can become part of it.")}</p><span className="home-path-card__cta">{t("进入 City Zero", "Open City Zero")} →</span></div>
              <img src="/optimized/city-zero/city-hero-1280-v2.webp" alt="City Zero" loading="lazy" />
            </Link>
            <Link to="/gallery" className="home-path-card home-path-card--gallery">
              <div className="home-path-card__copy"><span className="home-path-card__index">03</span><p className="public-eyebrow">GALLERY</p><h3>{t("Origins 档案", "The Origins archive")}</h3><p>{t("浏览全部 500 位 Origins 忍者，探索每一份独特的链上身份。", "Browse all 500 Origins ninjas and explore each unique on-chain identity.")}</p><span className="home-path-card__cta">{t("进入 Gallery", "Open Gallery")} →</span></div>
              <img src="/passport/citizen-kaze-passport.png" alt="Origins" loading="lazy" />
            </Link>
          </div>
        </div>
      </section>

      <section id="city-highlights" className="public-section public-section--dark home-highlights">
        <div className="public-shell">
          <SectionHeading
            eyebrow={t("城市焦点", "CITY HIGHLIGHTS")}
            title={t("城市公共舞台上的重要时刻", "The moments that move the city")}
            description={t(
              "回顾塑造 N1NJ4 及其生态的重要赛事、建设者计划与公开成果。",
              "Revisit the competitions, builder programs, and public milestones that have shaped N1NJ4 and its wider ecosystem.",
            )}
          />
          <div className="home-section-meta home-section-meta--dark">
            <span className="home-content-heading__count">{String(highlightEvents.length).padStart(2, "0")} {t("项记录", "records")}</span>
          </div>

          {leadHighlight && (
            <div className="home-highlights__layout">
              <a href={leadHighlight.link} target="_blank" rel="noreferrer" className="home-highlight-lead">
                <div className="home-highlight-lead__media">
                  {leadHighlight.image && <img src={leadHighlight.image} alt="" loading="lazy" style={{ objectPosition: leadHighlight.imagePosition }} />}
                </div>
                <div className="home-highlight-lead__body">
                  <div className="home-highlight-lead__topline">
                    <span className="public-eyebrow">{t("首要焦点", "LEAD HIGHLIGHT")}</span>
                    <StatusBadge status={eventStatus[leadHighlight.status].status} language={language} label={t(eventStatus[leadHighlight.status].zh, eventStatus[leadHighlight.status].en)} />
                  </div>
                  <p className="home-highlight-lead__meta">{t(leadHighlight.organizer.zh, leadHighlight.organizer.en)} · {t(leadHighlight.statusNote.zh, leadHighlight.statusNote.en)}</p>
                  <h3>{t(leadHighlight.title.zh, leadHighlight.title.en)}</h3>
                  <p className="home-highlight-lead__summary">{t(leadHighlight.summary.zh, leadHighlight.summary.en)}</p>
                  <div className="home-highlight-lead__facts">
                    {leadHighlight.participants && <span><strong>{leadHighlight.participants}</strong>{t("参与者", "Builders")}</span>}
                    <span><strong>{leadHighlight.prize}</strong>{t("奖金", "Prize")}</span>
                  </div>
                  <span className="home-highlight-lead__open">{t(leadHighlight.linkLabel?.zh ?? "查看活动", leadHighlight.linkLabel?.en ?? "View event")} <ArrowIcon /></span>
                </div>
              </a>

              <div className="home-highlights__supporting">
                {supportingHighlights.map((event) => (
                  <a key={event.id} href={event.link} target="_blank" rel="noreferrer" className="home-highlight-card">
                    <div className="home-highlight-card__media">
                      {event.image && <img src={event.image} alt="" loading="lazy" style={{ objectPosition: event.imagePosition }} />}
                    </div>
                    <div className="home-highlight-card__body">
                      <div className="home-highlight-card__topline">
                        <span>{t(event.statusNote.zh, event.statusNote.en)}</span>
                        <StatusBadge status={eventStatus[event.status].status} language={language} label={t(eventStatus[event.status].zh, eventStatus[event.status].en)} />
                      </div>
                      <p className="home-highlight-card__meta">{t(event.organizer.zh, event.organizer.en)}</p>
                      <h3>{t(event.title.zh, event.title.en)}</h3>
                      <p className="home-highlight-card__summary">{t(event.summary.zh, event.summary.en)}</p>
                      <div className="home-highlight-card__footer">
                        <div>
                          {event.participants && <span>{event.participants} {t("位参与者", "builders")}</span>}
                          <span>{event.prize} {t("奖金", "prize")}</span>
                        </div>
                        <ArrowIcon />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="city-dispatch" className="public-section public-section--soft home-dispatch">
        <div className="public-shell">
          <SectionHeading
            eyebrow={t("城市快报", "CITY DISPATCH")}
            title={t("来自城市与生态的最新动态", "Latest from the city and its ecosystem")}
            description={t(
              "关注来自 N1NJ4、Ninja Labs、建设者与 Injective 生态的最新消息、故事和项目动态。",
              "Follow the latest news, stories, and project updates from N1NJ4, Ninja Labs, builders, and the wider Injective ecosystem.",
            )}
          />
          <div className="home-section-meta">
            <span className="home-content-heading__count home-content-heading__count--light">{t(`最新 ${dispatchPreview.length} / 共 ${NEWS.length} 条`, `Latest ${dispatchPreview.length} of ${NEWS.length}`)}</span>
          </div>
          <div className="home-dispatch-broadsheet">
            {activeDispatch && (
              <Link
                key={activeDispatch.id}
                to={`/news/${activeDispatch.id}`}
                className="home-dispatch-feature"
                aria-live="polite"
              >
                <div className="home-dispatch-feature__media">
                  {activeDispatch.image && <img src={activeDispatch.image} alt={t(activeDispatch.imageLabel.zh, activeDispatch.imageLabel.en)} loading="lazy" />}
                </div>
                <div className="home-dispatch-feature__copy">
                  <div className="home-dispatch-feature__topline">
                    <span>{t(activeDispatch.category.zh, activeDispatch.category.en)}</span>
                    <StatusBadge status={newsStatus[activeDispatch.status].status} language={language} label={t(newsStatus[activeDispatch.status].zh, newsStatus[activeDispatch.status].en)} />
                  </div>
                  <p className="home-dispatch-feature__meta">{t(activeDispatch.source.zh, activeDispatch.source.en)} · {activeDispatch.date}</p>
                  <h3>{t(activeDispatch.title.zh, activeDispatch.title.en)}</h3>
                  <p className="home-dispatch-feature__summary">{t(activeDispatch.summary.zh, activeDispatch.summary.en)}</p>
                  <span className="home-dispatch-feature__open">{t("阅读快报", "Read dispatch")} <ArrowIcon /></span>
                </div>
              </Link>
            )}

            <div className="home-dispatch-stack">
              {dispatchPreview.map((item, index) => {
                const isActive = item.id === activeDispatch?.id;
                return (
                  <Link
                    key={item.id}
                    to={`/news/${item.id}`}
                    className={`home-dispatch-stack__item${isActive ? " is-active" : ""}`}
                    onMouseEnter={() => setActiveDispatchId(item.id)}
                    onFocus={() => setActiveDispatchId(item.id)}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span className="home-dispatch-stack__number">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="home-dispatch-stack__meta">{t(item.category.zh, item.category.en)} · {item.date}</p>
                      <h3>{t(item.title.zh, item.title.en)}</h3>
                      <p className="home-dispatch-stack__summary">{t(item.summary.zh, item.summary.en)}</p>
                    </div>
                    <ArrowIcon />
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="home-dispatch__footer">
            <Link to="/news" className="home-dispatch__library">{t(`查看全部 ${NEWS.length} 条快报`, `View all ${NEWS.length} dispatches`)} <ArrowIcon /></Link>
          </div>
        </div>
      </section>

      <section id="community-projects" className="public-section public-section--white home-community">
        <div className="public-shell">
          <SectionHeading
            eyebrow={t("社区项目", "COMMUNITY PROJECTS")}
            title={t("由社区创造并公开呈现", "Built by the community, shared in public")}
            description={t(
              "探索由 N1NJ4 与 Injective 社区建设者创造的产品、实验和创意作品。",
              "Explore products, experiments, and creative work made by builders across the N1NJ4 and Injective communities.",
            )}
          />
          <div className="home-section-meta">
            <span className="home-content-heading__count home-content-heading__count--light">{String(projectCards.length).padStart(2, "0")} {t("个项目", "projects")}</span>
          </div>
          <div className="home-community__grid">
            {projectCards.map((card, index) => (
              <CommunityProjectTile key={card.id} card={card} language={language} shape={COMMUNITY_TILE_SHAPES[index] ?? "standard"} />
            ))}
          </div>
        </div>
      </section>

      <section className="public-section public-section--soft home-roadmap">
        <div className="public-shell">
          <SectionHeading
            eyebrow={t("路线图", "ROADMAP")}
            title={t("城市扩张时间线", "City Expansion Timeline")}
            description={t(
              "从 Origins 与 City Zero 出发，了解 N1NJ4 如何逐步连接更多居民、建设者与数字城市。",
              "Beginning with Origins and City Zero, follow N1NJ4's long-term direction toward a wider network of residents, builders, and digital cities.",
            )}
          />
          <div className="home-roadmap__grid">
            {roadmap.map((item) => (
              <article key={item.phase} className={`home-roadmap-card home-roadmap-card--${item.status}`}>
                <p className="home-roadmap-card__phase">{item.phase}</p>
                <h3>{item.title}</h3>
                <p className="home-roadmap-card__description">{item.description}</p>
                <span className="home-roadmap-card__status">{item.statusLabel}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="public-section public-section--white public-faq-section">
        <div className="public-shell">
          <header className="public-section-heading public-section-heading--center home-faq__heading">
            <p className="public-eyebrow public-section-kicker">{t("常见问题", "FAQ")}</p>
          </header>
          <div className="public-faq">{faqs.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
