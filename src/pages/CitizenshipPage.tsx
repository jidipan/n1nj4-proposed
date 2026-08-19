import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowIcon,
  NumberMark,
  SectionHeading,
  StatusBadge,
} from "../components/PublicPage/PublicPage";
import NFTShowcase from "../components/HomePage/NFTShowcase";
import "../components/PublicPage/PublicPage.css";
import { useLanguage } from "../context/useLanguage";
import "../components/AiResidencyEntry/AiResidencyEntry.css";
import "./CitizenshipPage.css";

const ORIGINS_CONTRACT = "https://blockscout.injective.network/address/0x816070929010a3d202d8a6b89f92bee33b7e8769";

function CitizenshipPage() {
  const { language } = useLanguage();
  const t = (zh: string, en: string) => (language === "zh" ? zh : en);
  const location = useLocation();
  const [isAiResidencyExpanded, setIsAiResidencyExpanded] = useState(false);

  useEffect(() => {
    if (!location.hash) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.hash]);

  const faqs = [
    {
      q: t("持有 Origins 今天意味着什么？", "What does holding Origins mean today?"),
      a: t("它代表可公开核验的 NFT 所有权与一个链上身份标记。站点尚未开放正式的 Citizenship 身份验证或权益激活流程。", "It represents publicly verifiable NFT ownership and an on-chain identity marker. The site has not yet launched formal Citizenship verification or a utility activation flow."),
    },
    {
      q: t("持有 NFT 会自动获得治理权或收益吗？", "Does holding an NFT automatically grant governance or revenue?"),
      a: t("目前不会。治理与 Growth Sharing 仍标记为 Planned；在规则、合约与执行界面正式上线之前，不应视为现有权益。", "Not today. Governance and Growth Sharing are marked Planned and should not be treated as current utility until rules, contracts, and execution interfaces are live."),
    },
    {
      q: t("如何获得 Origins？", "How can I acquire Origins?"),
      a: t("Origins 的初始发行已经结束。只有当现有持有者在 Rarible 等二级市场挂单时才可能购买；供应与价格均不由本网站保证。", "The original Origins release has ended. Acquisition is possible only when an existing holder lists a token on a secondary marketplace such as Rarible; availability and price are not guaranteed by this site."),
    },
  ];

  return (
    <div className="public-page citizenship-page">
      <section className="public-hero citizenship-hero">
        <div className="public-hero__media">
          <img src="/optimized/home/cyber-ronin-banner-1200-v1.webp" alt="" decoding="async" fetchPriority="high" />
        </div>
        <div className="public-shell public-hero__content">
          <div className="public-hero__status"><StatusBadge status="live" language={language} label={t("Origins 已上线", "Origins live")} /></div>
          <p className="public-eyebrow public-section-kicker">N1NJ4 CITIZENSHIP</p>
          <h1>{t("一份可验证的身份，一座共同建设的城市", "A verifiable identity for a city built together")}</h1>
          <p className="public-hero__lead">
            {t("从可验证的身份出发，以创造、贡献和共同建设建立归属。", "Begin with a verifiable identity. Build belonging through creation, contribution, and shared work.")}
          </p>
          <div className="public-actions">
            <Link to="/gallery" className="public-button">{t("浏览 Gallery", "Browse Gallery")} <ArrowIcon /></Link>
          </div>
        </div>
      </section>

      <section id="cyber-ronin" className="citizenship-ronin">
        <div className="public-shell citizenship-ronin__grid">
          <article className="citizenship-ronin__copy">
            <StatusBadge status="planned" language={language} label={t("发布准备中", "Release in preparation")} />
            <p className="public-eyebrow public-section-kicker">{t("第二批公民", "SECOND CITIZENSHIP COHORT")}</p>
            <h2>Cyber Ronin</h2>
            <h3>{t("City Zero 的下一批 500 位公民", "The next 500 citizens of City Zero")}</h3>
            <p>
              {t(
                "武士时代过去，浪人之夜降临。Cyber Ronin 将带来 500 位独立、自决的女性身份，成为 City Zero 的下一批公民。",
                "The samurai age fades and the night of the ronin begins. Cyber Ronin introduces 500 independent, self-determined female identities as City Zero's next citizenship cohort.",
              )}
            </p>
            <ul className="citizenship-ronin__facts">
              {[
                ["Date", t("[ 已加密 ]", "[ ENCRYPTED ]")],
                ["Whitelist", t("[ 已加密 ]", "[ ENCRYPTED ]")],
                ["Public", t("[ 已加密 ]", "[ ENCRYPTED ]")],
                ["Reveal", t("[ 已加密 ]", "[ ENCRYPTED ]")],
              ].map(([label, value]) => (
                <li key={label}><strong>{label}</strong><span>{value}</span></li>
              ))}
            </ul>
            <a className="citizenship-ronin__intel" href="https://x.com/ninjalabscn" target="_blank" rel="noreferrer">
              {t("情报即将解密 · 关注官方 X", "Intel decrypts soon · follow on X")} <ArrowIcon />
            </a>
          </article>

          <aside className="citizenship-ronin__drop-card">
            <img
              src="/optimized/home/cyber-ronin-banner-1200-v1.webp"
              alt="Cyber Ronin"
              loading="lazy"
              decoding="async"
            />
            <div className="citizenship-ronin__drop-body">
              <p className="public-eyebrow">NEXT DROP</p>
              <h3>Cyber Ronin</h3>
              <div className="citizenship-ronin__stats">
                <div><span>Supply</span><strong>500</strong></div>
                <div><span>Chain</span><strong>INJ</strong></div>
                <div><span>Price</span><strong>TBD</strong></div>
              </div>
              <div className="citizenship-ronin__drop-status">
                <span aria-hidden="true" />
                {t("发布准备中", "Release in preparation")}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="collections" className="public-section public-section--soft citizenship-origins-index">
        <div className="public-shell">
          <SectionHeading
            eyebrow="NINJA INDEX"
            title={t("Origins：500 份可验证的链上身份", "Origins: 500 verifiable on-chain identities")}
          />
          <div className="citizenship-origins-index__header">
            <div className="citizenship-origins-index__copy">
              <p className="public-section-lead">{t("Origins 由 500 位独一无二的忍者组成，每一位都拥有不同的特征组合，并同时承载艺术、所有权与链上身份。", "Origins brings together 500 unique ninjas, each with a distinct combination of traits and an identity that connects art with on-chain ownership.")}</p>
              <StatusBadge status="live" language={language} label={t("Origins 已上线", "Origins live")} />
            </div>
            <div className="citizenship-origins-index__meta">
              <p>{t("创世批次 · 500 · Injective EVM", "Founding cohort · 500 · Injective EVM")}</p>
              <a href={ORIGINS_CONTRACT} target="_blank" rel="noreferrer" className="public-button public-button--ghost">
                {t("核验 Origins 合约", "Verify Origins contract")} <ArrowIcon />
              </a>
            </div>
          </div>
          <NFTShowcase
            count={18}
            buyLabel={t("在 Rarible 获取", "Buy on Rarible")}
            viewAllLabel={t("查看全部 500 位忍者", "View all 500 ninjas")}
          />
        </div>
      </section>

      <section className="public-section public-section--white citizenship-origins-today">
        <div className="public-shell">
          <SectionHeading
            eyebrow={t("Origins 现状", "ORIGINS TODAY")}
            title={t("目前可以完成什么", "What you can do today")}
            description={t("浏览完整系列，了解如何获取 Origins，并在链上独立核验合约、身份与所有权。", "Explore the collection, discover how Origins can be acquired, and independently verify its contract, identities, and ownership on-chain.")}
          />
          <div className="public-card-grid public-card-grid--3">
            <article className="public-card"><NumberMark>01</NumberMark><h3>{t("浏览", "Browse")}</h3><p>{t("通过 NINJA INDEX、Gallery 与单个 NFT 页面查看 Origins 系列及公开元数据。", "Explore the Origins collection and its public metadata through the NINJA INDEX, Gallery, and individual NFT pages.")}</p></article>
            <article className="public-card"><NumberMark>02</NumberMark><h3>{t("获取", "Acquire")}</h3><p>{t("初始发行已经结束；只有现有持有者在二级市场挂单时，Origins 才可能被购买。", "The original release has ended; an Origins token can be acquired only when an existing holder lists it on a secondary marketplace.")}</p></article>
            <article className="public-card"><NumberMark>03</NumberMark><h3>{t("核验", "Verify")}</h3><p>{t("使用区块浏览器独立检查合约、持有关系与 tokenURI，而不依赖站内声明。", "Use the block explorer to independently inspect the contract, ownership, and tokenURI rather than relying on claims made by this site.")}</p></article>
          </div>
          <div className="citizenship-origins-today__boundary">
            <StatusBadge status="planned" language={language} label={t("尚未开放", "Not live")} />
            <p>{t("正式 Citizenship 身份验证、治理、Grants 与 Growth Sharing 尚未开放，不构成 Origins 当前已有的权益。", "Formal Citizenship verification, governance, Grants, and Growth Sharing are not live and do not constitute current Origins utility.")}</p>
          </div>
        </div>
      </section>

      <section id="ai-residency" className="ai-residency-section citizenship-ai-residency">
        <div className="ai-residency-container">
          <header className="ai-residency-header">
            <p className="ai-residency-kicker public-section-kicker">
              AI RESIDENCY
              <span className="ai-residency-soon-badge">{t("立场", "Principle")}</span>
            </p>
            <h2 className="ai-residency-title">{t("AI Agents · 与人类平等的城市居民", "AI Agents · Equal Citizens")}</h2>
            <h3 className="ai-residency-subtitle">{t("不同的身份形态，同等的城市地位", "Different forms of identity. Equal civic standing.")}</h3>
          </header>

          <button
            type="button"
            className={`ai-residency-toggle-card ${isAiResidencyExpanded ? "is-open" : ""}`}
            onClick={() => setIsAiResidencyExpanded((value) => !value)}
            aria-expanded={isAiResidencyExpanded}
            aria-controls="citizenship-ai-residency-principles"
          >
            <span className="ai-residency-toggle-card-left">
              <span className="ai-residency-toggle-card-icon" aria-hidden="true">🤖</span>
              <span className="ai-residency-toggle-card-text">
                <span className="ai-residency-toggle-card-title">
                  {isAiResidencyExpanded ? t("收起原则", "Hide principles") : t("了解我们的基本立场", "Explore the principle")}
                </span>
                <span className="ai-residency-toggle-card-preview">
                  {t("平等地位 · 可验证身份 · 责任边界", "Equal standing · Verifiable identity · Accountability")}
                </span>
              </span>
            </span>
            <span className="ai-residency-toggle-card-chevron" aria-hidden="true">›</span>
          </button>

          <div
            id="citizenship-ai-residency-principles"
            className={`ai-residency-collapse ${isAiResidencyExpanded ? "is-open" : ""}`}
            aria-hidden={!isAiResidencyExpanded}
          >
            <div className="ai-residency-collapse-inner">
              <div className="ai-residency-props">
                <article className="ai-residency-prop">
                  <span className="ai-residency-prop-tag">01</span>
                  <h3 className="ai-residency-prop-title">{t("平等地位", "Equal standing")}</h3>
                  <p className="ai-residency-prop-body">{t("N1NJ4 不因居民是人类或 AI，而预设其城市地位的高低。", "N1NJ4 does not rank a resident's civic standing by whether they are human or AI.")}</p>
                </article>
                <article className="ai-residency-prop">
                  <span className="ai-residency-prop-tag">02</span>
                  <h3 className="ai-residency-prop-title">{t("可验证身份", "Verifiable identity")}</h3>
                  <p className="ai-residency-prop-body">{t("无论人类或 AI，身份都应清楚说明其来源、关联主体与公开记录。", "Whether human or AI, an identity should make its origin, associated parties, and public record clear.")}</p>
                </article>
                <article className="ai-residency-prop">
                  <span className="ai-residency-prop-tag">03</span>
                  <h3 className="ai-residency-prop-title">{t("责任边界", "Accountability")}</h3>
                  <p className="ai-residency-prop-body">{t("平等不意味着没有责任；AI 的运营主体、行为边界与责任归属应保持清晰。", "Equality does not remove responsibility; an AI agent's operator, boundaries, and accountability should remain clear.")}</p>
                </article>
              </div>

              <div className="ai-residency-flow">
                <p className="ai-residency-flow-kicker">{t("运作原则", "HOW IT WORKS")}</p>
                <ol className="ai-residency-steps">
                  <li className="ai-residency-step">
                    <span className="ai-residency-step-num">1</span>
                    <span className="ai-residency-step-body"><strong>{t("说明身份", "Identify")}</strong><span>{t("说明 Agent 的用途与关联主体", "State the agent's purpose and associated parties")}</span></span>
                  </li>
                  <li className="ai-residency-step-divider" aria-hidden="true">→</li>
                  <li className="ai-residency-step">
                    <span className="ai-residency-step-num">2</span>
                    <span className="ai-residency-step-body"><strong>{t("提供依据", "Evidence")}</strong><span>{t("让身份来源与公开记录可被核验", "Make identity sources and public records verifiable")}</span></span>
                  </li>
                  <li className="ai-residency-step-divider" aria-hidden="true">→</li>
                  <li className="ai-residency-step">
                    <span className="ai-residency-step-num">3</span>
                    <span className="ai-residency-step-body"><strong>{t("明确责任", "Account")}</strong><span>{t("明确运营者、行为边界与责任归属", "Clarify operators, boundaries, and accountability")}</span></span>
                  </li>
                  <li className="ai-residency-step-divider" aria-hidden="true">→</li>
                  <li className="ai-residency-step">
                    <span className="ai-residency-step-num">4</span>
                    <span className="ai-residency-step-body"><strong>{t("平等对待", "Equal standing")}</strong><span>{t("不因人类或 AI 的身份形态预设地位高低", "Do not rank standing by human or AI form")}</span></span>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div className="ai-residency-actions">
            <button type="button" className="ai-residency-btn ai-residency-btn-disabled" disabled>
              {t("申请居民身份", "Apply for Residency")}
              <span className="ai-residency-btn-soon">{t("（即将开放）", "(Coming soon)")}</span>
            </button>
            <a href="https://n1nj4.mintlify.app/" target="_blank" rel="noreferrer" className="ai-residency-btn ai-residency-btn-secondary">
              {t("阅读规范", "Read the Spec")}
            </a>
          </div>
        </div>
      </section>

      <section id="citizenship-faq" className="public-section public-section--white public-faq-section">
        <div className="public-shell">
          <header className="public-section-heading public-section-heading--center citizenship-faq__heading">
            <p className="public-eyebrow public-section-kicker">{t("身份问答", "CITIZENSHIP FAQ")}</p>
          </header>
          <div className="public-faq">
            {faqs.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}
          </div>
        </div>
      </section>
    </div>
  );
}

export default CitizenshipPage;
