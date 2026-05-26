import { useLanguage } from "../../context/useLanguage";

function GalleryHero() {
  const { language } = useLanguage();
  return (
    <div
      className="bg-gradient-light border-bottom"
      style={{ padding: "120px 20px 80px" }}
    >
      <div className="container text-center">
        <h1
          className="title text-primary mb-lg"
          style={{
            fontSize: "4.5rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          N1NJ4 ORIGIN GALLERY
        </h1>
        <p
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            fontSize: "1.05rem",
            lineHeight: 1.8,
            color: "var(--text-secondary)",
          }}
        >
          {language === "zh"
            ? "这里存放着 N1NJ4 的视觉档案：每一位忍者都由算法随机生成。浏览画廊即可追踪他们的进化形态、任务状态与社区贡献，让零号城市的故事在你的屏幕上延展。"
            : "This is the visual archive of N1NJ4: every ninja is algorithmically generated. Browse the gallery to track their evolution, missions, and contributions as City Zero's story unfolds on your screen."}
        </p>
      </div>
    </div>
  );
}

export default GalleryHero;
