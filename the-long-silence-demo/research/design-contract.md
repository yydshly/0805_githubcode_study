# The Long Silence 能力提炼 Demo · 修订设计合同 v12

## 本轮继续优化（2026-08-06 · story-driven First Canto）

- User authorization：用户明确要求把故事描述加入游戏，用叙事指导玩家并形成游玩驱动力。
- Primary journey：阅读“四万年前，九百个世界在四天内沉默”的任务简报 → 驾驶 Pale Seeker 扫描 ITHIRKA II → 从“没有战争痕迹”的异常数据中定位 `RESONATOR I` → 转向、接近并调谐共鸣器 → 解锁 `THE FIRST CANTO · 1/7`，理解下一步为何继续寻找其余六台共鸣器。
- Player motivation：每次操作回答一个问题——为什么出发、扫描发现了什么、为什么追踪第二目标、完成后获得了什么；故事不是页面末尾的背景资料，而是任务状态本身。
- State mapping：`briefing`（0/7）→ `world-scan` → `trace-found` → `resonator-locked` → `attuning` → `canto-recovered`（1/7）。
- Acceptance criteria：任务简报首屏可见；两次扫描的 HUD、按钮、遥测和侧栏叙事一致；第一段 Canto 是明确奖励；桌面、移动端和 WebGL 文本降级均能读懂故事；原有驾驶、双视角、资产切换和确定性 seed 不回退。
- Scope boundary：本 Demo 只实现第一台共鸣器 / 第一段 Canto 的叙事垂直切片，不伪装成完整七星系战役；Canto 文案采用忠实概括，不复刻大段源文。

## 本轮继续优化（2026-08-06 · 确定性双航点调查链）

- Entry mode：Revision-led implementation；用户以“确定”授权执行上一轮推荐的第二航点任务链。
- Primary journey：调查 ITHIRKA II → 扫描完成并发现信号 → 主动追踪第二航点 → 根据左右转向提示调整船头 → 接近并制动 → 扫描失事信标 → 完成 2/2 调查。
- Flat gameplay contract：两个调查目标、飞船、距离、碰撞和扫描继续位于同一 XZ 玩法平面；背景行星的倾斜轨道仍只承担视觉纵深，不能被升级为可交互目标。
- Deterministic content：第二航点的位置、名称和遥测由当前 seed 派生；同一 seed 重生成必须得到同一航向和距离。
- State contract：第一目标完成后进入 `discovered`，由用户点击“追踪第二航点”才切换目标；第二段提供实时左右转向角、距离、速度和扫描门槛；最终进入 `mission-complete`，可一键重跑任务链。
- Visual feedback：第二航点揭示前不可见；揭示后场景目标环、目标名称、遥测、HUD、说明和扫描反馈同步切换；第一目标保留已完成的绿色证据。
- Preserve：双视角、轻量/源库资产、导览、折跃、暂停、重生成、三维背景轨道、移动触控和 WebGL fallback 不改变既有边界。
- Supported surfaces：桌面键盘与 375 × 844 触控竖屏；深色 3D、完成态和文本 fallback。
- Observable completion：桌面可完成两次合法扫描；第二段必须真实要求转向与推进；移动端可发现并追踪第二航点且无溢出；重置和同 seed 重生成稳定；浏览器无错误；四场景视觉回归与 build 通过。
- Out of scope：第三航点、随机任务树、资源奖励、战斗、六自由度、着陆和存档。

## 本轮继续优化（2026-08-06 · 三维轨道视觉层）

- Entry mode：revision-led；用户确认修正“所有星球看起来都在同一平面”的视觉问题。
- Current gap：当前轨道顶点和所有行星位置都固定为 `Y = 0`，玩法平面与宇宙视觉层被错误合并，空间缺少纵深。
- Layer separation：飞船、调查目标、扫描距离、碰撞与任务航线继续使用稳定 XZ 玩法平面；非任务行星与轨道只作为不可交互背景表现。
- Deterministic space：每颗非任务行星由 seed 数据获得稳定的轨道倾角和升交点；轨道线与行星运动共用同一个轨道平面变换，禁止只随机修改高度。
- Visual range：倾角控制在可读的小范围，避免背景轨道遮挡飞船、目标标记和触控按钮；调查目标轨道保持高亮且水平。
- State boundary：扫描、驾驶、碰撞、导览、重生成、源库/轻量资产和 WebGL fallback 不改变语义。
- Information update：页面说明明确区分“单平面玩法层”和“三维视觉轨道层”，避免把背景空间感误认为六自由度飞行。
- Supported surfaces：1280 × 720 与 375 × 844；深色主题；默认 3D、任务完成态与文本 fallback。
- Autonomy authorization：用户“确定”授权实现该可逆视觉修订；不扩展第二航点、六自由度或新任务链。
- Observable completion：同一 seed 重生成得到相同倾角；至少三条背景轨道具有可见但不过度的空间差；目标、飞船和扫描闭环仍在同一玩法平面；桌面/手机无遮挡；build、浏览器日志和四场景视觉回归通过。

## 本轮继续优化（2026-08-06 · 最小驾驶与调查闭环）

- Entry mode：revision-led；用户确认停止无目的优化，授权按已推荐方向补齐真正可玩的最小闭环。
- Current gap：当前飞船不可驾驶；扫描不校验距离或速度；“完整调查闭环”的页面承诺与实际能力不一致。
- Primary journey：驾驶飞船前进 → 调整方向 → 接近目标 → 进入扫描走廊 → 制动稳定 → 完成扫描 → 获得调查结果。
- Movement model：所有玩法保持在单一 XZ 平面；`W/S` 前进/后退、`A/D` 转向、`Space` 制动；移动端提供可持续按压的同等按钮；不是六自由度飞行模拟。
- Camera model：飞行输入期间使用平滑追随镜头，分别平滑位置与观察点；输入停止后恢复可拖拽观察，提供一键重置取景；驾驶舱按船头方向观察。
- Scan contract：只有进入目标扫描距离且绝对速度低于阈值时才允许扫描；扫描期间锁定驾驶输入；完成后场景、任务状态、目标环、进度与说明同步进入成功态。
- Safety boundary：目标行星使用简化安全半径防止穿模；撞上边界时推回安全距离并损失速度；不引入伤害、着陆、敌人或复杂物理。
- State mapping：approach、stabilize、scan-ready、scanning、complete、collision、paused；距离、速度和任务目标必须在舞台与控制面板中可读。
- Guided route：原有导览仍可运行，但在扫描步骤使用确定性自动进近夹具，避免绕过新的扫描规则却又要求用户等待驾驶。
- Supported surfaces：1280 × 720 键盘/鼠标、375 × 844 触控竖屏、键盘焦点与 WebGL 文本降级；深色主题。
- Autonomy authorization：用户“确定”授权直接实现与验证；不扩展到完整游戏、后端、存档、战斗或新增高成本资产。
- Observable completion：键盘和触控都能改变真实船位/朝向/速度；扫描在远距离或高速时不可用并说明原因；满足条件后可完成任务；重置可回到稳定出生点；源库/轻量船体、外部/驾驶舱、暂停和 fallback 不回退；build、视觉回归和真实浏览器游玩通过。

## 本轮继续优化（2026-08-06 · WebGL fallback and visual regression）

- Entry mode：revision-led；用户“确定”授权上一轮锁定的 WebGL 降级实测与自动视觉回归。
- Current gap：现有 fallback 只有无法主动触发的小警告框；3D 控件仍可触发未初始化对象，且没有可重复的桌面/移动/能力降级截图基线。
- Fallback route：`?webgl=off` 是确定性能力夹具，走与真实 WebGL2 探测失败相同的产品路径；不是假装浏览器真的缺少 GPU。
- Readable fallback：保留标题、研究说明、覆盖矩阵、沉淀笔记和来源；空间舞台变为静态飞船结构示意；3D 专用控件禁用并说明原因，提供“重新检测 3D”恢复入口。
- State mapping：`3d-ready` / `fallback-forced` / `fallback-capability`；状态必须同步到舞台、run state、scene state、asset/quality/LOD 读数和控件 disabled。
- Visual regression：建立可重复的 headless Edge/Chromium 测试，覆盖 desktop-study、desktop-fallback、mobile-study、mobile-fallback；固定 seed、暂停动画、稳定动态读数后截图，与仓库内基线进行像素差异比较。
- Test boundary：高保真源库加载已由浏览器主路径验证；自动视觉基线优先覆盖不依赖异步大资产的稳定关键表面，避免把网络/解码波动误判为视觉回归。
- Supported surfaces：1280 × 720 与 375 × 844，深色主题；fallback 的滚动、可读性、禁用态和恢复按钮。
- Autonomy authorization：允许添加测试依赖、脚本、基线图片和查询参数夹具；不引入远程服务或 CI 发布。
- Observable completion：forced fallback 可真实运行且无控制台错误；恢复按钮回到 3D；桌面/移动无溢出；`npm run test:visual` 可启动临时服务器、生成 current/diff、比较三个基线并以退出码报告；build 和浏览器主路径通过。

## 本轮继续优化（2026-08-06 · source hull geometry LOD）

- Entry mode：revision-led；用户再次授权“继续”，承接上一轮确定的几何 LOD 优先级。
- Representative baseline：1280 × 720、Auto/Detail、固定 seed、高保真外部 hero；约 240 FPS / 33 draws / 150k tris。
- Asset representation：保留上游 `buildHull` 作为近景 FULL；新增一个只保留长轴、锤头、驾驶舱、散热翼和双引擎的程序化远景 PROXY，不对源库几何做破坏性修改。
- Switching policy：仅高保真外部启用；镜头距离 > 12.5 个场景单位进入 PROXY，< 10.8 恢复 FULL，中间区保持当前级别，防止阈值附近闪烁；不把 Demo 比例伪称为真实米制。
- State/feedback：页面显示当前 FULL/PROXY、镜头距离和两级三角形预算；轻量模式与驾驶舱显示明确的 N/A/INTERIOR，而不是伪造 LOD。
- Visual constraint：远景代理必须保留可辨识朝向与功能轮廓；扫描光束、目标标记、导览和折跃不得因 LOD 消失。
- Performance boundary：降低远景几何与绘制成本，不额外下载资产；不把 LOD 与 DPR 画质档混为一谈。
- Supported surfaces：1280 × 720 桌面与 375 × 844 手机；自动切换和用户缩放路径。
- Observable completion：近/远切换真实改变 renderer triangles；双阈值状态可见且不抖动；高保真外部近景仍是源库资产，远景代理轮廓可读；扫描/导览/重生成兼容；移动端无溢出；build 与浏览器日志通过。

## 本轮继续优化（2026-08-06 · adaptive quality and loading feedback）

- Entry mode：revision-led；用户再次授权“继续”，沿上一轮明确的下一优先级实施。
- 当前基线：默认轻量外部约 202 FPS / 82 draws / 1.35x；高保真资产已经按需分块，但加载只显示笼统文案，分辨率仍固定为 1.35x。
- Primary journey：默认自动画质 → 主动选择高保真 → 看见模块/资产真实完成进度 → 进入源库模式 → 观察实际像素比与画质等级；失败时保持轻量版并可重试。
- Control model：提供 Auto / Detail / Eco 三种语义按钮；Auto 根据持续帧率和视口选择明确、可逆的 DPR 档位，手动档不会被自动策略覆盖。
- State mapping：idle、module-loading、asset-loading、ready、error/retry；加载状态必须同时体现在文案、进度条、disabled 控件和 aria 属性。
- Performance boundary：先降低像素密度，不牺牲扫描反馈、任务状态、交互可达性或源库资产身份；采用滞回和冷却，避免频繁跳档。
- Supported surfaces：1280px 桌面与 375 × 844 手机；深色主题；鼠标、触控目标与键盘语义路径。
- Autonomy authorization：用户“继续”授权当前可逆优化，不扩展到完整飞行、着陆或新后端。
- Observable completion：三档切换会改变真实 renderer DPR；Auto 状态与原因可见；高保真加载显示单调递增的真实资源完成数；失败保留轻量版并允许重试；原有双视角、扫描、导览与移动端布局不回退；build 和浏览器验证通过。

## 本轮继续优化（2026-08-06 · source fidelity comparison）

- Entry mode：revision-led；用户确认按推荐继续。
- Desired first impression：先看到一艘可读的调查船，再能明确比较“轻量提炼”与“源库高保真”的资产、成本和适用场景。
- Asset route：默认 L1/L2 程序化资产；用户主动切换后按需加载源库程序化船体，以及 11 个、合计约 3.79MiB 的 Draco GLB / WebP 内舱资产候选；4 张无关地表纹理不进入 Demo。
- Provenance：源库为 MIT；直接复用的源码和资产必须保留版权与许可说明，页面展示来源和载入边界。
- Primary journey：打开页面 → 观察轻量版 → 切换源库高保真 → 对比外部/驾驶舱 → 查看覆盖矩阵 → 继续扫描、折跃或导览。
- State mapping：study、source-loading、source-ready、source-error；这些状态不能破坏 existing external/cockpit/scanning/folding/tour 状态。
- Performance boundary：默认首屏不得请求高保真资产；高保真模式加载失败时继续保留轻量版，并提供明确恢复方式。
- 新验收：两种资产模式可切换且状态可见；源库模式外部确实使用上游 `buildHull`，内部确实使用 Draco GLB 与烘焙纹理；覆盖矩阵诚实区分“已接入 / 概念演示 / 尚未接入”；桌面与 375px 可达；build 和浏览器主路径通过。

## 本轮继续优化（2026-08-06 · guided tour）

- Entry mode：revision-led；用户再次明确授权“继续”。
- 当前证据：手动能力已经完整，但第一次进入页面仍需用户自己推断轮廓、材料、驾驶舱、扫描和相对原点之间的顺序。
- 最小连贯改动：新增约 20 秒的可播放导览，让镜头、视角、扫描、折跃、步骤文字和进度共用同一条状态链。
- 手动优先：任何视角、原则、种子、任务按钮、键盘切换或镜头拖动都会立即中断导览并交还控制权；导览结束后保留最终调查状态。
- 说明沉淀：页面需要明确告诉用户导览展示什么、如何接管，以及它把哪些原库能力串成了可复用的方法。
- 新验收：导览可播放、可中断、可重播；步骤状态与场景一致；结束时完成扫描和相对原点重定位；约 830px 应用视口与 375px 手机无新增横向溢出或控件遮挡。

## 本轮继续优化（2026-08-06）

- Entry mode：revision-led；用户明确授权“继续”。
- 当前证据：外部船体已经可辨认，但场景反馈仍主要集中在目标环和文字；四条设计原则只是静态标签，尚未成为可探索内容。
- 最小连贯改动：增加船到目标的扫描光束、目标遥测、驾驶舱扫描线；把四条设计原则改为可点击的观察入口，并为外部飞船使用稳定的局部坐标镜头预设。
- 保留：双视角、固定 seed、扫描、折跃、相对原点、说明层、窄屏布局和性能指标。
- 资产边界：继续保持 L1/L2 程序化原型，不声称达到上游真实资产的 L3/L4 近景品质。
- 新验收：扫描时空间场景、驾驶舱 HUD、遥测与文字同步；设计原则可用鼠标/键盘触发并产生对应视角或解释；桌面、当前约 830px 宽的应用视口和 390px 手机无横向溢出。

## 本轮目标

把原项目中真正有参考价值的飞船表现纳入当前 Demo：用户既能观察外部巡航船，也能进入驾驶舱继续执行扫描与折跃；页面同时说明当前效果如何生成、怎么操作、从原库学到了什么，以及后续应优先优化什么。

## 已授权范围

- 直接修改现有 `the-long-silence-demo`，不改动上游仓库。
- 保留固定种子、扫描、相对原点、实时性能读数等已验证能力。
- 新增外部巡航 / 内部驾驶舱双视角和页面内研究说明。
- 使用轻量程序化几何表达设计规则，不复制上游 200KB 以上的飞船实现或 2.99MB 室内模型。

## 主要用户与主路径

- 用户：正在判断 The Long Silence 对自己是否有参考意义的开发者或研究者。
- 主路径：打开页面 → 观察飞船外形 → 进入驾驶舱 → 扫描目标 → 折跃/重定位 → 查看证据与方法说明。
- 核心闭环：每个关键操作同时改变场景、状态文字和可观测读数。

## 空间架构

- Scene base：WebGL2 / Three.js，外部宇宙场景持续存在；驾驶舱作为独立前景 3D 层叠加。
- Foreground controls：双视角切换、种子、重生成、扫描、折跃、重置、暂停、说明与指标。
- State mapping：external、cockpit、scanning、scanned、folding、close survey、paused、fallback。
- Mobile transformation：场景保持首屏可操作，控制与知识卡片在下方自然展开；不依赖悬停。
- Fallback：WebGL2 不可用时仍可阅读方法、操作和路线图。

## 视觉与资产方向

- 外形优先：用锤头传感器、分离式引擎、后掠散热翼、背鳍和偏置天线建立可辨识轮廓。
- 材料叙事：骨白压力壳、近黑承力结构、金属连接件、发光玻璃/引擎四类材料互相分工。
- 居住证据：驾驶舱框架、控制台、导航屏和舷窗把“飞船模型”连接到“有人工作的空间”。
- 引擎表现：用双层加色尾焰表达高温核心与冷色外缘，保持轻量并可随状态变化。
- 资产边界：当前仍是 L1/L2 程序化原型；若追求近景与商业级画面，应进入 GLB + 烘焙纹理的资产管线，而不是继续堆镜头滤镜。

## 信息架构

页面必须明确回答四个问题：

1. 当前场景如何从 seed、数据、几何/Shader 和渲染指标生成。
2. 用户按什么顺序操作，键盘和按钮如何对应。
3. 原项目哪些思想值得沉淀，以及本 Demo 如何应用。
4. 后期优化按 P0 资产、P1 反馈、P2 工程化如何推进。

## 验收标准

1. 桌面首屏可看出飞船是视觉主体，并能发现外部/驾驶舱切换。
2. 外部视角能辨认锤头、散热翼、背鳍、双引擎和尾焰；驾驶舱有前景框架、控制台、屏幕与窗外目标。
3. 两种视角均可继续扫描、折跃、重置和暂停；状态文字不矛盾。
4. 同一种子重生成得到相同目标名和系统参数。
5. 页面内可读到“如何生成、如何操作、沉淀价值、后续优化”四类信息。
6. 桌面与 390px 窄屏均无主控件遮挡或不可达；键盘焦点清晰。
7. build 通过、控制台无阻断错误，页面显示 FPS、draw calls、三角形和像素比例。
