# 研究资料索引

这里保存 `graphify-study` 可提交、可复核的研究材料。Graphify 和 pi 的完整源码副本以及大体积图谱产物不在本目录中，也不会进入 Git。

## 建议阅读顺序

1. [experiment-log.md](./experiment-log.md)：先看 Graphify 在 pi 上的安装、建图、查询实验和适用边界。
2. [pi-system-architecture.md](./pi-system-architecture.md)：建立 pi 的十层系统全景、package 责任和实现成熟度。
3. [pi-deep-dive-notes.md](./pi-deep-dive-notes.md)：继续阅读普通对话、工具调用、压缩、扩展和 Session 的函数级机制。
4. [browser-evidence.md](./browser-evidence.md)：查看学习工作台在桌面、手机、主题和交互状态下的验收记录。

## 文件职责

| 文件 | 职责 |
| --- | --- |
| `pi-architecture.md` | 最初的主链架构切片与关键组件记录 |
| `pi-learning.json` | 首页、研究方法、运行链和复习卡的结构化内容 |
| `pi-system-map.json` | 十层架构、正式 package、成熟度和模块入口 |
| `pi-deep-dives.json` | 机制步骤、状态模型、扩展阶段、术语和自研 Agent 决策底图 |
| `runs.json` | Graphify 各次构建运行的结构化统计 |
| `design-contract.md` | 当前 Web 研究成果的信息和交互边界 |
| `coverage-manifest.md` | 用户目标到页面、证据和验收状态的对应关系 |

## 证据规则

- Graphify 输出用于发现候选节点、关系和局部路径。
- pi 固定提交的源码、测试和实际运行行为用于确定架构事实。
- 推断、未完成能力和未知项必须单独标记；连接度、社区编号和 inferred edge 不能独立证明模块重要性或修改范围。
- `site/data.js` 是面向静态发布的生成结果；结构化研究源以本目录的 JSON 和 Markdown 为准。
