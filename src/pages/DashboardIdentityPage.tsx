import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { useLanguage } from "../context/useLanguage";
import ImagePlaceholder from "../components/ImagePlaceholder/ImagePlaceholder";
import "./DashboardIdentityPage.css";

/* ====================================================================
 * Citizen Passport · 公民护照 (完整身份层)
 * --------------------------------------------------------------------
 * 覆盖 V5 提案"身份"的规范结构,五大块:
 *   1) 公民归属    — 系列 / 类型(人/AI) / 链上起始
 *   2) 身份画像    — 功能 × 项目角色 + 等级阶梯
 *   3) 链上声誉    — 贡献分 / 排名 / 贡献证明明细 / 徽章墙
 *   4) 治理与权益  — 当前等级已解锁 / 待解锁的权利
 *   5) 城市通行 + 文化认同 — 网络/活动/社区 + 符号/代号/Manifesto
 *
 * ⚠️ 数据硬编码占位;🖼 灰块为待补图片区域。
 * ==================================================================== */

const FACTS = {
  id: "#1427",
  handle: "kaze.n1nj4",
  series: { zh: "创世忍者 · Origins", en: "Origins · Founding Cyber Ninja" },
  kind: { zh: "人类公民", en: "Human Citizen" },
  since: { zh: "链上公民自 2025.11", en: "On-chain citizen since 2025.11" },
  codename: { zh: "代号 · 风 (Kaze)", en: "Codename · Kaze (Wind)" },
};

const FUNCTIONS = [
  { zh: "前端", en: "Frontend", on: true },
  { zh: "架构", en: "Architect", on: true },
];
const PROJECT_ROLES = [
  { zh: "协作者", en: "Collaborator", on: true },
  { zh: "出资人", en: "Funder", on: true },
  { zh: "发起人", en: "Initiator", on: false },
];

const TIERS = [
  { key: "CITIZEN", zh: "公民", en: "Citizen", at: 0 },
  { key: "BUILDER", zh: "建设者", en: "Builder", at: 500 },
  { key: "FOUNDER", zh: "创始者", en: "Founder", at: 2000 },
  { key: "GOVERNOR", zh: "执政者", en: "Governor", at: 5000 },
];
const CURRENT_TIER = "BUILDER";
const CONTRIBUTION = 1248;

const PROOF_OF_BUILD = [
  { zh: "合并 PR", en: "PRs merged", value: 12 },
  { zh: "部署 Agent", en: "Agents deployed", value: 2 },
  { zh: "修复 Bug", en: "Bugs fixed", value: 5 },
  { zh: "代码评审", en: "Reviews", value: 18 },
  { zh: "文档贡献", en: "Docs", value: 4 },
  { zh: "拉新公民", en: "Citizens onboarded", value: 9 },
];

const BADGES = [
  { zh: "前端", en: "Frontend", on: true, src: "/passport/badge-frontend.svg" },
  { zh: "架构", en: "Architect", on: true, src: "/passport/badge-architect.svg" },
  { zh: "协作者", en: "Collaborator", on: true, src: "/passport/badge-collaborator.svg" },
  { zh: "出资人", en: "Funder", on: true, src: "/passport/badge-funder.svg" },
  { zh: "评审员", en: "Reviewer", on: true, src: "/passport/badge-reviewer.svg" },
  { zh: "拉新者", en: "Recruiter", on: true, src: "/passport/badge-recruiter.svg" },
  { zh: "创世", en: "Genesis", on: true, src: "/passport/badge-genesis.svg" },
  { zh: "发起人", en: "Initiator", on: false, src: "/passport/badge-initiator.svg" },
];

/* ---- 主轴 B · 通行凭证 ---- */
const ACCESS_TIER = { zh: "内环 · Inner Ring", en: "Inner Ring" };
const ACCESS_OPEN = 8;
const ACCESS_TOTAL = 10;

/* 城市设施"签证":已解锁 / 未解锁 + 该设施解锁的权限 */
const FACILITIES = [
  { zh: "移民大厅", en: "Immigration Hall", unlock: { zh: "身份注册 · 徽章", en: "Identity · badges" }, on: true },
  { zh: "任务公告栏", en: "Mission Board", unlock: { zh: "接任务 · 赚贡献", en: "Claim missions · earn" }, on: true },
  { zh: "学院", en: "Academy", unlock: { zh: "上手 · 导师", en: "Onboarding · mentorship" }, on: true },
  { zh: "中央银行", en: "Central Bank", unlock: { zh: "申请 Grant · 领赏金", en: "Grants · payouts" }, on: true },
  { zh: "市政厅", en: "City Hall", unlock: { zh: "地标 / 法则投票", en: "Vote: landmarks & rules" }, on: true },
  { zh: "贡献丰碑", en: "Monument", unlock: { zh: "排行榜 · 存档", en: "Leaderboards · archive" }, on: true },
  { zh: "竞技场", en: "Stadium", unlock: { zh: "Demo Day · 黑客松", en: "Demo Day · hackathons" }, on: true },
  { zh: "集市", en: "Market", unlock: { zh: "交易 · 授权", en: "Trade · licensing" }, on: true },
  { zh: "人才大厦", en: "Talent Tower", unlock: { zh: "发起项目 · 招募团队", en: "Launch projects · recruit" }, on: false, need: { zh: "创始者", en: "Founder" } },
  { zh: "AI 居民塔", en: "AI Residency Tower", unlock: { zh: "注册 · 部署 Agent", en: "Register & deploy agents" }, on: false, need: { zh: "创始者 / AI 资格", en: "Founder / AI" } },
];

/* 活动门票 / 资格 */
const TICKETS = [
  { zh: "Demo Day", en: "Demo Day", note: { zh: "持票", en: "Ticket" } },
  { zh: "城市大会", en: "City Assembly", note: { zh: "受邀", en: "Invited" } },
  { zh: "黑客松", en: "Hackathon", note: { zh: "报名资格", en: "Eligible" } },
];

function DashboardIdentityPage({ publicView = false }: { publicView?: boolean }) {
  const { language } = useLanguage();
  const { address } = useAccount();
  const params = useParams();
  const t = (zh: string, en: string) => (language === "zh" ? zh : en);
  const shortAddr = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "0x71C…4f3A";
  const pid = publicView ? params.id || "1427" : FACTS.id.replace("#", "");
  const shareUrl = `n1nj4.fun/citizen/${pid}`;

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard?.writeText(`https://${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="idp-page">
      <div className="idp-shell">
        {/* 返回 */}
        <Link to={publicView ? "/" : "/dashboard"} className="idp-back">
          ← {publicView ? t("前往 N1NJ4", "Go to N1NJ4") : t("返回 Dashboard", "Back to Dashboard")}
        </Link>

        <header className="idp-header">
          <h1 className="idp-h1">
            {publicView ? t(`公民 #${pid} 的建设者名片`, `Citizen #${pid} · Builder Card`) : t("公民护照", "Citizen Passport")}
          </h1>
          <p className="idp-sub">
            {t(
              "你的链上身份 = 贡献证明 + 声誉 + 画像 + 权益。不是头像,是建设者凭证。",
              "Your on-chain identity = proof of build + reputation + persona + rights. A builder credential, not a PFP."
            )}
          </p>
        </header>

        {/* 公开名片 · 分享栏 */}
        <div className="idp-sharebar">
          <span className="idp-share-flag">🌐 {t("公开身份名片", "Public builder card")}</span>
          <code className="idp-share-url">{shareUrl}</code>
          <button className="idp-share-btn" onClick={handleCopy}>
            {copied ? t("✓ 已复制", "✓ Copied") : t("复制链接", "Copy link")}
          </button>
          {!publicView && (
            <Link to={`/citizen/${pid}`} className="idp-share-preview">
              {t("预览公开页 →", "Preview public →")}
            </Link>
          )}
        </div>

        {/* ============ 1 · 公民归属 (Hero) ============ */}
        <section className="idp-hero">
          <ImagePlaceholder
            className="idp-hero-art"
            ratio="4 / 5"
            src="/passport/citizen-kaze-passport.png"
            objectPosition="50% 20%"
            label={t("公民护照半身照 · 4:5", "Citizen passport portrait · 4:5")}
          />
          <div className="idp-hero-facts">
            <div className="idp-hero-idrow">
              <h2 className="idp-citizen">{t("公民", "Citizen")} {FACTS.id}</h2>
              <span className="idp-tier-chip">{CURRENT_TIER}</span>
            </div>
            <p className="idp-handle">{FACTS.handle}</p>
            <dl className="idp-facts">
              <div className="idp-fact">
                <dt>{t("系列", "Series")}</dt>
                <dd className="idp-fact-emblem">
                  <ImagePlaceholder
                    className="idp-emblem"
                    ratio="1"
                    iconOnly
                    src="/passport/origins-emblem.svg"
                    label={t("Origins 氏族徽记 · 1:1", "Origins clan emblem · 1:1")}
                  />
                  {t(FACTS.series.zh, FACTS.series.en)}
                </dd>
              </div>
              <div className="idp-fact">
                <dt>{t("公民类型", "Type")}</dt>
                <dd>{t(FACTS.kind.zh, FACTS.kind.en)}</dd>
              </div>
              <div className="idp-fact">
                <dt>{t("代号", "Codename")}</dt>
                <dd>{t(FACTS.codename.zh, FACTS.codename.en)}</dd>
              </div>
              <div className="idp-fact">
                <dt>{t("链上起始", "On-chain since")}</dt>
                <dd>{t(FACTS.since.zh, FACTS.since.en)}</dd>
              </div>
              {!publicView && (
                <div className="idp-fact">
                  <dt>{t("钱包", "Wallet")}</dt>
                  <dd className="idp-mono">{shortAddr}</dd>
                </div>
              )}
            </dl>
            <p className="idp-equal-note">
              {t("人类与 AI 在 City Zero 是平等公民。", "Humans and AI are equal citizens of City Zero.")}
            </p>
          </div>
        </section>

        {/* ============ 2 · 通行凭证 (主轴 B) ============ */}
        <section className="idp-panel">
          <h3 className="idp-panel-title">{t("通行凭证 · 签证页", "Access · Visa Pages")}</h3>
          <p className="idp-access-lead">
            {t(
              "护照的本质是通行凭证:你的身份解锁了城市的哪些门、能调用哪些权限。",
              "A passport is an access credential — which doors your identity opens, which powers you may invoke."
            )}
          </p>
          <div className="idp-access-tier">
            🛂 <span>{t("准入环层", "Access tier")} · {t(ACCESS_TIER.zh, ACCESS_TIER.en)}</span>
            <span className="idp-access-count">{t(`通行 ${ACCESS_OPEN} / ${ACCESS_TOTAL} 设施`, `${ACCESS_OPEN} / ${ACCESS_TOTAL} facilities`)}</span>
          </div>
          <div className="idp-visas">
            {FACILITIES.map((f) => (
              <div key={f.en} className={`idp-visa${f.on ? " on" : " locked"}`}>
                <div className="idp-visa-top">
                  <span className="idp-visa-name">{t(f.zh, f.en)}</span>
                  <span className="idp-visa-mark">{f.on ? "✓" : "🔒"}</span>
                </div>
                <span className="idp-visa-unlock">{t(f.unlock.zh, f.unlock.en)}</span>
                {!f.on && f.need && (
                  <span className="idp-visa-need">{t("需 ", "needs ")}{t(f.need.zh, f.need.en)}</span>
                )}
              </div>
            ))}
          </div>
          <span className="idp-persona-cap idp-tickets-cap">{t("活动门票 / 资格", "Event tickets")}</span>
          <div className="idp-tickets">
            {TICKETS.map((tk) => (
              <span key={tk.en} className="idp-ticket">
                ✓ {t(tk.zh, tk.en)} · {t(tk.note.zh, tk.note.en)}
              </span>
            ))}
          </div>
        </section>

        {/* ============ 3 · 身份画像 ============ */}
        <section className="idp-panel">
          <h3 className="idp-panel-title">{t("身份画像 · Builder Persona", "Builder Persona")}</h3>
          <div className="idp-persona">
            <div className="idp-persona-col">
              <span className="idp-persona-cap">{t("功能", "Function")}</span>
              <div className="idp-chips">
                {FUNCTIONS.map((f) => (
                  <span key={f.en} className={`idp-chip${f.on ? "" : " off"}`}>{t(f.zh, f.en)}</span>
                ))}
              </div>
            </div>
            <span className="idp-persona-x">×</span>
            <div className="idp-persona-col">
              <span className="idp-persona-cap">{t("项目角色", "Project Role")}</span>
              <div className="idp-chips">
                {PROJECT_ROLES.map((r) => (
                  <span key={r.en} className={`idp-chip${r.on ? "" : " off"}`}>{t(r.zh, r.en)}</span>
                ))}
              </div>
            </div>
          </div>

          <span className="idp-persona-cap idp-ladder-cap">{t("治理等级阶梯", "Governance tier ladder")}</span>
          <div className="idp-ladder">
            {TIERS.map((tier, i) => {
              const reached = CONTRIBUTION >= tier.at;
              const current = tier.key === CURRENT_TIER;
              return (
                <div key={tier.key} className={`idp-ladder-step${reached ? " reached" : ""}${current ? " current" : ""}`}>
                  <span className="idp-ladder-name">{t(tier.zh, tier.en)}</span>
                  <span className="idp-ladder-at">{tier.at}+</span>
                  {i < TIERS.length - 1 && <span className="idp-ladder-arrow">→</span>}
                </div>
              );
            })}
          </div>
        </section>

        {/* ============ 3 · 链上声誉 ============ */}
        <section className="idp-panel">
          <h3 className="idp-panel-title">{t("链上声誉 · On-Chain Reputation", "On-Chain Reputation")}</h3>
          <div className="idp-rep-top">
            <div className="idp-rep-stat">
              <span className="idp-rep-value">{CONTRIBUTION.toLocaleString()}</span>
              <span className="idp-rep-label">{t("贡献值 · 灵魂绑定", "Contribution · soulbound")}</span>
            </div>
            <div className="idp-rep-stat">
              <span className="idp-rep-value">#32</span>
              <span className="idp-rep-label">{t("全城排名 · 前 7%", "City rank · Top 7%")}</span>
            </div>
          </div>

          <span className="idp-persona-cap">{t("贡献证明 · 全部链上可查", "Proof of Build · on-chain verifiable")}</span>
          <div className="idp-proof-grid">
            {PROOF_OF_BUILD.map((p) => (
              <div className="idp-proof" key={p.en}>
                <span className="idp-proof-value">{p.value}</span>
                <span className="idp-proof-label">{t(p.zh, p.en)}</span>
              </div>
            ))}
          </div>

          <span className="idp-persona-cap">{t("徽章墙 · 功能 × 角色,按真实建设解锁", "Badge wall · unlocked by real building")}</span>
          <div className="idp-badges">
            {BADGES.map((b) => (
              <div key={b.en} className={`idp-badge${b.on ? "" : " locked"}`}>
                <ImagePlaceholder
                  className="idp-badge-icon"
                  ratio="1"
                  iconOnly
                  src={b.src}
                  label={t(`徽章图标 · ${b.zh}`, `Badge icon · ${b.en}`)}
                />
                <span className="idp-badge-name">{t(b.zh, b.en)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ============ 6 · 文化认同 ============ */}
        <section className="idp-panel">
          <h3 className="idp-panel-title">{t("文化认同 · Cultural Identity", "Cultural Identity")}</h3>
          <div className="idp-glyphs">
            <ImagePlaceholder className="idp-glyph" ratio="1" src="/passport/origins-emblem.svg" label={t("氏族符号 · 1:1", "Clan glyph · 1:1")} />
            <ImagePlaceholder className="idp-glyph" ratio="1" src="/passport/kaze-sigil.svg" label={t("代号印记 · 1:1", "Codename sigil · 1:1")} />
          </div>
          <ImagePlaceholder
            className="idp-manifesto-art"
            ratio="21 / 9"
            src="/passport/manifesto-city.png"
            label={t("Manifesto 主视觉 · 21:9", "Manifesto key visual · 21:9")}
          />
          <blockquote className="idp-manifesto">
            {t(
              "「用代码、AI 和链上证明说话,而不是靠口号。把自己看作城市的建筑师,而不是用户。」",
              "“Speak through code, AI and on-chain proof — not slogans. See yourself as an architect of the city, not a user.”"
            )}
          </blockquote>
        </section>
      </div>
    </div>
  );
}

export default DashboardIdentityPage;
