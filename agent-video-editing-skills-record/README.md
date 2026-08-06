# Agent 视频剪辑 Skills 暂不研究记录

> 状态：**暂不研究**
>
> 当前决定：只保留链接、原理、差异与重新研究的触发条件；不下载源码、不安装 Skill、不配置 ChatCut 或 ElevenLabs，也不制作展示站。

记录日期：2026-08-06

## 记录对象

| 项目 | 官方链接 | 本次固定快照 | 定位 |
| --- | --- | --- | --- |
| freecut | [Moh4696/freecut](https://github.com/Moh4696/freecut) | [`f1d4334`](https://github.com/Moh4696/freecut/commit/f1d43341204fffe3b8352e8dfe6f507f87bd5637) | 本地优先的对话式视频剪辑 Skill 与 Python/FFmpeg 工具链 |
| YH ChatCut Video Skills | [yihui-dev/yh-chatcut-skills](https://github.com/yihui-dev/yh-chatcut-skills) | [`8dc9ce6`](https://github.com/yihui-dev/yh-chatcut-skills/commit/8dc9ce611484e93e736594dade4fd5e7b635249f) | 基于 ChatCut 可编辑项目的分阶段口播剪辑 Skill，以及独立的中文视频转 SRT Skill |

此前沟通中使用过“yc-chatcut-skill”这一名称。公开仓库的准确名称是 **`yh-chatcut-skills`**，本文统一使用准确名称，避免后续检索错误。

## 一句话结论

两个项目采用相近的 Agent 视频剪辑范式：

```text
录制视频
→ 提取音频并生成带时间戳的转写
→ Agent 按语义决定保留、删除和编排内容
→ 将语义判断映射回视频时间轴
→ 由确定性剪辑工具执行
→ 检查并交付
```

它们的主要创新都不是新的音视频基础算法，而是用 Skill 把大模型、转写服务、时间轴和渲染工具编排成可通过自然语言操作的工作流。

当前我们已经理解这套共同机制，但没有持续的视频生产需求，也没有需要解决的真实剪辑样本，因此继续下载、安装和做展示页会产生较多重复研究，暂时没有足够的增量意义。

## freecut 的作用与原理

### 作用

freecut 接收已经录制好的口播、访谈、教程、录屏或多次 take，通过 Agent 对话生成剪辑策略，最终在素材目录的 `edit/` 中输出预览和 `final.mp4`。

主要能力包括：

- 删除口误、语气词、重复 take 和过长停顿；
- 根据内容结构选择并重排多段素材；
- 自动生成字幕、调色和音频淡入淡出；
- 叠加 HyperFrames、Remotion、Manim 或 PIL 动画；
- 在剪辑点附近抽帧并结合波形做有限自检；
- 使用 `project.md` 保存后续会话需要的项目记忆。

### 原理

freecut 不把完整视频逐帧交给大模型。它采用“音频优先、视觉按需”的两层表示：

1. 用 FFmpeg 提取单声道 16 kHz 音频。
2. 默认用本地 Whisper 生成逐词时间戳；可选 VibeVoice 或 ElevenLabs。
3. 将逐词 JSON 压缩成带时间范围的 `takes_packed.md`，供 Agent 阅读全部内容。
4. 只在停顿、take 比较和剪辑点检查等关键位置生成“抽帧＋波形＋词语标签”时间线图。
5. Agent 根据语义和叙事结构生成自定义 `edl.json`。
6. Python 脚本调用 FFmpeg 完成片段提取、拼接、字幕、动画、调色、响度处理和编码。
7. Agent 查看输出剪辑点附近的时间线图，发现问题后修改并重新渲染。

核心映射是：

```text
词语时间戳
→ 原素材切点
→ EDL 片段顺序
→ 成片累计时间
→ 字幕和动画的新时间位置
```

### Skill 实际实现的内容

freecut 的 `SKILL.md` 主要实现：

- 素材检查、转写、规划、确认、执行、自检和记忆的工作顺序；
- 产品介绍、教程、访谈等常见内容的叙事组织方法；
- 不切断单词、切点留边、字幕最后叠加、剪辑点音频淡入淡出等生产规则；
- EDL、中间目录和动画任务的结构约定；
- 多动画并行生成和最多三轮自检的协作协议。

语音识别来自 Whisper/VibeVoice/ElevenLabs，实际视频处理来自 FFmpeg；Skill 本身没有训练新的剪辑模型。

## YH ChatCut Video Skills 的作用与原理

该仓库包含两个相互独立的 Skill，不能简单看成 freecut 的本地替代品。

### `yh-chatcut-edit`

它依赖 ChatCut 插件和一个现有的可编辑 ChatCut 项目。Agent 读取项目、素材库和时间线后，严格按照状态机工作：

```text
准备
→ A-Roll 去停顿、重复和卡壳
→ 强制暂停，等待用户确认
→ B-Roll
→ 中文字幕
→ 强调音效
→ 背景音乐
→ 总检
```

它的重点不是直接烘焙一个不可修改的 MP4，而是让每次修改继续保留在 ChatCut 的多轨时间线中，用户之后仍可手工调整、撤销和导出。

Skill 主要提供口播剪辑规则，例如默认 1.1 倍速、在语义重音处适度 Punch-in、按用户指定素材映射 B-Roll、按中文语义断字幕，以及在关键节点验证时间线状态。

### `yh-tools-video2srt`

这是一个可以脱离 ChatCut 使用的中文字幕工具。其流程是：

1. 从本地视频提取单声道 16 kHz 音频。
2. 使用 ElevenLabs Scribe v2 获取字符级时间戳。
3. 以真实录音为内容依据，只用参考稿纠正人名、产品名和技术术语。
4. 由 Agent 按中文语义插入字幕换行，而不是按固定字数机械切断。
5. 使用 ElevenLabs Forced Alignment 将最小校正后的文本重新对齐音频。
6. 验证字幕序号、时间范围、重叠、标点和横竖版长度限制后输出 SRT。

该路线需要网络和 ElevenLabs API Key，音频与最小校正后的转写会发送给 ElevenLabs，可能产生费用和隐私约束。

## 两者的相似与差异

| 维度 | freecut | YH ChatCut Video Skills |
| --- | --- | --- |
| 共同范式 | 语音转写＋时间戳＋Agent 语义判断＋确定性时间轴执行 | 语音转写＋时间戳＋Agent 语义判断＋确定性时间轴执行 |
| 主要输入 | 本地录制视频和音频 | ChatCut 项目及素材；视频转 SRT Skill 接收本地视频/音频 |
| 主要操作界面 | 文件、Markdown 转写、JSON EDL 和命令行 | ChatCut 可编辑多轨时间线 |
| 转写 | 默认本地 Whisper；可选 VibeVoice/ElevenLabs | 字幕 Skill 当前依赖 ElevenLabs Scribe v2 和 Forced Alignment |
| 输出 | 主要是渲染后的 MP4、SRT 和中间文件 | 可继续编辑的 ChatCut 项目；字幕 Skill 输出 SRT |
| 视觉检查 | 按需生成抽帧、波形和词语标签图 | 通过 ChatCut 项目状态、时间线和关键画面验证 |
| 强项 | 本地、开放、适合从多次 take 自动形成成片 | 保留真正可编辑的时间线，中文口播阶段和确认节点更明确 |
| 主要依赖 | Python、FFmpeg、本地 ASR；动画工具按需安装 | ChatCut 账户/插件；字幕功能还依赖 ElevenLabs |

二者相似的是上层 Agent 工作流，不同的是执行载体：freecut 直接围绕文件和 FFmpeg 生产成片，YH Skill 主要围绕 ChatCut 的可编辑项目操作。

## 为什么暂时没有研究意义

这里的“没有研究意义”指当前阶段缺少增量价值，不代表项目没有产品价值。

1. **核心范式已经清楚。** 两者都在解决“把语义剪辑判断映射成精确时间轴操作”，继续阅读大量规则不会改变当前认知。
2. **暂时没有真实剪辑任务。** 当前研究库的主要工作仍是 GitHub 项目理解、网页展示和 Three.js Demo，而不是持续制作口播视频。
3. **缺少验证样本。** 没有多次 take、采访或带旁白的录屏素材时，无法有意义地比较 take 选择、字幕对齐、节奏和成片质量。
4. **验证成本高于当前收益。** freecut 需要配置 Windows 版 FFmpeg、`faster-whisper` 和模型权重；YH 编辑 Skill 需要 ChatCut 项目，字幕 Skill 需要 ElevenLabs Key 和付费调用。
5. **重复建设风险较高。** 现阶段制作新的研究站，只会再次呈现“转写→语义判断→时间轴→渲染”的流程，与已有 Agent Skill 研究方法重复。
6. **当前没有集成目标。** 我们尚未决定要把自动视频生产接入研究项目发布、The Long Silence 演示或其他固定内容流水线。

因此当前仅保存可追溯记录，不把任一项目加入默认 Skill，也不进行本地运行验证。

## 后续重新研究的触发条件

满足以下任一条件时，可以重新开启：

1. 开始持续为研究项目制作口播讲解、演示视频或短视频。
2. 已准备一组包含多次 take、口误、停顿和 B-Roll 的真实测试素材。
3. 需要比较“本地直接出片”与“云端可编辑时间线”的成本、质量和隐私。
4. 需要为中文口播建立稳定的字幕断句与 Forced Alignment 流程。
5. 决定开发自己的视频剪辑 Skill，需要复用它们的 EDL、确认节点或 QA 设计。
6. 需要将浏览器/Three.js 自动录屏与后续 Agent 剪辑串成发布流水线。

届时应以同一组真实素材做对照测试，至少比较：安装成本、转写准确率、切点自然度、中文字幕、时间线可编辑性、渲染速度、费用、隐私和人工返工时间。

## 来源与边界

- [freecut README](https://github.com/Moh4696/freecut/blob/main/README.md)
- [freecut SKILL.md](https://github.com/Moh4696/freecut/blob/main/SKILL.md)
- [freecut helpers](https://github.com/Moh4696/freecut/tree/main/helpers)
- [YH ChatCut Video Skills 中文说明](https://github.com/yihui-dev/yh-chatcut-skills/blob/main/README.zh-CN.md)
- [`yh-chatcut-edit` SKILL.md](https://github.com/yihui-dev/yh-chatcut-skills/blob/main/skills/yh-chatcut-edit/SKILL.md)
- [`yh-tools-video2srt` SKILL.md](https://github.com/yihui-dev/yh-chatcut-skills/blob/main/skills/yh-tools-video2srt/SKILL.md)
- [ChatCut 官方 Agent Plugin](https://github.com/ChatCut-Inc/agent-plugin)

当前结论基于上述文档与关键实现的静态核验。尚未下载或运行两个仓库，未使用真实素材验证转写、剪辑、字幕、渲染或 ChatCut 项目操作，因此不把上游宣传中的质量描述视为独立实测结论。
