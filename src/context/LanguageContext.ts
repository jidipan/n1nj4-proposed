import { createContext } from "react";

type Language = "en" | "zh";

type HeaderNavItem = {
  path: string;
  label: string;
};

type HeaderTranslations = {
  navItems: HeaderNavItem[];
  previewNavItems: HeaderNavItem[];
  previewNavLabel: string;
  languageSwitcherLabel: string;
};

type TranslationDictionary = {
  header: HeaderTranslations;
};

type SupportedLanguage = {
  code: Language;
  label: string;
};

const supportedLanguages: SupportedLanguage[] = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
];

const translationMap: Record<Language, TranslationDictionary> = {
  en: {
    header: {
      navItems: [
        { path: "/", label: "Home" },
        { path: "/citizenship", label: "Citizenship" },
        { path: "/city-zero", label: "City Zero" },
        { path: "/gallery", label: "Gallery" },
      ],
      previewNavItems: [
        { path: "/dashboard", label: "Dashboard" },
        { path: "/dashboard-legacy", label: "Dashboard Legacy" },
        { path: "/city-zero/lab", label: "City Lab" },
        { path: "/home-legacy", label: "Old Home" },
        { path: "/city-zero-legacy", label: "Old City Zero" },
      ],
      previewNavLabel: "Preview",
      languageSwitcherLabel: "Language",
    },
  },
  zh: {
    header: {
      navItems: [
        { path: "/", label: "首页" },
        { path: "/citizenship", label: "公民身份" },
        { path: "/city-zero", label: "零号城市" },
        { path: "/gallery", label: "画廊" },
      ],
      previewNavItems: [
        { path: "/dashboard", label: "Dashboard" },
        { path: "/dashboard-legacy", label: "公民面板 Legacy" },
        { path: "/city-zero/lab", label: "城市实验室" },
        { path: "/home-legacy", label: "旧版首页" },
        { path: "/city-zero-legacy", label: "旧版零号城市" },
      ],
      previewNavLabel: "预览",
      languageSwitcherLabel: "语言切换",
    },
  },
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  translations: TranslationDictionary;
  supportedLanguages: SupportedLanguage[];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export {
  LanguageContext,
  translationMap,
  supportedLanguages,
  type Language,
  type HeaderNavItem,
  type TranslationDictionary,
  type SupportedLanguage,
  type LanguageContextValue,
};
