# N1NJ4 Web · UI 设计导则 v2

> v2 覆盖全站当前设计:Home、Dashboard、公民护照/名片、City Dispatch、City Zero(地标控制台 + 共创社区)。
> 新增页面/section/组件时**优先复用本文 token 与基元**,避免一次性自定义。
> Source of truth: `src/index.css`(token 变量)、`src/styles/global.css`、各页面/组件 `*.css`。
> v1 → v2 变更见文末「附录 A · v1→v2 迁移记录」。

---

## 0. 设计基调

- **视觉变体 A · Miami golden hour**(主):暖奶白底、橙→粉渐变、青/柠檬点缀、毛玻璃圆角卡。全站默认走这套。
- 变体 B · Cyber Night(暗色,备用):仅 Cyber Ronin / 特定高能模块,**不与 A 混用**。
- 字体:`"Space Grotesk", "Inter", "Helvetica Neue", sans-serif`(`src/index.css`)。ID/地址/数字用 `monospace`。
- 一句话原则:**一切卡片、状态、强调色都走统一基元;新组件不要自创视觉语言。**

---

## 1. 颜色系统(已抽成 CSS 变量 · `src/index.css :root`)

### 1.1 基础文本 / 背景(既有)

| 变量 | 值 | 用途 |
|---|---|---|
| `--text-primary` | `#1c1f2b` | 标题主色(部分卡片用 `#0f131d`) |
| `--text-secondary` | `rgba(12,16,30,0.7)` | 正文 |
| `--text-tertiary` | `rgba(12,16,30,0.45)` | 辅助/元数据 |
| `--bg-primary` | `#fffdf8` | 暖白底 |
| `--bg-secondary` | `#f8f3ec` | 次级底 |
| `--border-color` | `rgba(20,24,35,0.08)` | 通用细边框 |

### 1.2 品牌主色 + 渐变(v2 新增变量)

| 变量 | 值 | 用途 |
|---|---|---|
| `--accent-orange` | `#f68535` | **所有 section-kicker**、强调橙(v2 修复:此前被引用却未定义) |
| `--pink-primary` | `#ee6a9e` | 强调数字 / 步骤序号 / 点亮态 |
| `--pink-bright` | `#ff7096` | hover 加亮、渐变终点 |
| `--brand-gradient` | `linear-gradient(120deg,#ffb347,#ff7096)` | **主 CTA 胶囊按钮**、进度条、强调条 |
| `--text-gradient` | `linear-gradient(120deg,#ff8a3d,#ff7096)` | **大数字渐变文字**(背景裁切) |

### 1.3 四套功能 token 配色(v2 核心 · 新增)

跨 Dashboard / 护照 / 地标 / 三支柱统一的语义配色。每套含 `accent`(主)/`tint`(淡底)/`ink`(深字)。

| 语义族 | accent | tint | ink | 典型用处 |
|---|---|---|---|---|
| **Identity 身份/治理**(青) | `--tk-identity` `#2bb6e0` | `--tk-identity-tint` | `--tk-identity-ink` `#0a7ea4` | 护照、身份与准入地标、开发分类 |
| **Work 共建/栖息地**(橙) | `--tk-work` `#f5933d` | `--tk-work-tint` | `--tk-work-ink` `#b9701a` | 共建与工作地标、栖息地支柱、建设中状态 |
| **Growth 经济/增长**(柠檬) | `--tk-growth` `#7f9c1f` | `--tk-growth-tint` | `--tk-growth-ink` `#5a7a00` | 经济与治理地标、增长共享支柱、已开放状态 |
| **Culture 文化/媒体**(紫) | `--tk-culture` `#8b63d4` | `--tk-culture-tint` | `--tk-culture-ink` `#6b46c1` | 文化与市集地标、媒体分类 |

**用法**:卡片按其语义族设 `--accent`/`--tint` 局部变量(见 §5.1),图标圆底用 `tint`+`accent`,标签深字用 `ink`。

### 1.4 页面主题色(例外 · 仅 hero/标识元素)

| 页面 | 主题色 | 字体 | 仅用于 |
|---|---|---|---|
| **City Zero** | `#bfff00` 霓虹绿 | `Impact`/`Arial Black` italic | Hero 滚动公告、Stadium 入口按钮 |

边界:✅ Hero/主入口高能 CTA ❌ section header / 正文链接 / 卡片描边(这些走基础粉橙系)。

### 1.5 卡片基元变量

`--card-bg` `rgba(255,255,255,0.85)` · `--card-border` `rgba(12,16,30,0.08)` · `--card-radius` `18px` · `--card-shadow` `0 20px 60px rgba(120,90,60,.12)` · `--card-shadow-hover` `0 32px 80px rgba(120,90,60,.18)`

---

## 2. 字号系统

> 1rem = 16px。clamp 让字号随视口平滑过渡。

### 桌面端(≥901px)

| 档位 | clamp | 范围 px | 用途 |
|---|---|---|---|
| **H1/H2 Section Title** | `clamp(2rem,5vw,4rem)` | 32–64 | Section 主标题 |
| **H3 Section Subtitle** | `clamp(1.5rem,3.75vw,3rem)` | 24–48 | 副/子标题 |
| **H4 Card Title** | `1.02–1.4rem` | 16–22 | 卡片标题(v2 统一收窄,旧的 28–32 仅遗留) |
| **Body** | `0.96–1.04rem` | 15–17 | 正文 |
| **Meta/标签** | `0.7–0.82rem` | 11–13 | 状态胶囊 / 功能行 / 元数据 |
| **Kicker** | `0.88rem` · `letter-spacing:0.4em` | 14 | Section 顶部小标签 |

### 移动端(≤900px)

H2 `clamp(1.5rem,7vw,2rem)` 24–32 · Subtitle `clamp(1.125rem,5vw,1.5rem)` 18–24 · Kicker `0.76rem`/`0.24em`。

### HTML 层级规范

`<h1>` 整页唯一(目前仅 Preview Roster + 各详情页主标题) → `<h2>` section 主标题 → `<h3>` 副/子标题 → `<h4>` 卡片标题。**禁止跳级**(H2 不直接到 H4)。

---

## 3. 间距系统

| 关系 | 桌面 | 移动 |
|---|---|---|
| Section 顶 → Kicker | 50–72px | 48–50px |
| Kicker → H2 | 30px | 30px |
| H2 → 正文 p | 24px | 14px |
| H2 → H3 subtitle | 10px | 8px |
| 卡片内 padding | 20–28px | 16–22px |
| 卡片网格 gap | 16–24px | 14–18px |

实现:`kicker margin:0`,间距交给 H2 的 `margin-top`;多层容器用 `gap` 而非 margin。
全局 `* { margin:0; padding:0; box-sizing:border-box }`(`index.css`)——**每个间距必须显式定义**。

---

## 4. 布局系统

- 容器:`.container` `max-width:1440px`(内容页常用 1100–1240) · `.container-sm` 900px。
- 断点:`@media (max-width:900px)` 为主;`1024 / 768 / 560 / 480` 按需微调。
- 网格:卡片栅格 `repeat(N,1fr)` + 响应式降列(3→2→1)。

---

## 5. 组件基元(v2 核心)

### 5.1 Frosted Card · 毛玻璃卡(全站统一基元)

所有面板/入口卡/统计卡的基底。**新卡片从这里起步,不要另起样式。**

```css
.card-base {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  backdrop-filter: blur(18px);
  transition: transform var(--dur-mid) ease, box-shadow var(--dur-mid) ease, border-color var(--dur-mid) ease;
}
.card-base:hover {           /* 可点卡 */
  transform: translateY(-6px);
  border-color: var(--accent);          /* 语义族 accent */
  box-shadow: var(--card-shadow-hover);
}
```

变体:
- **顶部强调色条**:`::before` 高 4px,`background: var(--accent)` 或 `--brand-gradient`(三支柱、面板标题)。
- **左侧强调竖条**:面板标题 `.dash-panel-title::before` 5×17px 圆角竖条 + 渐变。
- **图标圆底**:48–56px 圆角方,`background:var(--tint)` `color:var(--accent)`;hover 可填充为 `accent` 实心 + 白字。

实例:`.dash-panel` / `.czl-card` / `.city-zero-pillar` / `.dash-namecard` / `.idp-panel`。

### 5.2 状态胶囊 · Status Pill

```
✅ 已开放 Live      bg rgba(212,234,60,.30)  color #5a7a00   (growth)
🏗 建设中 Building   bg rgba(255,179,71,.20)  color #b9701a   (work)
   即将开放 Soon     bg rgba(12,16,30,.05)    color tertiary
```
Dashboard 提案/投票另有:`Funded`(柠檬)/`Voting`(橙)/`Submitted`(青)/`In progress`(紫)——同一配色语言。
形态:`padding:3-5px 10px` · `border-radius:999px` · `font-size:0.68-0.72rem` · `font-weight:700`。

### 5.3 主 CTA 胶囊按钮

```css
.btn-cta {
  background: var(--brand-gradient); color:#fff; border:none;
  border-radius:999px; font-weight:700; letter-spacing:0.04em;
  box-shadow: 0 12px 30px rgba(255,140,120,0.3);
}
.btn-cta:hover { transform: translateY(-2px); box-shadow: 0 18px 40px rgba(255,140,120,0.42); }
```
次级:`ghost`(透明 + 青描边 `--tk-identity`)/ `outline`(灰描边)。站点级既有按钮见 §legacy。

### 5.4 大数字渐变文字

贡献值、QF 池等"高光数字":`background:var(--text-gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent;`。实例 `.dash-side-value` / `.idp-rep-value` / `.cz-chapter-no`。

### 5.5 ImagePlaceholder · 图片占位 / 真实图

组件 `src/components/ImagePlaceholder`。**所有"待补图"位置都用它**,不要留空或硬塞临时图。
- 占位态:灰色 45° 斜纹 + 🖼 + `label`(标注"放什么图 · 比例")+ `ratio`。
- 真实态:传 `src` → 渲染 `<img object-fit:cover>`(`.imgph-real`),可传 `objectPosition` 控裁切焦点。
- 变体:`iconOnly`(只图标,用于头像/小图标)、`imgph-round`、`imgph-mini`。

### 5.6 施工质感(City Zero "建设中")

未开放地标:虚线边框 + 45° 斜纹 + 图标降饱和。`repeating-linear-gradient(45deg, rgba(12,16,30,.022) 0 9px, transparent 9px 18px)`。既是状态也是"城市从 0 生长"的叙事。

### 5.7 Section / Chapter Header

- **标准 section**:`.section` 容器 + 居中 `.section-kicker`(`--accent-orange`,大写,`0.4em`)+ `<h2>` +(可选 `<h3>`)+ 正文。kicker 全站**居中**(对齐 COMMUNITY GALLERY / NINJA INDEX)。
- **章节 header**(City Zero):大号渐变序号 `01/02`(`--text-gradient` + drop-shadow)+ kicker + `<h3>`。

### 5.8 Account Popover(Header 连接后)

连接钱包后,点地址 → 自定义 popover(非 RainbowKit 默认 modal):身份摘要 + 主操作(进入 Dashboard)+ 次操作 + 断开。样式见 `Header.css .account-popover`。

---

## 6. 动效与交互

| 类型 | 时长(变量) | Easing |
|---|---|---|
| 微交互(hover lift/色切换) | `--dur-micro` 150ms | `ease`/`ease-out` |
| 中过渡(background/渐变/卡片) | `--dur-mid` 300ms(250–400) | `cubic-bezier(.22,1,.36,1)` 或 ease |
| 入场 `.reveal` → `.in-view` | `--dur-reveal` 800ms | ease |
| 轮播滑入(News/banner) | 0.55s | `cubic-bezier(.22,1,.36,1)` |

推荐组合:可点卡 = **Lift + Shadow Bloom + Border 点亮 + 图标填充**;入口卡 = underline/chevron 右滑;装饰卡 = background reveal。
`.reveal` 由 `useRevealObserver` 的 IntersectionObserver 触发。

---

## 7. 页面与路由地图(v2 新增登记)

| 路由 | 页面 | 关键组件/基元 |
|---|---|---|
| `/` | Home | Hero、Cyber Ronin、About、Roadmap、**Three Pillars(图标卡)**、Preview Roster、**City Dispatch**、FAQ |
| `/dashboard` | 建设者工作台 | 身份条、主舞台(进行中+任务)、右栏(身份名片 + 资助轮 + 投票)、城市设施宫格 |
| `/dashboard/identity` | 公民护照 | Hero 身份页、**通行凭证·签证(主轴)**、画像+等级、声誉、文化认同;顶部公开名片分享栏 |
| `/citizen/:id` | 公开建设者名片 | 护照的对外只读版(隐私字段隐藏) |
| `/news` · `/news/:id` | 城市快报列表/详情 | News 卡(hover 上滑揭示)、详情 + 原文外链 |
| `/city-zero` | City Zero | Hero 图 → **地标控制台(地图即界面)** → 共创社区(展示/接入) → AI Residency → City Dossier |
| `/gallery` · `/nft/:id` | 画廊/详情 | NFT 网格 |

数据:`src/data/news.ts` 等;占位数据均硬编码,标注 `mock`,后端就位后替换。

---

## 8. CSS 编码规范

- 命名 **kebab-case**;组件类前缀对应组件(`.czl-` `.dash-` `.idp-` `.news-tk-`)。
- 颜色/卡片/时长**优先用 §1/§5 的 CSS 变量**;新代码避免散落 hex(迁移中,旧 hex 逐步替换)。
- 避免 `!important`;冲突优先加类而非堆叠选择器。已有 `!important`(如 deployment 覆盖)维持现状。
- 文件组织:`index.css`(变量/重置/body)→ `styles/global.css`(跨页 `.section`/`.container`/`.btn`/`.card`)→ 页面 `*.css` → 组件自包含 `*.css`。
- 跨组件复用样式才下沉到 global;一次性样式留在组件内。
- 双语:`useLanguage` + `translate(zh,en)` / `t(zh,en)`,数据对象存 `{zh,en}`。

---

## 9. 新组件/Section checklist

- [ ] 卡片从 **Frosted Card 基元**(§5.1)起步,按语义族设 `--accent`/`--tint`
- [ ] 状态用 **Status Pill**(§5.2),不自造
- [ ] 主 CTA 用 `--brand-gradient` 胶囊(§5.3)
- [ ] 待补图用 **ImagePlaceholder**(§5.5)并标注比例
- [ ] Section kicker 居中、`--accent-orange`、`0.88rem`/`0.4em`
- [ ] 间距走 §3;`.reveal` 入场;`@media (max-width:900px)` 覆盖
- [ ] 颜色/时长用 CSS 变量;双语 `translate()`
- [ ] 与既有 token 族配色一致(青/橙/柠檬/紫),不引入新强调色

---

## 10. 参考实现

| 想做的 | 看 |
|---|---|
| 标准 section + kicker + h2 | About N1NJ4 (`HomePage.tsx`) |
| Frosted 面板 + 标题竖条 | `.dash-panel`(`DashboardPage.css`) |
| 图标卡(token 色 + 顶部条) | **Three Pillars**(`HomePage.css`)/ `.czl-card`(`CityLandmarks.css`) |
| 状态胶囊 | `.czl-status` / `.dash-status` |
| 大数字渐变文字 | `.dash-side-value` / `.idp-rep-value` |
| 章节序号 header | `.cz-chapter-head`(`CityZeroPage.css`) |
| 轮播卡 hover 揭示 | `.news-tk-card`(`NewsTicker.css`)/ COMMUNITY GALLERY |
| 图片占位/真实图 | `ImagePlaceholder` |
| 公开名片/护照 | `DashboardIdentityPage` |

---

## 附录 A · v1 → v2 迁移记录

| 项 | v1 | v2 |
|---|---|---|
| Three Pillars | 希腊柱式(矩形+左右 mask 剪影,默认灰、hover 显色) | **图标卡**:Frosted Card + token 色 + 顶部色条 + 自定义 SVG 图标 |
| Street Poster | 双卡静态海报 section | 替换为 **City Dispatch**(3 卡轮播,每 3s 替换一张) |
| 颜色 token | 直接 hex,`--accent-orange` 被引用但**未定义** | 抽成 `:root` 变量;**修复 `--accent-orange`**;新增四套功能 token + 卡片/渐变/时长变量 |
| 卡片语言 | 各页各自定义 | 统一 **Frosted Card 基元** + 状态胶囊 + 大数字渐变 |
| 覆盖范围 | 仅 HomePage | + Dashboard / 护照 / 公开名片 / City Dispatch / City Zero 地标控制台 |
| City Zero | 静态图 + Dossier + 社区 | Hero → **地标控制台(地图即界面)** → 共创社区(展示/接入) → AI Residency → Dossier(全浅色统一) |

---

## 附录 B · 仍未规范化(TODO)

| 项 | 现状 | 建议 |
|---|---|---|
| 组件 hex → 变量迁移 | 变量已建,组件仍多用 hex | 逐组件替换为 `var(--tk-*)` / `var(--card-*)` |
| H4 卡片标题字号 | 仍有 28–32px 遗留(旧 Mint/Roadmap 卡) | 统一收敛到 1.02–1.4rem 档 |
| 正文 p 字号 | `0.96/1.02/1.04rem` 混用 | 收敛单一 token |
| 暗色变体 B | 仅 Cyber Ronin 一处 | 若扩展(Cyber Ronin drop / Demo Month),补一套暗色 token 镜像 |
| Section padding-bottom | 各 section 自定义 | 待规范节奏档 |

---

**Maintainer**:本文档手工维护。改 token / 加组件 / 调规范时**同步更新本文**,PR 注明 "design system update"。
