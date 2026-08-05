# 浏览器验收记录

- 时间：2026-08-05 22:47:53 +08:00
- 运行命令：`python -m http.server 4176 --directory i-have-adhd-skill-study/site`
- 规范地址：`http://127.0.0.1:4176/`
- 浏览器：Codex In-app Browser
- 主题：浅色、深色
- 视口：1440 × 1000、768 × 900、390 × 844

## 主旅程

| 检查 | 证据 | 结果 |
| --- | --- | --- |
| 首屏定义 | H1 为“它不替模型想答案，它替答案排顺序”；同时显示 0 次 Prompt 改写、1 个宿主模型、10 条规则、6 类例外 | pass |
| 五阶段流程 | 浏览器识别 5 个语义 tab；逐步切换后标题、作用边界、trace 和下一步同步更新 | pass |
| 四类任务 | 排错、详细解释、危险操作、真实歧义均可选择；`aria-pressed` 和对比答案同步变化 | pass |
| 危险分支 | 例外路由显示“安全高于简短与行动优先”；输出先要求确认数据库、备份和回滚条件 | pass |
| 十条规则 | 浏览器识别 10 个规则 tab；选择第 10 条后显示“删除前言、复盘和客套结尾”及对应正反例 | pass |
| Token 计算 | 将 Skill=2400、普通输出=300、塑形输出=250、减少轮次=0 后，页面显示增加 2350 tokens | pass |
| 主题切换 | 浅色→深色后 `data-theme=dark`、按钮状态和可访问名称同步；深色→浅色复检通过 | pass |
| 键盘 | 在流程 tab 上按左方向键，选中项由“发送前检查”移动到“输出塑形”，tabpanel 引用同步 | pass |

## 跨表面检查

| 表面 | 观察 | 结果 |
| --- | --- | --- |
| 1440px 桌面 | `scrollWidth = clientWidth = 1425`；首屏双栏完整，流程、规则和样例数量正确 | pass |
| 768px 平板 | `scrollWidth = clientWidth = 753`；流程和规则工作区转换为单栏 | pass |
| 390px 手机 | `scrollWidth = clientWidth = 375`；Hero、样例、规则列表均为单栏，无横向溢出 | pass |
| 深色手机 | Hero、按钮、事实数字和流程内容在深色主题中可读，主操作保持可见 | pass |
| 语义 | 无重复 ID、无缺失 `aria-labelledby`、按钮均有名称、四个 range 均关联 label | pass |
| 控制台 | 页面加载和完整交互后错误日志为空 | pass |

## 动效与能力边界

- 页面没有持续动画或高成本视觉资源，主旅程不依赖动效。
- CSS 已提供 `prefers-reduced-motion: reduce`，会关闭平滑滚动和过渡。
- 当前浏览器能力没有提供媒体偏好模拟入口，因此未实际切换操作系统 reduced-motion 状态。
- 状态：`defer`。已尝试浏览器 viewport、DOM、交互与能力检查；缺少媒体偏好模拟能力。重测触发条件：在支持 `prefers-reduced-motion` 模拟的 DevTools 或浏览器环境中重新打开页面。

## 最终审计

- 页面可运行，主旅程完整。
- 桌面、平板、手机和双主题均无阻断问题。
- 交互和语义检查通过，控制台无错误。
- 唯一延后项为非阻断的 reduced-motion 环境模拟；基础 UI 不依赖动画。

## Revision 2：完整中文版 Skill

- 时间：2026-08-05
- 基线：原页面只有 10 条规则摘要，`#full-skill` 不存在。
- 变更：新增 `site/i-have-adhd.zh-CN.md`，网页阅读版从该文件动态生成；加入章节目录、完整性计数、复制全文和下载 Markdown。

| 检查 | 浏览器证据 | 结果 |
| --- | --- | --- |
| 完整章节 | `skill-persistence`、`skill-reading`、`skill-rules`、`skill-exceptions`、`skill-presend` 五个章节均存在 | pass |
| 条目数量 | 5 条阅读依据、10 个规则标题、6 类例外、5 项发送前删除检查 | pass |
| 单一内容来源 | 阅读版加载 `./i-have-adhd.zh-CN.md`；下载链接指向同一文件 | pass |
| 复制功能 | 点击“复制中文版”后显示“已复制完整中文版” | pass |
| 390px 手机 | `scrollWidth = clientWidth = 375`；目录双栏、正文单栏、元数据无内部溢出 | pass |
| 深色主题 | 中文版区域与元数据块使用深色语义变量，正文和边框可读 | pass |
| 控制台 | 加载、复制、目录跳转和主题切换后错误日志为空 | pass |
