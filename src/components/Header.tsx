import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useDisconnect } from "wagmi";
import { useLanguage } from "../context/useLanguage";
import type { Language } from "../context/LanguageContext";
import "./Header.css";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { disconnect } = useDisconnect();
  const {
    language,
    setLanguage,
    supportedLanguages,
    translations,
  } = useLanguage();
  const navItems = translations.header.navItems;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const accountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setIsAccountMenuOpen(false);
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
                        <div className="account-menu-wrap" ref={accountRef}>
                          <button
                            type="button"
                            onClick={() =>
                              setIsAccountMenuOpen((prev) => !prev)
                            }
                            className="connect-button"
                          >
                            {language === "zh" ? "连接钱包" : "Connect"}
                            <span className="language-toggle-icon">
                              {isAccountMenuOpen ? "▲" : "▼"}
                            </span>
                          </button>
                          {isAccountMenuOpen && (
                            <div className="account-popover">
                              <button
                                type="button"
                                className="account-popover-item"
                                onClick={() => {
                                  setIsAccountMenuOpen(false);
                                  openConnectModal();
                                }}
                              >
                                {language === "zh" ? "连接钱包" : "Connect Wallet"}
                              </button>
                              <button
                                type="button"
                                className="account-popover-item primary"
                                onClick={() => {
                                  setIsAccountMenuOpen(false);
                                  navigate("/dashboard");
                                }}
                              >
                                {language === "zh"
                                  ? "进入 Dashboard"
                                  : "Enter Dashboard"}
                              </button>
                            </div>
                          )}
                        </div>
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
                      <div className="account-menu-wrap" ref={accountRef}>
                        <button
                          type="button"
                          onClick={() =>
                            setIsAccountMenuOpen((prev) => !prev)
                          }
                          className="connect-button"
                        >
                          {account.displayName}
                          <span className="language-toggle-icon">
                            {isAccountMenuOpen ? "▲" : "▼"}
                          </span>
                        </button>
                        {isAccountMenuOpen && (
                          <div className="account-popover">
                            <div className="account-popover-head">
                              <div className="account-avatar">N1</div>
                              <div className="account-popover-id">
                                <div className="account-popover-citizen">
                                  {language === "zh"
                                    ? "公民 #1427"
                                    : "Citizen #1427"}
                                  <span className="account-tier-chip">
                                    BUILDER
                                  </span>
                                </div>
                                <span className="account-popover-series">
                                  {language === "zh"
                                    ? "创世忍者 · Origins"
                                    : "Origins"}
                                </span>
                                <span className="account-popover-addr">
                                  {account.displayName}
                                </span>
                              </div>
                            </div>
                            <div className="account-popover-divider" />
                            <button
                              type="button"
                              className="account-popover-item primary"
                              onClick={() => {
                                setIsAccountMenuOpen(false);
                                navigate("/dashboard");
                              }}
                            >
                              {language === "zh"
                                ? "进入 Dashboard"
                                : "Enter Dashboard"}
                            </button>
                            <button
                              type="button"
                              className="account-popover-item"
                              onClick={() => {
                                setIsAccountMenuOpen(false);
                                openAccountModal();
                              }}
                            >
                              {language === "zh" ? "钱包详情" : "Wallet Details"}
                            </button>
                            <button
                              type="button"
                              className="account-popover-item danger"
                              onClick={() => {
                                setIsAccountMenuOpen(false);
                                disconnect();
                              }}
                            >
                              {language === "zh" ? "断开连接" : "Disconnect"}
                            </button>
                          </div>
                        )}
                      </div>
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
