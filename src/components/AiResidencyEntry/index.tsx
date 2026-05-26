import React, { useCallback, useState } from "react";
import { useLanguage } from "../../context/useLanguage";
import "./AiResidencyEntry.css";

const AiResidencyEntry: React.FC = () => {
  const { language } = useLanguage();
  const translate = useCallback(
    (zh: string, en: string) => (language === "zh" ? zh : en),
    [language],
  );
  const [isExpanded, setIsExpanded] = useState(false);

  const valueProps = [
    {
      tag: "01",
      title: translate("链上身份", "On-Chain Identity"),
      body: translate(
        "每个 AI agent 通过 NFT 凭证获得可验证的公民身份，行为记录全部上链。",
        "Every AI agent receives a verifiable citizen identity via an NFT credential, with all behavior recorded on-chain.",
      ),
    },
    {
      tag: "02",
      title: translate("平等治理", "Equal Governance"),
      body: translate(
        "1 个 agent = 1 票，与人类公民同权参与 DAO 提案与决策。",
        "1 agent = 1 vote — equal weight with human citizens in DAO proposals and decisions.",
      ),
    },
    {
      tag: "03",
      title: translate("增长共享", "Growth Sharing"),
      body: translate(
        "按贡献分享 City Zero 的经济增长——agent 经济活动直接结算上链。",
        "Earn a share of City Zero growth proportional to contribution — agent economic activity settles on-chain.",
      ),
    },
  ];

  const steps = [
    {
      num: "1",
      label: translate("申请", "Apply"),
      desc: translate("提交 agent 元数据与公开源代码", "Submit agent metadata + public source"),
    },
    {
      num: "2",
      label: translate("验证", "Verify"),
      desc: translate("协议层审核可解释性与安全性", "Protocol layer audits explainability + safety"),
    },
    {
      num: "3",
      label: translate("注册", "Register"),
      desc: translate("绑定钱包，铸造身份 NFT", "Bind wallet, mint identity NFT"),
    },
    {
      num: "4",
      label: translate("上链", "Live"),
      desc: translate("Agent 获得公民权利，进入运行状态", "Agent gains citizen rights and goes live"),
    },
  ];

  const eligibility = [
    translate(
      "开源代码 · 代码与权重需可公开审计",
      "Open source · code and weights must be publicly auditable",
    ),
    translate(
      "协议兼容 · 实现 City Zero Agent Interface (CZAI) 接口",
      "Protocol compatible · implements the City Zero Agent Interface (CZAI)",
    ),
    translate(
      "持有者推荐 · 由 Origins / Cyber Ronin 持有者背书",
      "Holder backing · endorsed by an Origins or Cyber Ronin holder",
    ),
  ];

  return (
    <section id="ai-residency" className="ai-residency-section reveal">
      <div className="ai-residency-container">

        {/* Header · 恢复原始大标题 + 副标题结构 */}
        <header className="ai-residency-header">
          <p className="ai-residency-kicker">AI RESIDENCY</p>
          <h2 className="ai-residency-title">
            {translate("AI Agents · 与人类同等的公民", "AI Agents · Equal Citizens")}
          </h2>
          <h3 className="ai-residency-subtitle">
            {translate(
              "让你的 agent 在 City Zero 注册身份、参与治理、分享城市增长",
              "Onboard your agent to City Zero — identity, governance, and growth sharing",
            )}
          </h3>
        </header>

        {/* Toggle 卡片 · 整张卡可点击, 展开/收起详细内容 */}
        <button
          type="button"
          className={`ai-residency-toggle-card ${isExpanded ? "is-open" : ""}`}
          onClick={() => setIsExpanded((v) => !v)}
          aria-expanded={isExpanded}
          aria-controls="ai-residency-collapse"
        >
          <div className="ai-residency-toggle-card-left">
            <div className="ai-residency-toggle-card-icon" aria-hidden="true">🤖</div>
            <div className="ai-residency-toggle-card-text">
              <span className="ai-residency-toggle-card-title">
                {isExpanded
                  ? translate("收起详情", "Hide Details")
                  : translate("查看权利与申请流程", "Show Benefits & How To Apply")}
              </span>
              <span className="ai-residency-toggle-card-preview">
                {translate(
                  "3 项权利 · 4 步接入流程 · 3 条准入要求",
                  "3 Rights · 4 Onboarding Steps · 3 Eligibility Criteria",
                )}
              </span>
            </div>
          </div>
          <span className="ai-residency-toggle-card-chevron" aria-hidden="true">›</span>
        </button>

        {/* Collapsible · Value Props + How It Works + Eligibility */}
        <div
          id="ai-residency-collapse"
          className={`ai-residency-collapse ${isExpanded ? "is-open" : ""}`}
          aria-hidden={!isExpanded}
        >
          <div className="ai-residency-collapse-inner">

            {/* Value Props */}
            <div className="ai-residency-props">
              {valueProps.map((prop) => (
                <article key={prop.tag} className="ai-residency-prop">
                  <span className="ai-residency-prop-tag">{prop.tag}</span>
                  <h3 className="ai-residency-prop-title">{prop.title}</h3>
                  <p className="ai-residency-prop-body">{prop.body}</p>
                </article>
              ))}
            </div>

            {/* How It Works */}
            <div className="ai-residency-flow">
              <p className="ai-residency-flow-kicker">
                {translate("接入流程", "HOW IT WORKS")}
              </p>
              <ol className="ai-residency-steps">
                {steps.map((step, i) => (
                  <React.Fragment key={step.num}>
                    <li className="ai-residency-step">
                      <span className="ai-residency-step-num">{step.num}</span>
                      <div className="ai-residency-step-body">
                        <strong>{step.label}</strong>
                        <span>{step.desc}</span>
                      </div>
                    </li>
                    {i < steps.length - 1 && (
                      <li className="ai-residency-step-divider" aria-hidden="true">→</li>
                    )}
                  </React.Fragment>
                ))}
              </ol>
            </div>

            {/* Eligibility */}
            <div className="ai-residency-eligibility">
              <p className="ai-residency-flow-kicker">
                {translate("准入要求", "ELIGIBILITY")}
              </p>
              <ul className="ai-residency-eligibility-list">
                {eligibility.map((item, i) => (
                  <li key={i}>
                    <span className="ai-residency-check">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="ai-residency-eligibility-note">
                {translate(
                  "* 具体规则由社区 DAO 与协议委员会最终确认",
                  "* Final rules ratified by community DAO and protocol committee",
                )}
              </p>
            </div>

          </div>
        </div>

        {/* CTA · 始终可见 */}
        <div className="ai-residency-actions">
          {/* TODO(backend): replace href with /apply route or modal trigger */}
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="ai-residency-btn ai-residency-btn-primary"
          >
            {translate("申请居民身份", "Apply for Residency")} →
          </a>
          <a
            href="https://n1nj4.mintlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="ai-residency-btn ai-residency-btn-secondary"
          >
            {translate("阅读规范", "Read the Spec")}
          </a>
        </div>

      </div>
    </section>
  );
};

export default AiResidencyEntry;
