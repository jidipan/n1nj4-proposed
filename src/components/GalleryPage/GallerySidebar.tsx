import { useMemo, useState } from "react";
import { useLanguage } from "../../context/useLanguage";
import "./GallerySidebar.css";

type TraitSummary = Record<string, Record<string, number>>;

interface GallerySidebarProps {
  traitSummary: TraitSummary;
  filters: Record<string, string>;
  onFilterChange: (category: string, value: string) => void;
}

function GallerySidebar({
  traitSummary,
  filters,
  onFilterChange,
}: GallerySidebarProps) {
  const { language } = useLanguage();
  const translate = useMemo(
    () => (zh: string, en: string) => (language === "zh" ? zh : en),
    [language],
  );
  const categories = Object.keys(traitSummary);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () =>
      categories.reduce(
        (acc, category) => {
          acc[category] = false;
          return acc;
        },
        {} as Record<string, boolean>,
      ),
  );

  const toggleSection = (category: string) => {
    setOpenSections((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <div className="gallery-sidebar">
      <div className="sidebar-section">
        <h3
          className="sidebar-title"
          style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}
        >
          {translate("按属性筛选", "Filter By")}
        </h3>
      </div>
      <div className="sidebar-divider"></div>
      {categories.map((category) => {
        const options = Object.keys(traitSummary[category]);
        const isOpen = openSections[category];

        return (
          <div className="sidebar-section" key={category}>
            <button
              className="sidebar-section-header"
              onClick={() => toggleSection(category)}
            >
              <span className="sidebar-title">{category}</span>
              <span className={`dropdown-icon ${isOpen ? "open" : ""}`}>⌃</span>
            </button>
            {isOpen && (
              <div className="sidebar-options">
                <button
                  className={`sidebar-option ${
                    filters[category] === "all" ? "active" : ""
                  }`}
                  onClick={() => onFilterChange(category, "all")}
                >
                  {translate("全部", "All")}
                </button>
                {options.map((option) => (
                  <button
                    key={option}
                    className={`sidebar-option ${
                      filters[category] === option ? "active" : ""
                    }`}
                    onClick={() => onFilterChange(category, option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
            <div className="sidebar-divider light"></div>
          </div>
        );
      })}
    </div>
  );
}

export default GallerySidebar;
