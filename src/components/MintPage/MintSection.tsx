import { useLanguage } from "../../context/useLanguage";

function MintSection() {
  const { language } = useLanguage();

  const handleMint = () => {
    // 直接跳转到 Rarible 二级市场页面
    window.open(
      "https://rarible.com/injective/collections/0x816070929010a3d202d8a6b89f92bee33b7e8769",
      "_blank"
    );
  };

  return (
    <div className="card flex-col gap-lg">
      <button
        className="btn btn-primary btn-full btn-lg"
        onClick={handleMint}
      >
        {language === "zh" ? "前往二级市场" : "Trade On Secondary"}
      </button>
    </div>
  );
}

export default MintSection;
