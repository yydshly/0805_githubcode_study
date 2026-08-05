# 研究判断：Storybook Generator Skill

## 研究对象

- 上游：<https://github.com/weaiw/storybook-generator-skill>
- 固定提交：`72d30ecd51d12986738db6d4f40d79cd7fa6358a`
- 提交日期：2026-07-06
- 仓库形态：一个 `SKILL.md`、九份专项参考文档、Agent 展示配置和 MIT License；没有应用代码、模型权重、后端或自动化测试。

## 它实际实现了什么

这是一个 instruction-driven workflow：Codex 根据 `SKILL.md` 判断交付模式，并按任务读取对应参考文档，将绘本生产拆成以下产物：

1. 绘本 brief 与选题定位；
2. 故事骨架与逐页因果链；
3. 角色、场景、道具和画风圣经；
4. 逐页图片生成 Prompt；
5. 封面与多语排版规则；
6. QA、局部返工与文件版本管理；
7. 可选的 KDP 式 MVP 验证建议。

它的“执行能力”来自宿主 Agent 可调用的图片、HTML、PPT、PDF 等工具，而不是仓库自身代码。

## 一致性机制分级

### 已有：流程级软一致性

- 每页重复固定角色字段，而不是只写“同一个角色”；
- 建立角色、场景、道具三类视觉锚点；
- 明确左右手用途、遮挡和可见肢体数量；
- 先生成前 1—3 页校准，稳定后再继续；
- 漂移时减少复杂度，一次只改一个变量；
- 通过 QA 人工检查并保存 `-v2`、`-v3`。

这些机制可以降低生成漂移，但没有身份锁定能力。

### 缺失：模型级强一致性

- 没有强制参考图回传协议；
- 没有固定 seed、latent 或角色 embedding；
- 没有 LoRA、DreamBooth、IP-Adapter、ControlNet 等方案；
- 没有跨页人脸、服装、配色、道具相似度检测；
- 没有质量阈值、自动 Prompt 修复和自动重试闭环。

## 研究价值判断

| 维度 | 价值 | 判断 |
| --- | --- | --- |
| 绘本生产流程 | 高 | 结构完整，适合作为 SOP 基线 |
| Codex Skill 设计 | 高 | 展示了按任务渐进读取参考资料的组织方式 |
| 故事与图文契约 | 高 | 能明显减少“插画合集”与图文不符 |
| 角色软一致性 | 中 | 有可执行护栏，但依赖模型服从与人工判断 |
| 模型级生成技术 | 低 | 没有算法、权重或视觉控制实现 |
| 出版级自动化 | 低到中 | 有检查思路，没有完整出版工具链与市场验证 |

## 我们应当吸收什么

- 结构化角色圣经；
- 页间因果链和翻页钩子；
- 正文名词与画面证据的一一契约；
- 前三页校准后再批量生产；
- 插画层和文字排版层分离；
- 问题分类与局部返工。

## 后续研究假设

在该流程基线上增加以下闭环，才可能形成真正的技术差异：

```text
角色参考资产
→ 身份、服装、道具特征抽取
→ 每页生成时注入参考
→ 跨页一致性评分
→ 低于阈值时自动归因
→ 修改单一变量并重试
```

## 已完成的 ImageGen 实验

研究站现在包含一次真实的完整样书生成实验：先生成豆豆的角色锚点图，再让封面和 8 张内页逐页引用同一锚点。结果证明，单一参考图可以显著提高脸型、发型、睡衣配色和卧室气质的一致性，但仍不能自动锁定道具语义与光影因果。

- 高稳定项：豆豆身份、短发轮廓、黄色睡衣、深蓝拖鞋、深青色卧室；
- 可见漂移：第 7 页熊帽更像毛绒熊头；第 8 页树叶投影的来源不够明确；
- 结论：上游工作流值得作为编排层基线，但要达到出版级，需要参考资产协议、跨页评分和局部自动重生成闭环。

完整资产、页级观察和运行边界见 [ImageGen 完整样书实验](./imagegen-run.md)。

下一层研究是光影因果 QA：不只检查光源和影子是否出现，还检查“光源 → 遮挡物 → 投影面”的关系是否成立。实现边界和自动化路线见 [光影 QA 研究层](./lighting-qa.md)。

## 证据入口

- 总流程：[SKILL.md](https://github.com/weaiw/storybook-generator-skill/blob/main/SKILL.md)
- 故事和图文契约：[story-structure.md](https://github.com/weaiw/storybook-generator-skill/blob/main/references/story-structure.md)
- 角色一致性：[character-continuity.md](https://github.com/weaiw/storybook-generator-skill/blob/main/references/character-continuity.md)
- 逐页提示词：[prompt-workflow.md](https://github.com/weaiw/storybook-generator-skill/blob/main/references/prompt-workflow.md)
- 多语排版：[layout-and-pinyin.md](https://github.com/weaiw/storybook-generator-skill/blob/main/references/layout-and-pinyin.md)
- 质量检查：[qa-checklist.md](https://github.com/weaiw/storybook-generator-skill/blob/main/references/qa-checklist.md)
