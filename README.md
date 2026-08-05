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

## 研究项目约定

每个子项目尽量具备以下内容：

- `README.md`：说明研究对象、目标、运行方式和外部来源。
- `upstream/`：只读的原始资料或可追溯来源；不把第三方资料混入自己的分析内容。
- `research/`：研究判断、设计决策、验证记录和待验证问题。
- `site/` 或其他成品目录：可直接浏览、运行或复用的研究成果。

## 第一个项目：OPC Methodology 研读台

这个项目不是对原书的全文复制，而是把开源书的章节、创业框架与 Skills 工作流转化为可阅读、可筛选、可反思的个人研读界面。它服务于一个具体问题：**这本书的观点是什么、适用条件是什么、我能如何据此开始一个可验证的行动。**

后续项目会继续沿用“来源 → 分析 → 可用成果”的结构，但每个项目保持自己的研究目标与表达方式。

## 多项目发布配置

GitHub Pages 的项目清单由 [projects.config.json](./projects.config.json) 统一管理。新增一个可发布研究项目时：

1. 建立项目目录及其 `site/` 成品页面。
2. 在 `projects.config.json` 增加该项目的名称、说明、资料链接、项目目录和 `site/` 路径；若研究工具与目标库不同，可额外设置 `researchTargetUrl`。
3. 推送到 `main`；GitHub Pages 会自动更新总站，并生成该项目的独立访问路径。

这样可以保持总仓库只有一个发布入口，同时让每个研究项目保有独立页面与来源说明。
