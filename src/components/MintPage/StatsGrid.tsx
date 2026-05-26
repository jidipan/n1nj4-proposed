import { useLanguage } from "../../context/useLanguage";

interface StatsGridProps {
  totalMinted: number;
  maxSupply: number;
  userMinted: number;
  maxPerWallet: number;
}

function StatsGrid({
  totalMinted,
  maxSupply,
  userMinted,
  maxPerWallet,
}: StatsGridProps) {
  const { language } = useLanguage();
  return (
    <div className="grid-2 gap-md mb-lg">
      <div className="stat-card">
        <div className="stat-value">
          {totalMinted}/{maxSupply}
        </div>
        <div className="stat-label">
          {language === "zh" ? "已铸造/总量" : "Minted / Total"}
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-value">
          {userMinted}/{maxPerWallet}
        </div>
        <div className="stat-label">
          {language === "zh" ? "你的铸造量" : "Your Mints"}
        </div>
      </div>
    </div>
  );
}

export default StatsGrid;
