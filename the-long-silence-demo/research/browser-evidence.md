# Browser evidence · 2026-08-06

Canonical runtime: `http://127.0.0.1:5180/`

## Revision v12 · 故事驱动的第一段 Canto

- 基线确认旧任务只提供“失事信标 / 2/2 完成”：玩家知道如何重复扫描，却不知道九百个世界为何沉默、为什么追第二目标、完成后得到什么。
- 首屏现在同时呈现世界谜题、Pale Seeker、第 1101 次远征与 `RESONATORS 0/7`；三个故事节拍为“扫描世界 → 定位共鸣 → 解读 Canto”，并与任务状态联动。
- 桌面键盘完整复现：从 `3.49u` 接近 ITHIRKA II，在 `1.85u` 完成首次扫描，进入 `TRACE FOUND`。叙事明确显示城市仍整齐运行、没有爆炸/辐射/抵抗痕迹，按钮变为“追踪共鸣器”。
- 第二目标实测切换为 `RESONATOR I / 11.11 Hz / 40 kyr / WAITING`，起始为 `6.58u / 向左转 88°`；转向对准、推进和制动后到达 `2.61u / READY`，第二次扫描完成为 `CANTO 1/7 / RESONATORS 1/7`。
- 最终奖励显示 `THE FIRST CANTO · RECOVERED`，用短文回答第一次调查：Choir 最先建造聆听塔，天空并非空无，而像在屏息；同时明确还有六台共鸣器，形成继续探索的理由。
- 完成态主动切到源库高保真，得到 `L2/L3 · SOURCE` 且故事仍为 `RESONATORS 1/7`；原库飞船资产与新叙事状态共存。
- `?webgl=off` 中任务简报和锁定的 First Canto 仍可读，23 个 3D 专用控制保持禁用；文本降级没有丢失“为何出发”的背景。
- 375 × 844 的自动真实浏览器全页截图中，舞台 HUD、五个触控按钮、任务简报和操作区均可见；四场景视觉回归更新有意高度变化后，desktop/mobile × study/fallback 均 `PASS 0.000%`。
- 最终 build 通过；主入口 `680.10 kB`（gzip `179.24 kB`），高保真飞船和内舱继续独立按需分包。

## Revision v11 · 确定性双航点调查链

- 旧基线中只有 ITHIRKA II 一个目标；扫描完成后按钮变为“清除扫描”，没有发现、转向或第二次调查。本轮将它改为由一次结果推动下一段操作的连续任务。
- 首次扫描实测进入 `NEW SIGNAL / DISCOVERED`，按钮变为“追踪第二航点”；点击后目标名称、遥测、目标环、HUD 和场景说明同步切换到 `WRECKAGE VD-4213-3`。
- 桌面完整键盘路径从第二段 `向左转 83° / 6.62u` 开始，经真实 `A` 转向后显示“船头已对准”，再用 `W` 推进与 `Space` 制动，到达 `1.79u / 0.02u/s / READY`；第二次扫描结束为 `2/2 COMPLETE / 100% / mission-complete`。
- 最终按钮为“重新运行任务链”，点击后恢复 ITHIRKA II、`目标 1/2`、0% 与初始船位；第一目标的完成环在第二段保持绿色，失事信标只在首次扫描后显现。
- 375 × 844 实测 `clientWidth = scrollWidth = 360px`。首次版本的目标标签会压到触控按钮，已把移动端标签约束到控制区上方；复查无遮挡。触控可把 `向左转 87°` 调整到“船头已对准”，并将第二段距离从 `6.58u` 推进到 `5.94u`。
- 从手机视口恢复当前应用宽度时，旧的默认 hero 镜头会把船体裁得过近；初始与重置取景已统一为完整船体的 flight 构图，重新加载后不再依赖手动点击“重置飞行取景”。
- “生成”证据在同 seed 重生成前后均显示 `第二航段 6.60u`，证明信标路线稳定。源库高保真加载后仍保持失事信标与 `2/2 COMPLETE`，浏览器错误日志为空。
- `?webgl=off` 继续显示双航点能力说明，同时明确驾驶任务 `UNAVAILABLE`；“重新检测 3D”可恢复默认场景，三维轨道与文本降级边界未被任务链破坏。
- 页面新增“扫描结果 → 第二航点”生成说明、连续操作路线和后期边界。第三航点、奖励、战斗、六自由度、着陆与存档仍不在当前范围。
- 四场景视觉回归先正确识别到说明区增加 57px，更新有意基线后 desktop/mobile × study/fallback 全部 `PASS 0.000%`；默认取景修正后再次复测仍为四项 `PASS 0.000%`。最终 build 通过，主入口 `676.57 kB`（gzip `177.96 kB`），高保真模块继续按需分包。

## Revision v10 · 三维视觉轨道与稳定玩法平面

- 基线问题已确认：旧场景的轨道线和行星都固定在 `Y=0`，因此无论镜头如何调整，太阳系结构仍像一张平面示意图。
- 现在只把非任务背景轨道放入确定性的轨道平面；默认 seed `20260725` 的实时读数为 `MISSION 0° · BG −17° / +19° / −10° / +14°`。轨道线与对应行星共享同一倾角和升交点，因此运动不会脱离可见轨道。
- 点击“重生成”前后，上述四组倾角完全一致，证明三维层次仍服从 seed，而不是每次刷新随机漂移。
- 调查目标仍保持 `0°` 任务平面。桌面重新执行主路径后达到 `2.04u / 0.00u/s / COMPLETE / 100% / external / scanned`，背景倾角没有改变距离、碰撞、制动或扫描判定。
- 375 × 844 实测中，首屏仍同时显示飞船、三项任务读数、五个触控按钮和双视角入口；页面 `clientWidth = scrollWidth = 360px`。点击“推进”后从 `0.00u/s / 3.49u` 变为 `0.21u/s / 3.30u`。
- `?webgl=off` 保留“玩法平面 / 三维视觉层”说明，运行证据显示 `TEXT · gameplay 0° / visual layered`；“重新检测 3D”可在同一标签恢复默认场景，浏览器错误日志为空。
- 页面已经把该决策沉淀为“玩法平面 → 视觉轨道”：当前获得纵深但不增加驾驶复杂度；第二航点和六自由度仍明确留在后续路线，而不伪装成已接入能力。
- 四场景视觉回归先正确识别到说明区增加 80px，确认有意变化后更新基线；普通测试再次得到 desktop/mobile × study/fallback 全部 `PASS 0.000%`。最终 build 通过，主入口 `673.06 kB`（gzip `176.62 kB`），源库高保真模块继续保持按需分包。

## Revision v9 · 最小驾驶与调查闭环

- 1280 × 720 基线确认旧版本没有驾驶状态，扫描按钮也不校验距离或速度；本轮把页面承诺改为真实的“驾驶接近 → 制动稳定 → 扫描完成”。
- 桌面场景现在可聚焦，`W/S/A/D/Space` 分别控制推进、后退、转向和制动。实测推进后读数从 `0.00u/s / 3.49u` 变为 `0.49u/s / 3.29u`，`SCENE STATE` 同步进入 `external / flying`。
- 调查目标被冻结为稳定任务锚点，其他行星仍按 seed 轨道运动，避免目标在玩家学习控制时持续远离。扫描走廊最终校准为 `2.65u`，速度门槛为 `0.30u/s`。
- 桌面完成路径实测到达 `2.22u / 0.04u/s / READY`，扫描约 3 秒后进入 `COMPLETE / 100% / external / scanned`；远距离时按钮显示“接近后扫描”并禁用。
- 行星使用简化安全半径。实测高速冲入目标会进入 `SAFE LIMIT / COLLISION`，船体被推回且速度削减；提示结束后恢复驾驶状态，没有穿模或软锁。
- 驾驶输入期间镜头平滑追随船体的位置与船头，停止后恢复 OrbitControls；场景保留自由拖拽，侧栏新增“重置飞行取景”。驾驶舱世界相机改为沿船头方向观察。
- 375 × 844 首屏同时可见飞船、速度/距离/扫描读数、五个触控按钮、双视角和当前实验说明。点击触控推进后实测从 `0.00u/s / 3.49u` 变为 `0.12u/s / 3.41u`；无控件重叠或横向溢出。
- 原 20 秒导览使用确定性自动进近夹具进入合法扫描走廊；完整回归后仍以 `COMPLETE / 100% / RECENTERED / external / close-survey` 结束。
- 高保真模式实测完成 `11 / 11 · 100%`、`L2/L3 · SOURCE`；源库外部船体与 Draco 驾驶舱正常切换，浏览器错误与警告日志为空。
- `?webgl=off` 中新增驾驶任务显示 `UNAVAILABLE`，取景按钮与其他 3D 控件一并禁用，知识内容仍可读；错误与警告日志为空。
- 自动视觉测试先正确报告四张旧基线尺寸变化，更新有意基线后 desktop/mobile × study/fallback 四项均 `PASS 0.000%`。最终 build 通过。

## Revision v8 · 可读 WebGL 降级与自动视觉回归

- 新增确定性夹具 `?webgl=off`，与实际 WebGL2 探测失败共用 `enterFallbackMode`。桌面实测 `data-render-mode=fallback`、`TEXT MODE`、`fallback / readable`、`TEXT · no 3D assets`、`FALLBACK · N/A`。
- fallback 舞台不再是空黑画布：静态示意保留长轴、锤头、散热翼与双引擎；标题、当前实验说明和右侧研究内容仍在原有层级中。桌面截图无横向溢出。
- 18 个 3D 专用 button/input 被 disabled 并带 `aria-disabled` 与原因 title；飞船/生成/尺度/观测四个知识 tab 继续可用。fallback 中点击“生成”后正文与 deterministic proof 正常更新，控制台无错误。
- “重新检测 3D”会移除 `webgl=off` 与 `qa`，同一标签恢复 `data-render-mode=3d`、`READY`、`external / live`，canvas 重新成为可访问场景。
- 375 × 844 fallback 卡片为 324px 宽，body/html scrollWidth 均为 360px；无横向溢出。实看后隐藏了无效且与卡片相邻的舞台视角切换条，禁用原因仍由卡片与控制区表达。
- 自动视觉测试使用 `playwright-core` 启动本机 Edge/Chrome，以固定 seed、QA 冻结和 reduced-motion 捕获 `desktop-study`、`desktop-fallback`、`mobile-study`、`mobile-fallback` 四张 full-page baseline。
- `npm run test:visual:update` 生成四张基线；页面新增“工程保障”说明后，普通测试正确捕获四个场景均增加 48px 并失败。确认属于有意变化后更新基线，再跑四项均 `PASS`、像素差异 `0.000%`、无 diff 文件。阈值为 1%，失败时保留 actual 与 diff。
- fallback 不创建 Three.js renderer，也不触发源库动态 import；页面读数明确为 0 draws / 0k tris / no 3D assets。最终浏览器错误与警告日志为空。
- 最终 build 通过：HTML 17.87 kB、CSS 19.24 kB、主入口 663.97 kB（gzip 173.16 kB）；源库高保真模块继续为独立按需 chunks。

## Revision v7 · 源库船体几何 LOD

- 代表性基线为 1280 × 720、固定 seed、Auto/Detail、高保真外部 hero：`FULL · 7.1u`，约 `31–33 draws / 147–150k tris / 240 FPS`。源码级统计显示完整船体约 175k tris；视锥裁剪后的 renderer 实际值较低。
- 新增的远景 PROXY 由程序化几何构成，仅保留长轴、锤头、驾驶舱、散热翼、背鳍和双引擎轮廓；代理自身为 `248 tris`、2 个材质批次，不增加下载资产。
- 第一版 9.5u 阈值实看过早，飞船仍偏大；最终调整为距离 > 12.5u 切 PROXY、< 10.8u 恢复 FULL。`u` 明确表示 Demo 场景单位，不声称真实米制。
- 最终桌面远景 `PROXY · 12.9u` 约 `15 draws / 13k tris`。向内缩到 `11.5u` 仍保持 `PROXY / 14 draws / 12k tris`，继续缩到 `9.3u` 才恢复 `FULL / 32 draws / 148k tris`，双阈值滞回符合预期。
- 远景代理状态下启动扫描，观察到 `external / scanning`、43%、`PROXY · 15.9u`、约 `18 draws / 13k tris`；进入驾驶舱后显示 `INTERIOR · PROXY`，扫描继续到 82%，说明 LOD 没有截断任务状态。
- 高保真状态重生成后回到 hero，并正确恢复 `FULL · 7.9u / 35 draws / 154k tris`。播放导览进入第五步驾驶舱后显示 `INTERIOR · PROXY`、`cockpit / scanned`、100%，资产身份保持 `L2/L3 · SOURCE`。
- 375 × 844 近景仍显示完整源库船体；拉远到 `12.9u` 自动显示轮廓代理，约 `12 draws / 7k tris`，页面无横向溢出。切回轻量模式后显示 `STUDY · N/A`，没有把不同资产系统混为一谈。
- 最终浏览器错误与警告日志为空；build 通过。

## Revision v6 · 自适应画质与真实加载反馈

- 1280 × 720 基线为默认轻量、`AUTO · DETAIL`；Auto、Detail、Eco 均为语义按钮并同步 `aria-pressed`。实测手动切换后 `PIXEL RATIO` 从 `1.35x` 变为 `0.85x`，再回到 `1.35x`，证明控件改变真实 renderer DPR，而非只改标签。
- Auto 使用三档上限：Eco 0.85、Balanced 1.10、Detail 1.35；连续 4 个 0.5 秒样本低于 48 FPS 才降档，连续 16 个样本高于 57 FPS 才升档，每次变化后冷却 6 秒。当前高帧率桌面保持 Detail。
- 高保真加载的进度由 `LoadingManager` 中真实完成的 `models/*` 文件驱动。冷加载实测观察到 `10 / 11 · 82%` 中间态，随后进入 `11 / 11 · 100%`、`L2/L3 · SOURCE` 与 `SOURCE READY`。
- 测试过程中真实复现过 Draco 开发态解析失败：页面保持 `FALLBACK · STUDY`、显示“加载中断 · 轻量版仍可使用 / 重试”，主场景未中断。重启并应用 Vite workspace/dedupe 配置后，独立新标签完成 11/11，错误与警告日志为空。
- 375 × 844 下 Auto 从 Balanced 开始；当前测试设备 DPR 为 1，因此实际显示 `AUTO · BALANCED · 1.00X`。三个画质按钮各约 97px，`body/html scrollWidth = 360`，无横向溢出。
- 移动端高保真 + Eco + 驾驶舱扫描组合实测为 `L2/L3 · SOURCE`、100%、`MANUAL · ECO · 0.85X`、`cockpit / scanning`、约 58 draws；交互反馈未被画质策略删除。
- 最终 build 通过：HTML 16.88 kB、CSS 17.41 kB、主入口 658.64 kB（gzip 171.12 kB）；高保真模块继续作为独立按需 chunks。

## Revision v5 · 轻量提炼 / 源库高保真对照

- 默认打开仍为 `L1/L2 · READY`，不触发高保真动态 import；主动选择后显示 loading，再进入 `L2/L3 · SOURCE`。源库船体模块、内舱构建器与 11 个约 3.79 MiB 的内舱文件均位于该按需路径。
- 外部高保真模式真实调用上游 `buildHull`，可以观察更复杂的长轴结构、锤头、散热构件、推进器与表面细节；当前视口观察约 `31 draws / 147k tris`。
- 高保真驾驶舱真实加载 Draco GLB、AO 与 albedo/normal/ORM 材质；视角对准源库驾驶席，目标与任务 HUD 继续复用 Demo 状态。截图中可见有接触阴影的地板、控制台、框架和窗外目标。
- 高保真内舱扫描状态与目标环、遥测、文字和扫描进度同步。静态阴影改为进入时更新一次后，扫描完成状态约 `54 draws / 37k tris`，相比持续阴影更新时约 `296 draws` 明显下降。
- 已验证高保真 → 轻量 → 高保真往返：轻量驾驶舱约 `34 draws / 9k tris`；再次切换和“重生成”后仍保持 `L2/L3 · SOURCE`，场景回到 `cockpit / live`。
- 高保真模式下播放导览，进入驾驶舱并完成扫描后仍保持源库资产；未出现状态被轻量版本覆盖的问题。
- 375 × 844 视口中 `window.innerWidth = 375`，`body/html scrollWidth = 360`，无横向溢出；两个资产按钮各约 147px，均可点击。移动端高保真外部约 31 draws。
- 页面新增“真实覆盖”区，DOM 中明确区分已接入、按需接入、概念演示和尚未接入；MIT 来源与 3.79 MiB 成本在切换入口附近可见。
- 浏览器错误日志为空；最终构建通过。主入口 `654.15 kB`（gzip `169.61 kB`）；高保真模块被拆为 `RoomEnvironment 2.04 kB`、`BufferGeometryUtils 4.76 kB`、`interiorAssets 52.13 kB`、`Interior 85.18 kB` 与 `hull 104.22 kB` 的按需 chunk，另输出 Draco 解码器。

## Revision v4 · 20 秒引导式技术叙事

- 默认控制区新增“播放 20 秒导览”，位于 seed 和单步任务之前；约 830px 桌面视口中它与左侧飞船同屏，未挤压空间舞台。
- 已实测完整时间线：轮廓 → 材料 → 居住空间 → 外部扫描 → 驾驶舱同进度 → 折跃/重定位 → 外部近距离调查；结束状态为 `external / close-survey`、扫描 `100%`、`WORLD POSITION +0.8 km local`、`RENDER ORIGIN +1,250,725 km · recentered`。
- 驾驶舱导览阶段已观察到 `cockpit / scanning`、扫描 93%、HUD、目标遥测与步骤 `05 / 07` 同时存在；后续折跃阶段在驾驶舱中显示重定位完成，再切回外部结果。
- 已分别用视角按钮和真实画布拖动中断导览；按钮变为“从头播放导览”，状态恢复为 `cockpit / live` 或 `external / live`，画布拖动提示“已手动接管镜头”。
- 375px × 844px 手机视口可播放导览；`body clientWidth = scrollWidth = 360`（15px 为浏览器滚动条），无横向溢出，导览入口、双视角和原有任务按钮均可达。
- 导览运行时观察值约 238–240 FPS；外部材料阶段约 74 draws，驾驶舱扫描阶段约 85 draws。数值随视锥裁剪与状态变化，不作为固定承诺。
- 浏览器错误日志为空；最终 build 通过。主产物约 HTML 12.92KB、CSS 14.68KB、JS 585.98KB（gzip 150.39KB）。

## Revision v3 · guided inspection and scan feedback

- 在约 832px 的当前应用窗口中，页面保持 487px 宽的粘性场景与 345px 信息区并排；操作扫描时页面 `scrollY = 0`，空间场景没有被挤出视野。
- “材料分工”入口会进入材料近景，并同步更新 `aria-pressed`、当前实验说明和参考镜头正文；“居住证据”会进入驾驶舱。
- 外部扫描约 42% 时已观察到船到目标的加色光束、目标遥测卡、扫描状态和进度同步；draw calls 约从 82 增至 87，仍保持约 240 FPS。
- 驾驶舱扫描约 31% 时，HUD 类名为 `is-visible is-scanning`，扫描线、遥测、目标环和状态文字同时存在。
- 375px 手机扫描状态无横向溢出（body `clientWidth = scrollWidth = 375`）；遥测卡保持在画面范围内，四条桌面观察入口隐藏，双视角入口继续可达。

## Desktop · 1265px wide

- 外部首屏以程序化调查船为主视觉，能辨认锤头、背鳍、散热翼、分离引擎、尾焰和发光座舱；目标行星与任务标记同屏。
- 点击“内部驾驶舱”后，前景出现座舱框架、侧控制台、导航环、仪表光和 HUD，窗外仍是同一个目标。
- 驾驶舱内扫描在约 3 秒后达到 `COMPLETE / 100% / cockpit / scanned`。
- 驾驶舱内折跃完成后显示 `cockpit / close-survey`，世界读数变为 `+0.8 km local`，渲染原点变为 `+1,250,725 km · recentered`，按钮变为“返回轨道”。
- 键盘 `V` 可从驾驶舱切回外部，`aria-pressed` 与 `SCENE STATE` 同步更新。
- 四个知识分区均可展开，已观察到 P0 资产路线“分件 GLB + AO/normal/ORM + 纹理压缩”。
- 当前环境观察值约 `216–240 FPS`；外部约 `76 draws / 16k tris`，驾驶舱约 `36 draws / 15k tris`。数值会随 GPU、窗口和场景状态变化，不作为固定承诺。
- WebGL fallback 保持隐藏、FPS 持续更新，说明主循环已正常运行；未观察到阻断性错误界面。

## Narrow viewport · 375px observed / 844px target

- 场景约 490px 高，双视角按钮在场景内同排可达，页面随后自然进入说明和操作区域。
- 外部首屏仍能看见整船；驾驶舱首屏仍能看见框架、目标、仪表与当前实验说明。
- 种子、扫描、折跃、重置、暂停和四个知识分区无横向溢出，主路径不依赖悬停。

## Keyboard and semantics

- 外部与驾驶舱使用语义 button + `aria-pressed`；说明使用原生 `details/summary`。
- 已观察到视角按钮获得 `2px solid` 可见焦点轮廓。
- `V` 键切换路径已复现。

## Engineering

- `npm run build`：pass。
- v3 产物：HTML 12.09KB、CSS 13.46KB、JS 582.42KB（gzip 149.19KB）。
- Vite 报告单 chunk 超过 500KB；当前研究 Demo 可接受，生产化时应按视角拆分。

## Known boundary

- 本环境没有关闭 WebGL2 的浏览器能力，因此 fallback 只验证了语义内容与代码路径，保留为 `defer`。重测触发条件：在禁用 WebGL2 或 GPU 黑名单环境打开页面。
- 未模拟操作系统 reduced-motion；代码在该偏好下会缩短扫描/折跃并移除船体漂浮。重测触发条件：浏览器支持媒体偏好模拟或系统偏好可切换。
