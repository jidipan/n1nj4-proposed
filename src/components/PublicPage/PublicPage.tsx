import type { ReactNode } from "react";

export type ProductStatus = "live" | "beta" | "prototype" | "planned";

const statusCopy: Record<ProductStatus, { zh: string; en: string }> = {
  live: { zh: "已开放", en: "Live" },
  beta: { zh: "试运行", en: "Beta" },
  prototype: { zh: "原型", en: "Prototype" },
  planned: { zh: "规划中", en: "Planned" },
};

export function StatusBadge({
  status,
  language,
  label,
}: {
  status: ProductStatus;
  language: "zh" | "en";
  label?: string;
}) {
  return (
    <span className={`product-status product-status--${status}`}>
      <i aria-hidden="true" />
      {label ?? statusCopy[status][language]}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <header className={`public-section-heading public-section-heading--${align}`}>
      <p className="public-eyebrow public-section-kicker">{eyebrow}</p>
      <h2>{title}</h2>
      {description && <p className="public-section-lead">{description}</p>}
    </header>
  );
}

export function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

export function CheckIcon() {
  return <span className="public-check" aria-hidden="true">✓</span>;
}

export function NumberMark({ children }: { children: ReactNode }) {
  return <span className="public-number">{children}</span>;
}
