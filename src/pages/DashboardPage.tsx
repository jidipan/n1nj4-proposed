import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useLanguage } from "../context/useLanguage";
import ImagePlaceholder from "../components/ImagePlaceholder/ImagePlaceholder";
import { STADIUM_EVENTS, type StadiumEventStatus } from "../data/stadiumEvents";
import "./DashboardPage.css";

/* ====================================================================
 * Builder Dashboard · 建设者仪表盘 (V6)
 * --------------------------------------------------------------------
 * 按 V6「被记录 · 被看见 · 被资助」三价值组织,四个面板:
 *   1) 身份条     — 被记录 · 我是谁 (贡献值 / Rank / 等级进度 + 分享名片)
 *   2) 我的建设   — 被记录 · 六步闭环状态 (发布→招募→申请→资助→交付→结算)
 *      任务来源   — 接 STADIUM_EVENTS 真实活动 (HackQuest · 运营先行)
 *   3) 资助通道   — 被资助 · 门槛 + 四步流程 + 提交入口 (右栏)
 *   4) 贡献榜     — 被看见 · Top 建设者 + 我的排名 (数据源 GitHub, 接入位已留)
 * V5 遗留的治理投票 / QF 资助轮 / 城市设施宫格 / 重复名片已移除。
 *
 * ⚠️ 数字仍为硬编码占位 — 结构对应 V6 闭环,接真数据时无需改布局。
 * ==================================================================== */

const CITIZEN = {
  id: "#1427",
  series: { zh: "创世忍者 · Origins", en: "Origins" },
  tier: "BUILDER",
  contribution: 1248,
  rankNum: 32,
  rankPct: { zh: "前 7%", en: "Top 7%" },
  nextTierAt: 2000,
  nextTier: { zh: "创始者", en: "Founder" },
};

/* V6 六步闭环: 发布 → 招募 → 申请资金 → 获得资助 → 完成项目 → 结算贡献 */
const LOOP_STEPS = [
  { zh: "发布", en: "Post" },
  { zh: "招募", en: "Recruit" },
  { zh: "申请资金", en: "Apply" },
  { zh: "已资助", en: "Funded" },
  { zh: "交付", en: "Ship" },
  { zh: "结算", en: "Settle" },
];

/* 我的建设 · step = 当前所在闭环步 (0-5) */
const MY_WORK = [
  { title: { zh: "城市日志看板 v1", en: "City Log dashboard v1" }, step: 3 },
  { title: { zh: "贡献榜可视化", en: "Leaderboard visualizer" }, step: 2 },
  { title: { zh: "HackQuest 活动协作", en: "HackQuest event ops" }, step: 4 },
];

/* 活动状态 → 复用的状态胶囊配色 */
const EVENT_STATUS_LABEL: Record<StadiumEventStatus, { zh: string; en: string; cls: string }> = {
  upcoming: { zh: "即将开始", en: "Upcoming", cls: "submitted" },
  live: { zh: "进行中", en: "Live", cls: "funded" },
  voting: { zh: "投票中", en: "Voting", cls: "voting" },
  reviewing: { zh: "评审中", en: "Reviewing", cls: "inprogress" },
  ended: { zh: "已结束", en: "Ended", cls: "ended" },
};

/* 护照露出卡 · 与护照页 (DashboardIdentityPage) 同源的真实子集:
   身份 + 贡献证明 (GitHub) + 已获徽章。V5 的签证/准入体系不恢复。 */
const PASSPORT_PROOF = [
  { zh: "合并 12 PR", en: "12 PRs merged" },
  { zh: "部署 2 Agent", en: "2 Agents deployed" },
  { zh: "修复 5 Bug", en: "5 bugs fixed" },
];
const PASSPORT_BADGES = [
  { zh: "前端", en: "Frontend" },
  { zh: "架构", en: "Architect" },
  { zh: "协作者", en: "Collaborator" },
  { zh: "创世", en: "Genesis" },
];

/* 资助通道 · 四步 (V6: 提交 → 评审拨付 → 交付 → 回写声誉) */
const GRANT_STEPS = [
  { zh: "提交", en: "Apply" },
  { zh: "评审拨付", en: "Fund" },
  { zh: "交付", en: "Ship" },
  { zh: "回写声誉", en: "Record" },
];
const GRANT_BAR = 500; // 申请门槛 (贡献值)

/* 贡献榜 · Top 8 + 我 (mock; 数据源 = GitHub PR/部署/修复, 可选链上) */
const LEADERBOARD = [
  { rank: 1, no: "0007", handle: "sora.n1nj4", series: { zh: "创世忍者", en: "Origins" }, tier: "FOUNDER", contribution: 4820 },
  { rank: 2, no: "0214", handle: "rin.n1nj4", series: { zh: "创世忍者", en: "Origins" }, tier: "FOUNDER", contribution: 3964 },
  { rank: 3, no: "0892", handle: "kuro.n1nj4", series: { zh: "赛博浪人", en: "Cyber Ronin" }, tier: "BUILDER", contribution: 3110 },
  { rank: 4, no: "0455", handle: "hana.n1nj4", series: { zh: "创世忍者", en: "Origins" }, tier: "BUILDER", contribution: 2877 },
  { rank: 5, no: "0961", handle: "RONIN-07", series: { zh: "AI 居民", en: "AI Resident" }, tier: "BUILDER", contribution: 2402 },
  { rank: 6, no: "0333", handle: "geno.n1nj4", series: { zh: "赛博浪人", en: "Cyber Ronin" }, tier: "BUILDER", contribution: 2104 },
  { rank: 7, no: "0618", handle: "yuki.n1nj4", series: { zh: "创世忍者", en: "Origins" }, tier: "BUILDER", contribution: 1830 },
  { rank: 8, no: "1102", handle: "tora.n1nj4", series: { zh: "赛博浪人", en: "Cyber Ronin" }, tier: "BUILDER", contribution: 1655 },
];

function DashboardPage() {
  const { language } = useLanguage();
  const { isConnected, address } = useAccount();
  const t = (zh: string, en: string) => (language === "zh" ? zh : en);
  const citizenNo = CITIZEN.id.replace("#", "");
  const shortAddr = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "0x71C…4f3A";
  const progressPct = Math.min(100, Math.round((CITIZEN.contribution / CITIZEN.nextTierAt) * 100));
  const toNext = CITIZEN.nextTierAt - CITIZEN.contribution;

  return (
    <div className="dash-page">
      <div className="dash-shell">
        {!isConnected && (
          <div className="dash-preview-banner">
            <span>
              {t("预览模式 — 连接钱包后显示你的真实链上身份与贡献。", "Preview mode — connect your wallet to see your real on-chain data.")}
            </span>
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button className="dash-btn dash-btn-ghost dash-btn-sm" onClick={openConnectModal}>
                  {t("连接钱包", "Connect")}
                </button>
              )}
            </ConnectButton.Custom>
          </div>
        )}

        {/* ============ 1 · 身份条 (被记录 · 我是谁) ============ */}
        <section className="dash-idbar">
          <Link to="/dashboard/identity" className="dash-idbar-left">
            <ImagePlaceholder
              className="dash-avatar"
              ratio="1"
              iconOnly
              src="/dashboard/citizen-kaze.png"
              objectPosition="50% 19%"
              label={t("公民 NFT 头像 · 1:1", "Citizen NFT avatar · 1:1")}
            />
            <div className="dash-idbar-who">
              <div className="dash-idbar-name">
                {t("公民", "Citizen")} {CITIZEN.id}
                <span className="dash-tier-chip">{CITIZEN.tier}</span>
              </div>
              <span className="dash-idbar-series">{t(CITIZEN.series.zh, CITIZEN.series.en)} · {shortAddr}</span>
              <span className="dash-idbar-link">{t("查看完整护照 →", "View full passport →")}</span>
            </div>
          </Link>
          <div className="dash-idbar-metrics">
            <div className="dash-metric">
              <span className="dash-metric-value">{CITIZEN.contribution.toLocaleString()}</span>
              <span className="dash-metric-label">{t("贡献值", "Contribution")}</span>
            </div>
            <div className="dash-metric">
              <span className="dash-metric-value">#{CITIZEN.rankNum}</span>
              <span className="dash-metric-label">{t(CITIZEN.rankPct.zh, CITIZEN.rankPct.en)}</span>
            </div>
            <div className="dash-metric dash-metric-progress">
              <div className="dash-progress">
                <div className="dash-progress-bar" style={{ width: `${progressPct}%` }} />
              </div>
              <span className="dash-metric-label">
                {t(`距「${CITIZEN.nextTier.zh}」还差 ${toNext}`, `${toNext} to ${CITIZEN.nextTier.en}`)}
              </span>
            </div>
          </div>
        </section>

        {/* ============ 2 · 我的建设 + 任务来源 (主) / 资助通道 (右栏) ============ */}
        <div className="dash-layout">
          <section className="dash-main">
            {/* —— 我的建设 · 六步闭环状态 —— */}
            <div className="dash-panel">
              <header className="dash-panel-head">
                <h2 className="dash-panel-title">{t("我的建设", "My builds")}</h2>
                <span className="dash-panel-hint">
                  {t("发布 → 招募 → 申请 → 资助 → 交付 → 结算", "Post → Recruit → Apply → Fund → Ship → Settle")}
                </span>
              </header>
              <div className="dash-work-row">
                {MY_WORK.map((w) => (
                  <div className="dash-work-card" key={w.title.en}>
                    <div className="dash-loop-dots" aria-hidden="true">
                      {LOOP_STEPS.map((_, i) => (
                        <span
                          key={i}
                          className={`dash-loop-dot${i <= w.step ? " is-done" : ""}${i === w.step ? " is-current" : ""}`}
                        />
                      ))}
                    </div>
                    <p className="dash-work-title">{t(w.title.zh, w.title.en)}</p>
                    <span className="dash-loop-label">
                      {w.step + 1}/6 · {t(LOOP_STEPS[w.step].zh, LOOP_STEPS[w.step].en)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* —— 任务来源 · 本月真实活动 (运营先行) —— */}
            <div className="dash-panel">
              <header className="dash-panel-head">
                <h2 className="dash-panel-title">{t("任务来源 · 本月活动", "Mission source · this month")}</h2>
                <span className="dash-panel-hint">
                  {t("运营先行 — 接任务 = 参加活动 · HackQuest 同步", "Ops-first — missions come from real events · synced with HackQuest")}
                </span>
              </header>
              <ul className="dash-list">
                {STADIUM_EVENTS.map((ev) => {
                  const st = EVENT_STATUS_LABEL[ev.status];
                  return (
                    <li className="dash-event" key={ev.id}>
                      <div className="dash-event-info">
                        <div className="dash-event-top">
                          <span className={`dash-status dash-status-${st.cls}`}>{t(st.zh, st.en)}</span>
                          <span className="dash-event-note">{t(ev.statusNote.zh, ev.statusNote.en)}</span>
                        </div>
                        <p className="dash-event-title">{t(ev.title.zh, ev.title.en)}</p>
                        <span className="dash-event-meta">
                          {t(ev.organizer.zh, ev.organizer.en)} · {ev.prize} {t("奖池", "prize pool")}
                        </span>
                      </div>
                      <a className="dash-btn dash-btn-sm" href={ev.link} target="_blank" rel="noopener noreferrer">
                        {t("查看 ↗", "View ↗")}
                      </a>
                    </li>
                  );
                })}
              </ul>
              <Link className="dash-inline-link" to="/city-zero#stadium">
                {t("前往竞技场查看详情 →", "See details in the Stadium →")}
              </Link>
            </div>
          </section>

          {/* —— 右栏 · 护照露出卡 + 资助通道 —— */}
          <aside className="dash-rail">
            {/* 护照卡 · 对外可分享的身份摘要 (完整护照见 /dashboard/identity) */}
            <div className="dash-panel dash-namecard">
              <span className="dash-namecard-flag">🌐 {t("护照 · 可分享", "Passport · shareable")}</span>
              <div className="dash-namecard-head">
                <ImagePlaceholder
                  className="dash-namecard-avatar"
                  ratio="1"
                  iconOnly
                  src="/dashboard/citizen-kaze.png"
                  objectPosition="50% 19%"
                  label={t("公民 NFT 头像 · 1:1", "Citizen NFT avatar · 1:1")}
                />
                <div className="dash-namecard-id">
                  <div className="dash-namecard-name">
                    {t("公民", "Citizen")} {CITIZEN.id}
                    <span className="dash-tier-chip">{CITIZEN.tier}</span>
                  </div>
                  <span className="dash-namecard-sub">
                    {t(CITIZEN.series.zh, CITIZEN.series.en)} · kaze.n1nj4
                  </span>
                </div>
              </div>
              <div className="dash-namecard-proof">
                <span className="dash-namecard-proof-label">{t("贡献证明 · GitHub", "Proof of Build · GitHub")}</span>
                <span className="dash-namecard-proof-line">
                  {PASSPORT_PROOF.map((p) => t(p.zh, p.en)).join(" · ")}
                </span>
              </div>
              <div className="dash-namecard-badges">
                {PASSPORT_BADGES.map((b) => (
                  <span className="dash-namecard-badge" key={b.en}>{t(b.zh, b.en)}</span>
                ))}
              </div>
              <div className="dash-namecard-actions">
                <Link to="/dashboard/identity" className="dash-btn dash-btn-sm">{t("查看护照", "View passport")}</Link>
                <Link to={`/citizen/${citizenNo}`} className="dash-btn dash-btn-sm dash-btn-ghost">{t("分享名片", "Share card")}</Link>
              </div>
            </div>

            <div className="dash-panel dash-grant-card">
              <span className="dash-grant-kicker">{t("资助通道", "Grant Path")}</span>
              <p className="dash-grant-bar">
                {t(`门槛 · 贡献值 ≥ ${GRANT_BAR}`, `Bar · contribution ≥ ${GRANT_BAR}`)}
              </p>
              <p className="dash-grant-sub">
                {CITIZEN.contribution >= GRANT_BAR
                  ? t(`你已达标 (${CITIZEN.contribution.toLocaleString()}) — 可提交项目`, `You qualify (${CITIZEN.contribution.toLocaleString()}) — submit a project`)
                  : t(`还差 ${GRANT_BAR - CITIZEN.contribution} 贡献值达标`, `${GRANT_BAR - CITIZEN.contribution} more to qualify`)}
              </p>
              <ol className="dash-grant-steps">
                {GRANT_STEPS.map((s, i) => (
                  <li key={s.en}>
                    <span className="dash-grant-step-num">{i + 1}</span>
                    {t(s.zh, s.en)}
                  </li>
                ))}
              </ol>
              <Link to="/city-zero#submit" className="dash-btn dash-btn-block">
                {t("提交项目", "Submit a project")}
              </Link>
            </div>
          </aside>
        </div>

        {/* ============ 3 · 贡献榜 (被看见) ============ */}
        <section className="dash-panel">
          <header className="dash-panel-head">
            <h2 className="dash-panel-title">{t("贡献榜", "Leaderboard")}</h2>
            <span className="dash-panel-hint">
              {t("数据源 · GitHub 贡献 (PR / 部署 / 修复) · 链上可选", "Data · GitHub (PRs / deploys / fixes) · on-chain optional")}
            </span>
          </header>
          <ol className="dash-board">
            {LEADERBOARD.map((b) => (
              <li key={b.no}>
                <Link to={`/citizen/${b.no}`} className="dash-board-row">
                  <span className={`dash-board-rank${b.rank <= 3 ? " is-top" : ""}`}>#{b.rank}</span>
                  <ImagePlaceholder
                    className="dash-board-avatar"
                    ratio="1"
                    iconOnly
                    label={t("公民头像", "Citizen avatar")}
                  />
                  <span className="dash-board-who">
                    <span className="dash-board-handle">{b.handle}</span>
                    <span className="dash-board-series">{t(b.series.zh, b.series.en)} · #{b.no}</span>
                  </span>
                  <span className="dash-tier-chip">{b.tier}</span>
                  <span className="dash-board-score">{b.contribution.toLocaleString()}</span>
                </Link>
              </li>
            ))}
            <li className="dash-board-gap" aria-hidden="true">⋯</li>
            <li>
              <Link to={`/citizen/${citizenNo}`} className="dash-board-row dash-board-me">
                <span className="dash-board-rank">#{CITIZEN.rankNum}</span>
                <ImagePlaceholder
                  className="dash-board-avatar"
                  ratio="1"
                  iconOnly
                  src="/dashboard/citizen-kaze.png"
                  objectPosition="50% 19%"
                  label={t("我的头像", "My avatar")}
                />
                <span className="dash-board-who">
                  <span className="dash-board-handle">kaze.n1nj4 {t("(我)", "(you)")}</span>
                  <span className="dash-board-series">{t(CITIZEN.series.zh, CITIZEN.series.en)} · {CITIZEN.id}</span>
                </span>
                <span className="dash-tier-chip">{CITIZEN.tier}</span>
                <span className="dash-board-score">{CITIZEN.contribution.toLocaleString()}</span>
              </Link>
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;
