# Browser coverage manifest · ship / cockpit revision

## Revision v12 · story-driven First Canto active slice

| Stage | Journey / state | Viewport / boundary | Evidence | Status / next action |
|---|---|---|---|---|
| 1 | 基线：现有任务只说明“失事信标 / 2/2”，缺少世界谜题、行动原因和完成奖励 | Desktop | Source + runtime DOM | pass |
| 2 | 首屏任务简报说明九百世界沉默、Pale Seeker 与 0/7 共鸣器目标 | Desktop + mobile | Screenshot + DOM | pass |
| 4 | ITHIRKA II 扫描 → 异常证据 → 定位 RESONATOR I | Desktop keyboard | `3.49u → 1.85u → TRACE FOUND` | pass |
| 4 | RESONATOR I 调谐 → THE FIRST CANTO 1/7 | Desktop keyboard | `6.58u / 左转 88° → 2.61u / READY → CANTO 1/7` | pass |
| 6 | HUD、按钮、目标遥测、侧栏叙事在所有任务状态一致 | Desktop | State-by-state DOM + final screenshot | pass |
| 7 | 中文长文在 375 × 844 无横向溢出，触控与主要任务仍可达 | Mobile | Full-page screenshot + 375px regression fixture | pass |
| 8 | 高保真船体保持 1/7；WebGL 文本降级可读故事且 3D 控制禁用 | Source + fallback | Screenshot + `23 disabled` | pass |
| 9 | README、页面沉淀说明、browser evidence、build 与视觉回归更新 | Engineering | Files + build + 4 visual PASS | pass |

## Revision v11 · deterministic two-leg survey chain active slice

| Stage | Journey / state | Viewport | Evidence | Status / next action |
|---|---|---|---|---|
| 1 | 当前第一目标扫描后只能清除并重复，没有连续航点 | Desktop | Browser DOM + screenshot | pass |
| 3 | 页面解释第二航点如何生成、如何操作及能力边界 | Desktop + mobile | Page copy + DOM | pass |
| 4 | `追踪第二航点`、实时左右转向提示、最终重跑入口可达 | Keyboard + touch | Semantic controls + interaction | pass |
| 5 | 目标 1 扫描 → 发现 → 追踪 → 转向推进 → 目标 2 扫描 → 2/2 完成 | Desktop keyboard | `83° / 6.62u → 1.79u / 0.02u/s → 2/2 COMPLETE` | pass |
| 6 | discovered、leg-2 approach/stabilize/ready/scanning、mission-complete 与重置一致 | Gameplay states | DOM + scene feedback + rerun | pass |
| 7 | 375 × 844 中第二航点提示、触控与 HUD 无遮挡/溢出 | Mobile portrait | `360 = 360`; `87° → aligned`; `6.58u → 5.94u` | pass |
| 8 | 同 seed 航点稳定；高保真、导览与 fallback 不回退 | 3D + fallback | `6.60u = 6.60u`; SOURCE complete; fallback/recovery; empty errors | pass |
| 9 | README、浏览器证据、视觉基线与 build 更新 | Engineering | Files + 4 visual PASS + build | pass |

## Revision v10 · 3D orbital visual layer active slice

| Stage | Journey / state | Viewport | Evidence | Status / next action |
|---|---|---|---|---|
| 1 | 所有轨道与行星固定 `Y=0` 的现有基线 | Desktop | Source + current browser baseline | pass |
| 2 | 非任务轨道形成可见三维纵深，飞船和目标仍是视觉中心 | 1280 × 720 | Screenshot; `−17° / +19° / −10° / +14°` | pass |
| 3 | 页面解释玩法平面与视觉轨道层的边界 | Desktop + mobile | DOM + page copy | pass |
| 5 | 驾驶接近、制动、扫描完成不受背景倾角影响 | Desktop keyboard | `2.04u / 0.00u/s / COMPLETE / 100%` | pass |
| 7 | 375 × 844 中轨道不遮挡触控、视角和任务 HUD | Mobile portrait | `360px = 360px`; touch `0.21u/s / 3.30u` | pass |
| 8 | 相同 seed 倾角稳定；性能与 fallback 无回退 | 3D + fallback | Regenerate match; readable fallback; empty error log | pass |
| 9 | README、浏览器证据、视觉基线与 build 更新 | Engineering | Files + 4 visual baselines + build | pass |

## Revision v9 · minimal flight and survey loop active slice

| Stage | Journey / state | Viewport | Evidence | Status / next action |
|---|---|---|---|---|
| 1 | 现有页面不可驾驶且扫描不校验距离/速度的基线 | 1280 × 720 | Browser DOM | pass |
| 3 | 距离、速度、任务目标与操作说明支持新的主路径 | Desktop + mobile | Screenshot + DOM | pass |
| 4 | `W/S/A/D/Space`、触控持续按压、取景重置可达且状态可见 | Keyboard + touch | Focusable canvas + interaction evidence | pass |
| 5 | 出生点 → 驾驶接近 → 制动 → 合法扫描 → 完成 | Desktop keyboard | `3.49u → 2.22u`; READY → 100% COMPLETE | pass |
| 6 | 远距/高速禁用、碰撞回推、扫描中锁定、完成与重置一致 | Gameplay states | DOM + collision/scan interactions | pass |
| 7 | 主路径在 375 × 844 竖屏触控可完成且无遮挡/溢出 | Mobile portrait | Touch delta + screenshot | pass |
| 8 | 现有画质、LOD 与 WebGL fallback 不因驾驶闭环回退 | 3D + fallback | Source exterior/cockpit + fallback DOM/logs | pass |
| 9 | 页面沉淀说明、README、浏览器证据、视觉基线与 build 更新 | Engineering | Files + 4 visual PASS + build | pass |

## Revision v8 · WebGL fallback and visual regression active slice

| Stage | Journey / state | Viewport | Evidence | Status / next action |
|---|---|---|---|---|
| 1 | 现有 3D 默认路径作为未改基线 | 1280 × 720 | Browser DOM + screenshot | pass |
| 2 | fallback 舞台仍有清晰视觉中心，不是空黑画布 | Desktop + mobile | Screenshots | pass |
| 4 | 3D 控件禁用原因可见，重新检测入口可达 | Fallback | 18 disabled controls + recovery button | pass |
| 5 | `?webgl=off` 与真实探测失败复用同一路径，恢复后回到 3D | Desktop | fallback → same-tab 3D + empty logs | pass |
| 7 | fallback 在 375 × 844 可读、可滚动且无横向溢出 | Mobile | Screenshot; body/html 360px | pass |
| 8 | fallback 不创建 renderer、不请求高保真资产、无运行错误 | Desktop + mobile | 0 draws / 0k / no 3D assets; empty logs | pass |
| 9 | 自动视觉回归覆盖 desktop/mobile × study/fallback | Engineering | 4 baselines; 4 PASS at 0.000% | pass |
| 9 | README、页面覆盖说明、browser evidence、build 更新 | Engineering | Files + build | pass |

## Revision v7 · source hull geometry LOD active slice

| Stage | Journey / state | Viewport | Evidence | Status / next action |
|---|---|---|---|---|
| 1 | 固定 seed、高保真外部 hero 几何基线 | 1280 × 720 | Runtime metrics | pass · 240 FPS / 33 draws / 150k tris |
| 2 | PROXY 在远景保留长轴、锤头、散热翼与双引擎轮廓 | Desktop + mobile | Screenshots at 12.9u | pass |
| 4 | LOD 状态、镜头距离与预算可观察，不新增主要控制负担 | Desktop + mobile | DOM + screenshot | pass |
| 5 | 镜头远近跨越双阈值时 FULL/PROXY 正确切换，无阈值抖动 | Desktop | 12.9 proxy → 11.5 proxy → 9.3 full | pass |
| 6 | 扫描、导览、折跃、重生成与资产切换保持一致 | Source external/cockpit | Interaction + metrics | pass |
| 7 | 375 × 844 下 LOD 说明可读且无横向溢出 | Mobile | Screenshot + overflow false | pass |
| 8 | PROXY 显著降低三角形和 draws，不增加下载 | Desktop + mobile | 33/150k → 15/13k; 12/7k mobile | pass |
| 9 | 页面说明、README、browser evidence、coverage 与 build 更新 | Engineering | Files + build | pass |

## Revision v6 · adaptive quality and loading feedback active slice

| Stage | Journey / state | Viewport | Evidence | Status / next action |
|---|---|---|---|---|
| 1 | 当前默认轻量模式作为性能与布局基线 | 1280 × 720 | DOM + runtime metrics | pass · 202 FPS / 82 draws / 1.35x |
| 3 | 画质控制与加载进度并入资产区，不增加新的竞争面板 | Desktop + mobile | Screenshots + DOM | pass |
| 4 | Auto / Detail / Eco 可达，pressed 状态准确 | Desktop + mobile | Interaction + DOM; 1.35 → 0.85 → 1.35 | pass |
| 6 | module/assets/ready/error/retry 状态可理解，进度单调递增 | Desktop | 82% → 100%; actual failure + recovery | pass |
| 7 | 375 × 844 下控制不溢出，标签不截断 | Mobile | Screenshot; body/html 360px | pass |
| 8 | 画质档真实改变 DPR；Auto 有阈值、滞回与冷却；主交互不受影响 | Desktop + mobile | Runtime metrics; source cockpit scan at Eco | pass |
| 9 | 页面覆盖说明、README、browser evidence 与 build 更新 | Engineering | Files + build | pass |

## Revision v5 · source fidelity comparison active slice

| Stage | Journey / state | Viewport | Evidence | Status / next action |
|---|---|---|---|---|
| 1 | 当前默认轻量模式、双视角与导览作为未改基线 | 1280px desktop | Screenshot + DOM; `L1/L2 · READY` | pass |
| 2 | 资产对照入口可发现，但不抢夺飞船主视觉 | 1280px + 375px | Screenshot | pass |
| 3 | 页面覆盖矩阵清楚区分已接入、按需接入、概念演示和未接入 | Desktop + mobile | DOM + screenshot | pass |
| 4 | 轻量 / 源库高保真切换可达，loading/ready/error 明确 | Desktop + mobile | Interaction + DOM | pass |
| 5 | 高保真外部与内舱都使用真实源库实现，并能切回轻量版 | External + cockpit | Runtime interaction + screenshots | pass |
| 6 | 高保真模式继续支持扫描、折跃、重置、重生成和导览接管 | Desktop | Interaction + DOM | pass |
| 7 | 375px 下资产切换、覆盖矩阵和原有主路径无横向溢出 | 375 × 844 | `body/html scrollWidth = 360`, screenshot | pass |
| 8 | 默认首屏不触发高保真导入；主动切换后成本与加载状态可观察 | Desktop + mobile | Dynamic import boundary + status + runtime metrics | pass |
| 9 | MIT notice、README、browser evidence、build 更新 | Engineering | Files + build | pass |

## Revision v4 · guided tour active slice

| Stage | Journey / state | Viewport | Evidence | Status / next action |
|---|---|---|---|---|
| 2 | 导览入口比种子和单步任务更先被发现，但不压过场景主体 | ~830px + 375px | Screenshot | pass |
| 4 | 播放后按轮廓、材料、居住、扫描、驾驶舱、相对原点顺序推进 | Desktop/tablet | Interaction + DOM + screenshot | pass |
| 4 | 任一手动操作或镜头拖动可中断，之后可以从头重播 | Desktop | View-button click + real canvas drag + DOM | pass |
| 6 | 导览步骤文字、进度、场景 caption、run state 与真实任务状态一致 | Desktop/tablet | Interaction + DOM | pass |
| 7 | 375px 下导览入口、状态和原有任务按钮均可达，无横向溢出 | 375px | Screenshot; body client/scroll 360/360 | pass |
| 8 | 导览期间 FPS 与 draw calls 无明显回退 | Desktop | 238–240 FPS; 74–85 draws through guided states | pass |
| 9 | build、README、browser evidence 更新 | Engineering | Build + files | pass |

## Revision v3 · active slice

| Stage | Journey / state | Viewport | Evidence | Status / next action |
|---|---|---|---|---|
| 2 | 外部三分之四镜头稳定呈现船体长轴与目标关系 | 1265px + ~830px | Screenshot | pass |
| 4 | 四条设计原则成为可触发的观察入口 | Desktop/tablet + keyboard | Interaction + DOM | pass |
| 6 | 扫描光束、目标遥测、驾驶舱扫描线与状态同步 | External + cockpit | Interaction + screenshot | pass |
| 7 | 新前景控件在 390px 不遮挡主路径 | 375px observed | Screenshot + overflow | pass |
| 8 | 新视觉反馈不产生明显帧率或 draw-call 回退 | Desktop | ~240 FPS; 82 → 87 draws during scan | pass |
| 9 | build、README、browser evidence 更新 | Engineering | Build + files | pass |

| Stage | Journey / state | Viewport | Evidence | Status |
|---|---|---|---|---|
| 1 | 现有固定种子、扫描、折跃、指标基线 | Desktop | Prior + current browser evidence | pass |
| 2 | 外部巡航首屏：飞船轮廓成为视觉主体 | 1265px | Screenshot + DOM | pass |
| 3 | 页面说明：生成、操作、沉淀、路线图可读 | 1265px | DOM + expanded details | pass |
| 4 | 外部 / 驾驶舱切换可发现、状态一致 | 1265px | Interaction + screenshot | pass |
| 5 | 驾驶舱内执行扫描并看到反馈 | 1265px | Interaction + screenshot | pass |
| 5 | 驾驶舱内执行折跃并可恢复 | 1265px | Interaction + DOM | pass |
| 6 | 扫描完成、暂停、重置状态反馈 | 1265px | Interaction + DOM | pass |
| 7 | 窄屏场景、视角切换、知识内容与主控件可达 | 375px observed | Screenshot + DOM | pass |
| 7 | 键盘 V 切换、焦点样式、语义按钮 | Desktop | Keyboard + computed style + DOM | pass |
| 8 | 高成本视觉性能、draw/tris/pixel ratio | Desktop | Runtime metrics | pass |
| 8 | reduced-motion | Capability preference | Source path; preference simulation unavailable | defer |
| 8 | WebGL fallback | Capability boundary | Source path; WebGL2-off route unavailable | defer |
| 9 | build、README 与研究记录 | Engineering | Build + files | pass |

Reduced-motion retest trigger：浏览器提供媒体偏好模拟或系统偏好可切换时复查动画缩短和漂浮移除。

WebGL fallback retest trigger：在禁用 WebGL2 或 GPU 黑名单环境打开页面，确认文字说明仍可阅读。
