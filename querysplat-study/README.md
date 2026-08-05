# QuerySplat 待研究记录

状态：**待研究，当前不下载源码、不安装环境、不运行模型。**

研究对象：[inspatio/querysplat](https://github.com/inspatio/querysplat)

记录日期：2026-08-05

## 当前决策

QuerySplat 值得作为 3D Gaussian Splatting（3DGS）与多视角三维生成方向的候选项目保留，但目前没有必要下载源码展开研究。

原因如下：

- 当前需求只是理解它解决什么问题、依赖什么技术，并没有明确的 3D 实景重建任务。
- 官方发布的是研究级推理实现，不是可以直接嵌入网页的前端组件。
- 官方环境要求 Linux、NVIDIA CUDA GPU 和匹配的 PyTorch/CUDA 扩展。
- 当前设备为 RTX 4070 Laptop 8GB；论文中标准 8192 Query 模型在单张输入时的峰值显存已约为 9.28 GiB，本机不适合直接按官方配置验证。
- 完整管线依赖带非商业限制的 VGGT-Omega/DINOv3 组件，未来商业使用前需要重新核验许可。

因此本阶段只保留结构化认知与后续研究入口。等出现明确的实景空间重建、3DGS 网页展示或云 GPU 验证需求时，再固定上游提交、下载权重并进行运行验证。

## 本次沟通逻辑

本次讨论按以下问题逐层收敛：

1. **它是什么？** 先确认 QuerySplat 不是查询工具，而是一套从同一场景的一张或多张照片生成可渲染 3DGS 场景的模型。
2. **是不是多角度图片生成 3D？** 是。更准确地说，它把多角度图片转换成可从新视角观看的三维视觉场，而不是可随意拆分编辑的 Blender/GLB 网格模型。
3. **怎么实现？** 它先用视觉几何模型估计相机、深度和多视角空间特征，再用几何与外观分离的 Query 解码器预测大量三维高斯，最后通过 3DGS 算法渲染。
4. **依赖什么环境？** 官方推理实现依赖 Linux、NVIDIA CUDA GPU、Python/PyTorch、CUDA 扩展和两套预训练权重。
5. **是算法还是大模型？** 两者结合：视觉大模型负责理解空间，QuerySplat 神经网络负责生成高斯，3DGS/CUDA 算法负责渲染。
6. **底层大模型是否开源？** 核心模型 VGGT-Omega 的代码和权重可申请下载，但采用非商业许可，属于“研究可用、并非宽松商用”的开放模型。
7. **现在是否值得下载研究？** 暂不值得。缺少明确应用任务，本机环境也不适合标准配置，因此标记为待研究。

## 一句话理解

```text
同一场景的多角度照片
→ 自动估计相机、深度与空间关系
→ 预测大量带位置、形状、颜色和透明度的三维高斯
→ 渲染成可以切换观察视角的 3D 场景
```

它生成的是 3D Gaussian Splatting 场景，而不是传统三角网格。

| QuerySplat / 3DGS | 传统 GLB / Blender 网格 |
| --- | --- |
| 由大量半透明三维高斯组成 | 由三角形表面组成 |
| 擅长还原真实空间的视觉效果 | 擅长结构编辑、材质修改和动画 |
| 适合房间、街景、展厅、实景背景 | 适合游戏角色、商品配置和机械零件 |
| 没有天然碰撞、拓扑、UV 和零件语义 | 可以具备碰撞、骨骼、UV 和零件结构 |

## 本质原理

### 1. 用 VGGT-Omega 理解多视角几何

输入为同一场景的一张或多张普通图片，不要求用户提前提供相机位姿。QuerySplat 使用冻结的 VGGT-Omega 1B/512 视觉几何模型提取：

- 相机位置、方向与内参；
- 每张图片的深度；
- 多张图片之间的空间对应关系；
- 统一的三维坐标系和几何特征。

VGGT-Omega 负责回答“相机在哪里、场景结构大致在哪里”。

### 2. 几何与外观分支分别预测高斯属性

QuerySplat 的关键设计是把“在哪里”和“看起来怎样”分开：

| 分支 | 输入重点 | 预测属性 |
| --- | --- | --- |
| Geometry Query | 跨视角几何特征与全局空间关系 | 中心位置、三轴尺度、旋转 |
| Appearance Query | RGB 局部纹理、相机射线和几何结果 | 透明度、球谐颜色 |

标准配置使用 8192 个 Query，每个 Query 预测 64 个高斯，最多形成约 524,288 个三维高斯。Query 不绑定单个输入像素，可以跨图片收集证据，并把更多表示能力分配给边缘、细节和复杂结构。

这种解耦的目的，是避免纹理、反光和光照变化干扰稳定的空间结构预测。

### 3. 使用 3DGS 算法渲染

每个三维高斯可以理解为一个带位置、方向、大小、颜色和透明度的三维椭球。渲染时将其投影为屏幕上的二维椭圆色斑，再按照深度和透明度进行混合。几十万个色斑共同形成最终画面。

这一步是确定性的图形与数值计算，主要由 `gsplat` 等 CUDA 实现加速；它不是再次调用语言模型。

### 4. 可选 TTO 精修

基础模型可以一次前向生成场景。用户也可以开启 Test-Time Optimization（TTO），利用输入图片对当前场景的中间特征进行少量优化，在运行时间与重建质量之间做取舍。

## 它是算法还是大模型

准确分类是一个混合系统：

```text
QuerySplat 管线
├─ 视觉几何基础模型：VGGT-Omega 1B/512
├─ 3D 生成神经网络：QuerySplat 双分支 Query Decoder
├─ 场景表示与渲染算法：3D Gaussian Splatting
└─ GPU 加速实现：PyTorch + CUDA + gsplat
```

- **不是纯传统算法**：相机、深度和高斯布局主要依靠已经训练好的神经网络权重预测。
- **不是 GPT 类语言大模型**：它不负责对话，而是专门处理多视角图片和三维几何。
- **也不是只有大模型**：模型输出高斯参数后，仍需专门的 3DGS 投影、排序和透明度混合算法完成渲染。

## 底层开放模型说明

### VGGT-Omega 1B/512

QuerySplat 的核心视觉几何模型是 [facebook/VGGT-Omega](https://huggingface.co/facebook/VGGT-Omega)，由 Meta AI Research 与牛津大学 VGG 团队发布。

它是约十亿参数规模的视觉几何基础模型，面向多视角空间理解，而不是语言生成。QuerySplat 使用它的聚合器、相机头、深度头和中间几何特征，并在推理过程中保持模型冻结。

权重文件为：

```text
vggt_omega_1b_512.pt
```

其开放边界需要明确：

- 模型页面和权重公开可申请访问；
- 下载前需要登录 Hugging Face、同意访问条件并提供联系信息；
- Hugging Face 模型页标注为 `CC-BY-NC-4.0`；
- QuerySplat 仓库内置的 VGGT-Omega/DINOv3 代码标注为 FAIR Noncommercial Research License；
- 因此适合个人学习、学术研究和非商业验证，不能默认用于收费产品或客户项目。

这里应使用“开放权重/研究可用”来描述，不应把它等同于允许自由商用的宽松开源模型。

### QuerySplat 自有模型

QuerySplat 还需要自己的解码器权重：

```text
querysplat_vggto_1B_512_8192.safetensors
```

该模型读取 VGGT-Omega 的几何特征，并将其转换为最终的三维高斯。QuerySplat 自有代码部分采用 Apache 2.0，但完整运行链依赖上述非商业组件，因此整个现成管线不能仅依据 Apache 2.0 判断为可商用。

## 官方推理环境要求

### 硬件与系统

| 项目 | 官方要求或实测 |
| --- | --- |
| 操作系统 | Linux；论文环境为 Ubuntu 24.04 |
| GPU | 支持 CUDA 的 NVIDIA GPU |
| 显存 | 8192 Query 模型约 9.28 GiB 起；实际建议至少 12GB，较稳妥为 16GB |
| CPU/AMD | 官方实现不提供可用的 CPU 或 AMD 路线 |

Linux 不是数学原理上的限制，而是当前代码、CUDA 扩展和第三方依赖的工程限制。原生 Windows 不在官方支持范围；WSL2 也不能解决 8GB 显存不足的问题。

### 软件版本

官方测试组合为：

```text
Python 3.12
PyTorch 2.11.0
TorchVision 0.26.0
CUDA 12.8
cuDNN 9.19
```

主要 Python/CUDA 依赖包括：

```text
torch, torchvision, numpy, pillow, safetensors, einops,
gsplat, fused-ssim, lpips, plyfile, pyyaml, matplotlib, scipy
```

其中 `gsplat` 和 `fused-ssim` 涉及 CUDA 扩展及编译兼容性，是环境搭建的主要风险点。

### 必要权重与输入

```text
checkpoints/
├─ querysplat_vggto_1B_512_8192.safetensors
├─ querysplat_vggto_1B_512_8192.yaml
└─ vggt_omega_1b_512.pt
```

输入应为同一静态场景的多角度照片。单张图片也可以输入，但不可见区域更多依赖模型推测；实际验证应优先准备 4～12 张具有充分视角重叠的照片。

## 当前能力边界

适合候选场景：

- 房间、门店、展厅、街景和真实空间重建；
- 从照片快速得到可浏览的新视角场景；
- 文生视频多视角帧到 3DGS 的实验；
- 3DGS 场景修复或快速初始化；
- 离线生成 PLY，再接入独立 WebGL/Three.js 查看器。

不应期待它直接提供：

- 可编辑 GLB 网格；
- 商品零件拆分和材质配置；
- 游戏碰撞、物理、寻路；
- 精确 CAD、测量和工程模型；
- 浏览器内直接运行的完整生成服务。

若未来用于交互空间，推荐采用混合路线：3DGS 负责视觉，简化代理网格负责地面、碰撞、导航和交互。

## 后期按需研究的触发条件

满足以下任一条件时，再启动源码和运行研究：

1. 出现明确的房间、展厅、门店或其他真实空间重建需求。
2. 需要验证“多角度照片 → 3DGS PLY → Web 查看器”的完整链路。
3. 可以使用 Linux 且显存不少于 16GB 的 NVIDIA 本地或云 GPU。
4. 需要与传统 3DGS、VGGT、TokenGS 或其他 feed-forward 3DGS 方法做质量和成本比较。
5. 已明确项目为研究/非商业用途，或已完成商业许可核验。

启动后应按以下顺序研究：

```text
固定上游提交和权重校验值
→ 在云 GPU 复现官方样例
→ 用自有 4/8/12 视角素材测试
→ 检查显存、速度、PLY 大小和坏视角
→ 对比无 TTO、TTO-20、TTO-50
→ 验证 PLY 到 Web 查看器的格式兼容和压缩
→ 决定是否进入正式项目
```

## 当前结论

QuerySplat 是一个值得保留的前沿研究候选，但不是当前阶段需要立即下载和部署的基础依赖。

它对本项目库的主要意义，是展示一种新的 AI 资产生成范式：使用开放的视觉几何基础模型理解多视角空间，再由专用生成网络输出可以实时渲染的显式 3DGS 表示。当前保持“待研究”状态，未来由真实应用需求、可用 GPU 环境和许可条件共同触发进一步研究。

## 官方资料

- [QuerySplat 官方仓库](https://github.com/inspatio/querysplat)
- [QuerySplat 论文](https://arxiv.org/abs/2608.01186)
- [QuerySplat 论文 HTML](https://arxiv.org/html/2608.01186v1)
- [QuerySplat 模型权重](https://huggingface.co/inspatio/querysplat)
- [VGGT-Omega 模型页](https://huggingface.co/facebook/VGGT-Omega)
- [QuerySplat NOTICE 与第三方许可说明](https://github.com/inspatio/querysplat/blob/main/NOTICE)

当前只依据上述官方资料形成有边界的初步判断，尚未下载源码、运行权重或进行独立质量验证。
