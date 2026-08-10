# N1NJ4 Frontend — Active Website

> 这是 N1NJ4 工作区中的当前主站代码库。
> 旧的只读基线已归档至
> `../../archive/code/n1nj4-web-baseline-2026-05/`。
>
> Initial baseline: `Ninja-Labs-Devs/NinjaNFTFrontend` `dev@5a4a660`
> (2026-05-19).

## 文档导航

| 文档 | 路径 | 角色 |
|---|---|---|
| UI 目标规范 | [`../../docs/design/ui-guideline.md`](../../docs/design/ui-guideline.md) | 主站 UI 参考 |
| City Zero 问题分析 | [`../../docs/audits/city-zero-analysis.md`](../../docs/audits/city-zero-analysis.md) | 页面问题与改进建议 |
| 历史基线 | [`../../archive/code/n1nj4-web-baseline-2026-05/`](../../archive/code/n1nj4-web-baseline-2026-05/) | 只读归档 |
| 当前主站 | `./` | 日常开发与提交 |

## 工作流

1. Git 操作从本文件夹执行；工作区根目录不是 Git 仓库。
2. 代码变更通过 commit 或 PR 记录原因、范围和验证结果。
3. 查看初始差异时，与归档基线比对，不直接修改归档内容。
4. 同步上游时使用已配置的 Git remote，不覆盖归档基线。
5. 项目文档、研究源文件和最终交付稿分别放在
   `../../docs`、`../../studies` 和 `../../deliverables`。

## 开发

```powershell
npm install
npm run dev
```

`node_modules`、`dist`、`.vite` 和运行日志都是本地生成内容，不应提交。
