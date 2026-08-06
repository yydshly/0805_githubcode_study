# 研究判断：小红书运营手册 · AI 工作台

## 研究对象

- 上游仓库：<https://github.com/nihe0909/xiaohongshu-ai-workbench>
- 固定提交：`464ccec036139f0d9bd2b31af9c7b75296f3161a`
- 提交日期：2026-08-04
- 上游版本语义：v0.2.0 对应提交
- 本地快照：`../upstream/xiaohongshu-ai-workbench/`（由子项目 `.gitignore` 排除）
- 许可证：MIT

本次研究直接检查了七个 `SKILL.md`、七个 `agents/openai.yaml`、七份 eval JSON、打包脚本和校验脚本。上游自带的 `python scripts/validate_all.py` 在固定快照上通过。

## 一句话结论

它把作者的小红书运营方法写成 Codex 可执行的模板和流程，帮助你规划“讲什么、怎么讲、按什么顺序讲”。它不给可直接发布的完整内容，也不判断小红书是否值得你投入。

## 对使用者究竟有什么意义

它的意义不是证明“你值得做小红书”，也不是替你完成发布。它假设你已经决定运营小红书，再用固定方法减少策划阶段的随意性。

| 它交付 | 它不交付 |
| --- | --- |
| 账号简介、母题、栏目 | 小红书是否值得投入的市场判断 |
| 7/14/30 天选题和顺序 | 可直接发布的完整笔记正文 |
| 标题候选和评论回复 | 封面、多页图片或视频 |
| 内容到关注/体验/私信的路径 | 登录、发布、后台数据与效果复盘 |
| 一套让 AI 稳定执行的方法模板 | 流量、涨粉、成交或排名保证 |

因此，对已有真实产品但缺少内容方法的人，它是策划辅助；对期待一键生成和发布的人，它单独使用的价值很低。

## 能力地图

| Skill | 层级 | 解决的问题 | 主要输出 |
| --- | --- | --- | --- |
| `xiaohongshu-suite` | 路由 | 现在应该先解决哪一环 | 子 Skill 选择与最短工作流 |
| `xiaohongshu-profile` | 承接 | 用户进入主页后能否快速看懂 | 主页诊断、简介、置顶建议 |
| `xiaohongshu-magazine` | 战略 | 账号长期围绕什么持续表达 | 母题、栏目、信任/喜欢选题库 |
| `xiaohongshu-topic-planner` | 排期 | 接下来 7/14/30 天发什么 | 选题分类、优先级、发布日历 |
| `xiaohongshu-title` | 包装 | 一篇内容怎样获得第一眼停留 | 快速、诊断、优化三种标题输出 |
| `xiaohongshu-comment-reply` | 互动 | 评论区怎样像真人并延续对话 | 多语气回复、置顶评论、风险提醒 |
| `xiaohongshu-conversion-path` | 行动 | 内容如何通向体验、私信或成交 | 吸引、筛选、信任、行动、复访路径 |

总控 Skill 定义的完整顺序是：主页 → 成交路径 → 母题栏目 → 选题日历 → 标题 → 评论。单一问题则直接进入对应子 Skill，不扩展成全账号诊断。

## 工作原理

### 1. 描述负责触发与路由

每个 `SKILL.md` 的 YAML frontmatter 定义适用场景和排除边界。Codex 根据用户语言选择 Skill；`xiaohongshu-suite` 再负责跨 Skill 编排。

### 2. 正文负责限定角色、步骤和产物

规则把模糊的运营经验拆成输入字段、判断维度、操作顺序和输出模板。例如主页 Skill 检查第一眼清晰度、目标用户、结果、信任、行动、置顶和语气；成交 Skill 把路径拆成吸引、筛选、信任、行动、私信和复访。

### 3. 约束负责减少营销幻觉

七个 Skill 反复限制外部案例、虚构数据、效果承诺、平台算法结论和无依据背书。标题 Skill 进一步规定长度、风格差异、禁用词与质量自检。

### 4. 输出格式负责稳定交付

Skill 不训练新模型，而是让现有模型按固定结构交付。它的增量来自任务分解、边界、顺序和检查清单，而非新的语言或视觉生成能力。

### 5. Python 只负责发布工程

`package_all.py` 把每个 `SKILL.md` 和 `agents/openai.yaml` 压缩为 `.skill`；`validate_all.py` 检查名称、元数据、eval 结构、安装包一致性、品牌标识和禁用引用。它不运行模型质量评测，也不测量小红书运营效果。

## 证据与成熟度

| 检查项 | 固定快照事实 | 研究判断 |
| --- | --- | --- |
| Skills | 7 个 | 功能边界清楚，路由结构合理 |
| 规则样例 | 27 个：标题 8、路由 4，其余各 3 | 覆盖了典型触发与禁区，但样例量仍小 |
| 打包 | 7 个 `.skill` | 可直接分装，工程简单透明 |
| 校验 | 上游脚本通过 | 证明结构一致，不证明生成质量或业务效果 |
| 外部数据 | 无 | 不适合热点、竞品、搜索趋势和效果复盘 |
| 平台操作 | 无 | 不登录、不抓取、不发布、不回收后台数据 |
| 许可证 | MIT | 适合内部改写和二次封装，需保留许可声明 |

## 能做与不能做

### 能做

- 把真实产品材料整理成账号定位、栏目和选题系统。
- 把单篇内容加工成多方向标题和评论区动作。
- 把“关注/体验/反馈/购买”等目标拆成内容承接路径。
- 用一致的输出模板降低每次从零提示 AI 的成本。
- 作为团队的小红书运营基线和 Skill 编写样本。

### 不能做

- 获取实时热点、关键词热度、竞品数据或用户画像。
- 登录小红书、读取主页、抓取评论、自动私信或发布内容。
- 生成完整图片、视频或直接完成平台发布物料。
- 用真实数据闭环优化内容，除非使用者主动提供后台表现。
- 保证流量、涨粉、排名、私信或成交。
- 判断用户是否应该投入小红书，或用数据证明该渠道值得做。
- 直接交付“标题 + 完整正文 + 封面 + 多页配图 + 标签”的发布包。

## 对 0805 GitHub Code Study 的意义

它不是新的研究引擎，也不是完整内容分发系统，而是现有研究成果进入小红书之前的策划层。我们的研究库已经具备“固定来源 → 拆能力和原理 → 记录边界 → 制作演示”的生产链；这套 Skills 只能把这些结果整理为主页、栏目、选题、标题、评论和访问路径。

若要得到可直接发布的结果，还需要补一层我们自己的“研究报告转小红书成品”能力：写完整正文、编排 6–9 页图文、生成视觉素材、配置标签、事实复核、发布和数据回收。这部分不属于上游仓库。

更长期的可复用价值是它展示了一种方法论产品化结构：

```text
领域经验 → 单一稳定工作流 → 触发边界 → 输入契约
→ 判断步骤 → 输出模板 → 禁止项 → eval 样例 → 可安装包
```

这可以反向指导我们把“GitHub 项目值不值得研究”“模型硬件门槛判断”“研究报告转社媒内容”等自有方法封装成专属 Skills。

## 实际采用建议

- 如果近期不运营小红书：不必全局安装，保留为 Skill 设计和内容方法参考。
- 如果准备为研究库建立小红书账号：可以把 `profile + magazine + topic-planner + title` 作为策划模板，不能把它们当成内容生产线。
- 采用时应补上自己的事实库、历史内容表现、读者问题和品牌语气；上游不包含这些上下文。
- 把任何生成结果视为策划初稿；完整正文、图片、标签、事实与平台合规仍需另行完成。

完整策划样例见 [actual-sample.md](./actual-sample.md)。

## 固定源码证据

- [总控路由](https://github.com/nihe0909/xiaohongshu-ai-workbench/blob/464ccec036139f0d9bd2b31af9c7b75296f3161a/xiaohongshu-suite/SKILL.md)
- [标题规则](https://github.com/nihe0909/xiaohongshu-ai-workbench/blob/464ccec036139f0d9bd2b31af9c7b75296f3161a/xiaohongshu-title/SKILL.md)
- [主页规则](https://github.com/nihe0909/xiaohongshu-ai-workbench/blob/464ccec036139f0d9bd2b31af9c7b75296f3161a/xiaohongshu-profile/SKILL.md)
- [杂志感选题库](https://github.com/nihe0909/xiaohongshu-ai-workbench/blob/464ccec036139f0d9bd2b31af9c7b75296f3161a/xiaohongshu-magazine/SKILL.md)
- [发布规划](https://github.com/nihe0909/xiaohongshu-ai-workbench/blob/464ccec036139f0d9bd2b31af9c7b75296f3161a/xiaohongshu-topic-planner/SKILL.md)
- [评论回复](https://github.com/nihe0909/xiaohongshu-ai-workbench/blob/464ccec036139f0d9bd2b31af9c7b75296f3161a/xiaohongshu-comment-reply/SKILL.md)
- [转化路径](https://github.com/nihe0909/xiaohongshu-ai-workbench/blob/464ccec036139f0d9bd2b31af9c7b75296f3161a/xiaohongshu-conversion-path/SKILL.md)
- [打包脚本](https://github.com/nihe0909/xiaohongshu-ai-workbench/blob/464ccec036139f0d9bd2b31af9c7b75296f3161a/scripts/package_all.py)
- [校验脚本](https://github.com/nihe0909/xiaohongshu-ai-workbench/blob/464ccec036139f0d9bd2b31af9c7b75296f3161a/scripts/validate_all.py)
