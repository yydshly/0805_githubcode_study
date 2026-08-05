# Graphify × pi 实验记录

- 实验日期：2026-08-05
- 平台：Windows，Python 3.10.11
- Graphify：0.9.33，提交 `4e7e6b1f7e0df10ed07d5f28f9189bbde42940f1`
- pi：`main`，提交 `f909da2bf0e39ebeca9b2608f511d4167435360e`

## 目标

验证 Graphify 是否能在真实 Agent 单体仓库上完成代码建图、增量更新、符号解释、路径与影响查询，以及这些结果是否足以支撑后续 Agent 检索实验。

## 安装

Graphify 以 editable 方式安装在 `graphify-study/.venv` 独立环境中，包含核心 Tree-sitter 解析器，并补装 `tree-sitter-sql==0.3.11`。CLI 和 Python import 均已验证，版本为 0.9.33。

## 构建结果

| 运行 | 模式 | 耗时 | 节点 | 关系 | 社区 | 观察 |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| 首次全量 | code-only | 76.06s | 12,127 | 32,791 | 382 | SQL 可选解析器缺失 |
| 安装 SQL 后增量 | incremental | 6.50s | 12,123 | 32,791 | 424 | 0 文件重提取，未补回 SQL |
| 安装 SQL 后强制全量 | force | 43.67s | 12,139 | 32,802 | 403 | SQL 解析生效 |
| 无变更增量 1 | incremental | 5.91s | 12,135 | 32,802 | 395 | 节点、边趋于稳定 |
| 无变更增量 2 | incremental | 6.01s | 12,135 | 32,802 | 398 | 图哈希与社区数仍变化 |
| 最终聚类 | cluster-only | 6.24s | 12,135 | 32,802 | 397 | 从 pi 工作目录运行，来源提交正确 |

最终关系中，32,543 条为 `EXTRACTED`，259 条为 `INFERRED`；未调用 LLM，token 成本为 0。图中有 3,918 个度数不高于 1 的孤立或弱连接节点。

## 查询测试

1. `explain AgentSession`：准确定位 `packages/coding-agent/src/core/agent-session.ts:L305`，并列出 `SettingsManager`、`SessionManager`、`ExtensionRunner` 等关系。适合作为模块入口。
2. `path AgentSession ExtensionRunner`：返回一跳 `EXTRACTED references`，同时提示目标有同名歧义。路径证据有用，但必须检查候选符号。
3. `query "agent tool state"`：起点落在测试函数、`package.json` 字段和宽泛 `Tool` 类型，自然语言短查询噪声明显。
4. `affected SettingsManager --depth 1`：返回 `No unique node match`。高频同名符号会中断影响分析工作流。
5. `query AgentSession ExtensionRunner`：起点更准确，但在 1,200 token 预算下扩展到约 700 个节点并截断 668 个，说明图扩展仍需约束。

## 发现的问题

- `cluster-only` 记录 Git commit 时依赖当前工作目录。从父仓库运行会把父仓库提交写入报告；必须从目标仓库目录运行，或显式修正运行上下文。
- 无代码变化时，重复聚类的社区数在 395–398 间变化，`graph.json` 哈希也变化。社区名称和编号适合探索，不适合做稳定接口。
- “高连接节点”代表图结构中的枢纽，不自动等价于风险、复杂度或业务重要性。
- 三个 JSON 文件产生零节点警告，说明文件扫描数不等于有效语义覆盖率。

## 当前判断

Graphify 值得进入第二阶段研究，角色应限定为 Agent 的结构化检索与候选上下文层。下一阶段需要用人工标注的问题集，对比 Graphify、纯文本搜索和普通 RAG 的准确率、token、延迟与错误类型；在此之前，不应让模型仅凭图谱自主决定修改范围。
