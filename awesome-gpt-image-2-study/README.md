# Awesome GPT Image 2 研究子项目

这是 [0805 GitHub Code Study](../README.md) 的第 02 个研究子项目，研究对象是 [freestylefly/awesome-gpt-image-2](https://github.com/freestylefly/awesome-gpt-image-2)。

我们的目标不是重新收藏提示词，而是回答三个更有复用价值的问题：

1. 它如何把社区图片案例转化为结构化、可检索的 Prompt-as-Code 资产？
2. Agent Skill、模板库、案例数据和在线生成产品之间如何分工与协作？
3. 哪些设计可以迁移到我们自己的视觉生成工作流，哪些只是特定模型、案例或商业网站的实现细节？

## 当前研究基线

上游资料固定在提交 `76fcd0e6b3961ef2b041547aac654f1efd1ef270`（2026-07-23，`Add official account contact card`）。本地上游副本仅供研究，并由父仓库忽略。

在该提交中：

- `data/cases.json` 收录 517 个案例。
- `data/style-library.json` 定义 13 个类别、19 个风格、10 个场景和 22 套模板。
- `agents/skills/gpt-image-2-style-library/` 是面向 Codex、Claude Code 等 Agent 的风格选择 Skill。
- `src/` 是 React/Vite 案例画廊与账户界面。
- `api/` 包含 41 个服务端文件，覆盖生图、账户、收藏、会员、支付和管理功能。
- `supabase/migrations/` 包含 12 个数据库迁移。

这些数字是研究快照，不代表上游项目永久不变。

## 研究展示站

[打开在线研究站](https://yydshly.github.io/0805_githubcode_study/awesome-gpt-image-2-study/)。页面提供两个主要入口：一是带上游真实案例图、完整 Prompt 和来源的 22 模板/517 案例图鉴；二是把商品、信息图、UI、海报场景沉淀为可复制、可在浏览器本机保存的 Skill 配方工作台。页面还保留短 Prompt/六段模板/Skill Prompt 的真实生成对照和应用向导。

本地查看时，在父仓库根目录执行：

```powershell
python -m http.server 4173
```

然后访问 `http://127.0.0.1:4173/awesome-gpt-image-2-study/site/`。

## 目录结构

```text
awesome-gpt-image-2-study/
├── upstream/
│   └── awesome-gpt-image-2/  # 只读上游源码，本仓库不跟踪
├── research/
│   ├── 00-research-plan.md   # 研究问题、阶段和证据标准
│   ├── 01-architecture-baseline.md
│   ├── 02-data-audit-findings.md
│   ├── site-design-contract.md
│   ├── site-coverage-manifest.md
│   ├── site-browser-evidence.md
│   ├── site-handoff.md
│   ├── generated/            # 可重复生成的数据审计结果
│   └── source-lock.json      # 上游来源与固定提交
├── scripts/
│   ├── audit-data.mjs        # 数据与引用完整性审计
│   └── build-site-catalog.mjs # 从固定上游快照生成网页目录数据
├── site/
│   ├── catalog-data.js       # 22 模板与 517 案例的生成文件
│   └── assets/               # 三档真实生成对照样本；案例图从固定上游资源加载
└── README.md
```

## 研究主线

- **数据资产化**：案例如何归类，模板、风格、场景和标签是否足以支持稳定检索。
- **Prompt 编译**：自然语言需求如何被拆成主体、构图、材质、文字、比例和负面约束。
- **Agent Skill**：Skill 是静态操作手册、检索层还是提示词生成器；选择逻辑是否可验证。
- **模型调用**：在线测试站如何把提示词交给 GPT-Image-2，以及参数、供应商和额度系统造成的边界。
- **效果评估**：模板是否真的提升可控性、文字准确率、布局一致性和批量复用效率。
- **迁移价值**：提炼一个不绑定 GPT-Image-2、可以接入其他图像模型的最小协议。

## 当前判断

该项目的核心不是新的图像模型，也不是模型微调。它更接近一套由社区案例反向整理而成的“视觉生成领域知识库”：结构化 JSON 是事实源，模板文档是人工可读协议，Agent Skill 负责语义选择与组装，在线网站负责浏览、试生成和商业化账户流程。

网页已经用完整目录和一次三档真实生成对照验证了这一判断：模板明显提高了需求完整性和结果可复查性，但不能保证文字、数据和所有负面约束一次命中。详细证据见 [浏览器验收](research/site-browser-evidence.md) 与 [架构基线](research/01-architecture-baseline.md)。

## 重跑数据审计

在仓库根目录执行：

```powershell
node awesome-gpt-image-2-study/scripts/audit-data.mjs
```

结果会写入 `research/generated/data-audit.md` 和 `data-audit.json`。

## 本地查看上游项目

父仓库不会提交第三方源码。首次取得研究快照时，在本目录执行：

```powershell
git clone https://github.com/freestylefly/awesome-gpt-image-2 upstream/awesome-gpt-image-2
git -C upstream/awesome-gpt-image-2 checkout 76fcd0e6b3961ef2b041547aac654f1efd1ef270
```

如需运行上游网站，在 `upstream/awesome-gpt-image-2/` 中安装依赖并启动开发服务器。无需配置云服务也可以研究静态画廊和生成脚本；登录、生图、支付和分析后台需要 Supabase、图像 API 与相应环境变量。

研究过程中不要把密钥写入仓库，也不要默认把第三方案例图片视为可商业使用素材。

## 来源与版权边界

上游代码以 MIT License 发布，但其 README 明确说明：社区案例、图片和提示词可能来自第三方，MIT 许可不自动覆盖这些内容。我们的研究记录会区分“上游事实”“我们的推断”和“实验结论”，不将案例库重新打包为商业素材库。
