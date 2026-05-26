import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./CityZeroTaskDetailPage.css";
import { useLanguage } from "../../context/useLanguage";

const InjectivePassDetailPage: React.FC = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const translate = (zh: string, en: string) => (language === "zh" ? zh : en);
  const heroImage =
    (location.state as { heroImage?: string } | null)?.heroImage ||
    "/CityZero/job.png";

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="task-detail-page">
      {/* Hero Section */}
      <section className="task-detail-hero">
        <img
          src={heroImage}
          alt={translate("Injective Pass 项目图", "Injective Pass")}
          className="task-detail-hero-image"
          style={{ objectPosition: "center 72%" }}
        />
      </section>

      {/* Content Section */}
      <section className="task-detail-content-section">
        <div className="task-detail-content">
          {/* Return Navigation */}
          <Link to="/city-zero" className="back-link">
            {translate("← 返回 City Zero", "← Back to City Zero")}
          </Link>

          {/* Header Info Route */}
          <div className="task-head-info">
            <div className="task-head-left">
              <h1 className="task-title">Injective Pass</h1>
              <h3 className="task-subtitle">
                {translate(
                  "在 Injective 上探索更顺滑的新手首步体验",
                  "A smoother first-step onboarding experiment on Injective"
                )}
              </h3>
              <div className="task-tags">
                <span className="task-tag">{translate("标签", "Tags")}</span>
                <span className="task-tag">{translate("新手引导", "Onboarding")}</span>
                <span className="task-tag">{translate("Passkey", "Passkey")}</span>
                <span className="task-tag">{translate("Injective", "Injective")}</span>
              </div>
            </div>
            <div className="task-head-right">
              <a
                href="https://www.injpass.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="event-website-btn"
              >
                {translate("项目官网", "Event Website")}
              </a>
            </div>
          </div>

          <hr className="task-divider" />

          {/* Split Body Layout */}
          <div className="task-body-layout">
            {/* Left Content */}
            <div className="task-main-content">
              <h4 className="task-section-title">{translate("项目详情", "Event Detail Description")}</h4>
              <div className="task-description">
                <p>
                  {translate(
                    "Web3 钱包经常把新手引导变成认知负担。用户在真正接触链上价值前，就被要求安装钱包、保存助记词、理解 Gas、区分链网络、处理难读地址。Injective Pass 的出发点是：把首次使用门槛降到接近主流支付应用的清晰度。",
                    "Web3 wallets often turn onboarding into cognitive overload. Before users touch any on-chain value, they are asked to install a wallet, store a seed phrase, understand gas, choose chains, and handle opaque addresses. Injective Pass starts from a different premise: reduce first-use friction to the same clarity users expect from mainstream payment apps."
                  )}
                </p>
                <p>
                  {translate(
                    "该产品希望把 onboarding 从“先学习和配置”改成“输入并发送”。在 Injective 上，重点不只是链性能，更是把底层能力转化为普通用户几秒内可完成的入口流程，不需要先理解复杂底层轨道。",
                    "The product goal is to make onboarding feel like \"type and send\" rather than \"study and configure.\" On Injective, the focus is not only chain performance, but translating that infrastructure into an entry flow ordinary users can complete in seconds, without learning the rails first."
                  )}
                </p>
                <p>
                  {translate(
                    "INJ Pass 采用 Passkey 优先的身份创建和所见即所得的交互方式。若设备已有 passkey，用户可直接登录继续；若没有，系统引导创建。密钥管理下沉到操作系统安全能力，用户感知到的流程非常简单：创建 INJ Pass，然后开始使用。",
                    "INJ Pass introduces passkey-first identity creation and a WYSIWYG-style interface. If a passkey already exists on device, users sign in and continue. If not, they are guided to create one. Key management is pushed to OS-level security primitives, so the felt experience is simple: create an INJ Pass and start."
                  )}
                </p>
                <p>
                  {translate(
                    "系统仍保留 MetaMask 等兼容路径用于迁移，但默认方向很明确：新用户不应在第一次操作前先上“钱包教学课”。原型也探索了 Bonjour Card + Web NFC 的点触式入口，让首次登录更接近“刷卡”肌肉记忆，而不是复杂的加密仪式。",
                    "Compatibility paths like MetaMask remain available for migration, but the default direction is clear: newcomers should not need wallet education before first action. The prototype also explores Web NFC with Bonjour Card, enabling tap-to-enter identity flows that feel closer to transit-card muscle memory than crypto ceremony."
                  )}
                </p>
                <p>
                  {translate(
                    "随着 Injective EVM 上线，Injective Pass 目标是在熟悉的开发体验之上，叠加 Injective 的高性能执行和原生链上能力。这不是终点，而是起点：验证下一阶段 L1 竞争，可能不是比谁入口更复杂，而是比谁的第一体验更顺滑。",
                    "With Injective EVM live, Injective Pass aims to combine familiar developer access with high-performance execution and native on-chain capabilities. This is a starting point, not an endpoint: proving that the next chapter of L1 competition may be won by radically smoother first experience, not by complexity at the front door."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InjectivePassDetailPage;
