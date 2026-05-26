# N1NJ4 Web · UI 设计导则

> 本文档基于 HomePage 现状提炼，规范字号 / 间距 / 颜色 / 组件 / 动效。
> 新增页面 / section 时**优先复用本文定义的 token 与模式**，避免一次性自定义。
> Source of truth: `src/styles/global.css`, `src/index.css`, `src/pages/HomePage.css`

---

## 1. 颜色系统

### 文本色

| 用途 | 值 | 说明 |
|---|---|---|
| Primary | `#0f131d` / `#1c1f2b` | H 标题主色 |
| Secondary | `rgba(12, 16, 30, 0.62)` | 段落正文 |
| Tertiary | `rgba(12, 16, 30, 0.45)` | 辅助说明 / 元数据 |
| Quaternary | `rgba(12, 16, 30, 0.32)` | timeline-phase kicker 等极弱信息 |
| On-dark | `#f4ecff` / `#d6c9ef` | Cyber Ronin 暗色 section 内 |

### 品牌色（全站基础调色板）

| 名称 | 值 | 用途 |
|---|---|---|
| Accent Orange | `#f68535` / `#f68634` | section-kicker / deployment-kicker / timeline-kicker / accent |
| Primary Pink | `#ee6a9e` | strong 数字 / chevron / underline 等"点亮"色 |
| Deep Pink | `#c84a7c` | AI Residency 主题色 / hover 加深态 |
| Cyber Lavender | `#c8b8e8` | Cyber Ronin 暗色 section subtitle |

### 页面主题色（page-level accent · 例外定义）

某些页面有自己的主题色系，**仅在该页面顶层 hero / 标识性元素上使用**，section 内部仍走全站基础调色板。

| 页面 | 主题色 | 字体 | 使用位置 |
|---|---|---|---|
| **City Zero** | **`#bfff00`** (霓虹绿 / Neon Lime) | `Impact` / `Arial Black` (italic) | Hero 滚动公告、Stadium 入口按钮、City Zero 标识性 CTA |

**使用边界**：
- ✅ Hero 区 / 顶部宣传 banner / 主入口按钮
- ✅ 后续游戏化 / 体育场 / 任务系统的"高能"CTA
- ❌ Section header（kicker / h2 / h3）—— 走基础粉橙系
- ❌ 正文链接 / Read more / 次要按钮 —— 走基础粉橙系
- ❌ 表单 / 卡片描边 —— 走基础灰系

### 背景色

| Section | 值 | 说明 |
|---|---|---|
| 默认 body | `#fffdf8` + radial 渐变 | 暖白底 |
| `.deployment-section` (About) | `#eceef2` | 冷灰 |
| `.timeline-section` (Roadmap) | `#faf5e9` | 暖米 |
| `.cyber-ronin-section` | `#0d0a18` | 深紫黑 |
| `.new-mint-section` | `#eceef2` | 同 deployment |
| `.showcase-section` (Preview Roster) | `linear-gradient(white → #fff8ee)` | 白到淡米 |
| `.street-poster-section` | `linear-gradient(#f5f4f0 → ...)` | 暖灰 |
| `.ai-residency-section` | `linear-gradient(#f4f3f1 → #ece9e2)` | 暖灰 |

### 边框 / 分隔线

| 用途 | 值 |
|---|---|
| 默认细边框 | `rgba(12, 16, 30, 0.07)` |
| Hover 加深 / 描边强调 | `rgba(12, 16, 30, 0.18)` |
| Section 分隔 | `border-bottom: 1px solid rgba(12, 16, 30, 0.08)` |

### 渐变模式（135deg · 饱和→淡色 公式）

主页有 3 套同类渐变组合（Roadmap card / Three Pillars / 等），都遵循统一公式：

```
linear-gradient(135deg, <saturated start> 0%, <pale end> 100%)
```

| 组件 | 渐变 |
|---|---|
| Roadmap card 1 (City Zero Deployment) | `#dff251 → #dfeab1` |
| Roadmap card 2 (Cyber Ronin) | `#ffc97d → #ffe2bd` |
| Three Pillars · 黄绿 | `#c6e83a → #eef0bc` (hover only) |
| Three Pillars · 薄荷 | `#86d188 → #e8f3e8` (hover only) |
| Three Pillars · 米黄 | `#caa872 → #f0e0bd` (hover only) |

**新组件需要渐变时优先沿用本公式**，方向 135deg、起点比终点饱和、保持节奏一致。

---

## 2. 字号系统（规范化档位）

> 单位说明：1rem = 16px。clamp 公式让字号在视口缩放中平滑过渡。
> H2 max 64px 命中视口 ≥1280px（与 subtitle max 48px 同步）。

### 桌面端档位（≥901px）

| 档位 | clamp 公式 | 范围 (px) | 用途 |
|---|---|---|---|
| **H1 / H2 (Section Title)** | `clamp(2rem, 5vw, 4rem)` | **32 – 64** | Section 主标题 |
| **H3 (Section Subtitle)** | `clamp(1.5rem, 3.75vw, 3rem)` | **24 – 48** | Section 副/子标题（`.section-subtitle`、`.deployment-identity-heading`）|
| **Cyber Ronin 特殊 subtitle** | `clamp(1.5rem, 3.125vw, 2.5rem)` | **24 – 40** | Mint / Cyber Ronin 两处 "500 new citizens..." 单独走 40px |
| **H4 (Card Title)** | 各组件自定义 | **20 – 32** | Mint card / Pillars / Roadmap card / Street Poster |
| **Body (p)** | `1.02rem` 或 `1.04rem` | **16.3 – 16.6** | 正文段落 |
| **Kicker** | `0.88rem` / `letter-spacing: 0.4em` | **14** | Section 顶部小标签 |

### 移动端覆盖（≤900px）

| 档位 | clamp 公式 | 范围 (px) |
|---|---|---|
| H2 | `clamp(1.5rem, 7vw, 2rem)` | 24 – 32 |
| Section subtitle | `clamp(1.125rem, 5vw, 1.5rem)` | 18 – 24 |
| Kicker | `0.76rem` / `letter-spacing: 0.24em` | 12.16 |

### 语义层级 vs 视觉档位（HTML 角色规范）

| HTML 元素 | 语义角色 | 视觉档位 | 出现频率 |
|---|---|---|---|
| `<h1>` | 整页唯一主标题 | 32–64px | 仅 Preview Roster "预览名单" |
| `<h2>` | Section 主标题 | 32–64px | 各 section 顶部 |
| `<h3>` | Section 副/子标题 | 24–48px | section-subtitle / deployment-identity-heading |
| `<h4>` | 卡片标题 | 20–32px | Mint card / Three Pillars / Roadmap card / Street Poster card |
| `<h5>` | 卡片副标题（保留） | 待定 | 暂无内容使用 |

**规则**：一个 page 只能有 1 个 `<h1>`。H2-H4 按层级嵌套。SEO/无障碍工具会扫描层级跳跃，避免 H2 直接到 H4（中间需要 H3）。

---

## 3. 间距系统

### Section 节奏（规范化）

| 关系 | 桌面 | 移动 |
|---|---|---|
| **Section 顶部 → Kicker** | **50px** | 50px |
| **Kicker → H2 主标题** | **30px** | 30px |
| **H2 → 正文 p** | **24px** | 14px |
| **H2 → H3 subtitle** | **10px** | 8px |
| **H3 subtitle → 正文 p** | **24px** | 14px |
| Section 底部 padding | 各 section 自定义（26/56/60/96/100） | 略小 |

### 实现技巧

- **Kicker → H2**：通常由 H2 的 `margin-top` 控制（kicker `margin: 0`）
- **H2 → p**：由 p 的 `margin-top: 24px` 控制
- **多层 flex 容器**：用 `gap` 而不是 margin，更可控

### 全局重置（重要）

`src/index.css:20`:
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

**所有元素初始 margin/padding 为 0**，这意味着每个间距值必须显式定义，不能依赖浏览器默认。

---

## 4. 布局系统

### 容器

```css
.container { max-width: 1440px; margin: 0 auto; padding: 0 20px; }
.container-sm { max-width: 900px; ... }
```

### 断点

| 断点 | 用途 |
|---|---|
| `@media (max-width: 900px)` | **唯一**移动端断点，所有响应式覆盖在此触发 |
| `@media (max-width: 640px)` | 极少数极小屏微调 |

### 网格常用 gap

| 用途 | gap |
|---|---|
| 多 column 卡片网格 | 22-24px |
| 大间距网格（如 Identity grid） | 80px |
| Street Poster 双卡 | 60px |
| Section 内 flex column | 28-30px |

---

## 5. 组件库

### Section Header（标准结构）

```jsx
<section className="section <section-name>">
  <div className="container">
    <p className="section-kicker">SMALL LABEL</p>
    <h2>Main Title</h2>
    {/* 可选 subtitle */}
    <h3 className="section-subtitle">Subtitle line</h3>
    <p>Body paragraph...</p>
  </div>
</section>
```

**间距由 CSS 自动负责**，无需手动加 margin。

### Kicker 三种类

| 类名 | 颜色 | 用途 |
|---|---|---|
| `.section-kicker` | `var(--accent-orange)` | 通用 section kicker |
| `.deployment-kicker` | `#f68535` (居中) | About N1NJ4 / About City Zero |
| `.timeline-kicker` | `#f68634` | Roadmap |

字号统一 `0.88rem` (14px) / letter-spacing `0.4em`（已规范化）。

### 按钮系统

| 类名 | 用途 |
|---|---|
| `.deployment-btn.deployment-btn-primary` | 主 CTA（深色）|
| `.deployment-btn.deployment-btn-secondary` | 次 CTA（白底深色文字）|
| `.ai-residency-btn-primary` / `-secondary` | AI Residency section 专用 |
| `.btn.btn-rarible` | Preview Roster · Rarible 链接 |
| `.btn.btn-outline.btn-sm` | View All Ninjas |

**规范**：`min-height: 56-58px` / `border-radius: 999px` / `text-transform: uppercase` / `letter-spacing: 0.04em`

### 卡片系统

| 类型 | 代表组件 | 形态特征 |
|---|---|---|
| **Stat strip card** | About City Zero 4 列 | grid 4 列、`border-left` 分隔线、中央文字 |
| **Roadmap timeline card** | Roadmap | `padding: 34px` / `border-radius: 28px` / 渐变 or 灰底 |
| **Pillar (希腊柱式)** | Three Pillars | 矩形 + 左右 mask 块切剪影 |
| **Mint card** | Mint section | 深色卡 + stats 网格 + CTA |
| **Street poster card** | Street Poster | 大图卡 + 描述 |
| **Value prop card** | AI Residency | 白底圆角 + tag + 标题 + 段落 |

### 字号档位类

| 类名 | 字号 | 用途 |
|---|---|---|
| `.section-subtitle` | 24-48px | H2 后的副标题（H3 元素 + 此 class）|

---

## 6. 动效与交互

### 全局 reveal 入场

`.reveal` → `.reveal.in-view` 通过 IntersectionObserver 触发
- `opacity: 0 → 1`
- `transform: translateY(50px) → 0`
- `transition: 0.8s ease`

### Hover 效果速查表

| 组件 | 效果 | transition |
|---|---|---|
| Roadmap card | Lift 12px + shadow bloom + 边框加深 + 渐变方向 135→315 反转 | **100ms ease-out** (transform/shadow/border), 300ms (background) |
| Three Pillars | 默认透明 → hover 显渐变色 + 柱顶 radial spotlight | **400ms ease** (background) |
| AI Residency 入口卡 (Home) | 背景淡粉 + chevron 右滑 + 底部 underline 160px 展开 | **150ms** (bg/chevron), **200ms** (underline 展开) |
| AI Residency value prop card | Lift 8px + shadow + 粉色描边 | 150ms ease-out |
| Mint card | TBD | — |
| Buttons (`.deployment-btn-primary`) | Lift 2px + shadow + 背景色变化 | 150ms |

### 推荐动效组合（按层级）

| 层级 | 推荐效果 |
|---|---|
| 主要 CTA / 卡片 | **Lift + Shadow Bloom + Border 加深** |
| 装饰卡片 / 展示卡 | **Background Reveal** (透明→显色) |
| 入口/链接卡片 | **Underline Expand** (中心向两侧展开) |
| 戏剧性卡片 | **+ Cap Spotlight** (radial 光晕叠加) |
| 内容卡片 | **+ 渐变方向反转** (135→315deg) |

### 动效时长基准

| 类型 | 时长 |
|---|---|
| 微交互（hover lift / 颜色切换）| **100-150ms** |
| 中等过渡（background / 渐变）| **200-400ms** |
| 入场动画（reveal）| **800ms** |
| Easing 优先级 | `ease-out` > `ease` > `linear` |

---

## 7. CSS 编码规范

### 命名

- 全部 **kebab-case**：`.timeline-card`, `.section-kicker`
- Section 类前缀通常对应 section ID：`#about-n1nj4` → `.about-n1nj4-section`
- 修饰类用 `--` 或单独类：`.deployment-btn.deployment-btn-primary`

### 文件组织

| 文件 | 内容 |
|---|---|
| `src/index.css` | CSS 变量、全局重置、body 样式 |
| `src/styles/global.css` | `.section`, `.container`, NFT card 等跨页组件 |
| `src/pages/HomePage.css` | HomePage 所有 section 样式 |
| `src/pages/CityZeroPage.css` | City Zero 页面专属 |
| `src/components/*/*.css` | 组件自包含样式 |

### 优先级管理

- 优先**用 class 选择器**，避免 `!important`
- 已有 `!important` 的位置（如 `.deployment-section` 内部覆盖）维持现状，新代码避免
- Specificity 冲突时优先**加类**而非堆叠选择器

### 字号 / 颜色 token 来源

目前**直接写 hex 和 clamp**，未抽出 CSS 变量。如果未来要做主题切换，建议：
```css
:root {
  --fs-h2: clamp(2rem, 5vw, 4rem);
  --fs-subtitle: clamp(1.5rem, 3.75vw, 3rem);
  --color-pink-primary: #ee6a9e;
  --color-pink-deep: #c84a7c;
  /* ... */
}
```

---

## 8. 当前未规范化的点（TODO）

| 项 | 现状 | 建议 |
|---|---|---|
| 卡片标题 H4 字号 | 各组件自定义（28px / 1.4rem / clamp(1.3rem, 2vw, 1.95rem) 等） | 统一一档 clamp |
| H5 卡片副标题 | 暂无内容使用 | 待引入时定义 |
| 正文 p 字号 | `1.02rem` / `1.04rem` 混用 | 统一为单一 token |
| Section padding-bottom | 各 section 自定义（26 / 56 / 60 / 96 / 100） | 待规范 |
| 颜色 token | 直接 hex | 抽 CSS 变量 |
| 动效时长 token | 各处直接写数字 | 抽 transition duration 变量 |

---

## 9. 新 Section 快速 checklist

加新 section 时，确认以下点：

- [ ] 用 `<section className="section <new-name>">` 包裹
- [ ] 内部用 `.container` 限宽
- [ ] Section padding-top = **50px**（与全站统一）
- [ ] Section header 用 `kicker → h2 → (optional h3) → body` 结构
- [ ] H2 字号沿用 `clamp(2rem, 5vw, 4rem)`
- [ ] H3 subtitle 字号沿用 `clamp(1.5rem, 3.75vw, 3rem)`
- [ ] Kicker 字号 `0.88rem` / letter-spacing `0.4em` / 颜色 `var(--accent-orange)` 或主题橙
- [ ] Kicker → H2 间距 30px / H2 → p 间距 24px
- [ ] 卡片用既有渐变公式（135deg / 饱和→淡色）
- [ ] Hover 效果至少一个：lift / background reveal / underline
- [ ] 添加 `@media (max-width: 900px)` 移动端覆盖
- [ ] `.reveal` 加入入场动画
- [ ] Bilingual 用 `useLanguage` + `translate(zh, en)`

---

## 10. 参考实现位置

| 想做的事 | 看这个组件 |
|---|---|
| 标准 section + kicker + h2 + body | About N1NJ4 / About City Zero (`HomePage.tsx`) |
| 卡片 lift hover | Roadmap timeline card (`HomePage.css:1305+`) |
| 渐变颜色背景 + hover reveal | Three Pillars (`HomePage.css:349+`) |
| Cap spotlight (radial 光晕) | Three Pillars `:hover` 背景叠加 |
| Linkable stat with chevron + underline | About City Zero "AI 居民" 格 (`HomePage.tsx` + `HomePage.css:582+`) |
| 静态 entry section + steps + CTA | `AiResidencyEntry` (`src/components/AiResidencyEntry/`) |
| Bilingual section | 所有 section 都用 `useLanguage` + `translate()` |

---

**Maintainer 提示**：本文档不是自动生成的。修改 token / 新增组件 / 调整规范时，**记得同步更新本文档**，并在 PR 描述里标注 "design system update"。
