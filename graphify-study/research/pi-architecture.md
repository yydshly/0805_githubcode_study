# pi 架构研究笔记

- 研究对象：`earendil-works/pi`，提交 `f909da2b`
- 研究方法：项目文档 → Graphify 导航 → 源码核验 → 运行链路 → 限制复核

## 一句话心智模型

pi 不是单一的“聊天 CLI”，而是一组可组合的 Agent 构件：

```text
coding-agent（产品编排和终端体验）
    ├── agent-core（状态化 Agent 与工具循环）
    │       └── pi-ai（模型、Provider、认证和流式协议）
    └── pi-tui（终端组件、输入与差量渲染）

可选远程层：client → protocol ← server
可选持久化层：session-backends/sqlite-node
```

核心设计思想是：稳定的 Agent 循环保持较小，产品能力通过 `AgentSession`、资源加载器和扩展钩子组合，而不是把所有功能写进底层 Agent。

## 包职责

| Package | 层级 | 职责 | 直接证据 |
| --- | --- | --- | --- |
| `packages/ai` | 模型适配层 | 统一不同 LLM Provider、模型目录、认证、流式事件、工具调用和 token/cost | `packages/ai/README.md`；`packages/ai/src/index.ts` |
| `packages/agent` | Agent 运行时 | 保存状态，运行多轮模型/工具循环，发出生命周期事件，处理 steering/follow-up | `packages/agent/README.md`；`packages/agent/src/agent.ts:L346`；`packages/agent/src/agent-loop.ts:L95` |
| `packages/tui` | 终端呈现层 | 组件、输入、焦点、overlay、差量渲染与主屏/全屏渲染器 | `packages/tui/README.md`；`packages/tui/src/tui.ts` |
| `packages/coding-agent` | 产品编排层 | CLI、四种运行模式、会话、设置、资源、扩展、内置工具和 TUI 体验 | `packages/coding-agent/README.md`；`packages/coding-agent/src/main.ts:L886` |
| `packages/protocol` | 远程协议层 | 长度前缀 + CBOR 的实验性会话协议；不绑定传输 | `packages/protocol/README.md` |
| `packages/client` | 远程客户端 | 在任意有序字节传输上控制远程 pi 会话 | `packages/client/README.md` |
| `packages/server` | 远程服务端 | 实验性 `PiServer` 和协议/领域模型边界；应用自行提供 service | `packages/server/README.md` |
| `packages/session-backends/sqlite-node` | 持久化适配 | 为 agent-core 会话提供 Node SQLite 后端 | `packages/session-backends/sqlite-node/package.json` |

依赖方向由 package manifest 核验：`agent → ai`；`coding-agent → agent + ai + tui + client + protocol`；`client → protocol`；`server → ai + protocol`。`ai`、`tui` 和 `protocol` 不依赖其他 pi workspace package。

## coding-agent 内部核心组件

| 组件 | 责任 | 证据 |
| --- | --- | --- |
| `InteractiveMode` | 编辑器输入、主循环、把 AgentSession 事件变成终端组件 | `interactive-mode.ts:L1075`、`:L3028`、`:L3034` |
| `AgentSession` | 所有运行模式共享的产品边界；模型、工具、扩展、压缩、重试、会话持久化 | `agent-session.ts:L1`、`:L305`、`:L1116` |
| `Agent` | 最小状态机；把 prompt 规范化并启动 Agent loop | `agent.ts:L346` |
| `agent-loop` | 模型响应、工具调用、toolResult 回注和多轮循环 | `agent-loop.ts:L95`、`:L155`、`:L281`、`:L411` |
| `ModelRuntime` | coding-agent 使用的 pi-ai Models 集合；模型、Provider 和认证快照 | `model-runtime.ts:L127` |
| `SessionManager` | JSONL 追加式会话树；分支只移动 leaf，不修改历史 | `session-manager.ts:L844` |
| `SettingsManager` | 合并全局和项目设置，项目值覆盖全局值 | `settings-manager.ts:L279` |
| `DefaultResourceLoader` | 加载 AGENTS、skills、prompt templates、extensions、themes 和 packages | `resource-loader.ts:L195` |
| `ExtensionRunner` | 执行扩展并提供输入、消息、工具、Provider 等生命周期钩子 | `extensions/runner.ts:L268` |
| `TUI` / components | 接收事件后增量重绘消息、工具状态、编辑器和 footer | `interactive-mode.ts:L3090`、`:L3193`；`packages/tui/README.md` |

## 一次用户请求的真实主链

1. `main.ts` 创建 `AgentSessionRuntime`，选择 interactive/print/RPC 等模式；interactive 模式构造 `InteractiveMode`。证据：`main.ts:L802`、`:L886`、`:L915`。
2. `InteractiveMode.run()` 循环等待 `getUserInput()`，收到文本后调用 `session.prompt(userInput)`。证据：`interactive-mode.ts:L1075`、`:L3699`。
3. `AgentSession.prompt()` 处理扩展命令、input hook、skill/template 展开、队列、认证和压缩检查。证据：`agent-session.ts:L1116`。
4. 它构造 user message，触发 `before_agent_start` 扩展钩子并设置 system prompt，然后调用 `_runAgentPrompt()`。证据：`agent-session.ts:L1210-L1280`、`:L1063`。
5. `Agent.prompt()` 规范化消息并进入 `runAgentLoop()`；loop 把 AgentMessage 转成 LLM Context。证据：`agent.ts:L346`、`:L410`；`agent-loop.ts:L95`、`:L281`。
6. coding-agent 创建 Agent 时把 stream function 接到 `ModelRuntime.streamSimple()`，由 pi-ai Provider 实现完成真实模型请求和流式事件统一。证据：`sdk.ts:L294`、`:L312`。
7. 若模型返回 tool call，`agent-loop` 校验并执行工具，产生 toolResult，写回当前上下文并自动开始下一次模型调用；没有工具调用才结束。证据：`agent-loop.ts:L155-L270`、`:L411`。
8. `AgentSession._handleAgentEvent()` 先把事件发给扩展和 UI，再在 `message_end` 把消息追加到 `SessionManager`；`InteractiveMode.handleEvent()` 将消息和工具事件更新为 TUI 组件。证据：`agent-session.ts:L610-L660`；`interactive-mode.ts:L3034-L3255`。

## Graphify 在本次研究中的作用

Graphify 帮助找到 `Model`、`InteractiveMode`、`SettingsManager`、`AgentSession`、`TUI` 等高连接入口，并确认 `AgentSession → ModelRuntime`、`AgentSession → ExtensionRunner` 是一跳直接引用。

但它不是架构结论本身。例如查询 `InteractiveMode → TUI` 和模糊的 `AgentSession → Agent` 会绕到 package.json、README 或通用名称，说明同名符号和配置节点可能污染最短路径。因此本页的主链只采用已经回到源码核验的关系。

## 对后续 Agent 开发最有价值的原理

1. **Provider 与 Agent loop 分离**：Agent 不直接依赖 OpenAI/Anthropic SDK，只接收一个 `streamFn`。
2. **事件流驱动 UI 和持久化**：同一组 AgentEvent 同时供 TUI、扩展和会话记录消费。
3. **工具调用是循环的一部分**：工具不是额外命令；toolResult 被写回上下文后，模型自动进入下一轮。
4. **产品编排包裹最小核心**：压缩、重试、会话树、资源和扩展主要在 coding-agent 的 `AgentSession` 层。
5. **扩展点分布在关键边界**：输入前、Agent 启动前、Provider headers、消息和工具执行前后都可以介入。
6. **本地 CLI 与远程会话是两条架构路径**：当前主产品走本地 `InteractiveMode/AgentSession`；`protocol/client/server` 是实验性的远程控制层，不应混为主链。

## 仍需继续验证的问题

- `AgentSession` 当前承担的职责较多，哪些边界适合抽出为独立服务？
- 扩展 hook 的顺序、错误隔离和性能成本在复杂插件组合下如何表现？
- 并行工具执行与 SessionManager 追加顺序如何保持可重复性？
- remote protocol 成熟后，是否会成为 coding-agent 的默认运行边界？目前 server README 明确标记为 experimental。
- Graphify 的社区和自然语言查询如何与源码级符号 ID、测试覆盖信息结合，减少同名歧义？
