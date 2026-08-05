# pi 全景架构学习工作台

这个子项目的目标，是**从产品入口一路向下理解 [earendil-works/pi](https://github.com/earendil-works/pi) 的完整架构与运行原理**，为后续开发 Agent 建立可验证的代码地图。

Graphify 在这里是一张“候选导航图”：它帮助 AI 缩小阅读范围；最终结论仍由 pi 的源码、测试和实际运行行为核验。我们已经安装 Graphify，并对固定版本的 pi 完成全量建图、增量构建和查询实验。

## 两个库在项目中的角色

| 对象 | 它是什么 | 本项目如何使用 |
| --- | --- | --- |
| [Graphify](https://github.com/Graphify-Labs/graphify) | 将代码、文档等材料解析为节点、关系和社区，并提供符号、路径、影响范围等查询的代码图谱工具 | 作为研究工具生成候选入口和局部关系，评估它能否帮助 AI 缩小源码阅读范围 |
| [pi](https://github.com/earendil-works/pi) | 由 coding-agent、agent-core、模型 Provider、TUI、协议和 Session 等 package 组成的 Agent 工程 | 作为研究目标库，从产品入口、运行循环、工具、状态、记忆与扩展机制逐层核验 |
| `graphify-study` | 本仓库自己的研究子项目 | 保存研究判断、结构化数据、浏览器报告和复习入口，不修改两个上游库 |

这意味着：**Graphify 的图不是最终答案，pi 的固定提交源码才是架构事实的依据。** 图谱负责发现候选关系，源码、测试和运行行为负责确认或否定这些关系。

## 研究目标与边界

本项目回答三个问题：

1. Graphify 对真实 Agent 仓库的建图、增量更新和查询能力是否可靠，适合处在 AI 代码分析流程的哪一层。
2. pi 的产品编排、Agent loop、模型、工具、Session、状态记忆、扩展和远程能力如何分层与协作。
3. 以后开发自己的 Agent 时，哪些能力可以复用 pi，哪些仍应由产品层自行设计。

当前不做的事情：不修改 Graphify 或 pi，不把图谱推断当作源码事实，不创建新的业务 Agent 或后端，也不把尚未完成的 durable v2 描述成可直接使用的主链。

## 从这里开始

浏览器打开：`http://127.0.0.1:4174/`

- `http://127.0.0.1:4174/#architecture`：从上到下的 10 层全景架构，并补充“从 pi 到自己的 Agent”路线选择、能力边界与学习顺序。
- `http://127.0.0.1:4174/#memory`：状态、会话和记忆专题，区分当前 JSONL 主链与正在演进的持久化 v2。
- `http://127.0.0.1:4174/#runtime`：八步主链，以及普通对话、工具调用、压缩、扩展、会话树五条函数级机制。
- `http://127.0.0.1:4174/#review`：16 张复习卡、12 个“问题→源码”入口和 12 个工作概念。
- `http://127.0.0.1:4174/experiment.html`：保留的 Graphify × pi 原始实验仪表盘。

如果本地服务未运行，在父仓库根目录执行：

```powershell
python -m http.server 4174 -d graphify-study/site
```

## 页面如何组织

工作台分为六章：

1. **入口**：先区分 pi 源码、Graphify、图谱结果和 AI 研究者。
2. **怎么研究**：用六步法，从具体问题走到源码证据、反例和可复习报告。
3. **全景架构**：按产品入口、编排、Agent、模型、工具、状态、TUI、远程、测试共 10 层逐层展开；最后用三条开发路线和八项能力边界把理解转换成自研决策。
4. **状态记忆**：解释运行态、上下文、JSONL 会话树、压缩、资源记忆和 durable v2，并提供十行状态矩阵与九类 SessionEntry。
5. **运行链路**：先看八步主链，再从五条机制逐函数查看输入、动作、产出、状态、事件和失败边界；同时展示十一组扩展阶段。
6. **复习**：用 16 张问答卡检查心智模型，再按研究问题或 15 个分层入口回到源码。

## 当前最重要的架构结论

- pi 是一组可组合构件，而不是一个不可拆分的 coding agent。
- `pi-coding-agent` 是当前 CLI 产品的编排层；`pi-agent-core` 提供 Agent 循环和运行状态；`pi-ai` 统一模型 Provider、流式事件与工具调用；`pi-tui` 负责终端呈现。
- `protocol`、`client`、`server` 与 `session-backends/sqlite-node` 构成正在发展的远程和 durable session 能力，不应误说成当前本地 CLI 的必经主链。
- 目前存在两套需要明确区分的会话架构：当前产品使用 `AgentSession + JSONL SessionManager`；agent-core 中还有 `AgentHarness + SessionRepo/Lane/Record` 的 v2 脚手架，关键入口仍会返回 `HarnessNotImplemented`。
- pi 已有会话持久化、分支、压缩、资源加载和搜索，但并未内置一套完整的长期语义记忆系统，例如事实抽取、向量召回、自动遗忘与用户画像。
- 后续第一次实现自己的 Agent 时，最快路径是从 coding-agent SDK 开始；只有确实需要控制循环和产品编排时，再下沉到 `pi-agent-core + pi-ai`。durable v2 目前适合观察接口方向，不适合作为首版依赖。

完整全景证据见 [pi-system-architecture.md](./research/pi-system-architecture.md)，机制级底稿见 [pi-deep-dive-notes.md](./research/pi-deep-dive-notes.md)；结构化数据分别位于 [pi-system-map.json](./research/pi-system-map.json) 和 [pi-deep-dives.json](./research/pi-deep-dives.json)。

## 如何驱动 AI 继续研究

不要只说“总结 pi 项目”。一次选择一个问题，例如：

- 一次工具调用如何从模型输出走到执行结果？
- 扩展在输入、模型调用、工具调用的哪些位置介入？
- 当前 JSONL 会话树和 durable v2 的数据模型有什么差异？
- 如果我要开发长期记忆 Agent，pi 已提供哪些原语、还缺哪些能力？

完整流程：

```text
锁定一个问题 → 用图谱找候选入口 → 回到源码核验
→ 串成运行链路 → 主动找反例 → 沉淀成报告和复习卡
```

每条架构结论都应说明源码位置，并区分“Graphify 线索”“源码事实”“推断”和“未知”。

## Graphify 实验结论

- 扫描 1,153 个代码文件，生成 12,135 个节点、32,802 条关系和 397 个社区。
- 32,543 条关系为直接提取，259 条为推断。
- 明确符号解释、直接依赖和短路径适合缩小阅读范围。
- 宽泛自然语言查询、同名符号和配置节点可能带来噪声。
- 连接度、社区编号和 inferred 边不能直接作为架构事实。

完整实验数据见 [Graphify 实验记录](./research/experiment-log.md)。

## 交付内容

- `site/`：无需构建工具即可浏览的静态学习工作台；`data.js` 已提交，因此发布站不依赖本地 Graphify 环境。
- `research/`：架构报告、机制底稿、结构化地图、实验记录、覆盖清单和浏览器验收证据；索引见 [research/README.md](./research/README.md)。
- `scripts/build_summary_data.py`：在本地保留完整图谱产物时，重新汇总站点数据。
- `upstream/`、`subjects/`、`artifacts/`：本地可重建的源码副本和大体积实验产物，受 `.gitignore` 管理，不进入提交。

## 目录

```text
graphify-study/
├── README.md                # 子项目定位、入口、结论和边界
├── .gitignore               # 排除上游副本、环境和大体积生成物
├── research/                # 可提交的报告、地图、方法与验收证据
├── scripts/                 # 从完整图谱和研究数据生成 Web 数据
├── site/                    # 六章式 pi 全景架构学习工作台
├── upstream/graphify/       # 本地 Graphify 固定版本源码，不提交、不修改
├── subjects/pi/             # 本地 pi 固定版本源码，不提交、不修改
└── artifacts/pi/            # 本地完整图谱和 Graphify 报告，不提交
```

固定版本：Graphify `4e7e6b1`，pi `f909da2b`。两个上游项目均未被修改。
