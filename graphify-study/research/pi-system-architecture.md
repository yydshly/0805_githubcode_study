# pi 全景架构报告

- 研究对象：`earendil-works/pi`
- 固定提交：`f909da2bf0e39ebeca9b2608f511d4167435360e`
- 范围：9 个正式 package、504 个 `src/**/*.ts` 文件、产品主链与正在演进的 AgentHarness v2 线

## 先给结论

pi 不是单一 coding-agent 程序，而是一个从模型适配到终端产品的 Agent monorepo：

```text
产品入口：CLI / Interactive / Print / JSON / RPC / SDK
    ↓
运行时组装：AgentSessionRuntime / services / createAgentSession
    ↓
产品编排：AgentSession + model/session/settings/resources/extensions
    ↓
执行核心：Agent + agent-loop + events + tools
    ↓
模型平台：Models + Provider + API + Auth + normalized stream
    ↓
基础能力：TUI / protocol / client / server / session backends / evals
```

其中存在两条必须分开的会话架构：

1. **当前 coding-agent 主链**：`AgentSession + SessionManager`，以追加式 JSONL 树保存完整历史和分支。
2. **AgentHarness v2 演进线**：`SessionRepo + Entry/Record + Lane + SQLite backend`，数据契约和后端已形成，但 `AgentHarness.prompt/compact/resume` 等执行方法仍是 scaffold，并未接管主 CLI。

## 仓库全景

| Package | src 文件 | 角色 | 状态 |
| --- | ---: | --- | --- |
| `pi-coding-agent` | 196 | 主产品、CLI、SDK、运行模式和产品编排 | 主产品 |
| `pi-ai` | 172 | Provider、API、认证、模型目录和统一流事件 | 核心 |
| `pi-agent-core` | 39 | Agent 状态机、工具循环与新 durable harness contract | 核心 + 演进 |
| `pi-tui` | 37 | 终端组件、输入、布局、焦点和差量渲染 | 核心 |
| `pi-server` | 17 | 远程 session server 和 domain/protocol 适配 | 实验 |
| `pi-session-backend-sqlite-node` | 17 | 新 SessionRepo 的 SQLite、migration、facts、lease 与 FTS | 新架构 |
| `pi-client` | 10 | 远程连接、session lease 与 authoritative snapshot | 实验 |
| `pi-protocol` | 8 | 严格 CBOR、framing 和远程消息 schema | 实验 |
| `pi-evals` | 8 | 真实 AgentSession 的模型驱动行为评估 | 开发工具 |

## 第一层：产品入口

`packages/coding-agent/src/main.ts` 是 CLI 总入口。它处理参数、项目 cwd、信任、会话、模型和资源，然后选择运行模式：

- `InteractiveMode`：完整 TUI 产品。
- `runPrintMode`：一次性文本或 JSON 事件输出。
- `runRpcMode`：stdin/stdout LF-JSONL 控制协议。
- `createAgentSession`：Node SDK。
- `cli/experimental`：新的远程 client/server/pi 命令。

这些入口共享同一个产品编排核心，而不是各自实现 Agent。

## 第二层：运行时组装

`AgentSessionServices` 创建与 cwd 绑定的服务：

- `ModelRuntime`
- `SettingsManager`
- `DefaultResourceLoader`
- 扩展 Provider 注册与诊断

`createAgentSession()` 随后恢复或选择模型、thinking level、session messages 和工具，构造 `Agent` 与 `AgentSession`。`AgentSessionRuntime` 负责在 `/new`、`/resume`、`/fork`、import 或 cwd 切换时销毁并替换这套运行时。

这说明 pi 的产品生命周期边界不是 `Agent`，而是：

```text
cwd-bound services + SessionManager + AgentSession + selected mode
```

## 第三层：coding-agent 产品编排

### AgentSession

`AgentSession` 是所有运行模式共享的产品边界，负责：

- prompt 预处理、slash command 和 skill/template 展开；
- 把资源、system prompt、工具和扩展装配到 Agent；
- 订阅 AgentEvent，驱动扩展、持久化与 UI；
- steering/follow-up 队列、abort、retry、model cycle；
- 自动/手动 compaction、tree navigation 和分支；
- session stats、使用量和模型状态。

### 产品服务

| 服务 | 责任 |
| --- | --- |
| `ModelRuntime` | 模型、Provider、凭据、刷新、调用门面 |
| `SessionManager` | 当前 CLI 的 JSONL session tree |
| `SettingsManager` | 全局/项目设置与运行策略 |
| `DefaultResourceLoader` | AGENTS、SYSTEM、skills、prompts、themes、extensions、packages |
| `ExtensionRunner` | 输入、上下文、模型、工具、会话和 UI 钩子 |
| `PackageManager` | npm/git pi packages 的安装与解析 |
| `TrustManager` | 项目资源和任意代码扩展的信任边界 |

## 第四层：Agent 执行核心

`pi-agent-core` 的稳定主线由 `Agent` 与 `agent-loop` 组成。

### AgentState

Agent 在内存中保存：system prompt、model、thinking level、tools、messages、streaming message、pending tool calls 和 error。它还维护 steering/follow-up 队列、abort signal 与订阅者。

### agent-loop

一次执行的实际循环：

```text
prompt
  → transform context
  → convert AgentMessage to LLM Message
  → stream model response
  → emit assistant message events
  → validate and execute tool calls
  → emit/persist toolResult
  → inject steering/follow-up
  → next model turn or agent_end
```

工具可以并行或串行；`beforeToolCall` 可以阻止，`afterToolCall` 可以修改结果；只有一批工具结果全部声明 `terminate` 才会跳过后续模型调用。

### AgentHarness v2

agent-core 还导出新的 `AgentHarness`、durable Session API、harness tools 和 compaction。不过当前源码明确以 `HarnessNotImplemented` 处理 `prompt`、`compact`、`resume`、`navigateTree` 等方法。它代表下一阶段架构方向，不是当前产品行为。

## 第五层：模型与 Provider 平台

`pi-ai` 不依赖 coding-agent，是独立的统一 LLM 平台：

- `Models`：Provider collection 和模型路由。
- `providers/`：40+ provider/region/token-plan 模块。
- `api/`：Anthropic、OpenAI Responses/Completions、Google、Bedrock、Mistral 等线协议。
- `auth/`：CredentialStore、环境变量、OAuth、ambient credentials。
- `types.ts`：Model、Context、Message、Tool、Usage 和流式事件契约。
- `models.generated.ts`：模型能力、context window、价格和 reasoning 信息。
- `ImagesModels`：独立图像生成表面，不进入 chat/tool loop。
- `compat`：旧 API 和 coding-agent 当前使用的兼容门面。

pi-ai 只负责“如何与模型可靠通信”，不执行工具，也不管理产品会话。

## 第六层：工具、扩展与资源

### 工具

coding-agent 默认启用 `read`、`bash`、`edit`、`write`，并提供 `grep`、`find`、`ls` 工厂。agent-core 定义通用 Tool 契约和执行循环，coding-agent 提供 cwd、文件系统、截断、diff、输出渲染和 mutation queue 等产品实现。

### 扩展

扩展可以注册：

- 工具、命令和快捷键；
- Provider 和模型；
- 输入、上下文、模型 request/response、工具和 session hooks；
- editor、widget、status、footer、overlay 和消息渲染器；
- 自定义 compaction、权限门、子 Agent、MCP 和 sandbox。

扩展执行任意 TypeScript，因此项目 trust 是真实安全边界。

### 知识资源

- Context files：`AGENTS.md` / `CLAUDE.md`
- System prompt：`SYSTEM.md` / `APPEND_SYSTEM.md`
- Skills：按需加载的专用指令包
- Prompt templates：可复用提示
- Pi packages：通过 npm/git 分发扩展、skills、prompts、themes

## 第七层：状态、会话与记忆

| 类型 | 所有者 | 生命周期 | 持久化 |
| --- | --- | --- | --- |
| 运行状态 | `AgentState` | 当前进程/运行 | 无 |
| 工作记忆 | LLM `Context` | 一次模型调用 | 从 session 重建 |
| 会话记忆 | coding `SessionManager` | 跨运行 | JSONL tree |
| 压缩记忆 | compaction entry | context window 内 | JSONL entry |
| 项目知识 | `ResourceLoader` | reload 周期 | 项目/用户文件 |
| 偏好与安全状态 | Settings/Trust/Auth | 跨运行 | JSON/credential store |
| Durable session v2 | `SessionRepo` | 跨进程/恢复 | memory/SQLite |
| 长期语义记忆 | 未提供 | 跨会话 | 应用自行实现 |

### 当前 JSONL 会话

每条 entry 有 `id` 和 `parentId`，因此一个文件可以保存完整分支树。`/tree` 只改变 active branch，旧历史不会删除。compaction 把旧历史转成有损摘要，但原消息仍保留在 JSONL。

### 新 durable session contract

agent-core 的新 contract 把数据分为：

- `Entry`：message、model/thinking/tool change、compaction、branch summary、custom。
- `Record`：operation lifecycle、tool started、queue、deferred write、usage。
- `Lane`：指向树中 leaf 的命名游标。
- `SessionRepo`：create/open/list/delete/fork。
- `SQLite backend`：migrations、branch cache、facts、leases、statistics 和可选 FTS。

它比旧 JSONL 更适合崩溃恢复、多 lane、远程 server 和检索，但当前 Harness 执行尚未完成。

### 不存在的能力

pi core 没有内置：自动事实提取、embedding/vector store、跨会话语义召回、记忆重要性、遗忘策略、用户画像。应用可以通过 extensions、tools 或新的 SessionRepo search 自行实现，但不能把 session persistence 直接等同于长期语义记忆。

## 第八层：TUI 与呈现

`pi-tui` 是独立终端框架：

- `TUI` interface：child、focus、overlay、input、lifecycle 和 render。
- `TuiMainScreen`：保留终端 scrollback。
- `TuiAltScreen`：固定 viewport、应用滚动和 layout root。
- `VStack/HStack/ScrollView`：终端约束布局。
- `Editor/Input`：按键、IME、undo、kill ring 和 cursor。
- Components：Text、Markdown、Box、Loader、SelectList、SettingsList、Image 等。
- Differential rendering：只更新变化行，并用 CSI 2026 synchronized output 防闪烁。

coding-agent 的 InteractiveMode 把 AgentEvent 映射为 AssistantMessage、ToolExecution、Footer、Model/Session/Settings selector 等产品组件。

## 第九层：远程会话

这是一条实验线，与本地 RPC mode 不同：

```text
PiClient
  → ByteTransport
  → [uint32 length][strict CBOR]
  → PiServer listener
  → application-provided PiServerService
  → authoritative snapshots/events
```

- protocol 不绑定 transport。
- client 通过 shared/exclusive `SessionLease` 管理并发所有权。
- server 不提供 standalone coding-agent 服务，应用必须实现 service。
- server package 负责 pi-ai domain objects 与 protocol DTO 之间的严格桥接。
- snapshot 是权威状态，progress event 只是瞬时 UI 提示。

## 第十层：测试与评估

- 每个 package 都有单元或契约测试。
- `faux provider` 提供无真实 API 的确定性模型。
- `VirtualTerminal` 测试终端渲染和输入。
- protocol/client/server 有 transport-neutral conformance fixtures。
- session backend 对同一 `SessionRepo` contract 做 memory/SQLite conformance。
- `pi-evals` 在隔离目录运行真实 AgentSession、保存原生 JSONL artifacts，并比较 prompt、tool、skill、model 或 system prompt。

## 对开发自己 Agent 的启示

1. 复用 `pi-ai` 解决 Provider 和认证，而不是把厂商 SDK 写进 Agent。
2. 复用 `Agent`/`agent-loop` 解决事件化模型—工具循环。
3. 把产品策略放在类似 `AgentSession` 的编排层，不污染底层 loop。
4. 把 UI 作为 AgentEvent 的消费者，使 CLI、Web、RPC 可以共享运行时。
5. 明确状态层次：运行状态、上下文、持久会话、压缩摘要和长期记忆不是一回事。
6. 如果采用 AgentHarness v2，需要先确认未实现方法，不能只因类型和 backend 存在就认为系统已可用。
7. 长期语义记忆应作为独立策略层设计：提取、存储、召回、更新、遗忘和权限都需要明确契约。

## 证据边界

- package/exports/README 用于确认公共边界。
- main、SDK、AgentSession、Agent、agent-loop 用于确认当前主链。
- tests 与 `HarnessNotImplemented` 用于区分稳定行为和 scaffold。
- Graphify 用于发现候选符号与关系，不用于证明运行时已经接线。
