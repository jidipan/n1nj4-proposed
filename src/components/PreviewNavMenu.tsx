import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { HeaderNavItem } from "../context/LanguageContext";

type PreviewNavMenuProps = {
  items: HeaderNavItem[];
  label: string;
  pathname: string;
};

function PreviewNavMenu({ items, label, pathname }: PreviewNavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const hasActiveItem = items.some(
    (item) => pathname === item.path || pathname.startsWith(`${item.path}/`),
  );

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="preview-nav" ref={menuRef}>
      <button
        type="button"
        className={`preview-nav-toggle ${hasActiveItem ? "active" : ""}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="preview-nav-status" aria-hidden="true" />
        <span>{label}</span>
        <span className="preview-nav-chevron" aria-hidden="true">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen && (
        <div className="preview-nav-dropdown" role="menu">
          <div className="preview-nav-heading">
            <span>{label}</span>
            <span className="preview-nav-badge">TESTING</span>
          </div>
          {items.map((item) => {
            const isActive =
              pathname === item.path || pathname.startsWith(`${item.path}/`);

            return (
              <Link
                key={item.path}
                to={item.path}
                role="menuitem"
                className={`preview-nav-item ${isActive ? "active" : ""}`}
                onClick={() => setIsOpen(false)}
              >
                <span>{item.label}</span>
                <span className="preview-nav-arrow" aria-hidden="true">↗</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PreviewNavMenu;
