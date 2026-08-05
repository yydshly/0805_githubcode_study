# Storybook Generator Skill 研究站

这是 `0805 GitHub Code Study` 的第 05 个研究子项目，用交互式 Web 页面拆解 [`weaiw/storybook-generator-skill`](https://github.com/weaiw/storybook-generator-skill) 的能力、工作原理、一致性边界与可继续研究的方向。

## 当前结论

该项目是一套面向 Codex / AI Agent 的绘本生产工作流，不是独立生图模型。它在故事结构、角色圣经、逐页 Prompt、确定性排版和 QA 方面具有较高参考价值；其一致性主要来自提示词重复、视觉锚点与人工返工，未提供模型级身份锁定或自动跨页评分。

## 目录

```text
storybook-generator-skill-study/
  upstream/storybook-generator-skill/  # 本地只读上游，已被 gitignore
  research/                             # 研究结论、设计契约、验收记录
  site/                                 # 可直接部署的静态研究站
```

固定研究版本：`72d30ecd51d12986738db6d4f40d79cd7fa6358a`（上游提交日期：2026-07-06）。

## 本地运行

在仓库根目录执行：

```powershell
python -m http.server 4175 --directory storybook-generator-skill-study/site
```

然后访问 `http://127.0.0.1:4175/`。

页面是纯 HTML/CSS/JavaScript，不依赖后端。默认“怕黑 · 8 页”会装配本次由 Codex 内置 ImageGen 实际生成的封面与 8 张内页，并提供逐页 Prompt、翻页和跨页一致性诊断；其他主题或页数会明确切换为代码插画回退。浏览器本身不会直接调用图片模型。

## 研究材料

- [研究判断](./research/README.md)
- [设计契约](./research/design-contract.md)
- [覆盖清单](./research/coverage-manifest.md)
- [ImageGen 完整样书实验](./research/imagegen-run.md)
- [光影 QA 研究层](./research/lighting-qa.md)
- [上游仓库](https://github.com/weaiw/storybook-generator-skill)

上游仓库采用 MIT License；本研究站的分析与交互实现属于本仓库内容，引用上游事实时均链接到对应原始文件。
