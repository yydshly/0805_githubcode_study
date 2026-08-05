# Design Contract — Revision 5

- Entry mode: Revision-led
- Request revision: 5 — 将“详细理解 pi”收束为“为以后开发自己的 Agent 建立必要基础”
- Target user and context: 当前先建立架构心智模型，后期再开始自研 Agent 设计与实现
- Desired first impression: 用户能立刻判断自己应该复用 coding-agent SDK、组合 agent-core + pi-ai，还是暂时观察 durable v2
- Visual ambition: Editorial
- Experience architecture: Hybrid Workspace

## Visual constraints

- 保留现有六章、全景和机制解剖；不新增主导航或继续堆叠分析专题。
- 在“全景架构”中增加一块紧凑的“从 pi 到自己的 Agent”决策区。
- 使用路线卡、能力分层表和四阶段学习顺序；手机端变为单列。
- 新内容必须明显区别“可直接复用”“需要自己设计”“当前不应依赖”。

## Information constraints

- 给出三条开发路线：coding-agent SDK、agent-core + pi-ai、自研产品层并观察 durable v2。
- 把自研 Agent 所需能力分为模型、循环、工具、会话、长期记忆、扩展、UI、远程八项。
- 对每项标注 pi 已提供什么、用户仍需设计什么，以及应该先阅读的源码。
- 给出最短学习顺序和高风险误区，不引入实际业务 Agent、后端或在线模型实验。
- 当前主链与 v2 scaffold 的成熟度结论必须保持一致。

## Operation constraints

- 路线可以选择，详情同步显示适用场景、复用层、自己负责的部分和起始源码。
- 能力表始终可见，用作以后设计 Agent 的检查清单。
- 所有数据继续来自静态研究文件并由 `data.js` 提供。

## State constraints

- 新路线选择使用原生 button、tab/aria-selected 语义和清晰选中态。
- 不增加新的持久化状态；原主题与复习状态不受影响。

## Environment constraints

- 规范入口 `http://127.0.0.1:4174/#architecture`。
- 无依赖静态站点；桌面、平板、390px 手机；浅深主题和 reduced-motion。
- 不修改 pi 或 Graphify 上游源码。

## Primary journey

建立 pi 全景 → 阅读实现成熟度 → 选择自研 Agent 路线 → 对照八项能力边界 → 按四阶段源码顺序学习。

## User-defined phases

1. 帮助自己理解 pi 架构。
2. 为后期开发自己的 Agent 做必要基础沉淀。
3. 只做必要补充，不扩大为新的开发平台。

## Required artifacts

- `pi-deep-dives.json` 增加 `agentDevelopmentGuide`。
- 全景架构页增加路线选择、能力清单、学习顺序与误区。
- 更新研究底稿、README、覆盖清单与浏览器证据。

Autonomy authorization: 用户明确要求“做好必要的补充即可”，允许在当前学习站点内完成最小补充。
User-decision boundary: 不创建实际 Agent，不安装新服务，不运行付费模型，不修改上游源码。

## Observable completion criteria

- 页面显示三条开发路线，选择后详情正确更新。
- 八项 Agent 能力明确区分 pi 可复用部分和用户自研部分。
- 四阶段学习顺序可直接用于以后继续研究。
- 页面明确提醒 durable v2 当前不可作为可用执行主链。
- 新区域在桌面、平板、手机和两种主题下可读且无横向溢出。
- 覆盖清单最终没有 `continue`。

Coverage record: `research/coverage-manifest.md`
