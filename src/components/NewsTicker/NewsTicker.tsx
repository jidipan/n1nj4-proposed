import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/useLanguage";
import ImagePlaceholder from "../ImagePlaceholder/ImagePlaceholder";
import { NEWS } from "../../data/news";
import "./NewsTicker.css";

/* ====================================================================
 * NewsTicker · 城市快报
 * --------------------------------------------------------------------
 * 始终展示 3 条新闻 (标题 + 海报);每 3 秒传送带式轮换一格:
 * 新新闻从右侧滑入, 整排左移一格, 最左侧那条滑出。
 * 实现: track 尾部追加第 4 条 → translateX 左移一格 → 动画结束后
 * 移除头部并瞬时复位 (视觉无跳变)。
 * 卡片 hover 揭示效果借鉴 City Zero 的 COMMUNITY GALLERY。
 * ==================================================================== */

const KICKER = { zh: "城市快报", en: "CITY DISPATCH" };
const ROTATE_MS = 3000;
const SLOT_COUNT = 3;

function NewsTicker() {
  const { language } = useLanguage();
  const t = (zh: string, en: string) => (language === "zh" ? zh : en);

  // track: 可见 3 条; 轮换期间尾部多挂 1 条 (共 4 条)
  const [track, setTrack] = useState<number[]>(() =>
    Array.from({ length: SLOT_COUNT }, (_, i) => i % NEWS.length)
  );
  const [shifting, setShifting] = useState(false);
  const nextRef = useRef(SLOT_COUNT % NEWS.length); // 下一个要滑入的新闻

  useEffect(() => {
    if (NEWS.length <= SLOT_COUNT) return;
    const timer = setInterval(() => {
      setTrack((prev) => {
        if (prev.length > SLOT_COUNT) return prev; // 上一轮动画未结束, 跳过
        let n = nextRef.current % NEWS.length;
        let guard = 0;
        while (prev.includes(n) && guard < NEWS.length) {
          n = (n + 1) % NEWS.length; // 避免与在场卡片重复
          guard++;
        }
        nextRef.current = (n + 1) % NEWS.length;
        return [...prev, n];
      });
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, []);

  // 第 4 条挂载后: 强制 reflow 让其以 translateX(0) 入位, 再同步加 is-shifting
  // 触发过渡 (FLIP; 不用 rAF — 页面不在前台时 rAF 不触发, 会卡死轮换)
  const trackEl = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (track.length <= SLOT_COUNT) return;
    void trackEl.current?.offsetWidth;
    setShifting(true);
  }, [track.length]);

  // 完成位移: 移除头部卡片 + 瞬时复位 (幂等, transitionend 与兜底定时器共用)
  const finishShift = useCallback(() => {
    setTrack((prev) => (prev.length > SLOT_COUNT ? prev.slice(1) : prev));
    setShifting(false);
  }, []);

  // 兜底: 后台标签页等场景 transitionend 可能不来, 超时强制收尾
  useEffect(() => {
    if (!shifting) return;
    const fallback = setTimeout(finishShift, 700);
    return () => clearTimeout(fallback);
  }, [shifting, finishShift]);

  // 过渡结束 (卡片 hover 的 transitionend 会冒泡, 需过滤)
  const handleShiftEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    finishShift();
  };

  return (
    <section className="section news-ticker-section reveal">
      <div className="container">
        <header className="news-ticker-header">
          <p className="section-kicker">{t(KICKER.zh, KICKER.en)}</p>
        </header>

        <div className="news-ticker-viewport">
          <div
            ref={trackEl}
            className={`news-ticker-track${shifting ? " is-shifting" : ""}`}
            onTransitionEnd={handleShiftEnd}
          >
          {track.map((newsIdx) => {
            const item = NEWS[newsIdx];
            // key 用 newsIdx: 轮换时 React 复用前 3 张 DOM, 只挂载新卡
            return (
              <Link
                key={newsIdx}
                to={`/news/${item.id}`}
                className="news-tk-card"
              >
                <div className="news-tk-top">
                  <div className="news-tk-media">
                    <ImagePlaceholder
                      src={item.image}
                      ratio="16 / 9"
                      label={t(item.imageLabel.zh, item.imageLabel.en)}
                    />
                  </div>
                  <div className="news-tk-meta">
                    <div className="news-tk-tagrow">
                      <span className={`news-tk-tag news-tk-tag-${item.catKey}`}>
                        {t(item.category.zh, item.category.en)}
                      </span>
                      <span className="news-tk-source">
                        {item.source}
                        {item.date ? ` · ${item.date}` : ""}
                      </span>
                    </div>
                    <h3 className="news-tk-title">{t(item.title.zh, item.title.en)}</h3>
                  </div>
                </div>
                <p className="news-tk-desc">{t(item.summary.zh, item.summary.en)}</p>
              </Link>
            );
          })}
          </div>
        </div>

        <div className="news-ticker-footer">
          <Link to="/news" className="news-ticker-all">
            {t("查看全部 →", "View all →")}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NewsTicker;
