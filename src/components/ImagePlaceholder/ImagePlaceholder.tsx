import "./ImagePlaceholder.css";

/* ====================================================================
 * ImagePlaceholder · 图片占位块
 * --------------------------------------------------------------------
 * 灰色斜纹色块,标注该区域将来需要放什么图片 + 建议比例。
 * 用于在接入真实素材前,把"哪里需要图"显式留出来。
 * ==================================================================== */

interface ImagePlaceholderProps {
  /** 该区域需要什么图片(可中英) */
  label: string;
  /** CSS aspect-ratio,如 "3 / 4" "1" "16 / 9" "21 / 9" */
  ratio?: string;
  /** 附加 class,用于尺寸/圆角微调 */
  className?: string;
  /** 仅显示图标(用于很小的方块,如头像/图标) */
  iconOnly?: boolean;
  /** 已准备好的真实图片路径 */
  src?: string;
  /** 图片在容器内的裁切焦点 */
  objectPosition?: string;
  /** img loading 策略 (首屏外的远程大图建议 "lazy") */
  loading?: "lazy" | "eager";
}

function ImagePlaceholder({
  label,
  ratio = "16 / 9",
  className = "",
  iconOnly = false,
  src,
  objectPosition,
  loading,
}: ImagePlaceholderProps) {
  if (src) {
    return (
      <div
        className={`imgph imgph-real ${className}`}
        style={{ aspectRatio: ratio }}
        role="img"
        aria-label={label}
        title={label}
      >
        <img
          src={src}
          alt={label}
          style={{ objectPosition }}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div
      className={`imgph ${className}`}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={label}
      title={label}
    >
      <span className="imgph-icon" aria-hidden="true">
        🖼
      </span>
      {!iconOnly && <span className="imgph-label">{label}</span>}
    </div>
  );
}

export default ImagePlaceholder;
