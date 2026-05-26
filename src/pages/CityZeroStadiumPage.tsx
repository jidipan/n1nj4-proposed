import React from "react";
import { Link } from "react-router-dom";
import "./CityZeroStadiumPage.css";
import { useLanguage } from "../context/useLanguage";

interface PhaseData {
  id: number;
  titleZh: string;
  titleEn: string;
  image: string;
  status: "Completed" | "Ongoing" | "Upcoming";
  descriptionsZh: string[];
  descriptionsEn: string[];
}

const PHASE_DATA: PhaseData[] = [
  {
    id: 1,
    titleZh: "Ninja Labs：City Zero 建设",
    titleEn: "Ninja Labs: City Zero Construction",
    image: "/CityZero/job.png",
    status: "Ongoing",
    descriptionsZh: [
      "City Zero 现已开放长期建设者合作。如果你是开发者或项目团队，正在寻找长期落地场景，欢迎联系 Ninja Labs，我们将协助你把项目引入这座城市。",
      "加入的项目将获得 City Zero 全域展示机会，并持续获得 Ninja Labs 团队支持。你也可以把项目作为资源或服务提供给更广泛社区，成为 City Zero 的长期组成部分。这不是短期资助活动，而是一个长期共建邀请。",
    ],
    descriptionsEn: [
      "City Zero is now open for long-term builder partnerships. If you are a developer or a project team looking for a home, we want to hear from you. Reach out to Ninja Labs and we will work with you on bringing your project into the city.",
      "Projects that join will get featured across City Zero and receive ongoing support from the Ninja Labs team. You can also offer your project as a resource or service to the broader community, making it a permanent part of what City Zero has to offer. This is not a short-term grant program. It is an open invitation to build here for the long run.",
    ],
  },
  {
    id: 2,
    titleZh: "AI 前沿训练营",
    titleEn: "AI Frontier Bootcamp",
    image: "/CityZero/task_board.png",
    status: "Upcoming",
    descriptionsZh: ["即将上线，详情即将公布。"],
    descriptionsEn: ["Coming soon. Details will be revealed shortly."],
  },
];

const CityZeroStadiumPage: React.FC = () => {
  const { language } = useLanguage();
  const isZh = language === "zh";
  const translate = (zh: string, en: string) => (isZh ? zh : en);

  const getStatusLabel = (status: PhaseData["status"]) => {
    if (status === "Completed") return translate("已完成", "Completed");
    if (status === "Ongoing") return translate("进行中", "Ongoing");
    return translate("即将开始", "Upcoming");
  };

  return (
    <div className="stadium-page">
      {/* Hero Section */}
      <section className="stadium-hero-section">
        <div className="stadium-hero-image-container">
          <img
            src="/CityZero/Stadium.png"
            alt={translate("City Zero 体育场", "City Zero Stadium")}
            className="stadium-hero-image"
          />
        </div>
      </section>

      {/* Content Section */}
      <section className="stadium-content-section">
        <div className="stadium-content">
          {/* Header Row */}
          <div className="stadium-header-row">
            <div className="stadium-title-group">
              <h1 className="stadium-title">
                {translate("City Zero 体育场", "City Zero Stadium")}
              </h1>
            </div>
            <div className="stadium-status-badge">
              {translate("进行中", "Ongoing")}
            </div>
          </div>

          {/* Original Introduction & Progress */}
          <div className="stadium-body-row">
            <div className="stadium-text-column">
              <h3 className="stadium-subtitle">
                {translate("简介", "BRIEF INTRODUCTION")}
              </h3>
              <p>
                {translate(
                  "City Zero Stadium 是 Ninja Labs 为 City Zero 居民打造的互动场域。在这里你可以看到当前最重要的进行中活动，并与 Ninja Labs 团队直接连接。",
                  "City Zero Stadium is the playground that Ninja Labs built for the residents of City Zero. This is where you will find our major ongoing events and a direct line to interact with the Ninja Labs team.",
                )}
              </p>
              <p>
                {translate(
                  "Stadium 也是我们持续发布参与机会的地方。无论是加入活动、参与共建，还是跟进社区动态，你都可以在这里找到入口。如果你是建设者，这里也会发布面向落地执行者的成长机会。建议定期查看，通常都会有值得参与的新内容。",
                  "The Stadium is also where we share participation opportunities as they come up, whether that means joining a campaign, contributing to something we are building, or simply being part of what is happening in the community. If you are a builder, this is also where we post growth opportunities designed specifically for people who want to create and ship things within City Zero. Come check in regularly. There is usually something worth your attention.",
                )}
              </p>
            </div>

            <div className="stadium-progress-column">
              <div className="progress-label">
                {translate("10% 已完成", "10% Completed")}
              </div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{ width: "10%" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Advanced Body Layout */}
          <div className="stadium-advanced-body">
            {/* Left Column: Mission Phase Cards */}
            <div className="stadium-phases-column">
              {PHASE_DATA.map((phase) => (
                <div key={phase.id} className="phase-card">
                  <div className="phase-image-wrapper">
                    <img
                      src={phase.image}
                      alt={translate(phase.titleZh, phase.titleEn)}
                      className="phase-image"
                    />
                  </div>
                  <div className="phase-header">
                    <h3 className="phase-title">
                      {translate(phase.titleZh, phase.titleEn)}
                    </h3>
                    <span
                      className={`phase-status-badge status-${phase.status.toLowerCase()}`}
                    >
                      {getStatusLabel(phase.status)}
                    </span>
                  </div>
                  <div className="phase-content">
                    {(isZh ? phase.descriptionsZh : phase.descriptionsEn).map(
                      (desc, idx) => (
                        <p key={idx}>{desc}</p>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Sidebar Widgets */}
            <div className="stadium-sidebar-column">
              {/* Widget 1: Participants & Links */}
              <div className="sidebar-widget">
                <h4 className="widget-title">
                  {translate("参与方", "Participant")}
                </h4>
                <div className="participant-list">
                  <div className="participant-item">
                    <img
                      src="/inj%20logo.svg"
                      alt="Injective"
                      className="p-avatar"
                    />
                    <span>Injective</span>
                  </div>
                  <div className="participant-item">
                    <img
                      src="/Ninja%20Lab%20logo.png"
                      alt="Ninja Labs CN"
                      className="p-avatar"
                    />
                    <span>Ninja Labs HQ</span>
                  </div>
                </div>
                <h4 className="widget-title">
                  {translate("参与方链接", "Participant Links")}
                </h4>
                <div className="project-link-btn">
                  Injective：https://injective.com/
                </div>
                <div className="project-link-btn">
                  Ninja Labs HQ：https://x.com/NinjaLabsHQ
                </div>
              </div>

              {/* Widget 3: Grants & Incubation */}
              <div className="sidebar-widget no-padding">
                <div className="widget-header-wrapper">
                  <h3 className="widget-main-title">
                    {translate("资助与孵化", "Grants & Incubation")}
                  </h3>
                </div>
                <div className="widget-body-wrapper grants-body">
                  <p className="grants-intro">
                    {translate(
                      "Ninja Labs 孵化计划。",
                      "Ninja Labs Incubation Program.",
                    )}
                  </p>

                  <div className="grants-section">
                    <div className="grants-section-header">
                      <span className="grants-badge grants-badge-green">
                        {translate("社区资助", "Community Grants")}
                      </span>
                    </div>
                    <p className="grants-section-desc">
                      {translate(
                        "为能惠及 City Zero 居民的项目提供直接资金支持。资助由 N1NJ4 持有者通过链上投票批准，按里程碑发放，并在 Injective 上保持全流程透明。",
                        "Direct funding for projects that benefit City Zero citizens. Grants are approved by N1NJ4 holders through on-chain voting, milestone-based, and fully transparent on Injective.",
                      )}
                    </p>
                    <div className="grants-tags">
                      <span className="grants-tag">
                        {translate("开源基础设施", "Open Source Infra")}
                      </span>
                      <span className="grants-tag">
                        {translate("消费级应用", "Consumer Apps")}
                      </span>
                      <span className="grants-tag">
                        {translate("研究", "Research")}
                      </span>
                      <span className="grants-tag">
                        {translate("社区建设", "Community Building")}
                      </span>
                    </div>
                  </div>

                  <div className="grants-divider" />

                  <div className="grants-section">
                    <div className="grants-section-header">
                      <span className="grants-badge grants-badge-blue">
                        {translate("孵化", "Incubation")}
                      </span>
                    </div>
                    <p className="grants-section-desc">
                      {translate(
                        "为希望在 City Zero 内长期成长的建设者提供结构化支持路径，超越一次性资助。",
                        "A structured support path for builders who want to grow a lasting project inside City Zero. Goes beyond a one-time grant.",
                      )}
                    </p>
                    <ul className="grants-list">
                      <li>
                        {translate(
                          "与里程碑绑定的多阶段持续资金支持",
                          "Multi-phase sustained funding tied to milestones",
                        )}
                      </li>
                      <li>
                        {translate(
                          "来自 Ninja Labs 工程团队的直接技术支持",
                          "Direct technical support from Ninja Labs engineers",
                        )}
                      </li>
                      <li>
                        {translate(
                          "作为官方认可的 City Zero 项目进行展示",
                          "Featured as an endorsed City Zero project",
                        )}
                      </li>
                      <li>
                        {translate(
                          "资深 Web3 建设者导师辅导",
                          "Mentorship from experienced web3 builders",
                        )}
                      </li>
                      <li>
                        {translate(
                          "交付成果的链上凭证记录",
                          "On-chain credentialing of your deliverables",
                        )}
                      </li>
                    </ul>
                  </div>

                  <a
                    href="https://n1nj4.mintlify.app/economy/grants-incubation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grants-apply-btn"
                  >
                    {translate("了解更多", "Learn More")}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="stadium-footer-actions">
            <Link to="/city-zero" className="return-city-zero-btn">
              {translate("返回 City Zero", "Return to City Zero")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CityZeroStadiumPage;
