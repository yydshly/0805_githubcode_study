# 0805 GitHub Code Study

这是一个持续扩展的个人研究项目库。每个一级目录都是一个独立研究主题：保留原始资料、记录分析过程，并在合适时提供可直接体验的小型网站或工具。

## 在线项目总入口

[进入 0805 研究项目库](https://yydshly.github.io/0805_githubcode_study/)

## 项目导航

| 项目 | 状态 | 说明 | 入口 |
| --- | --- | --- | --- |
| [OPC Methodology 研读台](./opc-methodology-study/) | 第 01 个项目 | 面向《OPC Methodology》的章节导读、方法论分析、Skills 梳理与个人学习记录 | [项目说明](./opc-methodology-study/README.md) · [上游资料](https://github.com/easychen/opc-methodology) · [在线研读站](https://yydshly.github.io/0805_githubcode_study/opc-methodology-study/) |
| [Awesome GPT Image 2 研究](./awesome-gpt-image-2-study/) | 第 02 个项目 · 研究演示 | 拆解案例库、结构化 Prompt、Agent Skill 与在线生图产品，验证其可控性和跨模型迁移价值 | [项目说明](./awesome-gpt-image-2-study/README.md) · [在线研究站](https://yydshly.github.io/0805_githubcode_study/awesome-gpt-image-2-study/) · [上游资料](https://github.com/freestylefly/awesome-gpt-image-2) |
| [Graphify × pi 架构学习工作台](./graphify-study/) | 第 03 个项目 · 学习报告可用 | 以 Graphify 作为代码图谱导航工具，以 pi 作为目标源码库，研究 Agent 分层、运行循环、状态记忆和自研边界 | [项目说明](./graphify-study/README.md) · [在线学习站](https://yydshly.github.io/0805_githubcode_study/graphify-study/) · [Graphify](https://github.com/Graphify-Labs/graphify) · [pi](https://github.com/earendil-works/pi) |
| [QuerySplat 待研究记录](./querysplat-study/) | 第 04 个项目 · 待研究 | 记录多视角图片生成 3DGS 的核心原理、视觉几何大模型、环境与许可门槛；当前不下载源码，后期由真实需求触发验证 | [待研究说明](./querysplat-study/README.md) · [上游仓库](https://github.com/inspatio/querysplat) · [论文](https://arxiv.org/abs/2608.01186) |

## 研究项目约定

每个子项目尽量具备以下内容：

- `README.md`：说明研究对象、目标、运行方式和外部来源。
- `upstream/`：只读的原始资料或可追溯来源；不把第三方资料混入自己的分析内容。
- `research/`：研究判断、设计决策、验证记录和待验证问题。
- `site/` 或其他成品目录：可直接浏览、运行或复用的研究成果。

## 共同研究方式

项目主题可以是方法论、案例库、代码库或工具，但都遵循同一条主线：

```text
固定来源与版本 → 明确研究问题 → 记录证据与限制
→ 形成结构化结论 → 制作可浏览成果 → 验证并持续修订
```

- **来源可追溯**：标明上游仓库、资料版本或固定提交，不把第三方原文与自己的判断混在一起。
- **结论有边界**：区分来源事实、工具生成结果、研究推断和仍待验证的问题。
- **成果可使用**：除研究笔记外，尽量沉淀为学习站点、实验报告、结构化数据或可复用工具。
- **项目相互独立**：每个一级目录拥有自己的目标、文档和成品；根 README 只维护统一导航和公共约定，不偏重某一个项目。

各项目的详细背景、运行方法和研究结论均放在对应目录的 `README.md` 中。

## 多项目发布配置

GitHub Pages 的项目清单由 [projects.config.json](./projects.config.json) 统一管理。新增一个可发布研究项目时：

1. 建立项目目录及其 `site/` 成品页面。
2. 在 `projects.config.json` 增加该项目的名称、说明、资料链接、项目目录和 `site/` 路径；若研究工具与目标库不同，可额外设置 `researchTargetUrl`。
3. 推送到 `main`；GitHub Pages 会自动更新总站，并生成该项目的独立访问路径。

这样可以保持总仓库只有一个发布入口，同时让每个研究项目保有独立页面与来源说明。
