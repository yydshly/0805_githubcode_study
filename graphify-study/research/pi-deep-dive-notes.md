# pi 机制级研究底稿

固定源码提交：`f909da2bf0e39ebeca9b2608f511d4167435360e`

这份底稿衔接 [pi-system-architecture.md](./pi-system-architecture.md)：前者回答“系统由什么组成”，本文回答“关键机制实际上怎样运行”。详细逐步数据位于 [pi-deep-dives.json](./pi-deep-dives.json)。

## 1. 当前主链的真实分层

```text
InteractiveMode
  → AgentSession.prompt
    → Agent.prompt
      → runAgentLoop
        → pi-ai Models / Provider
        ↔ AgentTool.execute
      → AgentSession._handleAgentEvent
        → SessionManager.appendMessage
        → InteractiveMode / TUI
```

这条链中有三个不能合并的职责：

- `AgentSession` 负责产品策略：输入扩展、模型认证、队列、重试、压缩、Session 和 UI 事件。
- `Agent`/`agent-loop` 负责执行状态机：构造上下文、调用模型、执行工具并结束 run。
- `pi-ai` 负责 Provider：模型目录、认证、请求协议和规范化流式事件。

## 2. 普通对话的关键事实

1. InteractiveMode 的 editor submit 最终调用 `session.prompt(text)`。
2. `AgentSession.prompt()` 在调用 Agent 前执行 extension command、`input`、skill/template 展开、模型/认证校验、压缩检查和 `before_agent_start`。
3. `Agent.prompt()` 拒绝第二个并发 run；运行中输入必须进入 steer 或 follow-up 队列。
4. `agent-loop` 先运行 `transformContext` 和 `convertToLlm`，再调用 Provider。
5. Provider 的 delta 变成 `message_update`；final message 变成 `message_end`。
6. `AgentSession._handleAgentEvent()` 在 `message_end` 时把 user、assistant、toolResult 写成 JSONL message entry。
7. `agent_end` 不是绝对空闲：自动重试、自动压缩或扩展追加的队列消息可能让 Agent 继续。

## 3. 工具调用不是一次函数调用

```text
AssistantMessage.toolCall
  → 查找工具
  → prepareArguments
  → schema 校验
  → beforeToolCall / tool_call hook
  → 串行或并行 execute
  → progress update
  → afterToolCall / tool_result hook
  → ToolResultMessage
  → 再次调用模型
```

重要边界：

- 任一工具声明 `executionMode="sequential"` 时，整个批次走串行路径。
- 未找到工具、参数非法、被扩展阻止、取消和运行异常都会被转换成 `isError` 的 tool result，而不是直接破坏事件序列。
- `tool_result` 扩展可以改变模型最终看见的结果，却不能撤销已经发生的文件或外部副作用。
- `stopReason="length"` 时，pi 不执行可能被截断的工具参数。
- 工具结果会作为新消息返回模型，因此一次用户请求可能包含多个模型 turn。

## 4. JSONL Session 的数据模型

文件第一行是 `SessionHeader`，后续每行是一条带 `id`、`parentId` 和 `timestamp` 的 entry。正式 entry 类型包括：

- `message`
- `thinking_level_change`
- `model_change`
- `compaction`
- `branch_summary`
- `custom`
- `custom_message`
- `label`
- `session_info`

`custom` 用于扩展持久化自己的 opaque data，但不进入模型上下文；`custom_message` 会进入模型上下文。

Session 是 append-only 树，而不是可修改数组：

```text
root
  └─ A
      ├─ B ─ C      旧分支仍保留
      └─ D ─ E      当前 leaf
```

`branch(A)` 只把 leaf 移到 A；下一次 append 自然生成 D。`buildSessionPath()` 从当前 leaf 沿 parentId 回到 root，得到当前模型需要的单一路径。

## 5. 压缩改变上下文，不删除历史

压缩过程：

1. 根据 context window、reserveTokens 或 overflow 判断是否触发。
2. `session_before_compact` 可取消或替换默认结果。
3. `prepareCompaction()` 从最新消息向后估算 token，选择 `firstKeptEntryId`。
4. 模型生成或更新结构化摘要；必要时单独总结 split-turn 前缀。
5. 追加一条 `compaction` entry，旧 entries 继续留在 JSONL。
6. 下一次 `buildContextEntries()` 返回摘要、保留尾部和压缩后的新消息。

因此 pi 同时拥有两种不同视图：完整 transcript 用于审计和树操作；active LLM Context 用于下一次模型请求。

## 6. 扩展应该在什么位置介入

当前扩展系统跨越十一组阶段：

```text
trust/resources
→ session start
→ input
→ before agent start
→ context
→ provider request/response
→ agent/turn/message events
→ tool call/result
→ compaction
→ tree/fork/switch
→ shutdown/reload
```

如果需求可以通过命令、工具、system prompt、上下文变换、Provider 注册、会话 hook 或 TUI 组件表达，优先写扩展。只有需要改变 Agent 循环语义、Session 基础数据契约或所有运行模式共享的核心不变量时，才考虑修改核心。

## 7. 当前状态与记忆边界

| 类型 | 所有者 | 生命周期 | 持久化 |
| --- | --- | --- | --- |
| AgentState | Agent | 当前进程 | 否 |
| streamingMessage | Agent | 单次响应 | 只保存最终消息 |
| steer/follow-up 队列 | Agent | 当前 run | 当前主链不跨进程 |
| LLM Context | agent-loop | 单次请求 | 从 Session 重建 |
| JSONL transcript tree | SessionManager | 跨进程 | JSONL |
| compaction checkpoint | SessionManager | 当前分支后续 | JSONL entry |
| 项目知识 | ResourceLoader | reload 周期 | 项目/用户文件 |
| 偏好、信任、认证 | 各配置服务 | 跨运行 | 配置/凭据存储 |
| durable Entry/Record/Lane | SessionRepo | 设计为跨进程 | 内存或 SQLite |
| 长期语义记忆 | 核心未提供 | — | 需要应用自行设计 |

## 8. durable v2 到了什么程度

已经形成的部分：

- `Entry`：消息、模型、thinking、active tools、compaction、branch summary、custom data。
- `LaneRecord`：operation start/finish、abort、step attempt、tool started、queue、deferred write、usage。
- `SessionStorage/SessionRepo`：lane、entry、record、facts、stats、fork 和查询契约。
- SQLite backend：migration、entries、records、lanes、leases、facts、FTS 和 materialized view 相关实现。
- `AgentHarness` 的读取、设置、watch snapshot 和资源/策略 getter/setter 骨架。

尚未接通的部分：`prompt`、`skill`、`promptFromTemplate`、`compact`、`navigateTree`、`resume`、`abort`、`steer`、`followUp`、`nextRun`、`recordUsage`、`createLane` 等仍通过 `HarnessNotImplemented` 拒绝。

因此，v2 的准确定位是：**数据模型和存储方向已经相当具体，执行器仍是 scaffold**。

## 9. 对后续 Agent 开发最有用的判断

- 需要快速实现自定义工具、命令、Provider、上下文处理或 UI：从 ExtensionAPI 开始。
- 需要无 TUI 的程序化 Agent：从 coding-agent SDK 和 `createAgentSession()` 开始。
- 需要自定义执行循环：直接复用 `pi-agent-core` 与 `pi-ai`，自行提供 streamFn、tools 和消息转换。
- 需要跨会话长期记忆：在 Session 之外增加事实抽取、索引、召回、冲突更新和遗忘层。
- 需要崩溃恢复、并发 lane 或 durable operation：持续观察 v2；当前不要假设 AgentHarness 已可替代主链。

## 10. 后续研究顺序

1. 用普通对话链建立整体时序。
2. 深挖 tool call，理解 Agent 的真实行动边界。
3. 读取 SessionManager，区分 transcript、branch 和 active context。
4. 读取 compaction，理解“保留历史”和“缩短上下文”的差异。
5. 读取扩展 hooks，判断自己的能力应该挂在哪里。
6. 最后对照 durable v2，识别未来可能迁移的接口与当前尚不能依赖的部分。

## 11. 从 pi 到自己的 Agent：最小决策底图

不是把 pi 整体复制一遍，而是先选择需要复用到哪一层：

| 路线 | 适合什么目标 | 直接复用 | 自己负责 |
| --- | --- | --- | --- |
| coding-agent SDK | 尽快做出可运行的首个 Agent | `createAgentSession()`、AgentSession、内置工具、会话与扩展机制 | 业务提示词、专用工具、产品 UI、长期记忆 |
| `pi-agent-core + pi-ai` | 要完全控制循环、会话和产品编排 | Provider、流式事件、Agent loop、tool execution 原语 | 编排策略、存储、权限、安全、重试、UI |
| durable v2 | 研究未来的崩溃恢复、lane 和 durable operation | SessionRepo、Entry/Record/Lane 数据契约和 SQLite 方向 | 等待执行器完成；当前不能以 AgentHarness 作为首版主链 |

八项能力应分开判断：模型接入和 Agent loop 可以直接复用；工具需要自定义业务实现并补权限边界；产品编排、长期语义记忆和产品 UI 仍属于应用层；当前 JSONL Session 可用于会话历史，但不能等同于长期记忆；durable v2 暂时只作为演进参考。

最短学习顺序是：先跑通最小 loop，再掌握扩展挂载点，然后厘清状态、会话与长期记忆，最后才设计自己的 Agent。每一步都应产出一张可验证的小图或小实验，而不是继续做无边界的全库摘要。
