# LongCat-Video 暂不研究记录

> 状态：**暂不深入研究**
>
> 当前决定：保留模型定位、能力、原理、资源门槛和后续触发条件；不下载约 75–83GB 的模型仓库，不在当前 8GB 显存设备上搭建推理环境，也不制作独立展示站。

研究对象：[meituan-longcat/LongCat-Video](https://github.com/meituan-longcat/LongCat-Video)

研究快照：[`6b3f4b8`](https://github.com/meituan-longcat/LongCat-Video/commit/6b3f4b8582a8bc3f20f795735f5383716c4ba794)

记录日期：2026-08-06

## 当前结论

LongCat-Video 是美团 LongCat 团队发布的开放权重视频生成模型及推理工程，不是视频剪辑 Skill、桌面编辑器或第三方 API 包装器。

它的核心价值是根据文字、图片、已有视频或语音生成新的动态画面：

```text
文字 / 图片 / 已有视频 / 语音
→ 视频生成基础模型
→ 新视频、续写视频或音频驱动数字人视频
```

它与此前记录的 freecut、YH ChatCut Video Skills 位于视频生产链的不同位置：

```text
LongCat-Video：生成新镜头、数字人和 B-Roll
                    ↓
freecut / ChatCut：选择、裁剪、字幕、音乐和合成
                    ↓
                 最终成片
```

对当前研究库而言，这个项目最多作为未来视频制作的候选素材生成方式。现阶段没有明确的视频生成任务，本机又不满足官方推理路线的资源要求，因此继续下载和运行的增量意义有限。

## 它提供什么能力

### 基础视频模型

LongCat-Video 基础模型为 13.6B 参数 Dense Diffusion Transformer，在一个模型中支持：

| 任务 | 输入 | 输出 |
| --- | --- | --- |
| Text-to-Video | 文字描述 | 全新生成的视频 |
| Image-to-Video | 图片＋文字描述 | 保留参考图主体的动态视频 |
| Video Continuation | 已有视频＋文字描述 | 延续原视频的新片段 |
| Long Video Generation | 初始提示词＋连续续写 | 数十秒至分钟级视频 |
| Interactive Video Generation | 按阶段排列的多条提示词 | 内容随提示词逐段变化的视频 |

“Interactive”在当前代码中指预先提供一组阶段性提示词，然后逐段生成和续写；它不是低延迟实时交互，也不是可以替代游戏引擎的物理世界模拟器。

### LongCat-Video-Avatar 1.5

同一仓库还提供基于基础模型扩展的音频驱动数字人路线：

- Audio-Text-to-Video：根据语音和文字生成说话人物；
- Audio-Image-to-Video：让指定人物图片按照语音说话和动作；
- Audio-driven Video Continuation：沿着音频继续生成更长的人物视频；
- 单路或多路音频输入；
- 单人、多人对话、唱歌、表演和商品讲解；
- 真人、动画角色和动物角色；
- 480p/720p 输出；
- DMD2 类步数蒸馏后的 8 步推理；
- 可选 INT8 DiT 权重，降低模型加载显存。

这里的音频是输入条件，不是模型生成的资源。Avatar 会提取已有语音特征，以此驱动口型、表情和身体动作，再把原音频写回视频。配音、音乐、环境音和音效仍需由其他模型或素材提供。

## 核心原理

### 1. 将条件编码成模型特征

- UMT5 编码文字提示词；
- 输入图片或视频经 VAE 编码到潜空间；
- Avatar 1.5 使用 Whisper-Large-v3 提取随时间变化的语音特征；
- 多人物模式分别处理人物条件和对应音频。

这些条件共同描述“生成什么、主体是谁、动作如何变化、嘴形何时变化”。

### 2. DiT 在视频潜空间中去噪

13.6B 参数视频 DiT 不直接逐个生成高清像素，而是在压缩后的视频时空潜变量上执行 Flow Matching 推理。模型从噪声出发，逐步形成：

- 场景与主体结构；
- 人物身份和外观；
- 镜头运动；
- 动作和前后帧关系；
- 光线、颜色和纹理。

最后再由视频 VAE 将潜变量解码为普通视频帧。

### 3. 先粗生成，再时空精修

官方文生视频示例先生成约 `832×480、93帧、15fps` 的内容和动作，再加载 refinement LoRA，通过时空精修得到 720p、30fps 输出。

```text
480p / 15fps 粗生成
→ 补充空间细节和时间帧
→ 720p / 30fps 精修结果
```

Block Sparse Attention 用于降低高分辨率视频注意力计算成本；蒸馏 LoRA 可以将基础采样从 50 步减少到 16 步。Avatar 1.5 进一步使用 8 步蒸馏推理。

### 4. 通过有重叠的片段连续续写

分钟级视频不是一次生成完整一分钟，而是分段完成：

```text
生成第一段
→ 保留末尾条件帧
→ 续写下一段
→ 重复拼接
→ 分段精修
```

官方长视频示例每次生成 93 帧，并用其中 13 帧衔接下一段，同时使用 KV Cache 辅助续写。这能提高连续性，但仍可能累积人物、场景、动作和物理关系漂移。

### 5. 用训练与对齐提高主观质量

技术报告称基础模型使用多奖励 GRPO/RLHF 优化文字一致性、视觉质量和运动质量；Avatar 1.5 又通过数据清洗、语音编码升级、RLHF 和步数蒸馏强化口型、身份与长视频稳定性。

这些是项目方技术报告和内部评测结论。本次没有独立运行模型，不把“商业级”“全面领先”等宣传表述视为已经复现的事实。

## 它不是哪些工具

LongCat-Video 不直接提供：

- 已录制视频中的口误、停顿和重复 take 删除；
- 多轨剪辑、字幕、转场、配乐和成片编排；
- 文本转语音、音乐或环境音生成；
- Premiere、剪映或 DaVinci Resolve 工程；
- 可实时控制、具有严格物理规律的 3D 世界；
- 面向普通网页前端直接加载的小型模型；
- 完整的数据准备、基础训练和 RLHF 训练流水线。

当前公开内容更准确地说是“开放权重＋推理代码＋演示脚本”，而不是从训练数据到最终模型的完整可复现工程。

## 开放与许可边界

官方 README 和 Hugging Face 模型卡将代码及模型权重标记为 MIT License，并明确说明许可证不授予美团商标或专利权。

开放内容包括：

- 基础视频模型和 Avatar 模型权重；
- BF16 与部分 INT8 权重；
- 文生视频、图生视频、视频续写和长视频示例；
- 单人、多人物音频驱动示例；
- Streamlit 演示入口；
- DiT、VAE、调度器、稀疏注意力、上下文并行和推理管线代码。

实际商用仍需单独处理输入素材授权、肖像权、声音权、隐私、内容安全和生成内容标识等问题，不能只依据代码许可证判断完整业务合规性。

## 环境与资源门槛

官方安装路线使用：

```text
Python 3.10
PyTorch 2.6 + CUDA 12.4
FlashAttention 2.7.4
NCCL / torchrun
Transformers + Diffusers
FFmpeg、Librosa、ONNX Runtime（Avatar）
```

资源事实：

| 项目 | 官方文件规模 |
| --- | ---: |
| LongCat-Video 基础模型仓库 | 约 83.3GB |
| LongCat-Video-Avatar 1.5 模型仓库 | 约 74.9GB |
| 核心模型参数量 | 13.6B |

模型仓库大小不等于运行显存，但 13.6B 参数仅用 BF16 保存核心参数，理论参数存储就约 27GB，尚未计入 UMT5、VAE、音频编码器、激活值和视频潜变量。官方推理脚本将整条 Pipeline 放到 CUDA，Avatar 1.5 官方示例默认采用两张 GPU。

因此当前 RTX 4070 Laptop 8GB 不适合直接按官方方案运行。即使使用 Avatar INT8，也没有证据表明完整管线可以装入 8GB 显存。原生 Windows 还会遇到 NCCL、FlashAttention、`/tmp` 与类 Unix 脚本假设等额外兼容问题。

## 对当前项目库的意义

可能的未来价值：

- 为研究项目介绍视频生成 B-Roll；
- 根据角色图和旁白生成虚拟人物讲解；
- 将静态概念图转为短动态镜头；
- 生成 AI 概念预告片或氛围视频；
- 研究“开放模型生成素材→Agent 自动剪辑→最终发布”的工作流；
- 在有云 GPU 时比较开放模型和商业视频 API 的成本、隐私与可控性。

当前增量价值有限：

1. 当前主线是 GitHub 项目研究、网页展示和 Three.js Demo，不是持续视频生产。
2. 本机 8GB 显存与官方推理路线不匹配。
3. 下载权重、搭建 CUDA/FlashAttention 环境的成本明显高于当前收益。
4. 没有明确提示词、参考图、旁白和验收标准时，运行只能得到无法比较的样片。
5. 仓库没有完整训练流水线，现阶段主要可研究推理和应用，而不是端到端训练。
6. 官方质量结论主要来自项目方内部 MOS 和自建评测，仍需同一素材下的独立对照实验。

所以当前定位是：**值得保存的开放视频模型候选，不是需要立即部署的基础能力。**

## 重新开启研究的条件

满足以下任一条件时，再开始下载或云端验证：

1. 出现明确的数字人讲解、图生视频、视频续写或 B-Roll 需求。
2. 已准备固定提示词、参考图片、音频和质量验收标准。
3. 可使用至少 48GB 级大显存 GPU，或有明确可用的多卡/云服务环境。
4. 需要比较 LongCat-Video、Wan、HunyuanVideo 与商业视频 API。
5. 需要验证分钟级续写中的人物身份、场景、色彩和动作漂移。
6. 准备搭建自动化视频内容生产流水线。

建议验证顺序：

```text
先看官方样例和在线 Demo
→ 用同一提示词做基础文生视频比较
→ 测试一张自有角色图＋短音频的 Avatar 1.5
→ 测试单段与多段续写漂移
→ 记录显存、耗时、失败率和人工返工
→ 再决定是否进入正式视频工作流
```

## 研究资料

- [LongCat-Video 官方仓库](https://github.com/meituan-longcat/LongCat-Video)
- [基础模型技术报告](https://arxiv.org/abs/2510.22200)
- [基础模型权重](https://huggingface.co/meituan-longcat/LongCat-Video)
- [项目展示页](https://meituan-longcat.github.io/LongCat-Video/)
- [Avatar 1.5 技术报告](https://arxiv.org/abs/2605.26486)
- [Avatar 1.5 模型权重](https://huggingface.co/meituan-longcat/LongCat-Video-Avatar-1.5)
- [Avatar 1.5 项目页](https://meigen-ai.github.io/LongCat-Video-Avatar-1.5-Page/)
- [文生视频示例](https://github.com/meituan-longcat/LongCat-Video/blob/main/run_demo_text_to_video.py)
- [长视频示例](https://github.com/meituan-longcat/LongCat-Video/blob/main/run_demo_long_video.py)
- [单人数字人示例](https://github.com/meituan-longcat/LongCat-Video/blob/main/run_demo_avatar_single_audio_to_video.py)

当前记录基于上述官方文档、模型卡、技术报告摘要和关键推理代码的静态核验。尚未下载权重、运行示例或进行独立视觉质量测试。
