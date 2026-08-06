import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const $ = (id) => document.getElementById(id);
const runtimeParams = new URLSearchParams(window.location.search);
const forceWebglFallback = runtimeParams.get('webgl') === 'off';
const visualQaMode = runtimeParams.get('qa') === '1';

const ui = {
  canvas: $('scene'), fallback: $('fallback'), fallbackReason: $('fallbackReason'), fallbackRetry: $('fallbackRetry'), seedInput: $('seedInput'),
  regenerate: $('regenerateButton'), scan: $('scanButton'), fold: $('foldButton'),
  reset: $('resetButton'), pause: $('pauseButton'), statsToggle: $('statsToggle'),
  statsGrid: $('statsGrid'), mode: $('modeBadge'), runState: $('runState'),
  caption: $('sceneCaption'), scanValue: $('scanValue'), scanFill: $('scanFill'),
  marker: $('targetMarker'), targetName: $('targetName'), cockpitHud: $('cockpitHud'),
  telemetry: $('targetTelemetry'), temp: $('tempValue'), gravity: $('gravityValue'), atmosphere: $('atmosphereValue'),
  telemetryLabelA: $('telemetryLabelA'), telemetryLabelB: $('telemetryLabelB'), telemetryLabelC: $('telemetryLabelC'),
  storyPanel: $('storyPanel'), storyProgress: $('storyProgress'), storyBody: $('storyBody'),
  storyRewardLabel: $('storyRewardLabel'), storyRewardBody: $('storyRewardBody'),
  tour: $('tourButton'), tourLabel: $('tourButtonLabel'), tourStep: $('tourStep'), tourFill: $('tourFill'), tourTime: $('tourTime'),
  assetState: $('assetState'), assetHelp: $('assetHelp'), assetLevel: $('assetLevelValue'),
  assetProgress: $('assetLoadProgress'), assetProgressLabel: $('assetProgressLabel'),
  assetProgressValue: $('assetProgressValue'), assetProgressFill: $('assetProgressFill'),
  qualityState: $('qualityState'), qualityHelp: $('qualityHelp'),
  lodHelp: $('lodHelp'), lodState: $('lodStateValue'),
  lensBody: $('lensBody'), lensProof: $('lensProof'), fps: $('fpsValue'),
  draws: $('drawValue'), tris: $('triValue'), pixel: $('pixelValue'),
  world: $('worldValue'), origin: $('originValue'), sceneState: $('sceneStateValue'),
  orbitPlanes: $('orbitPlanesValue'),
  flightSpeed: $('flightSpeed'), flightDistance: $('flightDistance'), targetDistance: $('targetDistance'),
  scanGate: $('scanGate'), missionPrompt: $('missionPrompt'), missionState: $('missionState'),
  missionDetail: $('missionDetail'), cameraReset: $('cameraResetButton'),
};

const PRINCIPLES = {
  silhouette: {
    body: '先让远距离轮廓说明朝向和功能：锤头传感器、背鳍、后掠散热翼与分离引擎都必须在低细节下仍可辨认。',
    proof: '轮廓证据：长轴 · 锤头 · V 形散热翼 · 双引擎',
    caption: '轮廓观察：先辨认朝向和功能，再讨论表面细节',
    view: 'external', preset: 'silhouette',
  },
  material: {
    body: '骨白压力壳、近黑承力结构、金属连接件和发光玻璃承担不同语义；价值明暗差比统一的“科幻灰”更能说明结构。',
    proof: '材料证据：bone shell · dark structure · alloy · emissive glass',
    caption: '材料观察：颜色和反光不是装饰，而是在解释部件职责',
    view: 'external', preset: 'material',
  },
  habitat: {
    body: '发光座舱必须连接到一个可进入的工作空间。内部框架、控制台、导航仪表和同一个窗外目标，共同建立尺度与生活感。',
    proof: '居住证据：外部座舱光 ↔ 内部仪表 ↔ 同一目标',
    caption: '居住观察：外部发光座舱与内部工作空间互相证明',
    view: 'cockpit', preset: null,
  },
  feedback: {
    body: '扫描不应只改变一个进度条：空间光束、目标遥测、驾驶舱扫描线、目标环和文字状态需要同步，用户才能理解因果关系。',
    proof: '反馈证据：beam · telemetry · HUD sweep · state text',
    caption: '反馈观察：点击“扫描目标”，查看空间与界面同步响应',
    view: 'external', preset: 'feedback',
  },
};

const LENS = {
  ship: {
    body: '外形用大轮廓区分朝向和功能，内部用框架、控制台和窗外目标证明“这里有人工作”；两者共享同一任务状态。',
    proof: '当前证据：外部 / 驾驶舱双视角 · 同一目标状态',
  },
  generate: {
    body: '固定 seed 先生成恒星与行星数据，也派生首次扫描后出现的共鸣器位置。轨道、几何、颜色、路线与信号参数都可重复，叙事线索因此也能被稳定测试和迭代。',
    proof: '当前证据：seed 20260725 · deterministic mulberry32',
  },
  scale: {
    body: '世界坐标可以很大，但渲染坐标始终围绕飞船或目标重定位。玩法保持单一 XZ 平面，非任务轨道使用 seed 倾角建立三维纵深，二者互不混淆。',
    proof: '当前证据：玩法平面 0° · 背景轨道分层 · WORLD / RENDER ORIGIN 分离',
  },
  measure: {
    body: 'FPS、draw calls、三角形和像素比例直接来自当前 renderer。效果是否值得保留，要看画面收益与运行成本是否匹配。',
    proof: '当前证据：renderer.info.render + capped pixel ratio',
  },
};

const TOUR_DURATION = 19.5;
const TOUR_STEPS = [
  { at: 0, label: '01 / 07 · 先读懂远距离轮廓', action: () => {
    focusPrinciple('silhouette');
    setOperation('guided', '导览 1/7：先用长轴、锤头、散热翼和双引擎确认飞船朝向', 'GUIDED');
  } },
  { at: 3, label: '02 / 07 · 用材料解释部件职责', action: () => {
    focusPrinciple('material');
    setOperation('guided', '导览 2/7：近看压力壳、承力结构、连接件与发光部件的分工', 'GUIDED');
  } },
  { at: 6, label: '03 / 07 · 进入有人工作的空间', action: () => {
    focusPrinciple('habitat');
    setOperation('guided', '导览 3/7：驾驶舱把外部座舱光连接到真实的工作尺度', 'GUIDED');
  } },
  { at: 9.2, label: '04 / 07 · 观察空间扫描反馈', action: () => {
    focusPrinciple('feedback');
    enterSurveyCorridor();
    startScan({ guided: true });
  } },
  { at: 11.3, label: '05 / 07 · 同一进度进入驾驶舱', action: () => {
    setViewMode('cockpit');
    setOperation('scanning', '导览 5/7：同一份扫描进度同时驱动 HUD、目标环和遥测', 'SCANNING');
  } },
  { at: 13.8, label: '06 / 07 · 折跃并重设渲染原点', action: () => startFold() },
  { at: 16, label: '07 / 07 · 回看近距离调查结果', action: () => {
    setViewMode('external');
    setOperation('close-survey', '导览 7/7：世界坐标保持巨大，GPU 只处理目标附近的局部坐标', 'RECENTERED');
  } },
];

const state = {
  seed: 20260725,
  view: 'external',
  operation: 'live',
  paused: false,
  scanActive: false,
  scanProgress: 0,
  scanComplete: false,
  missionLeg: 0,
  missionComplete: false,
  foldActive: false,
  folded: false,
  foldProgress: 0,
  cameraMove: null,
  originKm: 0,
  worldKm: 1240000,
  tourActive: false,
  tourElapsed: 0,
  tourStepIndex: -1,
  tourComplete: false,
  assetMode: 'study',
  assetLoading: false,
  assetProgress: 0,
  qualityMode: 'auto',
  qualityTier: window.innerWidth <= 700 ? 'balanced' : 'detail',
  qualityChangedAt: 0,
  qualityLowSamples: 0,
  qualityHighSamples: 0,
  qualityViewportMobile: window.innerWidth <= 700,
  lodLevel: 'study',
  lodLastUiAt: 0,
  speed: 0,
  scanReady: false,
  flightPhase: 'approach',
  flightFollowUntil: 0,
  collisionNoticeUntil: 0,
};

let renderer;
let scene;
let interiorScene;
let camera;
let interiorCamera;
let controls;
let systemRoot;
let starfield;
let targetPlanet;
let targetRing;
let targetAtmosphere;
let missionTargets = [];
let ship;
let cockpit;
let studyCockpit;
let sourceInterior;
let sourceInteriorData;
let sourceHullBuilder;
let sourceMergeGeometries;
let sourceAssetPromise;
let interiorEnvironmentRT;
let warpLines;
let scanBeam;
let currentSystem;
let currentLens = 'ship';
let currentPrinciple = 'silhouette';
let lastTime = performance.now();
let elapsed = 0;
let fpsFrames = 0;
let fpsTime = 0;
let foldStartCamera;
let foldStartTarget;
let foldEndCamera;
let foldEndTarget;
let savedExternalCamera = null;
let shipSpawnPosition = null;
let shipSpawnQuaternion = null;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FLIGHT = {
  maxForward: 0.95,
  maxReverse: 0.45,
  acceleration: 0.78,
  reverseAcceleration: 0.52,
  coastDrag: 0.40,
  brakeDrag: 4.2,
  turnRate: 1.18,
  scanDistance: 2.65,
  scanSpeed: 0.30,
  collisionPadding: 0.42,
};
const flightInput = { thrust: false, reverse: false, left: false, right: false, brake: false };
const keyboardInputExpiresAt = { thrust: 0, reverse: 0, left: 0, right: 0, brake: 0 };
const QUALITY_TIERS = {
  eco: { dpr: 0.85, label: 'ECO' },
  balanced: { dpr: 1.10, label: 'BALANCED' },
  detail: { dpr: 1.35, label: 'DETAIL' },
};

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function safeSeed(value) {
  const parsed = Number.parseInt(String(value).replace(/[^0-9-]/g, ''), 10);
  return Number.isFinite(parsed) ? Math.abs(parsed) >>> 0 : 20260725;
}

function enterFallbackMode(kind = 'capability') {
  document.documentElement.dataset.renderMode = 'fallback';
  document.querySelector('.stage-shell')?.classList.add('is-fallback');
  ui.canvas.setAttribute('aria-hidden', 'true');
  ui.fallback.classList.remove('hidden');
  ui.fallbackReason.textContent = kind === 'forced'
    ? '这是可重复验证的 WebGL 降级夹具。研究说明、来源与后续路线仍可阅读；3D 专用操作已经安全停用。'
    : kind === 'runtime'
      ? '3D 渲染器初始化失败。研究说明、来源与后续路线仍可阅读；可重新检测或换到支持 WebGL2 的浏览器。'
      : '当前浏览器没有启用 WebGL2。研究说明、来源与后续路线仍可阅读；3D 专用操作已经安全停用。';
  const disabledSelectors = [
    '[data-view]', '[data-principle]', '[data-asset-mode]', '[data-quality-mode]',
    '#tourButton', '#regenerateButton', '#scanButton', '#foldButton', '#resetButton', '#pauseButton', '#seedInput',
    '#cameraResetButton', '[data-flight-control]',
  ];
  document.querySelectorAll(disabledSelectors.join(',')).forEach((control) => {
    control.disabled = true;
    control.setAttribute('aria-disabled', 'true');
    control.title = '需要 WebGL2 3D 增强模式';
  });
  const statusDot = document.querySelector('.status-dot');
  statusDot?.classList.add('is-fallback');
  statusDot?.setAttribute('aria-label', '文本降级模式运行中');
  ui.mode.textContent = 'TEXT MODE';
  ui.runState.textContent = 'TEXT MODE';
  ui.caption.textContent = '静态结构示意：3D 不可用时仍保留研究结论与操作方法';
  ui.sceneState.textContent = 'fallback / readable';
  ui.assetState.textContent = 'TEXT ONLY';
  ui.assetHelp.textContent = '高保真资产不会在降级模式中请求；来源、成本与接入边界仍可阅读。';
  ui.assetLevel.textContent = 'TEXT · no 3D assets';
  ui.qualityState.textContent = 'UNAVAILABLE';
  ui.qualityHelp.textContent = '像素密度与几何 LOD 只适用于 WebGL2 增强画面。';
  ui.lodState.textContent = 'FALLBACK · N/A';
  ui.lodHelp.textContent = '静态示意只表达长轴、锤头、散热翼与双引擎等设计语法。';
  ui.orbitPlanes.textContent = 'TEXT · gameplay 0° / visual layered';
  ui.missionState.textContent = 'UNAVAILABLE';
  ui.missionDetail.textContent = '驾驶与扫描闭环需要 WebGL2；研究结论和操作规则仍可继续阅读。';
  ui.flightSpeed.textContent = '--';
  ui.flightDistance.textContent = '--';
  ui.scanGate.textContent = 'N/A';
  ui.fps.textContent = '--';
  ui.draws.textContent = '0';
  ui.tris.textContent = '0k';
  ui.pixel.textContent = '--';
}

function generateSystem(seed) {
  const rnd = mulberry32(seed);
  const starTypes = [
    { name: 'G · 5774 K', color: 0xffd7a0 },
    { name: 'K · 4600 K', color: 0xffa15d },
    { name: 'F · 6750 K', color: 0xfff0d2 },
  ];
  const planetNames = ['ITHIRKA II', 'COLD HARVEST', 'THOUSANDTH NAME', 'ITHIRKA IIIa', 'SABLE V'];
  const palette = [[0.12, 0.36, 0.56], [0.44, 0.26, 0.13], [0.20, 0.46, 0.32], [0.35, 0.42, 0.50]];
  const planets = planetNames.map((name, index) => {
    const orbitRnd = mulberry32((seed ^ Math.imul(index + 1, 0x9E3779B1)) >>> 0);
    const inclinationSign = index % 2 === 0 ? 1 : -1;
    return {
      name,
      radius: 0.62 + rnd() * 0.38,
      orbit: 4.1 + index * 1.68 + rnd() * 0.35,
      angle: rnd() * Math.PI * 2,
      speed: 0.025 + rnd() * 0.018,
      color: palette[Math.floor(rnd() * palette.length)],
      seed: rnd() * 100,
      inclination: index === 0 ? 0 : inclinationSign * (0.12 + orbitRnd() * 0.23),
      ascendingNode: index === 0 ? 0 : orbitRnd() * Math.PI * 2,
    };
  });
  planets.forEach((planet) => {
    const fraction = planet.seed - Math.floor(planet.seed);
    planet.tempK = Math.round(155 + fraction * 245);
    planet.gravity = (0.42 + ((planet.seed * 1.73) % 1) * 1.18).toFixed(2);
    planet.atmosphere = ['THIN N₂', 'DENSE CO₂', 'TRACE H₂O', 'NONE'][Math.floor(((planet.seed * 3.11) % 1) * 4)];
  });
  const waypointRnd = mulberry32((seed ^ 0xA511E9B3) >>> 0);
  const primary = planets[0];
  const primaryX = Math.cos(primary.angle) * primary.orbit;
  const primaryZ = Math.sin(primary.angle) * primary.orbit;
  const routeSign = waypointRnd() > 0.5 ? 1 : -1;
  const routeAngle = primary.angle + routeSign * (1.05 + waypointRnd() * 0.42);
  const routeDistance = 5.7 + waypointRnd() * 0.9;
  const waypoint = {
    name: 'RESONATOR I',
    radius: 0.44,
    frequency: `${(10.8 + waypointRnd() * 0.8).toFixed(2)} Hz`,
    age: '40 kyr',
    status: 'WAITING',
    x: primaryX + Math.cos(routeAngle) * routeDistance,
    z: primaryZ + Math.sin(routeAngle) * routeDistance,
    routeAngle,
    routeDistance,
  };
  return { seed, systemName: `ITHIRKA · ${String(seed).slice(-2)}`, star: starTypes[Math.floor(rnd() * starTypes.length)], planets, waypoint, targetIndex: 0 };
}

function makeStarfield(seed) {
  const rnd = mulberry32(seed ^ 0x4F1BBCDC);
  const count = 1100;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const theta = rnd() * Math.PI * 2;
    const phi = Math.acos(2 * rnd() - 1);
    const radius = 38 + rnd() * 65;
    const s = Math.sin(phi);
    positions[i * 3] = Math.cos(theta) * s * radius;
    positions[i * 3 + 1] = Math.cos(phi) * radius;
    positions[i * 3 + 2] = Math.sin(theta) * s * radius;
    const warm = rnd();
    colors[i * 3] = 0.55 + warm * 0.45;
    colors[i * 3 + 1] = 0.74 + warm * 0.24;
    colors[i * 3 + 2] = 0.96 + rnd() * 0.04;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return new THREE.Points(geometry, new THREE.PointsMaterial({
    size: 0.12, sizeAttenuation: true, vertexColors: true, transparent: true, opacity: 0.88, depthWrite: false,
  }));
}

const planetVertex = /* glsl */ `
  varying vec3 vLocal;
  varying vec3 vViewNormal;
  void main() {
    vLocal = normalize(position);
    vViewNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const planetFragment = /* glsl */ `
  precision highp float;
  uniform float uSeed;
  uniform vec3 uLight;
  uniform vec3 uTint;
  varying vec3 vLocal;
  varying vec3 vViewNormal;
  float hash13(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.yzx + 33.33);
    return fract((p.x + p.y) * p.z);
  }
  float noise3(vec3 p) {
    vec3 i = floor(p); vec3 f = fract(p); f = f * f * (3.0 - 2.0 * f);
    float n000 = hash13(i); float n100 = hash13(i + vec3(1,0,0));
    float n010 = hash13(i + vec3(0,1,0)); float n110 = hash13(i + vec3(1,1,0));
    float n001 = hash13(i + vec3(0,0,1)); float n101 = hash13(i + vec3(1,0,1));
    float n011 = hash13(i + vec3(0,1,1)); float n111 = hash13(i + vec3(1,1,1));
    return mix(mix(mix(n000,n100,f.x),mix(n010,n110,f.x),f.y),mix(mix(n001,n101,f.x),mix(n011,n111,f.x),f.y),f.z);
  }
  void main() {
    vec3 n = normalize(vLocal);
    float continents = noise3(n * 2.7 + uSeed);
    float detail = noise3(n * 8.0 - uSeed * 0.31);
    float water = smoothstep(0.40, 0.56, continents + detail * 0.11);
    float latitude = abs(n.y);
    vec3 ocean = mix(vec3(0.015,0.08,0.16), vec3(0.04,0.33,0.50), detail);
    vec3 land = mix(vec3(0.22,0.18,0.13), uTint, continents);
    land = mix(land, vec3(0.52,0.50,0.43), smoothstep(0.62,0.90,detail));
    vec3 base = mix(ocean, land, water);
    base = mix(base, vec3(0.72,0.78,0.76), smoothstep(0.73,0.94,latitude) * 0.68);
    float city = smoothstep(0.78,0.93,noise3(n * 18.0 + uSeed * 1.7)) * (1.0-water) * (1.0-latitude);
    float light = max(dot(normalize(vViewNormal), normalize(uLight)), 0.0);
    float rim = pow(1.0 - max(dot(normalize(vViewNormal), vec3(0,0,1)), 0.0), 2.6);
    vec3 color = base * (0.14 + light * 0.98);
    color += vec3(1.0,0.54,0.20) * city * 0.35;
    color += vec3(0.08,0.34,0.52) * rim * 0.32;
    gl_FragColor = vec4(color, 1.0);
  }
`;

const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`;

const atmosphereFragment = /* glsl */ `
  precision highp float;
  uniform vec3 uColor; varying vec3 vNormal;
  void main() {
    float rim = pow(1.0 - abs(dot(normalize(vNormal), vec3(0,0,1))), 2.0);
    gl_FragColor = vec4(uColor, rim * 0.48);
  }
`;

function makePlanetMaterial(planet) {
  return new THREE.ShaderMaterial({
    vertexShader: planetVertex,
    fragmentShader: planetFragment,
    uniforms: {
      uSeed: { value: planet.seed },
      uLight: { value: new THREE.Vector3(-0.35, 0.42, 1.0) },
      uTint: { value: new THREE.Color(...planet.color) },
    },
  });
}

function makeOrbit(radius, color = 0x1b5269) {
  const points = [];
  for (let i = 0; i < 128; i += 1) {
    const angle = (i / 128) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }
  return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.36 }));
}

function makeSurveyWaypoint() {
  const root = new THREE.Group();
  root.name = 'survey-waypoint-resonator';
  const dark = new THREE.MeshStandardMaterial({ color: 0x14232b, metalness: 0.82, roughness: 0.42 });
  const alloy = new THREE.MeshStandardMaterial({ color: 0x8fa8ad, metalness: 0.88, roughness: 0.28 });
  const signal = new THREE.MeshBasicMaterial({ color: 0x67dfff, transparent: true, opacity: 0.88 });
  root.add(mesh(new THREE.OctahedronGeometry(0.30, 1), dark));
  root.add(mesh(new THREE.CylinderGeometry(0.055, 0.09, 0.96, 8), alloy, [0, 0.22, 0]));
  root.add(mesh(new THREE.SphereGeometry(0.07, 14, 10), signal, [0, 0.72, 0]));
  for (let i = 0; i < 3; i += 1) {
    const fin = mesh(new THREE.BoxGeometry(0.62, 0.045, 0.12), alloy, [0, -0.02, 0], [0, i * Math.PI / 3, 0.12]);
    root.add(fin);
  }
  const innerRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.018, 6, 64),
    new THREE.MeshBasicMaterial({ color: 0xffc17d, transparent: true, opacity: 0.62 }),
  );
  innerRing.rotation.set(Math.PI / 2, 0.35, 0);
  root.add(innerRing);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.70, 0.025, 6, 72),
    new THREE.MeshBasicMaterial({ color: 0x67dfff, transparent: true, opacity: 0.82 }),
  );
  ring.rotation.x = Math.PI / 2;
  root.add(ring);
  return { root, ring };
}

function mesh(geometry, material, position = [0, 0, 0], rotation = [0, 0, 0]) {
  const object = new THREE.Mesh(geometry, material);
  object.position.set(...position);
  object.rotation.set(...rotation);
  return object;
}

function beamBetween(a, b, radius, material) {
  const start = new THREE.Vector3(...a);
  const end = new THREE.Vector3(...b);
  const direction = end.clone().sub(start);
  const object = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, direction.length(), 8), material);
  object.position.copy(start).add(end).multiplyScalar(0.5);
  object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return object;
}

function makeEnginePlume() {
  const root = new THREE.Group();
  const outer = mesh(
    new THREE.CylinderGeometry(0.03, 0.18, 1.25, 18, 1, true),
    new THREE.MeshBasicMaterial({ color: 0x57bfe8, transparent: true, opacity: 0.20, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
    [0, 0, -0.62], [Math.PI / 2, 0, 0],
  );
  const core = mesh(
    new THREE.CylinderGeometry(0.015, 0.085, 0.88, 14, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xdffbff, transparent: true, opacity: 0.72, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
    [0, 0, -0.43], [Math.PI / 2, 0, 0],
  );
  root.add(outer, core);
  root.userData.outer = outer;
  root.userData.core = core;
  return root;
}

function makeShip() {
  const root = new THREE.Group();
  root.name = 'pale-seeker-study-vessel';
  const bone = new THREE.MeshStandardMaterial({ color: 0xc9c8c0, metalness: 0.40, roughness: 0.48, emissive: 0x11191b, emissiveIntensity: 0.35 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x111a21, metalness: 0.74, roughness: 0.34 });
  const alloy = new THREE.MeshStandardMaterial({ color: 0x8ba0a8, metalness: 0.92, roughness: 0.20 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x183b4c, metalness: 0.22, roughness: 0.12, transmission: 0.35, transparent: true, opacity: 0.86, emissive: 0x1d7894, emissiveIntensity: 1.45 });
  const warm = new THREE.MeshBasicMaterial({ color: 0xffb86b });

  root.add(mesh(new THREE.CapsuleGeometry(0.39, 2.1, 8, 14), bone, [0, 0, 0], [Math.PI / 2, 0, 0]));
  root.add(mesh(new THREE.CylinderGeometry(0.30, 0.42, 0.58, 8), dark, [0, -0.01, -1.18], [Math.PI / 2, 0, 0]));
  root.add(mesh(new THREE.CylinderGeometry(0.15, 0.32, 0.62, 8), bone, [0, 0, 1.38], [Math.PI / 2, 0, 0]));

  const hammer = mesh(new THREE.BoxGeometry(1.68, 0.24, 0.28), bone, [0, 0.03, 1.30]);
  root.add(hammer);
  for (const side of [-1, 1]) {
    root.add(mesh(new THREE.SphereGeometry(0.19, 14, 10), dark, [side * 0.77, 0.03, 1.30]));
    root.add(mesh(new THREE.BoxGeometry(0.22, 0.10, 0.48), glass, [side * 0.34, 0.23, 1.13], [0, side * 0.12, 0]));

    const vane = mesh(new THREE.BoxGeometry(0.82, 0.055, 1.32), dark, [side * 0.72, 0.02, -0.12], [0, side * 0.33, side * -0.04]);
    root.add(vane);
    root.add(mesh(new THREE.BoxGeometry(0.70, 0.022, 1.10), alloy, [side * 0.72, 0.06, -0.12], [0, side * 0.33, side * -0.04]));

    root.add(beamBetween([side * 0.35, -0.05, -0.52], [side * 0.76, -0.06, -0.94], 0.06, alloy));
    const nacelle = new THREE.Group();
    nacelle.position.set(side * 0.80, -0.05, -1.02);
    nacelle.add(mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.82, 14), dark, [0, 0, 0], [Math.PI / 2, 0, 0]));
    nacelle.add(mesh(new THREE.TorusGeometry(0.19, 0.035, 8, 20), alloy, [0, 0, -0.36], [0, 0, 0]));
    const plume = makeEnginePlume();
    plume.position.z = -0.46;
    nacelle.add(plume);
    root.add(nacelle);
    root.userData.enginePlumes = root.userData.enginePlumes || [];
    root.userData.enginePlumes.push(plume);
  }

  root.add(mesh(new THREE.BoxGeometry(0.08, 0.88, 0.92), bone, [0, 0.52, -0.20], [0.08, 0, 0]));
  root.add(mesh(new THREE.BoxGeometry(0.05, 0.56, 0.72), dark, [0, 0.55, -0.18], [0.08, 0, 0]));
  root.add(mesh(new THREE.TorusGeometry(0.39, 0.045, 8, 26), alloy, [0, 0, 0.20]));
  root.add(mesh(new THREE.TorusGeometry(0.39, 0.035, 8, 26), dark, [0, 0, -0.56]));

  const dishPivot = new THREE.Group();
  dishPivot.position.set(-0.58, 0.45, -0.42);
  dishPivot.rotation.set(0.18, 0.22, -0.20);
  dishPivot.add(beamBetween([0, 0, 0], [0, 0.30, 0], 0.035, alloy));
  dishPivot.add(mesh(new THREE.SphereGeometry(0.28, 22, 8, 0, Math.PI * 2, 0, Math.PI / 2), bone, [0, 0.34, 0], [0, 0, Math.PI]));
  dishPivot.add(mesh(new THREE.SphereGeometry(0.035, 10, 8), warm, [0, 0.53, 0]));
  root.add(dishPivot);
  root.userData.dishPivot = dishPivot;

  for (let i = -2; i <= 2; i += 1) {
    root.add(mesh(new THREE.BoxGeometry(0.055, 0.035, 0.025), warm, [0.25, 0.18, i * 0.27]));
  }
  const fill = new THREE.PointLight(0x74ddf4, 4.2, 6, 2);
  fill.position.set(0, 0.45, 0.75);
  root.add(fill);
  root.scale.setScalar(1.18);
  return root;
}

function makeCockpit() {
  const root = new THREE.Group();
  const shell = new THREE.MeshStandardMaterial({ color: 0x17232c, metalness: 0.72, roughness: 0.38 });
  const edge = new THREE.MeshStandardMaterial({ color: 0x82939a, metalness: 0.92, roughness: 0.22 });
  const panel = new THREE.MeshStandardMaterial({ color: 0x0b1218, metalness: 0.45, roughness: 0.55 });
  const cyan = new THREE.MeshBasicMaterial({ color: 0x49cce9, transparent: true, opacity: 0.82 });
  const amber = new THREE.MeshBasicMaterial({ color: 0xffb86b, transparent: true, opacity: 0.80 });
  const screens = [];

  root.add(mesh(new THREE.BoxGeometry(4.7, 0.18, 4.3), shell, [0, -0.12, -0.25]));
  root.add(mesh(new THREE.BoxGeometry(2.75, 0.32, 0.85), shell, [0, 0.39, -1.18], [-0.12, 0, 0]));
  root.add(mesh(new THREE.BoxGeometry(1.15, 0.32, 2.25), panel, [-1.55, 0.48, -0.56], [-0.05, -0.08, -0.08]));
  root.add(mesh(new THREE.BoxGeometry(1.15, 0.32, 2.25), panel, [1.55, 0.48, -0.56], [-0.05, 0.08, 0.08]));

  const postPairs = [
    [[-1.25, 0.52, -1.35], [-1.82, 2.35, -2.28]],
    [[1.25, 0.52, -1.35], [1.82, 2.35, -2.28]],
    [[-1.82, 2.35, -2.28], [-0.72, 2.58, -2.55]],
    [[1.82, 2.35, -2.28], [0.72, 2.58, -2.55]],
    [[-0.72, 2.58, -2.55], [0.72, 2.58, -2.55]],
  ];
  postPairs.forEach(([a, b]) => root.add(beamBetween(a, b, 0.055, edge)));
  root.add(mesh(new THREE.TorusGeometry(1.64, 0.045, 8, 46), edge, [0, 1.37, -2.16], [0, 0, 0]));

  for (const side of [-1, 1]) {
    root.add(beamBetween([side * 2.22, -0.04, 1.05], [side * 1.74, 2.16, -1.58], 0.07, shell));
    root.add(mesh(new THREE.BoxGeometry(0.52, 0.035, 0.66), cyan, [side * 1.56, 0.69, -0.84], [-Math.PI / 2.25, 0, side * 0.10]));
    root.add(mesh(new THREE.BoxGeometry(0.60, 0.07, 0.74), edge, [side * 1.56, 0.66, -0.83], [-Math.PI / 2.25, 0, side * 0.10]));
    const screen = mesh(new THREE.PlaneGeometry(0.48, 0.34), side < 0 ? cyan.clone() : amber.clone(), [side * 0.72, 0.62, -1.58], [-0.30, 0, 0]);
    screens.push(screen);
    root.add(screen);
    root.add(mesh(new THREE.BoxGeometry(0.58, 0.03, 0.06), edge, [side * 0.72, 0.82, -1.51]));
  }

  const navRing = mesh(new THREE.TorusGeometry(0.42, 0.018, 6, 48), cyan.clone(), [0, 0.63, -1.64], [Math.PI / 2, 0, 0]);
  root.add(navRing);
  root.add(mesh(new THREE.IcosahedronGeometry(0.12, 1), amber.clone(), [0, 0.67, -1.64]));
  root.add(mesh(new THREE.BoxGeometry(0.86, 0.12, 0.45), panel, [0, 0.25, 1.12]));
  root.add(mesh(new THREE.BoxGeometry(0.54, 0.72, 0.42), shell, [0, 0.38, 1.38], [-0.08, 0, 0]));

  const cabinLight = new THREE.PointLight(0x66d6ee, 8, 6, 2);
  cabinLight.position.set(0, 2.15, 0.4);
  root.add(cabinLight);
  const warmLight = new THREE.PointLight(0xffb86b, 3, 4, 2);
  warmLight.position.set(0, 0.45, -1.0);
  root.add(warmLight);
  root.userData.screens = screens;
  root.userData.navRing = navRing;
  return root;
}

function makeShipAnchor() {
  const anchor = new THREE.Group();
  anchor.name = 'ship-asset-anchor';
  const studyVisual = makeShip();
  anchor.add(studyVisual);
  anchor.userData.visuals = { study: studyVisual, source: null };
  anchor.userData.activeVisual = studyVisual;
  anchor.userData.enginePlumes = studyVisual.userData.enginePlumes || [];
  anchor.userData.dishPivot = studyVisual.userData.dishPivot;
  return anchor;
}

function geometryForProxy(geometry, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) {
  const prepared = geometry.clone();
  for (const name of Object.keys(prepared.attributes)) {
    if (name !== 'position' && name !== 'normal') prepared.deleteAttribute(name);
  }
  const matrix = new THREE.Matrix4().compose(
    new THREE.Vector3(...position),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)),
    new THREE.Vector3(...scale),
  );
  prepared.applyMatrix4(matrix);
  if (!prepared.getAttribute('normal')) prepared.computeVertexNormals();
  return prepared;
}

function proxyWing(side) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute([
    side * 0.004, 0.001, 0.002,
    side * 0.027, 0.001, 0.028,
    side * 0.008, 0.001, 0.034,
    side * 0.004, -0.001, 0.002,
    side * 0.027, -0.001, 0.028,
    side * 0.008, -0.001, 0.034,
  ], 3));
  geometry.setIndex([
    0, 1, 2, 5, 4, 3,
    0, 3, 4, 0, 4, 1,
    1, 4, 5, 1, 5, 2,
    2, 5, 3, 2, 3, 0,
  ]);
  geometry.computeVertexNormals();
  return geometry;
}

function countObjectTriangles(object) {
  let triangles = 0;
  object?.traverse((child) => {
    const geometry = child.geometry;
    if (!child.isMesh || !geometry) return;
    triangles += geometry.index ? geometry.index.count / 3 : (geometry.getAttribute('position')?.count || 0) / 3;
  });
  return Math.round(triangles);
}

function makeSourceHullProxy() {
  const proxy = new THREE.Group();
  proxy.name = 'source-hull-distance-proxy';
  const shellParts = [
    geometryForProxy(new THREE.CylinderGeometry(0.006, 0.008, 0.048, 8, 1), [0, 0, 0], [Math.PI / 2, 0, 0]),
    geometryForProxy(new THREE.ConeGeometry(0.007, 0.018, 8, 1), [0, 0, -0.033], [-Math.PI / 2, 0, 0]),
    geometryForProxy(new THREE.BoxGeometry(0.027, 0.005, 0.008), [0, 0.001, -0.025]),
    geometryForProxy(new THREE.SphereGeometry(0.005, 8, 6), [0, 0.005, -0.017], [0, 0, 0], [1.1, 0.72, 1.6]),
    geometryForProxy(new THREE.CylinderGeometry(0.0055, 0.0045, 0.027, 8, 1), [-0.0105, -0.002, 0.023], [Math.PI / 2, 0, 0]),
    geometryForProxy(new THREE.CylinderGeometry(0.0055, 0.0045, 0.027, 8, 1), [0.0105, -0.002, 0.023], [Math.PI / 2, 0, 0]),
    geometryForProxy(new THREE.BoxGeometry(0.003, 0.015, 0.018), [0, 0.008, 0.012], [0.18, 0, 0]),
    proxyWing(-1),
    proxyWing(1),
  ];
  const plumeParts = [
    geometryForProxy(new THREE.ConeGeometry(0.0048, 0.022, 8, 1, true), [-0.0105, -0.002, 0.050], [Math.PI / 2, 0, 0]),
    geometryForProxy(new THREE.ConeGeometry(0.0048, 0.022, 8, 1, true), [0.0105, -0.002, 0.050], [Math.PI / 2, 0, 0]),
  ];
  const shellGeometry = sourceMergeGeometries(shellParts, false);
  const plumeGeometry = sourceMergeGeometries(plumeParts, false);
  shellParts.forEach((geometry) => { if (geometry !== shellGeometry) geometry.dispose(); });
  plumeParts.forEach((geometry) => { if (geometry !== plumeGeometry) geometry.dispose(); });
  const shell = new THREE.Mesh(shellGeometry, new THREE.MeshStandardMaterial({ color: 0xb7c4c4, roughness: 0.68, metalness: 0.48 }));
  const plume = new THREE.Mesh(plumeGeometry, new THREE.MeshBasicMaterial({ color: 0xa9efff, transparent: true, opacity: 0.72, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  shell.frustumCulled = false;
  plume.frustumCulled = false;
  proxy.add(shell, plume);
  proxy.userData.triangles = countObjectTriangles(proxy);
  return proxy;
}

function makeSourceShipVisual() {
  if (!sourceHullBuilder || !sourceMergeGeometries) return null;
  const built = sourceHullBuilder();
  const visual = new THREE.Group();
  visual.name = 'source-pale-seeker-high-fidelity';
  visual.rotation.y = Math.PI;
  visual.scale.setScalar(50);
  const proxy = makeSourceHullProxy();
  proxy.visible = false;
  visual.add(built.root, proxy);
  visual.userData.sourceBuilt = built;
  visual.userData.lod = {
    high: built.root,
    low: proxy,
    level: 'full',
    highTris: countObjectTriangles(built.root),
    lowTris: proxy.userData.triangles,
  };
  return visual;
}

function setInteriorCameraForAssetMode() {
  if (!interiorCamera) return;
  if (state.assetMode === 'source') {
    interiorCamera.position.set(0, 1.16, -5.28);
    interiorCamera.lookAt(0, 1.05, -8.4);
  } else {
    interiorCamera.position.set(0, 1.18, 3.35);
    interiorCamera.lookAt(0, 1.08, -2.2);
  }
}

function setAssetProgress(percent, label, visible = true, valueText = null) {
  const next = Math.max(state.assetProgress, Math.min(100, Math.round(percent)));
  state.assetProgress = next;
  ui.assetProgress.classList.toggle('hidden', !visible);
  ui.assetProgress.setAttribute('aria-valuenow', String(next));
  ui.assetProgressLabel.textContent = label;
  ui.assetProgressValue.textContent = valueText || `${next}%`;
  ui.assetProgressFill.style.width = `${next}%`;
}

function maxAutoTier() {
  return window.innerWidth <= 700 ? 'balanced' : 'detail';
}

function syncQualityUI(reason = '') {
  document.querySelectorAll('[data-quality-mode]').forEach((button) => {
    const active = button.dataset.qualityMode === state.qualityMode;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const actualDpr = renderer?.getPixelRatio?.() || Math.min(window.devicePixelRatio || 1, QUALITY_TIERS[state.qualityTier].dpr);
  const mode = state.qualityMode === 'auto' ? 'AUTO' : 'MANUAL';
  ui.qualityState.textContent = `${mode} · ${QUALITY_TIERS[state.qualityTier].label} · ${actualDpr.toFixed(2)}X`;
  if (state.qualityMode === 'auto') {
    ui.qualityHelp.textContent = reason || '自动模式保留交互反馈，并根据持续帧率与视口压力调整真实像素密度。';
  } else {
    ui.qualityHelp.textContent = reason || '当前为手动画质；Auto 才会根据持续帧率自动调整像素密度。';
  }
}

function applyQualityTier(tier, reason = '', force = false) {
  if (!QUALITY_TIERS[tier]) return;
  if (!force && state.qualityTier === tier && renderer) {
    syncQualityUI(reason);
    return;
  }
  state.qualityTier = tier;
  state.qualityChangedAt = performance.now();
  state.qualityLowSamples = 0;
  state.qualityHighSamples = 0;
  if (renderer) {
    const width = ui.canvas.clientWidth;
    const height = ui.canvas.clientHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, QUALITY_TIERS[tier].dpr));
    renderer.setSize(width, height, false);
  }
  syncQualityUI(reason);
}

function evaluateAutoQuality(fps) {
  if (state.qualityMode !== 'auto' || !renderer) return;
  if (performance.now() - state.qualityChangedAt < 6000) return;
  if (fps < 48) {
    state.qualityLowSamples += 1;
    state.qualityHighSamples = 0;
  } else if (fps > 57) {
    state.qualityHighSamples += 1;
    state.qualityLowSamples = 0;
  } else {
    state.qualityLowSamples = 0;
    state.qualityHighSamples = 0;
  }
  if (state.qualityLowSamples >= 4) {
    const lower = state.qualityTier === 'detail' ? 'balanced' : 'eco';
    if (lower !== state.qualityTier) applyQualityTier(lower, `持续帧率约 ${Math.round(fps)}，已降低像素密度；场景反馈保持完整。`);
  } else if (state.qualityHighSamples >= 16) {
    const ceiling = maxAutoTier();
    const higher = state.qualityTier === 'eco' ? 'balanced' : 'detail';
    if (state.qualityTier !== ceiling && (ceiling === 'detail' || higher === 'balanced')) {
      applyQualityTier(higher, `持续帧率约 ${Math.round(fps)}，已恢复更高像素密度。`);
    }
  }
}

function syncAssetUI(mode, status = 'ready') {
  document.querySelectorAll('[data-asset-mode]').forEach((button) => {
    const active = button.dataset.assetMode === mode;
    button.classList.toggle('is-active', active);
    button.classList.toggle('is-loading', status === 'loading' && button.dataset.assetMode === 'source');
    button.setAttribute('aria-pressed', String(active));
    button.disabled = status === 'loading';
  });
  if (status === 'loading') {
    ui.assetState.textContent = 'LOADING · 3.79 MiB';
    ui.assetHelp.textContent = '正在载入源库程序化船体、Draco 内舱与 10 张烘焙纹理；轻量场景会持续显示。';
    return;
  }
  if (status === 'error') {
    ui.assetState.textContent = 'FALLBACK · STUDY';
    ui.assetHelp.textContent = '源库资产载入失败，已保留轻量提炼版；可以再次尝试。';
    return;
  }
  const source = mode === 'source';
  ui.assetState.textContent = source ? 'L2/L3 · SOURCE' : 'L1/L2 · READY';
  ui.assetHelp.textContent = source
    ? '外部使用源库 buildHull；内部使用 Draco GLB、AO 与 albedo/normal/ORM。MIT · Anshu Chimala。'
    : '当前只表达轮廓和交互规则；切换后载入源库真实船体、Draco 内舱与烘焙纹理。';
  ui.assetLevel.textContent = source ? 'L2/L3 · source assets' : 'L1/L2 · procedural';
  if (source) setAssetProgress(100, '11 / 11 内舱文件已就绪', true);
  else if (status !== 'error') {
    state.assetProgress = 0;
    setAssetProgress(0, '按需加载尚未开始', false);
  }
}

function applyAssetMode(mode) {
  if (mode === 'source' && (!sourceHullBuilder || !sourceInterior)) return false;
  state.assetMode = mode;
  if (ship?.userData?.visuals) {
    if (mode === 'source' && !ship.userData.visuals.source) {
      ship.userData.visuals.source = makeSourceShipVisual();
      ship.add(ship.userData.visuals.source);
    }
    const studyVisual = ship.userData.visuals.study;
    const sourceVisual = ship.userData.visuals.source;
    studyVisual.visible = mode === 'study';
    if (sourceVisual) sourceVisual.visible = mode === 'source';
    ship.userData.activeVisual = mode === 'source' ? sourceVisual : studyVisual;
    ship.userData.enginePlumes = mode === 'study' ? (studyVisual.userData.enginePlumes || []) : [];
    ship.userData.dishPivot = mode === 'study' ? studyVisual.userData.dishPivot : sourceVisual?.userData.sourceBuilt?.dishPivot;
  }
  if (studyCockpit && sourceInterior) {
    studyCockpit.visible = mode === 'study';
    sourceInterior.visible = mode === 'source';
    cockpit = mode === 'source' ? sourceInterior : studyCockpit;
  }
  renderer.shadowMap.enabled = mode === 'source';
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  setInteriorCameraForAssetMode();
  if (mode === 'source' && sourceInterior) {
    renderer.shadowMap.autoUpdate = true;
    renderer.setRenderTarget(null);
    renderer.render(interiorScene, interiorCamera);
    renderer.shadowMap.autoUpdate = false;
    renderer.shadowMap.needsUpdate = false;
  }
  syncAssetUI(mode);
  updateSourceHullLod(true);
  updateLensProof();
  if (state.view === 'cockpit') frameCockpit();
  else frameExternal(true, PRINCIPLES[currentPrinciple]?.preset || 'hero');
  return true;
}

function formatTriangleBudget(value) {
  if (!Number.isFinite(value)) return '--';
  return value >= 1000 ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k` : String(value);
}

function updateSourceHullLod(force = false) {
  const sourceVisual = ship?.userData?.visuals?.source;
  const lod = sourceVisual?.userData?.lod;
  if (state.assetMode !== 'source' || !lod) {
    state.lodLevel = 'study';
    if (ui.lodState) ui.lodState.textContent = 'STUDY · N/A';
    if (ui.lodHelp) ui.lodHelp.textContent = '几何 LOD：轻量模式不适用；源库高保真会依据镜头距离切换完整船体与远景轮廓。';
    return;
  }

  const distance = camera.position.distanceTo(getShipWorld());
  let next = lod.level;
  if (state.view === 'cockpit') next = 'proxy';
  else if (lod.level === 'full' && distance > 12.5) next = 'proxy';
  else if (lod.level === 'proxy' && distance < 10.8) next = 'full';
  if (force && state.view === 'external') next = distance > 12.5 ? 'proxy' : 'full';

  if (next !== lod.level || force) {
    lod.level = next;
    lod.high.visible = next === 'full';
    lod.low.visible = next === 'proxy';
  }
  state.lodLevel = next;
  const now = performance.now();
  if (!force && now - state.lodLastUiAt < 500) return;
  state.lodLastUiAt = now;
  const level = next === 'full' ? 'FULL' : 'PROXY';
  ui.lodState.textContent = state.view === 'cockpit'
    ? `INTERIOR · ${level}`
    : `${level} · ${distance.toFixed(1)}u`;
  ui.lodHelp.textContent = `几何 LOD：FULL ${formatTriangleBudget(lod.highTris)} → PROXY ${formatTriangleBudget(lod.lowTris)} tris；10.8u / 12.5u 双阈值防抖。`;
}

async function loadSourceAssetMode() {
  if (sourceHullBuilder && sourceInterior) {
    applyAssetMode('source');
    return;
  }
  if (sourceAssetPromise) return sourceAssetPromise;
  state.assetLoading = true;
  state.assetProgress = 0;
  setAssetProgress(4, '正在载入高保真模块', true);
  syncAssetUI('study', 'loading');
  sourceAssetPromise = (async () => {
    const manager = THREE.DefaultLoadingManager;
    const previousManagerCallbacks = {
      onStart: manager.onStart,
      onLoad: manager.onLoad,
      onProgress: manager.onProgress,
      onError: manager.onError,
    };
    const completedModelFiles = new Set();
    const failedModelFiles = new Set();
    try {
      const [hullModule, assetModule, interiorModule, environmentModule, geometryUtilsModule] = await Promise.all([
        import('../../the-long-silence/src/ship/hull.js'),
        import('../../the-long-silence/src/ship/interiorAssets.js'),
        import('../../the-long-silence/src/ship/Interior.js'),
        import('three/examples/jsm/environments/RoomEnvironment.js'),
        import('three/examples/jsm/utils/BufferGeometryUtils.js'),
      ]);
      setAssetProgress(18, '5 / 5 高保真模块已就绪', true);
      manager.onProgress = (url) => {
        const modelMatch = String(url).match(/models\/([^?#]+)/);
        if (!modelMatch) return;
        completedModelFiles.add(modelMatch[1]);
        const completed = Math.min(11, completedModelFiles.size);
        setAssetProgress(18 + (completed / 11) * 70, `${completed} / 11 内舱文件已完成`, true);
      };
      manager.onError = (url) => {
        const modelMatch = String(url).match(/models\/([^?#]+)/);
        if (modelMatch) failedModelFiles.add(modelMatch[1]);
      };
      sourceHullBuilder = hullModule.buildHull;
      sourceMergeGeometries = geometryUtilsModule.mergeGeometries;
      const assets = await assetModule.loadInteriorAssets(renderer);
      const waitStarted = performance.now();
      while (completedModelFiles.size < 11 && performance.now() - waitStarted < 3000) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      if (failedModelFiles.size || !Object.keys(assets.kit || {}).length) {
        throw new Error(`source interior incomplete: ${[...failedModelFiles].join(', ') || 'kit geometry unavailable'}`);
      }
      setAssetProgress(90, `${Math.min(11, completedModelFiles.size)} / 11 内舱文件已完成`, true);
      sourceInteriorData = interiorModule.buildInterior(assets);
      sourceInterior = sourceInteriorData.root;
      sourceInterior.name = 'source-interior-high-fidelity';
      sourceInterior.visible = false;
      interiorScene.add(sourceInterior);

      const pmrem = new THREE.PMREMGenerator(renderer);
      const room = new environmentModule.RoomEnvironment();
      interiorEnvironmentRT = pmrem.fromScene(room, 0.04);
      interiorScene.environment = interiorEnvironmentRT.texture;
      interiorScene.environmentIntensity = 0.12;
      room.dispose();
      pmrem.dispose();

      setAssetProgress(100, '11 / 11 内舱文件已就绪', true);
      state.assetLoading = false;
      applyAssetMode('source');
      ui.runState.textContent = 'SOURCE READY';
    } catch (error) {
      state.assetLoading = false;
      sourceAssetPromise = null;
      state.assetMode = 'study';
      syncAssetUI('study', 'error');
      setAssetProgress(state.assetProgress, '加载中断 · 轻量版仍可使用', true, '重试');
      console.error('[source-assets]', error);
    } finally {
      manager.onStart = previousManagerCallbacks.onStart;
      manager.onLoad = previousManagerCallbacks.onLoad;
      manager.onProgress = previousManagerCallbacks.onProgress;
      manager.onError = previousManagerCallbacks.onError;
    }
  })();
  return sourceAssetPromise;
}

function makeWarpLines() {
  const rnd = mulberry32(0x7A11CE);
  const positions = new Float32Array(120 * 6);
  for (let i = 0; i < 120; i += 1) {
    const direction = new THREE.Vector3(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).normalize();
    const inner = 1.5 + rnd() * 1.4;
    const outer = 7 + rnd() * 8;
    positions.set([direction.x * inner, direction.y * inner, direction.z * inner, direction.x * outer, direction.y * outer, direction.z * outer], i * 6);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const lines = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: 0x77dcff, transparent: true, opacity: 0, depthWrite: false }));
  lines.visible = false;
  return lines;
}

function makeScanBeam() {
  const root = new THREE.Group();
  const outerMaterial = new THREE.MeshBasicMaterial({
    color: 0x48cce9, transparent: true, opacity: 0.16,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  });
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0xd8fbff, transparent: true, opacity: 0.62,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  root.add(new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.13, 1, 16, 1, true), outerMaterial));
  root.add(new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.018, 1, 8, 1, true), coreMaterial));
  root.userData.materials = [outerMaterial, coreMaterial];
  root.visible = false;
  return root;
}

function updateScanBeam() {
  if (!scanBeam?.visible || !ship || !targetPlanet) return;
  const quaternion = ship.getWorldQuaternion(new THREE.Quaternion());
  const start = getShipWorld().add(new THREE.Vector3(0, 0.04, 1.65).applyQuaternion(quaternion));
  const end = getTargetWorld();
  const direction = end.clone().sub(start);
  const length = direction.length();
  scanBeam.position.copy(start).add(end).multiplyScalar(0.5);
  scanBeam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  scanBeam.scale.set(1, length, 1);
  const pulse = reducedMotion ? 1 : 0.78 + Math.sin(elapsed * 16) * 0.22;
  scanBeam.userData.materials[0].opacity = 0.12 + pulse * 0.08;
  scanBeam.userData.materials[1].opacity = 0.45 + pulse * 0.28;
}

function clearObject(object) {
  if (!object) return;
  object.traverse((child) => {
    child.geometry?.dispose();
    if (child.material) (Array.isArray(child.material) ? child.material : [child.material]).forEach((material) => material.dispose());
  });
}

function buildSystem(seed) {
  currentSystem = generateSystem(seed);
  missionTargets = [];
  if (systemRoot) { scene.remove(systemRoot); clearObject(systemRoot); }
  if (starfield) { scene.remove(starfield); clearObject(starfield); }

  systemRoot = new THREE.Group();
  systemRoot.name = 'seeded-system';
  starfield = makeStarfield(seed);
  scene.add(starfield);

  const star = new THREE.Mesh(new THREE.SphereGeometry(0.72, 28, 20), new THREE.MeshBasicMaterial({ color: currentSystem.star.color }));
  systemRoot.add(star);
  const starLight = new THREE.PointLight(currentSystem.star.color, 50, 32, 1.8);
  systemRoot.add(starLight);

  currentSystem.planets.forEach((planet, index) => {
    const orbitPlane = new THREE.Group();
    orbitPlane.name = index === currentSystem.targetIndex ? 'mission-orbit-plane' : `background-orbit-plane-${index}`;
    orbitPlane.rotation.order = 'YXZ';
    orbitPlane.rotation.y = planet.ascendingNode;
    orbitPlane.rotation.z = planet.inclination;
    orbitPlane.userData = {
      visualOnly: index !== currentSystem.targetIndex,
      inclination: planet.inclination,
      ascendingNode: planet.ascendingNode,
    };
    orbitPlane.add(makeOrbit(planet.orbit, index === currentSystem.targetIndex ? 0x2d8aa4 : 0x17394b));
    const planetGroup = new THREE.Group();
    planetGroup.userData = { orbit: planet.orbit, angle: planet.angle, speed: planet.speed, isMissionTarget: index === currentSystem.targetIndex };
    planetGroup.position.set(Math.cos(planet.angle) * planet.orbit, 0, Math.sin(planet.angle) * planet.orbit);
    const body = new THREE.Mesh(new THREE.SphereGeometry(planet.radius, 48, 32), makePlanetMaterial(planet));
    body.rotation.z = 0.2 + index * 0.09;
    planetGroup.add(body);
    if (index === currentSystem.targetIndex) {
      targetPlanet = body;
      targetAtmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(planet.radius * 1.06, 42, 28),
        new THREE.ShaderMaterial({ vertexShader: atmosphereVertex, fragmentShader: atmosphereFragment, uniforms: { uColor: { value: new THREE.Color(0x67dfff) } }, transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false }),
      );
      planetGroup.add(targetAtmosphere);
      targetRing = new THREE.Mesh(
        new THREE.TorusGeometry(planet.radius * 1.35, 0.025, 6, 72),
        new THREE.MeshBasicMaterial({ color: 0x67dfff, transparent: true, opacity: 0.78 }),
      );
      targetRing.rotation.x = Math.PI / 2;
      planetGroup.add(targetRing);
      missionTargets.push({
        kind: 'planet',
        root: planetGroup,
        object: body,
        ring: targetRing,
        atmosphere: targetAtmosphere,
        data: planet,
        radius: planet.radius,
        completed: false,
      });
    }
    orbitPlane.add(planetGroup);
    systemRoot.add(orbitPlane);
  });

  const waypointVisual = makeSurveyWaypoint();
  waypointVisual.root.position.set(currentSystem.waypoint.x, 0, currentSystem.waypoint.z);
  waypointVisual.root.visible = false;
  systemRoot.add(waypointVisual.root);
  missionTargets.push({
    kind: 'resonator',
    root: waypointVisual.root,
    object: waypointVisual.root,
    ring: waypointVisual.ring,
    atmosphere: null,
    data: currentSystem.waypoint,
    radius: currentSystem.waypoint.radius,
    completed: false,
  });

  targetPlanet = missionTargets[0].object;
  targetRing = missionTargets[0].ring;
  targetAtmosphere = missionTargets[0].atmosphere;

  const targetWorld = targetPlanet.getWorldPosition(new THREE.Vector3());
  ship = makeShipAnchor();
  const outward = targetWorld.clone().normalize();
  ship.position.copy(targetWorld).addScaledVector(outward, 3.3).add(new THREE.Vector3(0, 1.10, 0));
  ship.lookAt(targetWorld.x, ship.position.y, targetWorld.z);
  ship.userData.baseY = ship.position.y;
  shipSpawnPosition = ship.position.clone();
  shipSpawnQuaternion = ship.quaternion.clone();
  systemRoot.add(ship);
  scene.add(systemRoot);
  setMissionTarget(0);
  if (state.assetMode === 'source' && sourceHullBuilder) applyAssetMode('source');
  else syncAssetUI('study');
  const backgroundTilts = currentSystem.planets.slice(1).map((planet) => {
    const degrees = THREE.MathUtils.radToDeg(planet.inclination);
    return `${degrees >= 0 ? '+' : '−'}${Math.abs(degrees).toFixed(0)}°`;
  });
  ui.orbitPlanes.textContent = `MISSION 0° · BG ${backgroundTilts.join(' / ')}`;
  updateLensProof();
  frameExternal(true, 'flight');
}

function updateLensProof() {
  const target = missionTargets[state.missionLeg]?.data?.name || 'ITHIRKA II';
  const asset = state.assetMode === 'source' ? '源库高保真 · MIT' : '轻量提炼';
  if (currentLens === 'generate') ui.lensProof.textContent = `当前证据：${target} · seed ${state.seed} · 第二航段 ${currentSystem.waypoint.routeDistance.toFixed(2)}u · deterministic mulberry32`;
  else if (currentLens === 'ship') ui.lensProof.textContent = `${PRINCIPLES[currentPrinciple].proof} · ${target} · ${asset}`;
  else ui.lensProof.textContent = LENS[currentLens].proof;
}

function getTargetWorld() { return targetPlanet?.getWorldPosition(new THREE.Vector3()) || new THREE.Vector3(); }
function getShipWorld() { return ship?.getWorldPosition(new THREE.Vector3()) || new THREE.Vector3(); }

function activeMissionTarget() {
  return missionTargets[state.missionLeg] || missionTargets[0] || null;
}

function missionTransitionPending() {
  return state.scanComplete && !state.missionComplete && state.missionLeg < missionTargets.length - 1;
}

function setMissionTarget(index, { reframe = false } = {}) {
  if (!missionTargets.length) return;
  state.missionLeg = THREE.MathUtils.clamp(index, 0, missionTargets.length - 1);
  const active = activeMissionTarget();
  targetPlanet = active.object;
  targetRing = active.ring;
  targetAtmosphere = active.atmosphere;
  missionTargets.forEach((entry, entryIndex) => {
    entry.root.visible = entryIndex === 0 || entryIndex <= state.missionLeg || entry.completed;
    entry.ring.visible = entryIndex === state.missionLeg || entry.completed;
    entry.ring.material.color.setHex(entry.completed ? 0x8de0af : 0x67dfff);
    if (!entry.completed) entry.ring.scale.setScalar(1);
  });
  const targetData = active.data;
  ui.targetName.textContent = targetData.name;
  if (active.kind === 'resonator') {
    ui.telemetryLabelA.textContent = 'SIGNAL';
    ui.telemetryLabelB.textContent = 'AGE';
    ui.telemetryLabelC.textContent = 'STATE';
    ui.temp.textContent = targetData.frequency;
    ui.gravity.textContent = targetData.age;
    ui.atmosphere.textContent = targetData.status;
  } else {
    ui.telemetryLabelA.textContent = 'SURFACE';
    ui.telemetryLabelB.textContent = 'GRAVITY';
    ui.telemetryLabelC.textContent = 'ATM';
    ui.temp.textContent = `${targetData.tempK} K`;
    ui.gravity.textContent = `${targetData.gravity} g`;
    ui.atmosphere.textContent = targetData.atmosphere;
  }
  warpLines?.position.copy(getTargetWorld());
  updateLensProof();
  if (reframe && state.view === 'external') {
    savedExternalCamera = null;
    state.flightFollowUntil = performance.now() + 900;
    frameExternal(true, 'flight');
  }
}

function syncStoryUI() {
  if (!ui.storyPanel) return;
  const beats = [...document.querySelectorAll('[data-story-beat]')];
  const setBeat = (name, status) => {
    const beat = beats.find((entry) => entry.dataset.storyBeat === name);
    beat?.classList.toggle('is-active', status === 'active');
    beat?.classList.toggle('is-complete', status === 'complete');
  };
  ui.storyPanel.classList.toggle('is-recovered', state.missionComplete);
  if (state.missionComplete) {
    ui.storyProgress.textContent = 'RESONATORS 1/7';
    ui.storyBody.textContent = '第一台共鸣器已经回应。它没有解释九百个世界去了哪里，却证明沉默不是毁灭，而是一场被共同选择的离开。';
    ui.storyRewardLabel.textContent = 'THE FIRST CANTO · RECOVERED';
    ui.storyRewardBody.textContent = '他们最先建造的是聆听塔——不是为了向宇宙发声，而是为了倾听。天空并非空无，它像是在屏息。';
    setBeat('world', 'complete'); setBeat('resonator', 'complete'); setBeat('canto', 'complete');
  } else if (state.missionLeg === 1) {
    ui.storyProgress.textContent = 'RESONATOR I · LOCKED';
    ui.storyBody.textContent = state.scanActive
      ? '共鸣器正在辨认来访者。保持飞船稳定，让它完成第一次调谐。'
      : '信号来自一台 Choir 共鸣器。转向、接近并扫描它；这不是残骸，而是一件仍在等待回应的乐器。';
    ui.storyRewardLabel.textContent = 'THE FIRST CANTO · ATTUNEMENT REQUIRED';
    ui.storyRewardBody.textContent = '完成调谐，取回它保存了四万年的第一段信息。';
    setBeat('world', 'complete'); setBeat('resonator', 'active'); setBeat('canto', '');
  } else if (state.scanComplete) {
    ui.storyProgress.textContent = 'RESONANCE TRACE FOUND';
    ui.storyBody.textContent = 'ITHIRKA II 的城市仍整齐地运行：没有爆炸、辐射或抵抗痕迹。扫描只发现一束持续四万年的共鸣信号。';
    ui.storyRewardLabel.textContent = 'RESONATOR I · COORDINATES RESOLVED';
    ui.storyRewardBody.textContent = '追踪信号，确认沉默是灾难、逃亡，还是某种主动选择。';
    setBeat('world', 'complete'); setBeat('resonator', 'active'); setBeat('canto', '');
  } else {
    ui.storyProgress.textContent = 'RESONATORS 0/7';
    ui.storyBody.textContent = state.scanActive
      ? '正在比对城市、轨道与大气记录。寻找战争、灾难或撤离留下的任何证据。'
      : '你是第 1101 次远征。驾驶 Pale Seeker 进入沉默区，扫描 ITHIRKA II，寻找第一台仍在等待的共鸣器。';
    ui.storyRewardLabel.textContent = 'THE FIRST CANTO · LOCKED';
    ui.storyRewardBody.textContent = '扫描世界，找出沉默背后的第一段声音。';
    setBeat('world', 'active'); setBeat('resonator', ''); setBeat('canto', '');
  }
}

function releaseFlightInputs() {
  Object.keys(flightInput).forEach((key) => {
    flightInput[key] = false;
    keyboardInputExpiresAt[key] = 0;
  });
  document.querySelectorAll('[data-flight-control]').forEach((button) => {
    button.classList.remove('is-held');
    button.setAttribute('aria-pressed', 'false');
  });
}

function setFlightInput(action, active, button = null) {
  if (!(action in flightInput)) return;
  if (active && (state.scanActive || state.foldActive || state.folded || state.paused || missionTransitionPending())) return;
  const wasActive = flightInput[action];
  if (button) keyboardInputExpiresAt[action] = 0;
  flightInput[action] = active;
  if (button) {
    button.classList.toggle('is-held', active);
    button.setAttribute('aria-pressed', String(active));
  }
  if (active && !wasActive) {
    cancelGuidedTour('已手动驾驶 · 接近目标并稳定速度后执行扫描');
    state.flightFollowUntil = performance.now() + 950;
    if (!state.scanComplete) setOperation('flying', '手动驾驶：让位置、朝向、引擎功率与镜头共同响应输入', 'FLIGHT');
    if (action === 'thrust') state.speed = Math.min(FLIGHT.maxForward, state.speed + 0.14);
    else if (action === 'reverse') state.speed = Math.max(-FLIGHT.maxReverse, state.speed - 0.10);
    else if (action === 'brake') state.speed *= 0.38;
    else if (action === 'left' && ship) ship.rotateY(0.09);
    else if (action === 'right' && ship) ship.rotateY(-0.09);
  }
}

function flightSnapshot() {
  if (!ship || !targetPlanet) return { distance: Infinity, speed: Math.abs(state.speed), bearingDegrees: 0 };
  const shipWorld = getShipWorld();
  const targetWorld = getTargetWorld();
  const toTarget = targetWorld.sub(shipWorld);
  toTarget.y = 0;
  const forward = ship.getWorldDirection(new THREE.Vector3());
  forward.y = 0;
  let bearingDegrees = 0;
  if (toTarget.lengthSq() > 0.001 && forward.lengthSq() > 0.001) {
    toTarget.normalize();
    forward.normalize();
    const crossY = forward.z * toTarget.x - forward.x * toTarget.z;
    bearingDegrees = THREE.MathUtils.radToDeg(Math.atan2(crossY, THREE.MathUtils.clamp(forward.dot(toTarget), -1, 1)));
  }
  return { distance: shipWorld.distanceTo(getTargetWorld()), speed: Math.abs(state.speed), bearingDegrees };
}

function updateFlightStatus() {
  if (!ship || !targetPlanet) return;
  const { distance, speed, bearingDegrees } = flightSnapshot();
  if (state.operation === 'collision' && performance.now() >= state.collisionNoticeUntil) {
    setOperation('flying', '安全边界已解除；可转向、后退或在稳定后扫描', 'FLIGHT');
  }
  const ready = distance <= FLIGHT.scanDistance && speed <= FLIGHT.scanSpeed && !state.folded;
  state.scanReady = ready;
  ui.flightSpeed.textContent = `${speed.toFixed(2)} u/s`;
  ui.flightDistance.textContent = `${distance.toFixed(2)} u`;
  ui.targetDistance.textContent = `${distance.toFixed(2)} u`;

  const targetCount = missionTargets.length || 2;
  const targetNumber = state.missionLeg + 1;
  const bearingAmount = Math.round(Math.abs(bearingDegrees));
  const turnCue = bearingAmount > 10 ? `向${bearingDegrees > 0 ? '左' : '右'}转 ${bearingAmount}°` : '船头已对准';
  let phase = 'approach';
  let gate = 'TOO FAR';
  let prompt = targetNumber === 1
    ? `目标 1/${targetCount} · 阶段 1/3 · 接近寂静世界，寻找消失的证据`
    : `目标 ${targetNumber}/${targetCount} · ${turnCue}，驶往 RESONATOR I`;
  let detail = targetNumber === 1
    ? `继续朝目标推进；进入 ${FLIGHT.scanDistance.toFixed(2)}u 后才能扫描。`
    : `${turnCue}；距离 ${distance.toFixed(2)}u，进入 ${FLIGHT.scanDistance.toFixed(2)}u 后制动并扫描。`;
  if (performance.now() < state.collisionNoticeUntil) {
    phase = 'collision'; gate = 'SAFE LIMIT';
    prompt = '安全边界已介入 · 已阻止船体穿入目标';
    detail = '简化碰撞体已把飞船推回安全距离并削减速度；转向后继续调查。';
  } else if (state.scanComplete) {
    if (state.missionComplete) {
      phase = 'mission-complete'; gate = 'CANTO 1/7';
      prompt = 'THE FIRST CANTO 已取回 · 共鸣器 1/7';
      detail = '第一段信息已经解锁：天空并非空无，它像是在屏息。其余六台共鸣器仍在沉默区等待。';
    } else {
      phase = 'discovered'; gate = 'TRACE FOUND';
      prompt = '调查 1/2 完成 · 已定位 RESONATOR I';
      detail = '没有战争或灾难痕迹，只有持续四万年的信号。点击“追踪共鸣器”继续调查。';
    }
  } else if (state.scanActive) {
    phase = 'scanning'; gate = 'LOCKED';
    prompt = `目标 ${targetNumber}/${targetCount} · 阶段 3/3 · 保持稳定，正在扫描`;
    detail = '扫描期间驾驶输入暂时锁定，空间光束、目标环、HUD 与进度共享同一状态。';
  } else if (state.folded) {
    phase = 'recentered'; gate = 'PAUSED';
    prompt = '相对原点演示中 · 返回轨道后可继续驾驶';
    detail = '折跃/重定位是独立的尺度概念演示，不属于手动驾驶闭环。';
  } else if (distance <= FLIGHT.scanDistance && speed > FLIGHT.scanSpeed) {
    phase = 'stabilize'; gate = 'TOO FAST';
    prompt = `目标 ${targetNumber}/${targetCount} · 阶段 2/3 · 已进入扫描距离，请制动`;
    detail = `按 Space 或“制动”，把速度从 ${speed.toFixed(2)}u/s 降到 ${FLIGHT.scanSpeed.toFixed(2)}u/s 以下。`;
  } else if (ready) {
    phase = 'ready'; gate = 'READY';
    prompt = `目标 ${targetNumber}/${targetCount} · 阶段 2/3 · 距离与速度合格，可以扫描`;
    detail = targetNumber === 1 ? '扫描门槛已满足；寻找沉默世界留下的异常证据。' : '扫描门槛已满足；调谐共鸣器并取回第一段 Canto。';
  }
  state.flightPhase = phase;
  ui.scanGate.textContent = gate;
  ui.missionPrompt.textContent = prompt;
  ui.missionState.textContent = phase.toUpperCase();
  ui.missionDetail.textContent = detail;
  const hud = ui.missionPrompt.closest('.flight-hud');
  hud?.classList.toggle('is-ready', ['ready', 'discovered', 'mission-complete'].includes(phase));
  hud?.classList.toggle('is-warning', phase === 'stabilize' || phase === 'collision');
  ui.scan.disabled = state.scanActive || state.foldActive || (!state.scanComplete && !ready);
  if (state.scanActive) ui.scan.textContent = '扫描中…';
  else if (state.missionComplete) ui.scan.textContent = '重跑第一段 Canto';
  else if (missionTransitionPending()) ui.scan.textContent = '追踪共鸣器';
  else if (distance > FLIGHT.scanDistance) ui.scan.textContent = '接近后扫描';
  else if (speed > FLIGHT.scanSpeed) ui.scan.textContent = '减速后扫描';
  else ui.scan.textContent = '扫描目标';
  document.querySelectorAll('[data-flight-control]').forEach((button) => {
    button.disabled = state.scanActive || state.foldActive || state.folded || state.paused || missionTransitionPending();
  });
}

function enterSurveyCorridor() {
  if (!ship || !targetPlanet) return;
  const target = getTargetWorld();
  const outward = getShipWorld().sub(target);
  outward.y = 0;
  if (outward.lengthSq() < 0.001) outward.set(0, 0, 1);
  outward.normalize();
  ship.position.x = target.x + outward.x * 1.75;
  ship.position.z = target.z + outward.z * 1.75;
  ship.position.y = ship.userData.baseY;
  ship.lookAt(target.x, ship.userData.baseY, target.z);
  state.speed = 0;
  state.flightFollowUntil = performance.now() + 800;
  savedExternalCamera = null;
  if (state.view === 'external') frameExternal(true, 'flight');
  updateFlightStatus();
}

function updateFlight(dt) {
  if (!ship || !targetPlanet || dt <= 0) return;
  const now = performance.now();
  Object.keys(keyboardInputExpiresAt).forEach((action) => {
    if (keyboardInputExpiresAt[action] && now > keyboardInputExpiresAt[action]) {
      flightInput[action] = false;
      keyboardInputExpiresAt[action] = 0;
    }
  });
  const locked = state.scanActive || state.foldActive || state.folded || state.paused || state.tourActive || missionTransitionPending();
  if (locked) {
    state.speed = THREE.MathUtils.damp(state.speed, 0, state.scanActive ? 5 : 2.2, dt);
    return;
  }
  const hasInput = Object.values(flightInput).some(Boolean);
  if (flightInput.brake) state.speed = THREE.MathUtils.damp(state.speed, 0, FLIGHT.brakeDrag, dt);
  else if (flightInput.thrust && !flightInput.reverse) state.speed = Math.min(FLIGHT.maxForward, state.speed + FLIGHT.acceleration * dt);
  else if (flightInput.reverse && !flightInput.thrust) state.speed = Math.max(-FLIGHT.maxReverse, state.speed - FLIGHT.reverseAcceleration * dt);
  else state.speed = THREE.MathUtils.damp(state.speed, 0, FLIGHT.coastDrag, dt);

  const turn = (flightInput.left ? 1 : 0) - (flightInput.right ? 1 : 0);
  if (turn) {
    const authority = 0.56 + Math.min(1, Math.abs(state.speed) / FLIGHT.maxForward) * 0.44;
    ship.rotateY(turn * FLIGHT.turnRate * authority * dt);
  }

  const forward = ship.getWorldDirection(new THREE.Vector3());
  forward.y = 0;
  if (forward.lengthSq() > 0.001) forward.normalize();
  const candidate = ship.position.clone().addScaledVector(forward, state.speed * dt);
  candidate.y = ship.userData.baseY;
  const target = getTargetWorld();
  const targetRadius = activeMissionTarget()?.radius || 0.8;
  const minimumDistance = targetRadius + FLIGHT.collisionPadding;
  const toCandidate = candidate.clone().sub(target);
  if (toCandidate.length() < minimumDistance) {
    const horizontal = new THREE.Vector3(toCandidate.x, 0, toCandidate.z);
    if (horizontal.lengthSq() < 0.001) horizontal.copy(forward).multiplyScalar(-1);
    horizontal.normalize();
    const vertical = candidate.y - target.y;
    const horizontalMinimum = Math.sqrt(Math.max(0.04, minimumDistance ** 2 - vertical ** 2));
    candidate.x = target.x + horizontal.x * horizontalMinimum;
    candidate.z = target.z + horizontal.z * horizontalMinimum;
    state.speed = -Math.sign(state.speed || 1) * Math.min(0.16, Math.abs(state.speed) * 0.18);
    state.collisionNoticeUntil = performance.now() + 1500;
    setOperation('collision', '安全边界已阻止船体穿入目标；转向后继续调查', 'SAFETY');
  }
  ship.position.x = candidate.x;
  ship.position.z = candidate.z;
  if (hasInput || Math.abs(state.speed) > 0.04 || turn) state.flightFollowUntil = performance.now() + 850;
}

function followFlightCamera(dt) {
  if (!camera || !ship || state.view !== 'external' || state.cameraMove || state.foldActive || state.folded) return;
  const following = performance.now() < state.flightFollowUntil;
  if (!following) {
    if (!controls.enabled) {
      controls.enabled = true;
      savedExternalCamera = { position: camera.position.clone(), target: controls.target.clone() };
    }
    return;
  }
  controls.enabled = false;
  const pose = getExternalPose('flight');
  const positionAlpha = reducedMotion ? 1 : 1 - Math.exp(-dt * 4.8);
  const targetAlpha = reducedMotion ? 1 : 1 - Math.exp(-dt * 7.2);
  camera.position.lerp(pose.position, positionAlpha);
  controls.target.lerp(pose.target, targetAlpha);
  camera.lookAt(controls.target);
}

function getExternalPose(preset = 'hero') {
  const shipWorld = getShipWorld();
  const targetWorld = getTargetWorld();
  const quaternion = ship.getWorldQuaternion(new THREE.Quaternion());
  const offsets = {
    hero: [5.5, 3.0, -4.8],
    silhouette: [6.7, 2.15, 0.45],
    material: [3.8, 1.55, -3.25],
    feedback: [6.6, 3.55, -5.8],
    flight: [4.7, 2.35, -5.7],
  };
  const narrowFactor = Math.max(1, 1.05 / Math.max(camera.aspect, 0.35));
  const localOffset = new THREE.Vector3(...(offsets[preset] || offsets.hero)).multiplyScalar(narrowFactor).applyQuaternion(quaternion);
  const localAim = new THREE.Vector3(0, 0.08, 0.15).applyQuaternion(quaternion);
  return {
    position: shipWorld.clone().add(localOffset),
    target: shipWorld.clone().add(localAim).lerp(targetWorld, preset === 'feedback' ? 0.18 : 0.04),
  };
}

function frameExternal(force = false, preset = 'hero') {
  if (!camera || !ship) return;
  const targetWorld = getTargetWorld();
  if (state.folded && !force) {
    camera.position.copy(targetWorld).add(new THREE.Vector3(3.1, 1.8, 3.8));
    controls.target.copy(targetWorld);
  } else if (savedExternalCamera && !force) {
    camera.position.copy(savedExternalCamera.position);
    controls.target.copy(savedExternalCamera.target);
  } else {
    const pose = getExternalPose(preset);
    camera.position.copy(pose.position);
    controls.target.copy(pose.target);
  }
  camera.lookAt(controls.target);
  controls.update();
}

function moveExternalCamera(preset) {
  if (!camera || state.foldActive || state.view !== 'external') return;
  const pose = getExternalPose(preset);
  state.cameraMove = {
    elapsed: 0,
    duration: reducedMotion ? 0.05 : 0.72,
    startPosition: camera.position.clone(),
    startTarget: controls.target.clone(),
    endPosition: pose.position,
    endTarget: pose.target,
  };
  controls.enabled = false;
}

function updateCameraMove(dt) {
  if (!state.cameraMove) return;
  state.cameraMove.elapsed = Math.min(state.cameraMove.duration, state.cameraMove.elapsed + dt);
  const t = state.cameraMove.elapsed / state.cameraMove.duration;
  const eased = t * t * (3 - 2 * t);
  camera.position.lerpVectors(state.cameraMove.startPosition, state.cameraMove.endPosition, eased);
  controls.target.lerpVectors(state.cameraMove.startTarget, state.cameraMove.endTarget, eased);
  camera.lookAt(controls.target);
  if (t >= 1) {
    savedExternalCamera = { position: camera.position.clone(), target: controls.target.clone() };
    state.cameraMove = null;
    controls.enabled = state.view === 'external';
  }
}

function frameCockpit() {
  if (!camera || !ship || state.foldActive || state.folded) return;
  const shipWorld = getShipWorld();
  const forward = ship.getWorldDirection(new THREE.Vector3());
  camera.position.copy(shipWorld).add(new THREE.Vector3(0, 0.22, 0));
  camera.lookAt(shipWorld.clone().addScaledVector(forward, 8).add(new THREE.Vector3(0, 0.12, 0)));
}

function setOperation(operation, caption, runState = 'LIVE') {
  state.operation = operation;
  ui.caption.textContent = caption;
  ui.runState.textContent = runState;
  ui.sceneState.textContent = `${state.view} / ${state.operation}`;
}

function storyStageCaption(cockpitMode = state.view === 'cockpit') {
  if (state.missionComplete) return '第一段 Canto 已取回：其余六台共鸣器仍在沉默区等待';
  if (state.missionLeg === 1) return cockpitMode
    ? '内部调谐：让 RESONATOR I 辨认 Pale Seeker 的到来'
    : '追踪 RESONATOR I：接近并取回四万年前留下的信息';
  if (state.scanComplete) return 'ITHIRKA II 没有灾难痕迹：唯一线索指向一台共鸣器';
  return cockpitMode
    ? 'Pale Seeker 驾驶舱：接近 ITHIRKA II，寻找沉默的证据'
    : 'Pale Seeker 已进入沉默区：接近 ITHIRKA II 并寻找异常证据';
}

function setViewMode(view) {
  if (!camera || state.view === view) return;
  if (view === 'cockpit' && state.view === 'external') {
    savedExternalCamera = { position: camera.position.clone(), target: controls.target.clone() };
  }
  state.view = view;
  const cockpitMode = view === 'cockpit';
  state.cameraMove = null;
  ship.visible = !cockpitMode;
  controls.enabled = !cockpitMode && !state.foldActive && performance.now() >= state.flightFollowUntil;
  ui.cockpitHud.classList.toggle('is-visible', cockpitMode);
  document.querySelectorAll('[data-view]').forEach((button) => {
    const active = button.dataset.view === view;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  ui.mode.textContent = cockpitMode ? 'COCKPIT / OPTICAL NAV' : 'EXTERIOR CRUISE';
  if (cockpitMode) frameCockpit(); else frameExternal();
  setOperation(state.operation, storyStageCaption(cockpitMode), cockpitMode ? 'CREW VIEW' : 'LIVE');
}

function focusPrinciple(key) {
  if (!PRINCIPLES[key] || state.foldActive) return;
  currentPrinciple = key;
  const principle = PRINCIPLES[key];
  document.querySelectorAll('[data-principle]').forEach((button) => {
    const active = button.dataset.principle === key;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  currentLens = 'ship';
  document.querySelectorAll('[data-lens]').forEach((tab) => {
    const active = tab.dataset.lens === 'ship';
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  ui.lensBody.textContent = principle.body;
  updateLensProof();
  if (state.view !== principle.view) setViewMode(principle.view);
  if (principle.view === 'external') moveExternalCamera(principle.preset);
  ui.caption.textContent = principle.caption;
}

function resetExperiment() {
  releaseFlightInputs();
  state.scanActive = false;
  state.scanProgress = 0;
  state.scanComplete = false;
  state.missionLeg = 0;
  state.missionComplete = false;
  state.foldActive = false;
  state.folded = false;
  state.foldProgress = 0;
  state.cameraMove = null;
  state.originKm = 0;
  state.worldKm = 1240000 + (state.seed % 90000);
  state.speed = 0;
  state.scanReady = false;
  state.flightPhase = 'approach';
  state.flightFollowUntil = 0;
  state.collisionNoticeUntil = 0;
  if (ship && shipSpawnPosition && shipSpawnQuaternion) {
    ship.position.copy(shipSpawnPosition);
    ship.quaternion.copy(shipSpawnQuaternion);
    ship.userData.baseY = shipSpawnPosition.y;
  }
  missionTargets.forEach((entry) => {
    entry.completed = false;
    entry.ring.material.color.setHex(0x67dfff);
    entry.ring.scale.setScalar(1);
  });
  setMissionTarget(0);
  ui.scanFill.style.width = '0%';
  ui.scanValue.textContent = '0%';
  ui.scan.textContent = '扫描目标';
  ui.scan.disabled = true;
  ui.fold.textContent = '折跃 / 重定位';
  ui.fold.disabled = false;
  ui.world.textContent = `+${state.worldKm.toLocaleString()} km`;
  ui.origin.textContent = '0 km · ship-relative';
  if (warpLines) { warpLines.visible = false; warpLines.material.opacity = 0; }
  if (scanBeam) scanBeam.visible = false;
  ui.telemetry.classList.remove('is-visible');
  ui.telemetry.setAttribute('aria-hidden', 'true');
  ui.cockpitHud.classList.remove('is-scanning', 'is-complete');
  syncStoryUI();
  setOperation('live', storyStageCaption(), 'READY');
  if (state.view === 'cockpit') frameCockpit(); else frameExternal(true, 'flight');
  updateFlightStatus();
}

function activateNextWaypoint() {
  if (!missionTransitionPending()) return;
  releaseFlightInputs();
  state.scanActive = false;
  state.scanProgress = 0;
  state.scanComplete = false;
  state.speed = 0;
  ui.scanFill.style.width = '0%';
  ui.scanValue.textContent = '0%';
  ui.telemetry.classList.remove('is-visible');
  ui.telemetry.setAttribute('aria-hidden', 'true');
  ui.cockpitHud.classList.remove('is-scanning', 'is-complete');
  setMissionTarget(state.missionLeg + 1, { reframe: true });
  syncStoryUI();
  setOperation('waypoint', 'RESONATOR I 已锁定：根据左右转向提示调整船头，再接近并完成调谐', 'RESONATOR 1/7');
  updateFlightStatus();
}

function startScan({ guided = false } = {}) {
  updateFlightStatus();
  if (state.scanActive || !targetRing || (!guided && !state.scanReady)) {
    if (!guided && !state.scanReady) setOperation('scan-blocked', '扫描未解锁：先进入距离并把飞船速度稳定下来', 'NOT READY');
    return;
  }
  releaseFlightInputs();
  state.speed = 0;
  state.scanActive = true;
  state.scanProgress = 0;
  ui.scan.disabled = true;
  scanBeam.visible = true;
  ui.telemetry.classList.add('is-visible');
  ui.telemetry.setAttribute('aria-hidden', 'false');
  ui.cockpitHud.classList.add('is-scanning');
  ui.cockpitHud.classList.remove('is-complete');
  syncStoryUI();
  setOperation('scanning', state.missionLeg === 1
    ? '共鸣器正在辨认来访者：保持稳定，完成第一次调谐'
    : state.view === 'cockpit' ? '驾驶舱正在比对城市、轨道与大气中的异常记录' : '扫描波形正在寻找战争、灾难或撤离留下的证据', 'SCANNING');
}

function finishScan() {
  state.scanActive = false;
  state.scanComplete = true;
  const completedTarget = activeMissionTarget();
  if (completedTarget) completedTarget.completed = true;
  state.missionComplete = state.missionLeg >= missionTargets.length - 1;
  ui.scan.disabled = false;
  ui.scan.textContent = state.missionComplete ? '重跑第一段 Canto' : '追踪共鸣器';
  targetRing.material.color.setHex(0x8de0af);
  scanBeam.visible = false;
  ui.telemetry.classList.add('is-visible');
  ui.telemetry.setAttribute('aria-hidden', 'false');
  ui.cockpitHud.classList.remove('is-scanning');
  ui.cockpitHud.classList.add('is-complete');
  syncStoryUI();
  setOperation(
    state.missionComplete ? 'mission-complete' : 'discovered',
    state.missionComplete
      ? 'THE FIRST CANTO 已取回：共鸣器 1/7，其余六台仍在沉默区等待'
      : 'ITHIRKA II 没有灾难痕迹：扫描数据中出现了一台仍在等待的共鸣器',
    state.missionComplete ? 'CANTO 1/7' : 'TRACE FOUND',
  );
}

function startFold() {
  if (state.foldActive || !targetPlanet) return;
  if (state.folded) {
    resetExperiment();
    return;
  }
  releaseFlightInputs();
  state.speed = 0;
  foldStartCamera = camera.position.clone();
  foldStartTarget = controls.target.clone();
  foldEndTarget = getTargetWorld();
  const direction = camera.position.clone().sub(foldEndTarget).normalize();
  foldEndCamera = foldEndTarget.clone().addScaledVector(direction, 3.1).add(new THREE.Vector3(0, 0.65, 0));
  state.foldActive = true;
  state.cameraMove = null;
  state.foldProgress = 0;
  ui.fold.disabled = true;
  warpLines.visible = true;
  setOperation('folding', '折跃不是传送特效：它同时重设相机关系与渲染原点', 'FOLDING');
}

function updateFold(dt) {
  state.foldProgress = Math.min(1, state.foldProgress + dt / (reducedMotion ? 0.18 : 1.45));
  const t = state.foldProgress;
  const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  camera.position.lerpVectors(foldStartCamera, foldEndCamera, eased);
  controls.target.lerpVectors(foldStartTarget, foldEndTarget, eased);
  warpLines.material.opacity = Math.sin(Math.PI * t) * 0.64;
  warpLines.scale.setScalar(0.7 + t * 1.5);
  if (t >= 1) {
    state.foldActive = false;
    state.folded = true;
    state.originKm = state.worldKm;
    ui.origin.textContent = `+${state.originKm.toLocaleString()} km · recentered`;
    ui.world.textContent = '+0.8 km local';
    ui.fold.disabled = false;
    ui.fold.textContent = '返回轨道';
    warpLines.visible = false;
    setOperation('close-survey', '重定位完成：世界坐标很大，送进 GPU 的局部坐标仍然很小', 'RECENTERED');
  }
}

function setTourProgress(progress) {
  const percent = Math.round(THREE.MathUtils.clamp(progress, 0, 1) * 100);
  ui.tourFill.style.width = `${percent}%`;
  ui.tourFill.parentElement.setAttribute('aria-valuenow', String(percent));
  ui.tourTime.textContent = `00:${String(Math.max(0, Math.ceil(TOUR_DURATION - state.tourElapsed))).padStart(2, '0')}`;
}

function startGuidedTour() {
  if (!renderer || !targetRing) return;
  state.paused = false;
  ui.pause.textContent = '暂停画面';
  resetExperiment();
  if (state.view !== 'external') setViewMode('external');
  savedExternalCamera = null;
  frameExternal(true, 'hero');
  state.tourActive = true;
  state.tourComplete = false;
  state.tourElapsed = 0;
  state.tourStepIndex = -1;
  ui.tour.setAttribute('aria-pressed', 'true');
  ui.tourLabel.textContent = '停止并手动接管';
  ui.tourStep.textContent = '导览准备中 · 任意操作都可接管';
  setTourProgress(0);
  updateGuidedTour(0);
}

function cancelGuidedTour(message = '已切换为手动操作') {
  if (!state.tourActive) return false;
  state.tourActive = false;
  state.tourComplete = false;
  if (state.operation === 'guided') state.operation = 'live';
  if (!state.foldActive) state.cameraMove = null;
  if (controls) controls.enabled = state.view === 'external' && !state.foldActive && performance.now() >= state.flightFollowUntil;
  ui.tour.setAttribute('aria-pressed', 'false');
  ui.tourLabel.textContent = '从头播放导览';
  ui.tourStep.textContent = message;
  ui.tourTime.textContent = '00:20';
  ui.runState.textContent = 'MANUAL';
  ui.sceneState.textContent = `${state.view} / ${state.operation}`;
  return true;
}

function finishGuidedTour() {
  state.tourActive = false;
  state.tourComplete = true;
  state.tourElapsed = TOUR_DURATION;
  ui.tour.setAttribute('aria-pressed', 'false');
  ui.tourLabel.textContent = '重新播放 20 秒导览';
  ui.tourStep.textContent = '导览完成 · 当前状态可继续自由操作';
  setTourProgress(1);
  ui.tourTime.textContent = 'DONE';
}

function updateGuidedTour(dt) {
  if (!state.tourActive) return;
  state.tourElapsed = Math.min(TOUR_DURATION, state.tourElapsed + dt);
  while (state.tourStepIndex + 1 < TOUR_STEPS.length && state.tourElapsed >= TOUR_STEPS[state.tourStepIndex + 1].at) {
    state.tourStepIndex += 1;
    const step = TOUR_STEPS[state.tourStepIndex];
    ui.tourStep.textContent = step.label;
    step.action();
  }
  setTourProgress(state.tourElapsed / TOUR_DURATION);
  if (state.tourElapsed >= TOUR_DURATION) finishGuidedTour();
}

function updateMarker() {
  if (!targetPlanet) return;
  const projected = getTargetWorld().project(camera);
  const rect = ui.canvas.getBoundingClientRect();
  const x = (projected.x * 0.5 + 0.5) * rect.width;
  const y = (-projected.y * 0.5 + 0.5) * rect.height;
  const visible = projected.z > -1 && projected.z < 1 && x > -90 && x < rect.width + 90 && y > 65 && y < rect.height - 70;
  ui.marker.style.display = visible ? 'block' : 'none';
  if (visible) {
    const safeX = Math.min(Math.max(x, 22), Math.max(22, rect.width - 225));
    const bottomGuard = window.innerWidth <= 700 ? 285 : 150;
    const safeY = Math.min(Math.max(y, 95), Math.max(95, rect.height - bottomGuard));
    ui.marker.style.transform = `translate3d(${safeX}px, ${safeY}px, 0)`;
  }
}

function updateRuntimeStats(dt) {
  fpsFrames += 1;
  fpsTime += dt;
  if (fpsTime < 0.5) return;
  const measuredFps = fpsFrames / fpsTime;
  ui.fps.textContent = measuredFps.toFixed(0);
  ui.draws.textContent = String(renderer.info.render.calls);
  ui.tris.textContent = `${(renderer.info.render.triangles / 1000).toFixed(0)}k`;
  ui.pixel.textContent = `${renderer.getPixelRatio().toFixed(2)}x`;
  evaluateAutoQuality(measuredFps);
  fpsFrames = 0;
  fpsTime = 0;
}

function resize() {
  if (!renderer) return;
  const width = ui.canvas.clientWidth;
  const height = ui.canvas.clientHeight;
  const mobile = window.innerWidth <= 700;
  if (state.qualityMode === 'auto' && mobile !== state.qualityViewportMobile) {
    state.qualityTier = mobile ? 'balanced' : 'detail';
    state.qualityChangedAt = performance.now();
    state.qualityLowSamples = 0;
    state.qualityHighSamples = 0;
  }
  state.qualityViewportMobile = mobile;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, QUALITY_TIERS[state.qualityTier].dpr));
  renderer.setSize(width, height, false);
  camera.aspect = width / Math.max(1, height);
  camera.updateProjectionMatrix();
  interiorCamera.aspect = camera.aspect;
  interiorCamera.updateProjectionMatrix();
  if (ship && state.view === 'external' && !state.foldActive && !state.folded) {
    frameExternal(true, PRINCIPLES[currentPrinciple]?.preset || 'hero');
  }
  syncQualityUI(mobile && state.qualityMode === 'auto'
    ? '窄屏自动从均衡档开始，优先控制像素填充成本。'
    : '自动模式保留交互反馈，并根据持续帧率与视口压力调整真实像素密度。');
}

function bindUI() {
  ui.cameraReset.addEventListener('click', () => {
    cancelGuidedTour('已重置为飞行追随镜头');
    savedExternalCamera = null;
    state.flightFollowUntil = performance.now() + 850;
    if (state.view !== 'external') setViewMode('external');
    moveExternalCamera('flight');
  });
  document.querySelectorAll('[data-flight-control]').forEach((button) => {
    const action = button.dataset.flightControl;
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      button.setPointerCapture?.(event.pointerId);
      setFlightInput(action, true, button);
    });
    const release = () => setFlightInput(action, false, button);
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('lostpointercapture', release);
    button.addEventListener('contextmenu', (event) => event.preventDefault());
  });
  ui.fallbackRetry.addEventListener('click', () => {
    const retryUrl = new URL(window.location.href);
    retryUrl.searchParams.delete('webgl');
    retryUrl.searchParams.delete('qa');
    window.location.assign(retryUrl);
  });
  document.querySelectorAll('[data-quality-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      const mode = button.dataset.qualityMode;
      state.qualityMode = mode;
      if (mode === 'auto') {
        applyQualityTier(maxAutoTier(), '已恢复自动预算；持续低帧率时会逐级降低像素密度。', true);
      } else {
        applyQualityTier(mode, mode === 'detail'
          ? '手动细节档固定最高 1.35x；不会被自动策略覆盖。'
          : '手动节能档固定最高 0.85x；扫描反馈和交互保持完整。', true);
      }
    });
  });
  document.querySelectorAll('[data-asset-mode]').forEach((button) => {
    button.addEventListener('click', async () => {
      cancelGuidedTour('已切换资产模式 · 可随时重新播放导览');
      const mode = button.dataset.assetMode;
      if (mode === 'source') await loadSourceAssetMode();
      else {
        applyAssetMode('study');
        ui.runState.textContent = 'STUDY MODE';
      }
    });
  });
  ui.tour.addEventListener('click', () => {
    if (state.tourActive) cancelGuidedTour('导览已停止 · 当前画面可继续操作');
    else startGuidedTour();
  });
  ui.regenerate.addEventListener('click', () => {
    cancelGuidedTour();
    state.seed = safeSeed(ui.seedInput.value);
    ui.seedInput.value = String(state.seed);
    buildSystem(state.seed);
    resetExperiment();
    ui.runState.textContent = 'REGENERATED';
  });
  ui.seedInput.addEventListener('input', () => cancelGuidedTour('已切换为手动操作 · 输入新 seed 后重生成'));
  ui.seedInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') ui.regenerate.click(); });
  ui.scan.addEventListener('click', () => {
    cancelGuidedTour();
    if (state.scanComplete) {
      if (state.missionComplete) resetExperiment();
      else activateNextWaypoint();
      return;
    }
    startScan();
  });
  ui.fold.addEventListener('click', () => { cancelGuidedTour(); startFold(); });
  ui.reset.addEventListener('click', () => { cancelGuidedTour(); resetExperiment(); });
  ui.pause.addEventListener('click', () => {
    cancelGuidedTour();
    state.paused = !state.paused;
    releaseFlightInputs();
    ui.pause.textContent = state.paused ? '继续画面' : '暂停画面';
    ui.runState.textContent = state.paused ? 'PAUSED' : 'LIVE';
    ui.sceneState.textContent = `${state.view} / ${state.paused ? 'paused' : state.operation}`;
  });
  ui.statsToggle.addEventListener('click', () => {
    const hidden = ui.statsGrid.classList.toggle('is-hidden');
    ui.statsToggle.textContent = hidden ? '显示' : '隐藏';
    ui.statsToggle.setAttribute('aria-pressed', String(!hidden));
  });
  document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => {
    cancelGuidedTour();
    setViewMode(button.dataset.view);
  }));
  document.querySelectorAll('[data-principle]').forEach((button) => button.addEventListener('click', () => {
    cancelGuidedTour();
    focusPrinciple(button.dataset.principle);
  }));
  document.querySelectorAll('[data-lens]').forEach((button) => {
    button.addEventListener('click', () => {
      cancelGuidedTour();
      currentLens = button.dataset.lens;
      document.querySelectorAll('[data-lens]').forEach((tab) => {
        const active = tab === button;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
      });
      ui.lensBody.textContent = currentLens === 'ship' ? PRINCIPLES[currentPrinciple].body : LENS[currentLens].body;
      updateLensProof();
    });
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.tourActive) {
      cancelGuidedTour('导览已停止 · 当前画面可继续操作');
      return;
    }
    if (/input|textarea|select/i.test(document.activeElement?.tagName || '')) return;
    const key = event.key.toLowerCase();
    const flightKey = { w: 'thrust', s: 'reverse', a: 'left', d: 'right', ' ': 'brake' }[key];
    if (flightKey) {
      event.preventDefault();
      setFlightInput(flightKey, true);
      keyboardInputExpiresAt[flightKey] = performance.now() + 650;
      return;
    }
    if (key === 'v') {
      cancelGuidedTour();
      setViewMode(state.view === 'external' ? 'cockpit' : 'external');
    }
  });
  window.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    const flightKey = { w: 'thrust', s: 'reverse', a: 'left', d: 'right', ' ': 'brake' }[key];
    if (!flightKey) return;
    event.preventDefault();
    keyboardInputExpiresAt[flightKey] = 0;
    setFlightInput(flightKey, false);
  });
  window.addEventListener('blur', releaseFlightInputs);
  document.addEventListener('visibilitychange', () => { if (document.hidden) releaseFlightInputs(); });
}

function boot() {
  bindUI();
  if (visualQaMode) document.documentElement.dataset.visualQa = 'true';
  const probe = forceWebglFallback ? null : document.createElement('canvas').getContext('webgl2');
  if (!probe) {
    enterFallbackMode(forceWebglFallback ? 'forced' : 'capability');
    return;
  }
  try {
    renderer = new THREE.WebGLRenderer({ canvas: ui.canvas, antialias: true, powerPreference: 'high-performance', logarithmicDepthBuffer: true });
    document.documentElement.dataset.renderMode = '3d';
    renderer.setClearColor(0x030812, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.autoClear = false;
    renderer.info.autoReset = false;

    scene = new THREE.Scene();
    interiorScene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(48, 1, 0.03, 250);
    interiorCamera = new THREE.PerspectiveCamera(56, 1, 0.05, 30);
    interiorCamera.position.set(0, 1.18, 3.35);
    interiorCamera.lookAt(0, 1.08, -2.2);
    interiorCamera.layers.enableAll();

    controls = new OrbitControls(camera, ui.canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 3.8;
    controls.maxDistance = 28;
    controls.addEventListener('start', () => {
      state.flightFollowUntil = 0;
      cancelGuidedTour('已手动接管镜头 · 可随时重置飞行取景');
    });

    scene.add(new THREE.AmbientLight(0x1b3546, 0.48));
    const rimLight = new THREE.DirectionalLight(0x8bdcf1, 2.4);
    rimLight.position.set(-7, 8, 12);
    scene.add(rimLight);
    const warmLight = new THREE.DirectionalLight(0xffbb78, 1.4);
    warmLight.position.set(10, -2, -8);
    scene.add(warmLight);

    studyCockpit = makeCockpit();
    cockpit = studyCockpit;
    interiorScene.add(studyCockpit);
    interiorScene.add(new THREE.AmbientLight(0x233d49, 1.2));
    warpLines = makeWarpLines();
    scene.add(warpLines);
    scanBeam = makeScanBeam();
    scene.add(scanBeam);
    resize();
    buildSystem(state.seed);
    resetExperiment();
    window.addEventListener('resize', resize);
    requestAnimationFrame(frame);
  } catch (error) {
    enterFallbackMode('runtime');
    console.error(error);
  }
}

function frame(now) {
  requestAnimationFrame(frame);
  const dt = visualQaMode ? 0 : Math.min(0.05, Math.max(0, (now - lastTime) / 1000));
  lastTime = now;
  if (!state.paused) {
    elapsed += dt;
    if (starfield) starfield.rotation.y += dt * 0.002;
    if (systemRoot) {
      systemRoot.traverse((object) => {
        if (object.userData?.orbit && !object.userData.isMissionTarget && !state.folded) object.userData.angle += object.userData.speed * dt;
        if (object.userData?.orbit) {
          object.position.x = Math.cos(object.userData.angle) * object.userData.orbit;
          object.position.z = Math.sin(object.userData.angle) * object.userData.orbit;
        }
      });
    }
    updateFlight(dt);
    if (targetRing) targetRing.rotation.z += dt * 0.65;
    if (targetAtmosphere) targetAtmosphere.rotation.y -= dt * 0.02;
    if (ship) {
      ship.position.y = ship.userData.baseY + (reducedMotion ? 0 : Math.sin(elapsed * 1.4) * 0.035);
      if (ship.userData.dishPivot) ship.userData.dishPivot.rotation.y += dt * 0.12;
      (ship.userData.enginePlumes || []).forEach((plume, index) => {
        const pulse = reducedMotion ? 1 : 0.92 + Math.sin(elapsed * 12 + index) * 0.08;
        plume.userData.outer.scale.y = pulse * (state.foldActive ? 1.8 : 1);
        plume.userData.core.scale.y = pulse * (state.foldActive ? 2.3 : 1);
      });
      const sourceVisual = ship.userData.activeVisual?.userData?.sourceBuilt;
      if (sourceVisual) {
        const flightDemand = Math.min(1, Math.abs(state.speed) / FLIGHT.maxForward);
        const demand = state.foldActive ? 1.55 : state.scanActive ? 0.82 : 0.42 + flightDemand * 0.78;
        const visualState = ship.userData.activeVisual.userData;
        visualState.power = THREE.MathUtils.lerp(visualState.power || 0, demand, Math.min(1, dt * 4.5));
        visualState.heat = THREE.MathUtils.lerp(visualState.heat || 0, visualState.power * 0.62, Math.min(1, dt * 0.32));
        sourceVisual.engineMats.forEach((material) => {
          if (material.uniforms?.uTime) material.uniforms.uTime.value = elapsed;
          if (material.uniforms?.uPower) material.uniforms.uPower.value = visualState.power;
        });
        if (sourceVisual.radiator) sourceVisual.radiator.emissiveIntensity = visualState.heat * 0.28;
        sourceVisual.vanes?.forEach((vane, index) => {
          const side = index === 0 ? 1 : -1;
          const target = vane.userData.baseZ + side * visualState.heat * 0.26;
          vane.rotation.z += (target - vane.rotation.z) * Math.min(1, dt * 0.9);
        });
        const cycle = (elapsed * 0.72) % 1;
        const flash = cycle < 0.035 || (cycle > 0.09 && cycle < 0.125) ? 6 : 0;
        if (sourceVisual.strobe?.material?.color) sourceVisual.strobe.material.color.setRGB(flash, flash, flash);
      }
    }
    if (cockpit) {
      if (cockpit.userData.navRing) cockpit.userData.navRing.rotation.z -= dt * (state.scanActive ? 1.8 : 0.32);
      (cockpit.userData.screens || []).forEach((screen, index) => {
        screen.material.opacity = state.scanActive ? 0.68 + Math.sin(elapsed * 8 + index) * 0.22 : 0.78;
      });
    }
    if (state.tourActive) updateGuidedTour(dt);
    if (state.scanActive) {
      state.scanProgress = Math.min(1, state.scanProgress + dt / (reducedMotion ? 0.25 : 2.6));
      const percent = Math.round(state.scanProgress * 100);
      ui.scanFill.style.width = `${percent}%`;
      ui.scanValue.textContent = `${percent}%`;
      targetRing.scale.setScalar(1 + Math.sin(elapsed * 6) * 0.035 + state.scanProgress * 0.16);
      if (state.scanProgress >= 1) finishScan();
    }
    if (scanBeam?.visible) updateScanBeam();
    if (state.cameraMove) updateCameraMove(dt);
    if (state.foldActive) updateFold(dt);
    followFlightCamera(dt);
    if (state.view === 'cockpit') frameCockpit();
  }

  if (state.view === 'external' && !state.cameraMove) controls.update();
  updateSourceHullLod();
  updateFlightStatus();
  updateMarker();
  renderer.info.reset();
  renderer.clear();
  renderer.render(scene, camera);
  if (state.view === 'cockpit') {
    renderer.clearDepth();
    renderer.render(interiorScene, interiorCamera);
  }
  updateRuntimeStats(dt);
}

boot();
