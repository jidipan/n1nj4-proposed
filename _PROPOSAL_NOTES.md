# N1NJ4 Frontend — Proposed Edits

> 这是 N1NJ4 前端代码的**提案版本**。
> `../NinjaNFTFrontend-main/` 是上游镜像（只读基线），本文件夹是修改实验场。
>
> Baseline: 从 `Ninja-Labs-Devs/NinjaNFTFrontend` 的 `dev` 分支 `5a4a660` 同步而来 (2026-05-19)

---

## 文档导航

| 文档 | 路径 | 角色 |
|---|---|---|
| UI 目标规范 | [`../UI_GUIDELINE.md`](../UI_GUIDELINE.md) | 所有改动必须对齐这份规范 |
| CityZero 问题分析 | [`../CITYZERO_ANALYSIS.md`](../CITYZERO_ANALYSIS.md) | 待处理问题列表，逐条对应到修改日志 |
| 上游镜像 | [`../NinjaNFTFrontend-main/`](../NinjaNFTFrontend-main/) | 只读基线，**永不修改** |
| 本提案版（即本文件夹） | `./` | 所有改动在这里发生 |

---

## 工作流

1. **改动只发生在本文件夹** —— `../NinjaNFTFrontend-main/` 永远是只读上游镜像
2. **每完成一组改动后，在下方"修改日志"追加一条记录**，写清：
   - 日期
   - 涉及的问题编号（如 `CITYZERO_ANALYSIS.md Issue #5`）
   - 改了哪些文件
   - 为什么这样改
3. **想看自己改了什么**：用 VS Code 的 "Compare Folders" 插件、WinMerge 或 Beyond Compare 比对 `../NinjaNFTFrontend-main/` ↔ 本文件夹
4. **上游更新时**：直接覆盖 `../NinjaNFTFrontend-main/`（重新从 GitHub 下载即可），本文件夹完全不受影响
5. **交付给开发组时**：用 diff 工具生成对照报告，或截图/录屏配合 CITYZERO_ANALYSIS.md 引用

---

## 修改日志

### 2026-05-19 — Baseline
- 从 `NinjaNFTFrontend-main/` 完整复制为初始状态（不含 `node_modules` / `.DS_Store`）
- 尚无任何代码修改

<!-- 后续追加按照此模板：

### YYYY-MM-DD — 一句话主题（如：AiExperimentProject 去蓝化）

**Addresses**:
- CITYZERO_ANALYSIS.md Issue #5
- UI_GUIDELINE.md 拒绝清单第 3 条

**Files changed**:
- `src/components/AiExperienceProject/AiExperienceProject.css`
- `src/components/AiExperienceProject/ProjectCard.css`

**Rationale**:
将所有 `#3b82f6` `#60a5fa` `#2563eb` 替换为 `var(--accent)` 即 `#deff44`；
font-family 从 Inter 切回 `var(--font-sans)`；
按钮圆角从 `8px` 改为 `var(--r-pill)`；
banner 蓝色 rocket icon 改为橙色 `var(--kicker)` 风格胶囊。

**Visual preview**: 配套截图见 `_proposals/2026-XX-XX-ai-experiment-deblueify.png`

-->
