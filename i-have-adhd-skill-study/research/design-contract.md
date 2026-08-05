# i-have-adhd Skill 研究站设计契约

- Entry mode: brief-led
- Request revision: 2 — 在现有研究站中加入可完整阅读、复制和下载的中文 `SKILL.md`，而不是只提供十条规则摘要。
- Target user and context: 希望真正理解 Agent Skill 从入口、任务分析、例外路由到输出塑形全过程的中文读者；不要求具备提示词工程背景。
- Desired first impression: 这不是“Prompt 改写器”或第二个模型，而是一套清晰、可追踪的回答策略。
- Visual ambition: Editorial
- Experience architecture: Editorial Flow
- Visual constraints: 信息图式编辑页面；高对比文字、克制蓝色强调、清晰流程连线；避免伪代码主导、AI 科幻装饰和无意义动画。
- Information constraints: 区分上游事实、研究解释和模拟输出；完整覆盖入口、基础分析、例外判断、十条规则、发送前检查、持续状态、Token 影响和能力边界；中文 Skill 必须保留上游章节、规则、正反例、例外和检查项的完整语义，并标注翻译与医学边界。
- Operation constraints: 纯 HTML/CSS/JavaScript，无后端、无登录、无运行时模型调用；可由静态服务器运行并部署到 GitHub Pages。
- State constraints: 流程步骤选择、四类任务样例、规则详情选择、回答前后对比、中文 Skill 目录导航与复制反馈、Token 收支计算、浅色/深色主题。
- Environment constraints: 中文界面；桌面、平板、390px 手机；键盘可达；尊重 reduced-motion；现代浏览器。
- Primary journey: 用户先读一句话定义，再点击五个真实流程阶段，切换不同任务观察例外分支与输出变化；随后进入完整中文版 Skill，按章节阅读并复制或下载 Markdown，最后查看 Token 收支和可复用结论。
- User-defined phases: 理解作用；理解入口到分析逻辑；用样例观察回答变化；判断参考价值与边界。
- Required artifacts: 可运行静态站；完整中文 `i-have-adhd.zh-CN.md`；网页阅读版与复制/下载入口；研究说明；设计契约；覆盖清单；浏览器验收记录；根项目导航配置。
- Autonomy authorization: 用户明确要求在当前项目下创建子项目网页，可直接实现和验证。
- User-decision boundary: 接入真实模型、后端服务、发布上线、修改上游仓库或安装该 Skill 需要另行授权。
- Observable completion criteria: 首屏明确三项核心事实；五阶段流程均可交互；至少四个样例覆盖默认、详细解释、危险操作和真实歧义；十条规则有作用与例子；网页包含完整中文 Skill 的持久模式、五条依据、十条规则、六类例外和五项发送前检查，可复制并下载 Markdown；Token 计算器能说明何时省或不省；桌面和 390px 无横向溢出；键盘、主题切换和 reduced-motion 路径可用；Pages 构建通过。

## 设计方向

| 决策 | 方向 | 可观察约束 | 验收标准 |
| --- | --- | --- | --- |
| 信息层级 | 先纠正误解，再走流程，最后判断价值 | 首屏同时出现“输入不变、同一模型、输出受约束” | 用户无需滚动即可知道它不是 Prompt 改写器 |
| 视觉语言 | 精密的“回答编排台” | 流程、输入、规则与输出拥有稳定视觉角色 | 信息关系不依赖颜色 alone |
| 交互模型 | 流程步骤与任务样例互相联动 | 每次选择都有文本、状态和示例变化 | 鼠标与键盘均可完成主旅程 |
| 响应式 | 宽屏双栏、窄屏单栏 | 390px 无页面横向溢出 | 阅读顺序保持“定义→流程→样例→规则→结论” |
| 主题 | 浅色默认，支持深色 | 语义色在两种主题中一致 | 文字、边框、选中态与警告态均可读 |
| 动效 | 仅用于状态切换 | reduced-motion 关闭位移和平滑滚动 | 关闭动效不损失内容或控制状态 |
