# 小红书 AI 工作台研究站

这是 `0805 GitHub Code Study` 的第 10 个研究子项目，研究 [`nihe0909/xiaohongshu-ai-workbench`](https://github.com/nihe0909/xiaohongshu-ai-workbench) 的能力、工作原理、适用边界，并用当前研究项目库完成一套真实的小红书内容运营样例。

## 当前结论

该仓库把作者的小红书运营方法做成 Codex 模板和操作流程，不是内容生产或自动运营软件。它可以规划主页、母题栏目、发布计划、标题、评论和转化路径，但不会判断小红书是否值得投入，也不给可直接发布的完整正文、图片和标签，更不包含登录、抓取、发布、后台数据或效果归因能力。

## 项目结构

```text
xiaohongshu-ai-workbench-study/
  upstream/xiaohongshu-ai-workbench/  # 本地只读上游，已被 gitignore
  research/                            # 来源锁、研究结论、样例与验收记录
  site/                                # 可直接部署的静态研究站
```

固定上游提交：`464ccec036139f0d9bd2b31af9c7b75296f3161a`（2026-08-04）。

## 本地运行

在总仓库根目录执行：

```powershell
python -m http.server 4186 --directory xiaohongshu-ai-workbench-study/site
```

访问 `http://127.0.0.1:4186/`。

站点为纯 HTML/CSS/JavaScript，不会调用小红书、外部模型或后台服务。“0805 GitHub Code Study”样例是按固定上游规则完成并内置的确定性研究记录。

## 研究材料

- [研究判断](./research/README.md)
- [完整策划样例](./research/actual-sample.md)
- [来源锁](./research/source-lock.json)
- [设计契约](./research/design-contract.md)
- [覆盖清单](./research/coverage-manifest.md)
- [浏览器验收](./research/browser-validation.md)
- [交接说明](./research/handoff.md)
- [上游仓库](https://github.com/nihe0909/xiaohongshu-ai-workbench)

上游使用 MIT License。本项目保留上游来源和固定版本，研究解释、策划样例与交互实现属于当前研究仓库内容。
