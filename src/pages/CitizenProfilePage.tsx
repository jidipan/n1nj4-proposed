import { Link } from "react-router-dom";
import { ArrowIcon, StatusBadge } from "../components/PublicPage/PublicPage";
import "../components/PublicPage/PublicPage.css";
import { useLanguage } from "../context/useLanguage";

function CitizenProfilePage() {
  const { language } = useLanguage();
  const t = (zh: string, en: string) => (language === "zh" ? zh : en);

  return (
    <div className="public-page">
      <section className="public-section public-section--soft" style={{ minHeight: "calc(100dvh - 64px)", display: "grid", placeItems: "center" }}>
        <div className="public-shell">
          <div className="public-cta-band">
            <div>
              <StatusBadge status="planned" language={language} />
              <h2 style={{ marginTop: "24px" }}>{t("公开公民档案尚未开放", "Public citizen profiles are not live yet")}</h2>
              <p>{t("这个路由已为未来的可验证档案保留。在真实身份数据接入前，这里不会展示模拟 Citizen ID、等级、徽章或贡献记录。", "This route is reserved for future verifiable profiles. It will not display simulated Citizen IDs, tiers, badges, or contribution records before real identity data is connected.")}</p>
            </div>
            <Link to="/citizenship" className="public-button public-button--light">{t("返回 Citizenship", "Back to Citizenship")} <ArrowIcon /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CitizenProfilePage;
