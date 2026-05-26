import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useLanguage } from "../context/useLanguage";
import type { Language } from "../context/LanguageContext";
import "./Header.css";

function Header() {
  const location = useLocation();
  const {
    language,
    setLanguage,
    supportedLanguages,
    translations,
  } = useLanguage();
  const navItems = translations.header.navItems;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (code: Language) => {
    setLanguage(code);
    setIsDropdownOpen(false);
  };

  const getActiveClass = (item: { path: string }) => {
    return location.pathname === item.path ? "active" : "";
  };

  return (
    <header className="header">
      {/* SVG filter for Liquid Glass refraction · 必须随 .header 一起渲染 */}
      <svg
        style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
        aria-hidden="true"
      >
        <defs>
          <filter id="liquid-glass" x="-10%" y="-10%" width="120%" height="120%">
            {/* 1. 生成柔和的分形噪声 */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.012"
              numOctaves="2"
              seed="92"
              result="noise"
            />
            {/* 2. 平滑噪声,避免过于锐利 */}
            <feGaussianBlur in="noise" stdDeviation="2" result="smoothNoise" />
            {/* 3. 用噪声驱动位移,产生液态折射效果 */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="smoothNoise"
              scale="18"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div className="header-glow" />
      <div className="header-container">
        <Link to="/" className="logo">
          <img src="/NINJ4-Logo-2.svg" alt="N1NJ4" className="logo-symbol" />
        </Link>

        <nav className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${getActiveClass(item)}`}
            >
              <span className="nav-link-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="header-right">
          <div className="language-switcher" ref={dropdownRef}>
            <button
              type="button"
              className="language-toggle"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              <span className="language-toggle-label">
                {translations.header.languageSwitcherLabel}
              </span>
              <span className="language-toggle-icon">
                {isDropdownOpen ? "▲" : "▼"}
              </span>
            </button>
            {isDropdownOpen && (
              <div className="language-dropdown">
                {supportedLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    className={`language-option ${
                      language === lang.code ? "active" : ""
                    }`}
                    onClick={() => handleLanguageSelect(lang.code)}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="header-divider" />
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated");

              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          type="button"
                          onClick={openConnectModal}
                          className="connect-button"
                        >
                          {language === "zh" ? "连接钱包" : "Connect"}
                        </button>
                      );
                    }
                    if (chain.unsupported) {
                      return (
                        <button
                          type="button"
                          onClick={openChainModal}
                          className="connect-button connect-button-warning"
                        >
                          {language === "zh" ? "网络不支持" : "Wrong Network"}
                        </button>
                      );
                    }
                    return (
                      <button
                        type="button"
                        onClick={openAccountModal}
                        className="connect-button"
                      >
                        {account.displayName}
                      </button>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </header>
  );
}

export default Header;
