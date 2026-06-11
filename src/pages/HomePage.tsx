import { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import NFTShowcase from "../components/HomePage/NFTShowcase";
import FAQ from "../components/HomePage/FAQ";
import NewsTicker from "../components/NewsTicker/NewsTicker";

import { useLanguage } from "../context/useLanguage";
import { useRevealObserver } from "../hooks/useRevealObserver";
import "./HomePage.css";

function HomePage() {
  const { language } = useLanguage();
  const translate = useCallback(
    (zh: string, en: string) => (language === "zh" ? zh : en),
    [language],
  );

  const deploymentTimeline = useMemo(
    () => [
      {
        phase: "PHASE 1 · FOUNDATIONS",
        title: translate("City Zero 部署", "City Zero Deployment"),
        description: translate(
          "身份合约与 City Zero 核心合约上线，500 位 Origins 创世公民入驻。Grants 与 AI Residency 同步启动。",
          "Identity and City Zero core contracts go live, with 500 Origins citizens onboarded. Grants and AI Residency open in parallel.",
        ),
        statusKey: "live",
        statusLabel: translate("进行中", "Live"),
      },
      {
        phase: "PHASE 2 · EXPANSION",
        title: translate("城市扩张 · Cyber Ronin", "City Expansion · Cyber Ronin"),
        description: translate(
          "500 位 Cyber Ronin 加入，公民人口扩展至 1000。贡献系统与链上任务上线，新城市分区同步解锁。",
          "500 Cyber Ronin arrive, expanding citizenship to 1,000. The contribution system and on-chain missions launch as new city sectors unlock.",
        ),
        statusKey: "coming",
        statusLabel: translate("即将到来", "Coming Soon"),
      },
      {
        phase: "PHASE 3 · GROWTH",
        title: translate("生态扩展", "Ecosystem Growth"),
        description: translate(
          "跨链身份桥与 SDK 开放，外部 builders 加入孵化。首次 Growth Sharing 分配启动，AI 经济原语开启 agent 间结算。",
          "Cross-chain bridges and the City Zero SDK open up, drawing builders into incubation. The first Growth Sharing kicks off, and AI primitives let agents transact.",
        ),
        statusKey: "coming",
        statusLabel: translate("已规划", "Planned"),
      },
      {
        phase: "PHASE 4 · AUTONOMY",
        title: translate("DAO · 链上治理", "DAO · On-Chain Governance"),
        description: translate(
          "Ninja Labs 让渡治理权，社区 DAO 接管 —— 持有者链上投票，合约自动执行。AI 处理日常运营，City Zero 架构开放给其他城市复用。",
          "Ninja Labs cedes governance to a community DAO — holders vote on-chain, smart contracts execute. AI runs operations, and the City Zero stack opens up for others to fork.",
        ),
        statusKey: "locked",
        statusLabel: translate("未来阶段", "Future Phase"),
      },
    ],
    [translate],
  );

  useRevealObserver(translate);

  return (
    <div className="page-wrapper home-page reveal in-view">
      {/* Cyber Ronin announcement strip — removed 2026-05-22 per design feedback.
          To restore, uncomment the block below. CSS for .cyber-ronin-strip is
          kept in HomePage.css.

      <a href="#cyber-ronin" className="cyber-ronin-strip reveal">
        <span className="cyber-ronin-strip-tag">
          {translate("即将上线", "Coming Soon")}
        </span>
        <span className="cyber-ronin-strip-text">
          <strong>Cyber Ronin</strong>
          {translate(
            " · 500 位新公民即将抵达零号城市，完成 1000 创世公民阵容",
            " · 500 new citizens are arriving at City Zero, completing the 1000 founding wave",
          )}
        </span>
        <span className="cyber-ronin-strip-cta">
          {translate("了解更多", "Learn more")} →
        </span>
      </a>

      */}

      {/* ================================================================ */}
      {/* NEW HOMEPAGE SECTIONS · per 06-WEB_STRATEGY.html P11 · 6 sections   */}
      {/* 之前的主页内容保留在下方 · 待替换/合并                                */}
      {/* ================================================================ */}

      {/* SECTION 01 · HERO · 当期 drop 主推 */}
      <section className="section new-hero-section reveal">
        <div className="new-hero-bg" />
        <div className="new-hero-video-placeholder">
          <span>{translate("[ 视频待替换 · 暂用 hero 图 ]", "[ Video TBD · using hero image for now ]")}</span>
        </div>
        {/* 悬浮卡 · hero 右下角 · 缩略图左侧凸出且倾斜 + 中间 kicker/title + 右侧 Mint 按钮 */}
        <div className="hero-floating-card">
          <div className="hero-floating-card-thumb">
            <img src="/cyber-ronin-card.png" alt="Cyber Ronin card" />
          </div>
          <div className="hero-floating-card-text">
            <p className="hero-floating-card-kicker">
              {translate("即将上线", "NEXT DROP")}
            </p>
            <h3 className="hero-floating-card-title">
              {translate("Cyber Ronin 发布", "Cyber Ronin Release")}
            </h3>
          </div>
          <a href="#cyber-ronin" className="hero-floating-card-btn">COMING SOON</a>
        </div>
      </section>

      {/* SECTION 02 (浅色 Mint section) 已删除 · 内容与下方 dark Cyber Ronin 重复 */}

      {/* CYBER RONIN · 改造后的暗版 Section 3 */}
      <section id="cyber-ronin" className="section cyber-ronin-section reveal">
        <div className="container cyber-ronin-grid">
          <article className="cyber-ronin-copy">
            <p className="section-kicker">
              {translate("第二波公民 · 即将上线", "Second Wave · Coming Soon")}
            </p>
            <h2>Cyber Ronin</h2>
            <h3 className="section-subtitle">
              {translate(
                "500 位新公民即将抵达 City Zero",
                "500 new citizens arriving at City Zero",
              )}
            </h3>
            <p>
              {translate(
                "新章节开启 — 武士时代过去, 浪人之夜降临。500 名独立、漂泊、自决的女性 Cyber Ronin 抵达城市, 重新定义谁是公民。",
                "A new chapter opens — the samurai age fades, the night of the ronin arrives. 500 independent, wandering, self-determined female Cyber Ronin reach the city, redefining who counts as a citizen.",
              )}
            </p>
            <ul className="cyber-ronin-facts">
              <li>
                <strong>Date</strong>
                <span className="fact-encrypted">{translate("[ 已加密 ]", "[ ENCRYPTED ]")}</span>
              </li>
              <li>
                <strong>Whitelist</strong>
                <span className="fact-encrypted">{translate("[ 已加密 ]", "[ ENCRYPTED ]")}</span>
              </li>
              <li>
                <strong>Public</strong>
                <span className="fact-encrypted">{translate("[ 已加密 ]", "[ ENCRYPTED ]")}</span>
              </li>
              <li>
                <strong>Reveal</strong>
                <span className="fact-encrypted">{translate("[ 已加密 ]", "[ ENCRYPTED ]")}</span>
              </li>
            </ul>
            <a
              className="cyber-ronin-facts-note"
              href="https://x.com/ninjalabscn"
              target="_blank"
              rel="noreferrer"
            >
              {translate("情报即将解密 · 关注官方 X →", "Intel decrypts soon · follow on X →")}
            </a>
          </article>

          <aside className="new-mint-card on-dark cyber-ronin-mint-card">
            <img
              src="/Ninja Labs CN-banner-2-3.png"
              alt="City Zero Broadcast"
              className="cyber-ronin-mint-poster"
              loading="lazy"
            />
            <div className="new-mint-card-tag">NEXT DROP</div>
            <h4 className="new-mint-card-title">Cyber Ronin</h4>
            <div className="new-mint-card-stats">
              <div>
                <span>Supply</span>
                <strong>500</strong>
              </div>
              <div>
                <span>Chain</span>
                <strong>INJ</strong>
              </div>
              <div>
                <span>Price</span>
                <strong>TBD</strong>
              </div>
            </div>
            <a href="#contract" className="new-mint-card-cta">
              {translate("Coming Soon", "Coming Soon")} →
            </a>
          </aside>
        </div>
      </section>

      {/* SECTION 04A · About N1NJ4 · 品牌哲学 */}
      <section id="about-n1nj4" className="section deployment-section about-n1nj4-section reveal">
        <div className="container deployment-new-layout">

          <p className="deployment-kicker">
            {translate("关于 N1NJ4", "About N1NJ4")}
          </p>

          <article className="deployment-copy-card about-n1nj4-intro reveal">
            <h2>
              {translate(
                "让开发者、创作者与 AI 共生的",
                "An open developer brand where",
              )}
              <span>
                {translate(
                  "开源开发者品牌",
                  "developers, creators, and AI coexist",
                )}
              </span>
            </h2>
            <p>
              {translate(
                "N1NJ4 是 Ninja Labs 发起的开发者品牌与去中心化生态",
                "N1NJ4 is a developer-native brand and decentralized ecosystem initiated by Ninja Labs",
              )}
              <br />
              {translate(
                "—— 一座共生共长的链上家园。",
                "— an on-chain home for coexistence and growth.",
              )}
            </p>
          </article>

          <div className="deployment-top-grid about-n1nj4-identity-grid">
            <article className="deployment-copy-card reveal">
              <h3 className="deployment-identity-heading">
                N1NJ4 NFTs
                <span>
                  {translate("你的链上身份", "Your On-Chain Identity")}
                </span>
              </h3>
              <p>
                {translate(
                  "N1NJ4 NFTs 是建立在 Injective 上的赛博朋克社区身份系统。500 枚算法生成的独一无二忍者 NFT，将链上资产、治理权与文化归属感统合为一枚身份代币。",
                  "N1NJ4 NFTs are a cyberpunk community identity system built on Injective. 500 algorithmically generated one-of-a-kind ninja NFTs unify on-chain assets, governance, and cultural belonging into one identity token.",
                )}
              </p>

              <div className="deployment-actions">
                <a
                  href="https://n1nj4.mintlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="deployment-btn deployment-btn-primary"
                >
                  {translate("阅读白皮书", "Read the Whitepaper")}
                </a>
              </div>
            </article>

            <aside className="n1nj4-visual reveal">
              <video
                src="/live1.mp4"
                className="n1nj4-visual-media"
                autoPlay
                loop
                muted
                playsInline
              />
            </aside>
          </div>

        </div>
      </section>

      {/* SECTION 04B · About City Zero · 首发产品定义 */}
      <section id="about-city-zero" className="section deployment-section about-city-zero-section reveal">
        <div className="container deployment-new-layout">

          <p className="deployment-kicker">
            {translate("加入城市", "Join The City")}
          </p>

          <div className="deployment-top-grid">
            <article className="deployment-copy-card reveal">
              <h2>{translate("City Zero", "City Zero")}</h2>
              <h3 className="section-subtitle">
                {translate(
                  "Injective EVM 上的首个链上数字城市",
                  "the first on-chain digital city, built on Injective EVM",
                )}
              </h3>
              <p>
                {translate(
                  "City Zero 是真实可运行的基础设施层——不依赖炒作的虚拟世界。每一个身份、治理投票、Grant 拨款、贡献都被记录在链上。",
                  "City Zero is a real, functioning infrastructure layer — not a speculative virtual world. Every identity, governance vote, grant, and contribution is recorded on-chain.",
                )}
              </p>
            </article>

            <aside className="deployment-status-row city-zero-stats-grid reveal">
              <div className="deployment-status-item">
                <strong>NFT</strong>
                <p>{translate("身份层", "Identity")}</p>
                <span>{translate("公民凭证·链上可验证", "Citizenship · On-chain")}</span>
              </div>
              <div className="deployment-status-item">
                <strong>Grants</strong>
                <p>{translate("栖息地", "Habitat")}</p>
                <span>{translate("开发者资助 + 孵化", "Developer grants + incubation")}</span>
              </div>
              <div className="deployment-status-item">
                <strong>Shared</strong>
                <p>{translate("增长共享", "Growth Sharing")}</p>
                <span>{translate("建设者共享城市增长", "Builders share the city's upside")}</span>
              </div>
              <Link
                to="/city-zero#ai-residency"
                className="deployment-status-item deployment-status-item-link"
              >
                <span className="deployment-status-link-arrow" aria-hidden="true">›</span>
                <strong>1st-class</strong>
                <p>{translate("AI 居民", "AI Residency")}</p>
                <span>{translate("AI agent 与人类公民同等", "AI agents on equal footing")}</span>
              </Link>
            </aside>
          </div>

          <div className="city-zero-pillars-block">
            <p className="deployment-kicker city-zero-pillars-kicker">
              {translate("三大支柱", "THREE PILLARS")}
            </p>
            <div className="city-zero-pillars-row">
            <article className="city-zero-pillar pillar-identity">
              <div className="pillar-head">
                <span className="pillar-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4.5" width="18" height="15" rx="3" />
                    <circle cx="9" cy="11" r="2.3" />
                    <path d="M5.8 16.2c.5-1.7 1.8-2.5 3.2-2.5s2.7.8 3.2 2.5" />
                    <path d="M15 9.5h3.6M15 12.5h3.6M15 15.3h2.6" />
                  </svg>
                </span>
                <h4>{translate("身份 · Identity", "Identity")}</h4>
              </div>
              <p>
                {translate(
                  "公民身份链上颁发，持 NFT 即自动获得；人类与 AI 同等公民，共享治理权与经济权益。",
                  "Citizenship is issued on-chain, automatic upon holding the NFT. Humans and AI are equal citizens, sharing governance and economic rights.",
                )}
              </p>
            </article>
            <article className="city-zero-pillar pillar-habitat">
              <div className="pillar-head">
                <span className="pillar-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 20.5h19" />
                    <rect x="4" y="11.5" width="5" height="9" rx="0.8" />
                    <rect x="9.8" y="6" width="5" height="14.5" rx="0.8" />
                    <rect x="15.6" y="14" width="4.4" height="6.5" rx="0.8" />
                    <path d="M12.3 6V3.4M6.5 11.5V9.6" />
                  </svg>
                </span>
                <h4>{translate("栖息地 · Habitat", "Habitat")}</h4>
              </div>
              <p>
                {translate(
                  "去中心化的生活与工作空间。Ninja Labs 通过 grants + incubation 支持 builders 启动项目，不要求交出股权——「撒种 · 让开 · 不抽成」。",
                  "Decentralized space to live and build. Ninja Labs supports builders through grants + incubation, with no equity required — plant the seed, then get out of the way.",
                )}
              </p>
            </article>
            <article className="city-zero-pillar pillar-growth">
              <div className="pillar-head">
                <span className="pillar-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="5.5" cy="18" r="2.2" />
                    <circle cx="12" cy="5.5" r="2.2" />
                    <circle cx="18.5" cy="13.5" r="2.2" />
                    <path d="M7.4 16.8 10.6 7.4M13.9 6.8 17 11.3" />
                  </svg>
                </span>
                <h4>{translate("增长共享 · Growth Sharing", "Growth Sharing")}</h4>
              </div>
              <p>
                {translate(
                  "所有贡献者按比例分享城市未来的增长；按公民身份 1:1 计权，不按 token 数量——反 whale，平等参与。",
                  "All contributors earn a proportional share of the city's future growth. Weight is per-citizen, not per-token — anti-whale by design.",
                )}
              </p>
            </article>
            </div>
          </div>

          <div className="deployment-actions actions-center">
            <Link
              to="/city-zero"
              className="deployment-btn deployment-btn-secondary"
            >
              {translate("探索 City Zero", "Explore City Zero")} →
            </Link>
          </div>

        </div>
      </section>

      {/* SECTION 04C · Roadmap · City Expansion Timeline (紧接 About City Zero 下方) */}
      <section className="section timeline-section reveal">
        <div className="container">
          <header className="timeline-intro">
            <p className="timeline-kicker">
              {translate("路线图", "Roadmap")}
            </p>
            <h2>
              {translate(
                "城市扩张时间线",
                "City Expansion Timeline",
              )}
            </h2>
            <p>
              {translate(
                "City Zero 只是开端。随着更多忍者加入、新城市建立，N1NJ4 的疆域将持续扩张。",
                "City Zero is just the beginning. N1NJ4's territory will keep expanding as more ninjas and new cities are recruited.",
              )}
            </p>
          </header>

          <div className="timeline-grid">
            {deploymentTimeline.map((item, index) => (
              <article
                key={item.phase}
                className="timeline-card reveal"
                style={{ transitionDelay: `${index * 0.05}s` }}
              >
                <p className="timeline-phase">{item.phase}</p>
                <h4>{item.title}</h4>
                <p className="timeline-description">{item.description}</p>
                <span className={`timeline-status status-${item.statusKey}`}>
                  {item.statusLabel}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 BACKUP 已删除 · 改造定稿 */}

      {/* SECTION 05 (was 03 · ABOUT) 已删除 · 内容已被 Section 04 What N1NJ4 Is 覆盖 */}

      {/* SECTION 04 (WHY MINT) 已删除 · 内容已被 Section 04 三大支柱覆盖 */}

      {/* SECTION 05 · PREVIEW ROSTER · 从旧版 showcase-section 提上来替代 placeholder 版 */}
      <section className="section showcase-section reveal">
        <div className="container">
          <div className="showcase-header">
            <div className="showcase-heading">
              <p className="section-kicker">NINJA INDEX</p>
              <h1>{translate("预览名单", "Preview Roster")}</h1>
            </div>
            <p className="showcase-subtitle">
              {translate(
                "500个起源忍者，每个都由算法根据独特的特征组合生成。没有两个是相同的。每个代币都是艺术与身份的完美结合。",
                "500 Origin ninjas, each algorithmically generated from a unique combination of traits. No two are alike. Every token is art and identity in one.",
              )}
            </p>
          </div>
          <NFTShowcase count={18} />
        </div>
      </section>

      {/* 旧版 hero-section · 已删除 (新 Hero 在文件顶部) */}
      {/* deployment-section · 已移到 Section 3 (cyber-ronin) 下方 · 旧位置移除 */}

      {/* 旧版 showcase-section · 已提到 Section 05 位置 (旧位置已移除) */}
      {/* CYBER RONIN section · 已提到 Section 02 之后 (旧位置已移除) */}

      {/* SECTION 05B · CITY DISPATCH · 城市快报 (2 卡轮播新闻 → 详情页) */}
      <NewsTicker />

      {/* 旧版 city-entry-section · 已删除 */}

      <section id="faq" className="section faq-section-wrap reveal">
        <div className="container-sm">
          <FAQ />
        </div>
      </section>
    </div>
  );
}

export default HomePage;
