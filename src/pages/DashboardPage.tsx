import { useMemo, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useLanguage } from "../context/useLanguage";
import "./DashboardPage.css";

type DashboardMode = "builder" | "admin";
type SourceKey = "github" | "contract" | "manual";
type SourceFilter = "all" | SourceKey;

type ContributionEvent = {
  id: string;
  source: SourceKey;
  title: string;
  evidence: string;
  points: number;
  status: "Verified" | "Admin reviewed";
  happenedAt: string;
};

type AdminUser = {
  handle: string;
  wallet: string;
  github: string;
  pullRequests: number;
  deployments: number;
  manual: number;
};

const contributionEvents: ContributionEvent[] = [
  {
    id: "evt-105",
    source: "github",
    title: "Improve wallet session recovery",
    evidence: "Ninja-Labs-Devs/NinjaNFTFrontend-v2 · PR #105",
    points: 120,
    status: "Verified",
    happenedAt: "18 min ago",
  },
  {
    id: "evt-104",
    source: "contract",
    title: "Deploy ContributionRegistry v0.3",
    evidence: "Injective EVM · 0x71c…9a42",
    points: 300,
    status: "Verified",
    happenedAt: "2 days ago",
  },
  {
    id: "evt-103",
    source: "manual",
    title: "Solo AI Builder Sprint mentor session",
    evidence: "Added by city-ops · Event participation",
    points: 100,
    status: "Admin reviewed",
    happenedAt: "4 days ago",
  },
  {
    id: "evt-102",
    source: "github",
    title: "Add contribution event indexing",
    evidence: "Ninja-Labs-Devs/city-zero-indexer · PR #84",
    points: 120,
    status: "Verified",
    happenedAt: "6 days ago",
  },
  {
    id: "evt-101",
    source: "manual",
    title: "English documentation review",
    evidence: "Added by content-ops · Documentation",
    points: 60,
    status: "Admin reviewed",
    happenedAt: "8 days ago",
  },
];

const adminUsers: AdminUser[] = [
  {
    handle: "kaze.n1nj4",
    wallet: "0x71C8…4F3A",
    github: "kaze-builds",
    pullRequests: 240,
    deployments: 300,
    manual: 160,
  },
  {
    handle: "ada.injective",
    wallet: "0x8A10…19BC",
    github: "ada-onchain",
    pullRequests: 120,
    deployments: 600,
    manual: 0,
  },
  {
    handle: "rei.cityzero",
    wallet: "0x44E1…CD90",
    github: "rei-labs",
    pullRequests: 480,
    deployments: 0,
    manual: 80,
  },
];

const sourceMeta: Record<SourceKey, { label: string; short: string }> = {
  github: { label: "Merged pull request", short: "PR" },
  contract: { label: "Contract deployment", short: "SC" },
  manual: { label: "Admin adjustment", short: "AD" },
};

function DashboardPage() {
  const { language } = useLanguage();
  const { address, isConnected } = useAccount();
  const t = (zh: string, en: string) => (language === "zh" ? zh : en);
  const [mode, setMode] = useState<DashboardMode>("builder");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [githubConnected, setGithubConnected] = useState(true);
  const [lastSync, setLastSync] = useState("16:00 UTC");
  const [syncing, setSyncing] = useState(false);
  const [adminNotice, setAdminNotice] = useState("");

  const filteredEvents = useMemo(
    () =>
      sourceFilter === "all"
        ? contributionEvents
        : contributionEvents.filter((event) => event.source === sourceFilter),
    [sourceFilter],
  );

  const sourceTotals = useMemo(
    () =>
      contributionEvents.reduce(
        (totals, event) => {
          totals[event.source] += event.points;
          return totals;
        },
        { github: 0, contract: 0, manual: 0 } as Record<SourceKey, number>,
      ),
    [],
  );

  const totalScore = sourceTotals.github + sourceTotals.contract + sourceTotals.manual;
  const shortAddress = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "Not connected";

  const runSync = () => {
    setSyncing(true);
    window.setTimeout(() => {
      setLastSync("just now");
      setSyncing(false);
    }, 650);
  };

  const exportCsv = () => {
    const rows = [
      ["event_id", "source", "title", "evidence", "points", "status", "happened_at"],
      ...contributionEvents.map((event) => [
        event.id,
        event.source,
        event.title,
        event.evidence,
        String(event.points),
        event.status,
        event.happenedAt,
      ]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "dashboard-contribution-demo.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const applyDemoAdjustment = (delta: number) => {
    const prefix = delta > 0 ? "+" : "";
    setAdminNotice(
      t(
        `演示操作已记录：${prefix}${delta} 分。正式版本会要求原因并写入审计日志。`,
        `Demo action recorded: ${prefix}${delta} points. Production will require a reason and audit log.`,
      ),
    );
  };

  return (
    <div className="d2-page">
      <section className="d2-hero">
        <div className="d2-grid-lines" aria-hidden="true" />
        <div className="d2-shell d2-hero-inner">
          <div className="d2-hero-copy">
            <div className="d2-eyebrow-row">
              <span className="d2-eyebrow">CITY ZERO · CONTRIBUTION LEDGER</span>
              <span className="d2-demo-badge">MVP UI · DEMO DATA</span>
            </div>
            <h1>{t("建设，有据可查。", "Builds, verified.")}</h1>
            <p>
              {t(
                "把钱包、GitHub 和真实交付连接起来。每一分都能回到来源。",
                "A lightweight record of what you shipped, where it happened, and how every point was earned.",
              )}
            </p>
          </div>

          <div className="d2-mode-switch" aria-label={t("页面视图", "Dashboard view")}>
            <button
              type="button"
              className={mode === "builder" ? "active" : ""}
              onClick={() => setMode("builder")}
            >
              {t("建设者视图", "Builder view")}
            </button>
            <button
              type="button"
              className={mode === "admin" ? "active" : ""}
              onClick={() => setMode("admin")}
            >
              {t("管理视图", "Admin view")}
            </button>
          </div>
        </div>
      </section>

      <main className="d2-shell d2-main">
        {mode === "builder" ? (
          <>
            <section className="d2-identity-strip">
              <div className="d2-avatar" aria-hidden="true">K</div>
              <div className="d2-identity-copy">
                <span className="d2-overline">BUILDER IDENTITY</span>
                <h2>{isConnected ? "kaze.n1nj4" : t("连接你的建设者身份", "Connect your builder identity")}</h2>
                <p>{shortAddress} · Injective EVM</p>
              </div>
              <div className="d2-identity-actions">
                <span className={`d2-status-dot ${isConnected ? "is-live" : ""}`}>
                  {isConnected ? t("钱包已连接", "Wallet connected") : t("钱包未连接", "Wallet offline")}
                </span>
                {!isConnected && (
                  <ConnectButton.Custom>
                    {({ openConnectModal }) => (
                      <button type="button" className="d2-btn d2-btn-dark" onClick={openConnectModal}>
                        {t("连接钱包", "Connect wallet")}
                      </button>
                    )}
                  </ConnectButton.Custom>
                )}
              </div>
            </section>

            <section className="d2-score-grid" aria-label={t("贡献概览", "Contribution overview")}>
              <article className="d2-score-card d2-score-card-total">
                <span className="d2-overline">WEIGHTED TOTAL</span>
                <strong>{totalScore.toLocaleString()}</strong>
                <p>{t("来自 5 条已确认记录", "from 5 verified records")}</p>
              </article>
              <article className="d2-score-card">
                <span className="d2-source-mark is-github">PR</span>
                <div><strong>{sourceTotals.github}</strong><p>{t("合并 PR", "Merged PRs")}</p></div>
                <small>2 × 120 pts</small>
              </article>
              <article className="d2-score-card">
                <span className="d2-source-mark is-contract">SC</span>
                <div><strong>{sourceTotals.contract}</strong><p>{t("合约部署", "Deployments")}</p></div>
                <small>1 verified event</small>
              </article>
              <article className="d2-score-card">
                <span className="d2-source-mark is-manual">AD</span>
                <div><strong>{sourceTotals.manual}</strong><p>{t("人工调整", "Admin score")}</p></div>
                <small>2 reviewed events</small>
              </article>
            </section>

            <div className="d2-content-grid">
              <section className="d2-panel d2-ledger-panel">
                <header className="d2-panel-header">
                  <div>
                    <span className="d2-overline">AUDITABLE HISTORY</span>
                    <h2>{t("贡献记录", "Contribution ledger")}</h2>
                  </div>
                  <button type="button" className="d2-btn d2-btn-line" onClick={exportCsv}>
                    {t("导出 CSV", "Export CSV")} ↓
                  </button>
                </header>

                <div className="d2-filter-row" aria-label={t("贡献来源筛选", "Filter by source")}>
                  {(["all", "github", "contract", "manual"] as SourceFilter[]).map((filter) => (
                    <button
                      type="button"
                      key={filter}
                      className={sourceFilter === filter ? "active" : ""}
                      onClick={() => setSourceFilter(filter)}
                    >
                      {filter === "all" ? t("全部", "All events") : sourceMeta[filter].short}
                    </button>
                  ))}
                </div>

                <div className="d2-event-list">
                  {filteredEvents.map((event) => (
                    <article className="d2-event" key={event.id}>
                      <span className={`d2-source-mark is-${event.source}`}>{sourceMeta[event.source].short}</span>
                      <div className="d2-event-copy">
                        <div className="d2-event-title-row">
                          <h3>{event.title}</h3>
                          <strong>+{event.points}</strong>
                        </div>
                        <p>{event.evidence}</p>
                        <div className="d2-event-meta">
                          <span>{sourceMeta[event.source].label}</span>
                          <span>{event.status}</span>
                          <time>{event.happenedAt}</time>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <aside className="d2-sidebar">
                <section className="d2-panel d2-integration-card">
                  <span className="d2-overline">CONNECTIONS</span>
                  <h2>{t("数据来源", "Data connections")}</h2>
                  <div className="d2-connection">
                    <span className="d2-connection-icon">GH</span>
                    <div><strong>GitHub</strong><p>{githubConnected ? "@kaze-builds" : t("未连接", "Not connected")}</p></div>
                    <button type="button" onClick={() => setGithubConnected((value) => !value)}>
                      {githubConnected ? t("断开", "Disconnect") : t("连接", "Connect")}
                    </button>
                  </div>
                  <div className="d2-connection">
                    <span className="d2-connection-icon">INJ</span>
                    <div><strong>Injective EVM</strong><p>{t("合约索引器", "Contract indexer")}</p></div>
                    <span className="d2-mini-status">ONLINE</span>
                  </div>
                  <div className="d2-sync-row">
                    <span>{t("上次同步", "Last sync")} · {lastSync}</span>
                    <button type="button" onClick={runSync} disabled={syncing}>
                      {syncing ? t("同步中…", "Syncing…") : t("立即同步", "Run sync")}
                    </button>
                  </div>
                </section>

                <section className="d2-panel d2-rules-card">
                  <span className="d2-overline">SCORING RULES · V1</span>
                  <h2>{t("分数如何产生", "How points are issued")}</h2>
                  <ol>
                    <li><span>01</span><div><strong>Merged PR</strong><p>+120 fixed points in selected repos</p></div></li>
                    <li><span>02</span><div><strong>Contract deployment</strong><p>+300 after indexer verification</p></div></li>
                    <li><span>03</span><div><strong>Admin adjustment</strong><p>Variable, reason and reviewer required</p></div></li>
                  </ol>
                </section>

                <section className="d2-scope-note">
                  <strong>{t("V1 范围边界", "V1 scope boundary")}</strong>
                  <p>{t("不包含 NFT 验证、INJ 奖励、X 连接或公开排行榜。", "No NFT verification, INJ rewards, X connection, or public leaderboard.")}</p>
                </section>
              </aside>
            </div>
          </>
        ) : (
          <section className="d2-admin-view">
            <div className="d2-admin-metrics">
              <article><span>REGISTERED BUILDERS</span><strong>128</strong><small>+12 this month</small></article>
              <article><span>EVENTS THIS CYCLE</span><strong>364</strong><small>98.6% verified</small></article>
              <article><span>SYNC HEALTH</span><strong>99.8%</strong><small>2 events queued</small></article>
              <article><span>MANUAL REVIEWS</span><strong>7</strong><small>oldest · 3h</small></article>
            </div>

            <div className="d2-admin-grid">
              <section className="d2-panel d2-user-panel">
                <header className="d2-panel-header">
                  <div><span className="d2-overline">USER MANAGEMENT</span><h2>{t("建设者与分数", "Builders & scores")}</h2></div>
                  <button type="button" className="d2-btn d2-btn-line" onClick={exportCsv}>Export CSV ↓</button>
                </header>
                <div className="d2-user-table-wrap">
                  <table className="d2-user-table">
                    <thead><tr><th>Builder</th><th>Wallet</th><th>GitHub PR</th><th>Deploy</th><th>Admin</th><th>Total</th></tr></thead>
                    <tbody>
                      {adminUsers.map((user) => {
                        const total = user.pullRequests + user.deployments + user.manual;
                        return (
                          <tr key={user.wallet}>
                            <td><strong>{user.handle}</strong><span>@{user.github}</span></td>
                            <td><code>{user.wallet}</code></td>
                            <td>{user.pullRequests}</td>
                            <td>{user.deployments}</td>
                            <td>{user.manual}</td>
                            <td><strong>{total}</strong></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              <aside className="d2-panel d2-adjustment-panel">
                <span className="d2-overline">MANUAL ADJUSTMENT</span>
                <h2>{t("记录人工分数", "Record admin score")}</h2>
                <label>{t("建设者", "Builder")}<select defaultValue="kaze"><option value="kaze">kaze.n1nj4</option><option value="ada">ada.injective</option><option value="rei">rei.cityzero</option></select></label>
                <label>{t("原因", "Reason")}<select defaultValue="community"><option value="community">Community activity</option><option value="operations">Operations support</option><option value="special">Special task</option><option value="correction">Score correction</option></select></label>
                <label>{t("审计备注", "Audit note")}<textarea defaultValue="Contribution verified by city operations." /></label>
                <div className="d2-adjust-buttons">
                  <button type="button" onClick={() => applyDemoAdjustment(25)}>+25</button>
                  <button type="button" className="negative" onClick={() => applyDemoAdjustment(-10)}>−10</button>
                </div>
                {adminNotice && <p className="d2-admin-notice" role="status">{adminNotice}</p>}
              </aside>
            </div>

            <section className="d2-panel d2-pipeline-panel">
              <header className="d2-panel-header"><div><span className="d2-overline">HOURLY POLLING</span><h2>{t("同步管道", "Sync pipeline")}</h2></div><button type="button" className="d2-btn d2-btn-dark" onClick={runSync}>{syncing ? "Running…" : "Run all syncs"}</button></header>
              <div className="d2-pipeline-grid">
                <article><span className="d2-pipeline-light" /><div><strong>GitHub merged PRs</strong><p>24 repositories · last run {lastSync}</p></div><b>HEALTHY</b></article>
                <article><span className="d2-pipeline-light" /><div><strong>Contract deployments</strong><p>Injective EVM · last run {lastSync}</p></div><b>HEALTHY</b></article>
                <article><span className="d2-pipeline-light is-warn" /><div><strong>Manual review queue</strong><p>7 events awaiting an operator</p></div><b className="is-warn">ACTION</b></article>
              </div>
            </section>
          </section>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;
