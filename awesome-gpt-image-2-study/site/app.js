const capabilities = [
  { id: "ui", name: "UI 与界面", count: 73, route: "UI 截图系统", controls: "平台、页面层级、状态栏、Tab 与准确可见文字", pitfall: "避免把多个平台特征混在同一张截图中。", output: "App、网页、Dashboard、社媒与直播界面" },
  { id: "info", name: "图表与信息图", count: 52, route: "信息图引擎", controls: "模块数量、信息流、箭头、色组和短标签", pitfall: "先限制模块数量，禁止把长段正文塞进画面。", output: "流程图、知识图谱、时间线、技术解释图" },
  { id: "poster", name: "海报与排版", count: 82, route: "海报排版系统", controls: "标题层级、主视觉、色板、版式与传播比例", pitfall: "要求单张成品时，避免生成情绪板或过程拼贴。", output: "活动、电影、产品与社媒传播海报" },
  { id: "product", name: "商品与电商", count: 40, route: "商品商业视觉", controls: "商品识别、卖点、材质、场景、光线与版块", pitfall: "无关道具会削弱商品识别，包装文字要单独锁定。", output: "商品主图、包装、详情页和广告" },
  { id: "brand", name: "品牌与标志", count: 27, route: "品牌视觉系统", controls: "品牌核心、标志形态、触点、色彩与延展规则", pitfall: "单张 Logo 草图不等于完整品牌识别系统。", output: "Logo、VI、品牌触点与 Campaign" },
  { id: "space", name: "建筑与空间", count: 12, route: "建筑空间表现", controls: "透视、尺度、材质、室内外光线与动线", pitfall: "先锁定镜头和空间功能，再添加氛围细节。", output: "建筑渲染、室内、城市地图与空间概念" },
  { id: "photo", name: "摄影与写实", count: 75, route: "写实摄影系统", controls: "镜头、景别、光线、肤质、胶片与环境真实性", pitfall: "摄影术语要服务画面，不要机械堆叠器材名称。", output: "人像、手机纪实、胶片和商业摄影" },
  { id: "art", name: "插画与艺术", count: 56, route: "插画艺术系统", controls: "媒介、笔触、材质、构图、色彩与装饰密度", pitfall: "区分风格参考与直接模仿在世艺术家。", output: "插画、绘画、材质实验与装饰视觉" },
  { id: "character", name: "人物与角色", count: 26, route: "角色设定系统", controls: "身份、服装、比例、姿态、表情与多视图一致性", pitfall: "系列生成要固定不可变特征和参考视角。", output: "设定图、动作表、卡牌与 3D 玩具" },
  { id: "scene", name: "场景与叙事", count: 20, route: "场景叙事系统", controls: "人物关系、镜头序列、空间连续性与情绪节奏", pitfall: "先写清事件与镜头目的，再增加世界观细节。", output: "分镜、故事场景、直播画面与世界观" },
  { id: "history", name: "历史与古风", count: 16, route: "历史古风系统", controls: "时代、服饰、器物、长卷结构与文本出处", pitfall: "避免朝代元素混搭；长文字必须另行校对。", output: "古风长卷、历史人物、传统题材与诗词画面" },
  { id: "document", name: "文档与出版", count: 10, route: "出版页面系统", controls: "页面网格、目录、章节、图注、表格与阅读顺序", pitfall: "图片模型不替代专业排版，正文应保持短而可读。", output: "白皮书、手册、百科图鉴与出版页" },
  { id: "other", name: "其他任务", count: 28, route: "特殊输出系统", controls: "先定义最终载体，再组合最接近的模板约束", pitfall: "“创意”不是跳过结构，特殊任务更需要明确验收标准。", output: "实验、混合玩法与特殊实用输出" }
];

const scenarioConfigs = {
  product: {
    title: "商品：为新品茶饮做一张上市主视觉",
    description: "商品场景重点控制包装识别、准确卖点、材质和辅助道具；装饰不能抢走唯一主视觉。",
    category: "商品与电商", template: "商品商业视觉", style: "Product · Realistic", scene: "Commerce · Food", case: "373 · 高端品牌英雄图",
    reason: "任务同时要求商品识别、卖点表达和社媒传播，因此先锁定商品模板，再用写实材质与食品场景控制视觉。",
    pitfall: "不要让随机水果和装饰遮挡包装；包装文字与广告宣称必须精确、克制。",
    labels: { subject: "产品名", headline: "核心文案", audience: "目标人群", channel: "投放渠道" },
    defaults: { subject: "雾岭青梅气泡茶", headline: "一口醒夏", audience: "20–30 岁城市通勤人群", channel: "小红书竖版首图", ratio: "3:4 竖版" },
    channels: ["小红书竖版首图", "电商详情页头图", "线下灯箱海报"],
    tones: {
      fresh: { label: "清透自然", visual: "清透自然商业摄影，青梅绿与乳白色，冰感逆光、细密水珠、柔和自然阴影" },
      premium: { label: "高端商业", visual: "高端棚拍商业摄影，深茶褐与香槟金，轮廓光、凝露金属、克制留白" },
      technical: { label: "技术拆解", visual: "产品技术信息图，浅灰纸张背景，真实罐体配黑色工程线稿、编号箭头与青绿色数据标注" }
    }
  },
  info: {
    title: "信息图：解释城市通勤者的一天如何分配",
    description: "信息图场景先锁定读者、模块数量和关系，再决定图形语言；长段正文会直接破坏可读性。",
    category: "图表与信息图", template: "信息图引擎", style: "Infographic · Editorial", scene: "Education · Social", case: "310 · 产品技术分解图",
    reason: "任务目标是解释结构和关系，不是制造装饰插画；信息图模板会优先约束模块、标签和阅读顺序。",
    pitfall: "模块控制在 5 个以内，每个标签保持短句；箭头只能表达一种关系。",
    labels: { subject: "解释主题", headline: "主标题", audience: "目标读者", channel: "输出载体" },
    defaults: { subject: "城市通勤者的一天", headline: "24 小时精力地图", audience: "刚入职的城市白领", channel: "公众号长图", ratio: "3:4 竖版" },
    channels: ["公众号长图", "课程讲义插图", "汇报单页"],
    tones: {
      fresh: { label: "清晰编辑", visual: "编辑式信息图，米白纸张、墨黑文字、青绿色路径和五个圆角模块" },
      premium: { label: "数据商务", visual: "克制的商务信息图，深墨背景、细金色分隔线、高对比数据数字" },
      technical: { label: "系统图解", visual: "技术系统图，等宽标签、节点编号、精确连接线和清晰图例" }
    }
  },
  ui: {
    title: "UI：生成专注计时 App 的任务完成页",
    description: "UI 场景需要锁定平台、页面状态、核心组件和逐字文案，不能让模型自行混搭不同系统。",
    category: "UI 与界面", template: "UI 截图系统", style: "UI · Product", scene: "Tech", case: "17 · 高保真应用界面",
    reason: "这是一个明确页面状态，需要 UI 模板约束设备、导航、卡片层级和可见文案。",
    pitfall: "只生成一个平台和一个页面；避免同时出现 iOS 与 Android 导航特征。",
    labels: { subject: "产品 / 页面", headline: "页面主文案", audience: "使用人群", channel: "平台设备" },
    defaults: { subject: "「澄心」专注计时 App · 任务完成页", headline: "今天完成得很好", audience: "需要深度工作的知识工作者", channel: "iPhone 竖屏截图", ratio: "9:16 竖版" },
    channels: ["iPhone 竖屏截图", "Android 竖屏截图", "Web 桌面 Dashboard"],
    tones: {
      fresh: { label: "安静留白", visual: "温和的原生移动 UI，暖白背景、墨绿色强调、充足留白和轻微层次" },
      premium: { label: "深色专注", visual: "高对比深色 UI，精细的进度光环、冷灰卡片和克制荧光绿" },
      technical: { label: "数据面板", visual: "数据密集型产品界面，明确网格、可读图表、等宽数值和操作状态" }
    }
  },
  poster: {
    title: "海报：为城市夜跑活动设计报名主视觉",
    description: "海报场景先决定标题和主视觉谁是第一焦点，再控制传播比例、信息层级与单张成品边界。",
    category: "海报与排版", template: "海报排版系统", style: "Poster · Typography", scene: "Social · Sports", case: "海报类近邻案例",
    reason: "活动传播依赖远距离标题识别和明确行动信息，海报模板能把字体、主视觉和渠道比例放在同一协议中。",
    pitfall: "不要输出情绪板、多方案拼贴或过长日程；报名信息必须保持第二层级。",
    labels: { subject: "活动名称", headline: "主标题", audience: "目标人群", channel: "传播渠道" },
    defaults: { subject: "2026 城市夜跑计划", headline: "今晚，跑向灯火", audience: "18–35 岁城市运动爱好者", channel: "社媒报名海报", ratio: "3:4 竖版" },
    channels: ["社媒报名海报", "地铁灯箱", "活动现场立牌"],
    tones: {
      fresh: { label: "城市能量", visual: "城市夜色摄影与粗体排版，电光青绿、暖橙路灯、清晰速度轨迹" },
      premium: { label: "极简赛事", visual: "极简黑银赛事海报，大字号无衬线标题、单一跑者剪影和精确网格" },
      technical: { label: "路线图式", visual: "跑步路线信息海报，地图线、里程节点、编号注释和高对比标题" }
    }
  }
};

const skillRules = {
  product: {
    questions: ["产品名称和包装形态是否已经确定？", "哪些文字必须逐字准确？", "渠道、画幅和目标人群是什么？", "哪些商品数据禁止模型自行补充？"],
    before: ["只保留一个商品主视觉", "把标题、产品名和卖点放进文字白名单", "明确辅助物不得遮挡包装", "写出包装变形、随机 Logo 等禁止项"],
    after: ["逐字核对产品名、标题和卖点", "检查包装结构与品牌区域", "删除模型虚构的容量、成分或数字", "只针对失败模块修改后重试"]
  },
  info: {
    questions: ["读者是谁，读完要理解什么？", "最多允许几个信息模块？", "模块之间是时间、流程还是因果关系？", "哪些数字和结论有可信来源？"],
    before: ["模块数量控制在 3–5 个", "每个模块只保留短标签", "锁定单一阅读路径和箭头含义", "未经提供的数据不得出现"],
    after: ["检查第一眼是否看懂主题", "核对每个数字与标签", "检查箭头是否表达正确关系", "删除装饰性小字和重复模块"]
  },
  ui: {
    questions: ["目标平台和设备是什么？", "这是哪个页面、哪个状态？", "哪些文案必须准确显示？", "核心操作和信息层级是什么？"],
    before: ["只生成一个平台和一个页面状态", "列出必须出现的组件", "锁定按钮、标题和数据标签", "禁止混用不同系统导航特征"],
    after: ["检查平台特征是否一致", "核对按钮和页面文字", "检查操作层级与触控目标", "删除不可读小字和额外页面"]
  },
  poster: {
    questions: ["标题还是主视觉是第一焦点？", "观众需要记住哪一个行动？", "渠道、观看距离和画幅是什么？", "哪些日期、地点和品牌必须准确？"],
    before: ["只输出一张完成稿", "锁定标题、活动名和行动信息", "限定一个主视觉和两级信息", "禁止情绪板、赞助商占位和随机文案"],
    after: ["远距离检查标题识别", "逐字核对日期、地点和活动名", "检查主视觉是否压住行动信息", "删除多余 Logo、贴纸和说明"]
  }
};

const guideData = {
  product: { template: "商品商业视觉", noun: "商品主图", fields: "产品、渠道、文案、画幅", base: "先锁定包装识别和准确文案，再加入环境与道具。第一次只生成一个明确成品，不要同时要求主图、详情页和包装展开图。" },
  info: { template: "信息图引擎", noun: "信息图", fields: "主题、读者、3–5 个模块、信息流", base: "先确定读者和信息结构，再选择图形语言。模块越多，越应该缩短标签并明确箭头关系。" },
  ui: { template: "UI 截图系统", noun: "界面截图", fields: "平台、页面、核心组件、可见文案", base: "先锁定平台、设备与一个页面状态，再补状态栏、Tab 和内容卡片。不要让模型自行猜测平台特征。" },
  poster: { template: "海报排版系统", noun: "传播海报", fields: "活动、标题、主视觉、渠道与比例", base: "先决定标题与主视觉谁是第一焦点，再锁定版式和配色。只要求一张完成稿，不要混入设计过程。" }
};
const riskData = {
  text: { constraint: "指定文字必须逐字显示，禁止随机英文、占位文本和改写品牌名。", measure: "先检查文字和关键信息，再评价“好不好看”。错误时缩短文案并减少文本层级。" },
  layout: { constraint: "明确模块数量、主次层级、元素占比和留白，禁止额外卡片与重复信息。", measure: "先看第一眼焦点和阅读顺序，再检查元素是否遮挡；一次只调整一个布局变量。" },
  style: { constraint: "固定色板、材质、光线和不可变视觉特征，禁止混入未指定风格。", measure: "用同一模板连续生成 3 次，比较色彩、材质和主体特征的漂移程度。" }
};
const scaleData = {
  single: { action: "一次只生成一个明确成品；保留最少但完整的业务字段。", ending: "再输出自然语言 Prompt 与 JSON 版本。" },
  batch: { action: "把主体、文案、色板和场景设为变量；固定构图、画幅和负面约束。", ending: "再给出 3 个只改变主体、构图细节和色板的系列变体。" },
  agent: { action: "让 Agent 先分类和补齐字段，再输出可审查 JSON；模型调用与模板选择分离。", ending: "说明所选模板、参考案例、缺失变量和最终结构化 Prompt。" }
};

const catalog = window.AWESOME_IMAGE_CATALOG;
const state = {
  scenario: "product", tone: "fresh", promptMode: "natural",
  briefs: Object.fromEntries(Object.entries(scenarioConfigs).map(([key, value]) => [key, { ...value.defaults }])),
  guide: { goal: "product", risk: "text", scale: "single" },
  catalog: { templateId: null, query: "", category: "", style: "", scene: "", visible: 12, caseId: null },
  savedRecipes: []
};
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const escapeHTML = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);

function caseImageMarkup(item, variant = "card") {
  return `<figure class="case-visual case-visual-${variant}"><img src="${escapeHTML(item.localImageUrl)}" data-fallback="${escapeHTML(item.remoteImageUrl)}" alt="${escapeHTML(item.imageAlt || item.title)}" loading="${variant === "detail" ? "eager" : "lazy"}" /><span class="case-image-fallback"><strong>图片暂未加载</strong><small>Prompt 与来源仍可正常阅读</small></span></figure>`;
}

function attachCaseImageFallbacks(root = document) {
  root.querySelectorAll("img[data-fallback]").forEach((image) => {
    const handleError = () => {
      if (image.dataset.fallbackTried !== "true") {
        image.dataset.fallbackTried = "true";
        image.src = image.dataset.fallback;
        return;
      }
      image.hidden = true;
      image.closest(".case-visual")?.classList.add("is-error");
    };
    image.addEventListener("load", () => image.closest(".case-visual")?.classList.add("is-loaded"));
    image.addEventListener("error", handleError);
    if (image.complete && image.naturalWidth === 0) handleError();
  });
}

function renderCapability(id = "product") {
  const item = capabilities.find((entry) => entry.id === id) || capabilities[0];
  $$("#categoryTabs button").forEach((button) => {
    const selected = button.dataset.category === item.id;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  $("#capabilityDetail").innerHTML = `<div class="capability-title"><span>${String(item.count).padStart(2, "0")} CASES</span><h4>${item.name}</h4><p>${item.output}</p></div><div class="capability-facts"><div><small>推荐路由</small><strong>${item.route}</strong><span>先选择最接近的输出协议</span></div><div><small>关键控制</small><strong>${item.controls}</strong><span>把这些变量写进 Prompt</span></div><div><small>主要陷阱</small><strong>${item.pitfall}</strong><span>作为负面约束或评审项</span></div></div>`;
}

function initCapabilities() {
  const tabs = $("#categoryTabs");
  capabilities.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button"; button.role = "tab"; button.dataset.category = item.id;
    button.textContent = `${item.name} · ${item.count}`; button.setAttribute("aria-selected", "false");
    button.addEventListener("click", () => renderCapability(item.id));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const current = capabilities.findIndex((entry) => entry.id === item.id);
      const next = capabilities[(current + (event.key === "ArrowRight" ? 1 : -1) + capabilities.length) % capabilities.length];
      renderCapability(next.id); tabs.querySelector(`[data-category="${next.id}"]`).focus();
    });
    tabs.append(button);
  });
  renderCapability("product");
}

function categoryTitle(value) {
  return catalog.categories.find((item) => item.value === value)?.title?.zh || value;
}

function fillSelect(selector, values, labeler = (value) => value) {
  const select = $(selector);
  values.forEach((value) => select.insertAdjacentHTML("beforeend", `<option value="${escapeHTML(value)}">${escapeHTML(labeler(value))}</option>`));
}

function renderTemplateList() {
  const selectedId = state.catalog.templateId || catalog.templates[0].id;
  state.catalog.templateId = selectedId;
  $("#templateList").innerHTML = catalog.templates.map((template, index) => {
    const selected = template.id === selectedId;
    return `<button type="button" role="option" aria-selected="${selected}" tabindex="${selected ? 0 : -1}" class="template-item${selected ? " is-selected" : ""}" data-template-id="${escapeHTML(template.id)}"><span>${String(index + 1).padStart(2, "0")}</span><div><strong>${escapeHTML(template.title.zh)}</strong><small>${escapeHTML(categoryTitle(template.category))}</small></div></button>`;
  }).join("");
  const position = catalog.templates.findIndex((item) => item.id === selectedId) + 1;
  $("#templatePosition").textContent = `${position} / ${catalog.templates.length}`;
}

function renderTemplateDetail() {
  const template = catalog.templates.find((item) => item.id === state.catalog.templateId) || catalog.templates[0];
  const guidance = template.guidance.zh.map((item) => `<li>${escapeHTML(item)}</li>`).join("");
  const pitfalls = template.pitfalls.zh.map((item) => `<li>${escapeHTML(item)}</li>`).join("");
  const examples = template.exampleCases.map((id) => {
    const item = catalog.cases.find((entry) => entry.id === id);
    return item ? `<button type="button" data-example-case="${id}"><span>Case ${id}</span><strong>${escapeHTML(item.title)}</strong></button>` : "";
  }).join("");
  $("#templateDetail").innerHTML = `<div class="template-detail-head"><div><p class="micro-label">${escapeHTML(template.category)}</p><h3>${escapeHTML(template.title.zh)}</h3><p>${escapeHTML(template.description.zh)}</p></div><div class="tag-row">${[...template.styles, ...template.scenes].map((tag) => `<span>${escapeHTML(tag)}</span>`).join("")}</div></div><div class="template-when"><span>适合什么时候</span><strong>${escapeHTML(template.useWhen.zh)}</strong></div><div class="template-rules"><div><span>建议这样控制</span><ul>${guidance}</ul></div><div><span>常见失败</span><ul>${pitfalls}</ul></div></div><div class="template-examples"><span>关联案例</span><div>${examples || "暂无关联案例"}</div></div>`;
}

function filteredCases() {
  const query = state.catalog.query.trim().toLowerCase().replace(/^case\s*/i, "");
  return catalog.cases.filter((item) => {
    const haystack = `${item.id} ${item.title} ${item.prompt}`.toLowerCase();
    return (!query || haystack.includes(query)) && (!state.catalog.category || item.category === state.catalog.category) && (!state.catalog.style || item.styles.includes(state.catalog.style)) && (!state.catalog.scene || item.scenes.includes(state.catalog.scene));
  });
}

function renderCaseInspector(id = state.catalog.caseId) {
  const item = catalog.cases.find((entry) => entry.id === id);
  if (!item) {
    $("#caseInspector").innerHTML = `<div class="inspector-placeholder"><span>CASE PROMPT INSPECTOR</span><strong>选择任一案例查看完整 Prompt</strong><p>图片留在原始来源；这里保留可研究、可追溯的文字与标签。</p></div>`;
    return;
  }
  state.catalog.caseId = item.id;
  $("#caseInspector").innerHTML = `<div class="case-inspector-layout">${caseImageMarkup(item, "detail")}<div class="case-inspector-copy"><div class="case-inspector-head"><div><p class="micro-label">CASE ${item.id} · ${escapeHTML(categoryTitle(item.category))}</p><h3>${escapeHTML(item.title)}</h3></div><div class="source-actions"><a href="${escapeHTML(item.sourceUrl)}" target="_blank" rel="noreferrer">原始来源 ↗</a><a href="${escapeHTML(item.githubUrl)}" target="_blank" rel="noreferrer">仓库定位 ↗</a></div></div><div class="tag-row">${[...item.styles, ...item.scenes].map((tag) => `<span>${escapeHTML(tag)}</span>`).join("")}</div><p class="case-reference-note">真实案例图仅作研究参考；授权与商业使用范围请以原始来源为准。</p><pre><code>${escapeHTML(item.prompt)}</code></pre><button class="copy-button" type="button" id="copyCasePrompt">复制这个案例 Prompt</button><p class="copy-status" id="caseCopyStatus" role="status" aria-live="polite"></p></div></div>`;
  attachCaseImageFallbacks($("#caseInspector"));
  $("#copyCasePrompt").addEventListener("click", () => copyText(item.prompt, $("#caseCopyStatus"), $("#copyCasePrompt")));
}

function renderCases() {
  const matches = filteredCases();
  const visible = matches.slice(0, state.catalog.visible);
  $("#caseResultCount").textContent = String(matches.length);
  $("#caseRange").textContent = matches.length ? `显示 1–${visible.length} / ${matches.length}` : "没有匹配案例";
  $("#loadMoreCases").hidden = visible.length >= matches.length;
  $("#catalogEmpty").hidden = matches.length > 0;
  $("#caseGrid").innerHTML = visible.map((item) => `<article class="case-card">${caseImageMarkup(item)}<div class="case-card-body"><div class="case-card-top"><span>CASE ${item.id}</span><small>${escapeHTML(categoryTitle(item.category))}</small></div><h4>${escapeHTML(item.title)}</h4><p>${escapeHTML(item.promptPreview)}…</p><div class="tag-row">${[...item.styles.slice(0, 2), ...item.scenes.slice(0, 1)].map((tag) => `<span>${escapeHTML(tag)}</span>`).join("")}</div><small class="case-source">来源 · ${escapeHTML(item.sourceLabel)}</small><button type="button" data-case-id="${item.id}">查看图片与完整 Prompt</button></div></article>`).join("");
  attachCaseImageFallbacks($("#caseGrid"));
}

function resetCatalog() {
  state.catalog.query = ""; state.catalog.category = ""; state.catalog.style = ""; state.catalog.scene = ""; state.catalog.visible = 12;
  $("#catalogFilters").reset(); renderCases();
}

function initCatalog() {
  if (!catalog) return;
  $("#catalogTemplateTotal").textContent = catalog.totals.templates;
  $("#catalogCaseTotal").textContent = catalog.totals.cases;
  $("#catalogCategoryTotal").textContent = catalog.totals.categories;
  $("#catalogStyleTotal").textContent = catalog.totals.styles;
  fillSelect("#caseCategory", catalog.categories.map((item) => item.value), categoryTitle);
  fillSelect("#caseStyle", catalog.styles);
  fillSelect("#caseScene", catalog.scenes);
  state.catalog.templateId = catalog.templates.find((item) => item.category === "Products & E-commerce")?.id || catalog.templates[0].id;
  renderTemplateList(); renderTemplateDetail(); renderCases(); renderCaseInspector();
  $("#templateList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-template-id]"); if (!button) return;
    state.catalog.templateId = button.dataset.templateId; renderTemplateList(); renderTemplateDetail();
  });
  $("#templateList").addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
    event.preventDefault();
    const current = catalog.templates.findIndex((item) => item.id === state.catalog.templateId);
    const next = catalog.templates[(current + (event.key === "ArrowDown" ? 1 : -1) + catalog.templates.length) % catalog.templates.length];
    state.catalog.templateId = next.id; renderTemplateList(); renderTemplateDetail();
    $("#templateList [aria-selected='true']").focus();
  });
  $("#templateDetail").addEventListener("click", (event) => {
    const button = event.target.closest("[data-example-case]"); if (!button) return;
    renderCaseInspector(Number(button.dataset.exampleCase)); $("#caseInspector").focus();
  });
  $("#catalogFilters").addEventListener("input", () => {
    state.catalog.query = $("#caseSearch").value; state.catalog.category = $("#caseCategory").value;
    state.catalog.style = $("#caseStyle").value; state.catalog.scene = $("#caseScene").value; state.catalog.visible = 12; renderCases();
  });
  $("#caseGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-case-id]"); if (!button) return;
    renderCaseInspector(Number(button.dataset.caseId)); $("#caseInspector").focus();
  });
  $("#loadMoreCases").addEventListener("click", () => { state.catalog.visible += 12; renderCases(); });
  $("#resetCatalog").addEventListener("click", resetCatalog); $("#emptyReset").addEventListener("click", resetCatalog);
}

function briefValues() {
  return state.briefs[state.scenario];
}

function renderScenarioFields() {
  const config = scenarioConfigs[state.scenario];
  const values = briefValues();
  $("#scenarioFields").innerHTML = `<label for="briefSubject"><span>${config.labels.subject}</span><input id="briefSubject" name="subject" value="${escapeHTML(values.subject)}" maxlength="42" /></label><label for="briefHeadline"><span>${config.labels.headline}</span><input id="briefHeadline" name="headline" value="${escapeHTML(values.headline)}" maxlength="36" /></label><label for="briefAudience"><span>${config.labels.audience}</span><input id="briefAudience" name="audience" value="${escapeHTML(values.audience)}" maxlength="48" /></label><div class="field-grid"><label for="briefChannel"><span>${config.labels.channel}</span><select id="briefChannel" name="channel">${config.channels.map((item) => `<option${item === values.channel ? " selected" : ""}>${escapeHTML(item)}</option>`).join("")}</select></label><label for="briefRatio"><span>画幅</span><select id="briefRatio" name="ratio">${["3:4 竖版", "1:1 方形", "16:9 横版", "9:16 竖版"].map((item) => `<option${item === values.ratio ? " selected" : ""}>${item}</option>`).join("")}</select></label></div>`;
  $$("[data-tone]").forEach((button) => { button.textContent = config.tones[button.dataset.tone].label; });
}

function naturalPrompt(values, config, tone) {
  const specific = {
    product: { composition: "单一成品画面，产品包装为唯一主视觉，占画面约 40%；标题位于左上，3 个短卖点位于底部；辅助青梅、冰块与气泡不遮挡包装。", text: `主标题必须准确显示“${values.headline}”；产品名必须准确显示“${values.subject}”；卖点仅显示“0 糖”“真果汁”“冰爽气泡”。`, avoid: "包装不得变形或被遮挡；不要多瓶堆叠、无关水果、随机 Logo、错误汉字、额外英文或廉价塑料感。" },
    info: { composition: "单页信息图，建立 5 个时间模块，从早到晚按单一路径阅读；每个模块仅保留图标、时间和一个短标签。", text: `主标题必须准确显示“${values.headline}”；模块标签只使用“启动”“深度”“补给”“协作”“恢复”。`, avoid: "不要长段正文、3D 饼图、交叉箭头、无意义数据或装饰性小字。" },
    ui: { composition: "单个完整页面状态：顶部状态栏与标题，中部完成进度环和两张数据卡，底部一个主操作按钮与原生 Tab 栏。", text: `页面主标题必须准确显示“${values.headline}”；按钮只显示“完成并休息”；数据标签仅显示“专注 50 分钟”“中断 0 次”。`, avoid: "不要设备模型拼贴、多个页面、随机英文、不可读小字或混合 iOS 与 Android 导航。" },
    poster: { composition: "单张活动海报，超大标题为第一焦点，单一跑者剪影为第二焦点；报名日期与地点置于底部信息区。", text: `主标题必须准确显示“${values.headline}”；活动名准确显示“${values.subject}”；次级信息只显示“8 月 22 日 20:00”“滨江起点”。`, avoid: "不要情绪板、多方案拼贴、多个跑者脸部特写、随机赞助商 Logo 或冗长活动说明。" }
  }[state.scenario];
  return `【主体与任务】\n为“${values.subject}”生成${config.category}视觉，面向${values.audience}，用于${values.channel}。\n\n【构图与布局】\n${specific.composition}\n\n【视觉风格与材质】\n${tone.visual}；保持单一视觉语言和清晰信息层级。\n\n【文字与标签】\n${specific.text} 禁止增加占位文本。\n\n【比例与输出】\n${values.ratio}，适配${values.channel}，输出高完成度单张成品。\n\n【限制与负面项】\n${specific.avoid} 不要输出情绪板或多方案拼贴。`;
}

function jsonPrompt(values, config, tone) {
  return JSON.stringify({ type: config.template, scenario: state.scenario, subject: values.subject, audience: values.audience, channel: values.channel, exact_headline: values.headline, style: tone.visual, output: { aspect_ratio: values.ratio, format: "single_finished_visual" }, validation: ["检查文字逐字准确", "检查第一视觉焦点", "检查未增加随机内容", "失败时只修改一个变量"] }, null, 2);
}

function renderPreview(values) {
  const config = scenarioConfigs[state.scenario];
  const ratio = values.ratio.split(" ")[0];
  const previews = {
    product: `<div class="poster-grain"></div><div class="poster-kicker">${escapeHTML(values.channel.replace("首图", "").replace("头图", ""))}</div><div class="poster-title">${escapeHTML(values.headline)}</div><div class="poster-product" aria-hidden="true"><span class="leaf leaf-a"></span><span class="leaf leaf-b"></span><div class="can"><span class="can-brand">${escapeHTML(values.subject.slice(0, 4))}</span><i></i></div><div class="bubble bubble-a"></div><div class="bubble bubble-b"></div><div class="bubble bubble-c"></div></div><div class="poster-meta"><span>${escapeHTML(values.subject)}</span><span>0 糖 · 真果汁 · 冰爽气泡</span></div><div class="poster-ratio">${ratio}</div>`,
    info: `<div class="preview-kicker">INFO MAP / ${escapeHTML(values.channel)}</div><div class="info-title">${escapeHTML(values.headline)}</div><div class="info-path"><div><span>07:30</span><strong>启动</strong></div><i>→</i><div><span>09:30</span><strong>深度</strong></div><i>→</i><div><span>12:30</span><strong>补给</strong></div><i>→</i><div><span>15:00</span><strong>协作</strong></div><i>→</i><div><span>22:30</span><strong>恢复</strong></div></div><div class="preview-foot">${escapeHTML(values.subject)} · ${ratio}</div>`,
    ui: `<div class="phone-shell"><div class="phone-status"><span>9:41</span><span>● ● ●</span></div><div class="ui-eyebrow">${escapeHTML(values.subject.split("·")[0])}</div><div class="ui-title">${escapeHTML(values.headline)}</div><div class="progress-ring"><strong>50</strong><span>分钟</span></div><div class="ui-cards"><div><small>专注</small><strong>50 分钟</strong></div><div><small>中断</small><strong>0 次</strong></div></div><button type="button" tabindex="-1">完成并休息</button><div class="ui-tabs">今日　历史　我的</div></div>`,
    poster: `<div class="event-grid"></div><div class="event-kicker">${escapeHTML(values.subject)}</div><div class="event-title">${escapeHTML(values.headline)}</div><div class="runner-mark" aria-hidden="true"></div><div class="event-meta"><strong>8 月 22 日 20:00</strong><span>滨江起点 · ${escapeHTML(values.channel)}</span></div><div class="poster-ratio">${ratio}</div>`
  };
  const preview = $("#posterPreview");
  preview.className = `poster-preview tone-${state.tone} scenario-${state.scenario}`; preview.innerHTML = previews[state.scenario];
  $("#demoTitle").textContent = config.title; $("#demoDescription").textContent = config.description;
}

function skillRecipeText() {
  const config = scenarioConfigs[state.scenario];
  const values = briefValues();
  const tone = config.tones[state.tone];
  const rules = skillRules[state.scenario];
  return [
    "---",
    `name: ${($("#recipeName")?.value || `${values.subject} · ${config.template}`).trim()}`,
    `purpose: 为${config.category}任务补问信息、选择模板、编译 Prompt 并检查结果`,
    "auto_route:",
    `  category: ${config.category}`,
    `  template: ${config.template}`,
    `  style: ${config.style} · ${tone.label}`,
    "required_inputs:",
    `  subject: ${values.subject}`,
    `  headline: ${values.headline}`,
    `  audience: ${values.audience}`,
    `  channel: ${values.channel}`,
    `  ratio: ${values.ratio}`,
    "clarify_before_work:",
    ...rules.questions.map((item) => `  - ${item}`),
    "prompt_contract:",
    "  - 主体与任务",
    "  - 构图与布局",
    "  - 视觉风格与材质",
    "  - 文字与标签",
    "  - 比例与输出",
    "  - 限制与负面项",
    "preflight_checks:",
    ...rules.before.map((item) => `  - ${item}`),
    "post_generation_review:",
    ...rules.after.map((item) => `  - ${item}`),
    "failure_policy: 只修改失败模块；事实、品牌文字与用户确认的不变量不得自行改写",
    "---"
  ].join("\n");
}

function renderChecklist(selector, items) {
  $(selector).innerHTML = items.map((item) => `<li><span aria-hidden="true">✓</span>${escapeHTML(item)}</li>`).join("");
}

function renderSkillBuilder() {
  if (!$("#skillBuilder")) return;
  const config = scenarioConfigs[state.scenario];
  const values = briefValues();
  const rules = skillRules[state.scenario];
  const nameInput = $("#recipeName");
  if (nameInput.dataset.scenario !== state.scenario) {
    nameInput.value = `${values.subject} · ${config.template}`;
    nameInput.dataset.scenario = state.scenario;
  }
  renderChecklist("#skillQuestions", rules.questions);
  renderChecklist("#skillBefore", rules.before);
  renderChecklist("#skillAfter", rules.after);
  $("#skillRecipeOutput").textContent = skillRecipeText();
}

const recipeStorageKey = "awesome-gpt-image-2-skill-recipes-v1";

function persistRecipes() {
  try {
    localStorage.setItem(recipeStorageKey, JSON.stringify(state.savedRecipes));
    return true;
  } catch {
    return false;
  }
}

function readRecipes() {
  try {
    const stored = JSON.parse(localStorage.getItem(recipeStorageKey) || "[]");
    state.savedRecipes = Array.isArray(stored) ? stored : [];
  } catch {
    state.savedRecipes = [];
  }
}

function renderSavedRecipes() {
  const shelf = $("#savedRecipeList");
  if (!state.savedRecipes.length) {
    shelf.innerHTML = `<p class="recipe-empty">还没有保存配方。调整当前场景后点击“保存到本机”。</p>`;
    return;
  }
  shelf.innerHTML = state.savedRecipes.slice().reverse().map((recipe) => `<article class="saved-recipe-card"><button type="button" class="load-recipe" data-load-recipe="${recipe.id}"><span>${escapeHTML(scenarioConfigs[recipe.scenario]?.category || recipe.scenario)}</span><strong>${escapeHTML(recipe.name)}</strong><small>${escapeHTML(recipe.subject)} · ${escapeHTML(recipe.channel)}</small></button><button type="button" class="delete-recipe" data-delete-recipe="${recipe.id}" aria-label="删除配方 ${escapeHTML(recipe.name)}">删除</button></article>`).join("");
}

function saveCurrentRecipe() {
  const values = briefValues();
  const name = ($("#recipeName").value || `${values.subject} · ${scenarioConfigs[state.scenario].template}`).trim();
  state.savedRecipes.push({ id: Date.now(), name, scenario: state.scenario, tone: state.tone, values: { ...values }, subject: values.subject, channel: values.channel, recipe: skillRecipeText() });
  if (state.savedRecipes.length > 12) state.savedRecipes = state.savedRecipes.slice(-12);
  const saved = persistRecipes();
  renderSavedRecipes();
  $("#skillRecipeStatus").textContent = saved ? `已保存“${name}”，以后可以从下方恢复。` : "当前浏览器未允许保存，请复制配方后手动保留。";
}

function loadRecipe(id) {
  const recipe = state.savedRecipes.find((item) => item.id === id);
  if (!recipe || !scenarioConfigs[recipe.scenario]) return;
  state.briefs[recipe.scenario] = { ...recipe.values };
  setScenario(recipe.scenario, recipe.tone || "fresh");
  $("#recipeName").value = recipe.name;
  $("#skillRecipeOutput").textContent = skillRecipeText();
  $("#skillRecipeStatus").textContent = `已恢复“${recipe.name}”。`;
  $("#skillBuilder").scrollIntoView({ block: "start" });
}

function deleteRecipe(id) {
  state.savedRecipes = state.savedRecipes.filter((item) => item.id !== id);
  persistRecipes();
  renderSavedRecipes();
  $("#skillRecipeStatus").textContent = "已删除这条本机配方。";
}

function updateDemo() {
  const config = scenarioConfigs[state.scenario]; const values = briefValues(); const tone = config.tones[state.tone];
  renderPreview(values);
  $("#routeCategory").textContent = config.category; $("#routeTemplate").textContent = config.template;
  $("#routeStyle").textContent = `${config.style} · ${tone.label}`; $("#routeScene").textContent = config.scene; $("#routeCase").textContent = config.case;
  $("#routeReason").textContent = config.reason; $("#routePitfall").textContent = config.pitfall;
  $("#rawPrompt").textContent = `帮我做一张关于“${values.subject}”的图。`;
  $("#promptOutput").textContent = state.promptMode === "json" ? jsonPrompt(values, config, tone) : naturalPrompt(values, config, tone);
  renderSkillBuilder();
}

function setScenario(id, tone = "fresh") {
  state.scenario = id; state.tone = tone;
  $$("[data-scenario]").forEach((button) => { const selected = button.dataset.scenario === id; button.classList.toggle("is-selected", selected); button.setAttribute("aria-selected", String(selected)); button.tabIndex = selected ? 0 : -1; });
  $$("[data-tone]").forEach((button) => { const selected = button.dataset.tone === state.tone; button.classList.toggle("is-selected", selected); button.setAttribute("aria-pressed", String(selected)); });
  renderScenarioFields(); updateDemo();
}

async function copyText(text, statusElement, button) {
  const original = button.textContent;
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
    else { const area = document.createElement("textarea"); area.value = text; area.style.position = "fixed"; area.style.opacity = "0"; document.body.append(area); area.select(); if (!document.execCommand("copy")) throw new Error("copy unavailable"); area.remove(); }
    button.textContent = "已复制"; statusElement.textContent = "内容已复制到剪贴板。";
  } catch { statusElement.textContent = "浏览器未允许自动复制，请选中文本后手动复制。"; }
  window.setTimeout(() => { button.textContent = original; }, 1800);
}

function initDemo() {
  $("#scenarioSwitch").addEventListener("click", (event) => { const button = event.target.closest("[data-scenario]"); if (button) setScenario(button.dataset.scenario); });
  $("#scenarioSwitch").addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault(); const keys = Object.keys(scenarioConfigs); const current = keys.indexOf(state.scenario); const next = keys[(current + (event.key === "ArrowRight" ? 1 : -1) + keys.length) % keys.length];
    setScenario(next); $(`[data-scenario="${next}"]`).focus();
  });
  $("#briefForm").addEventListener("input", (event) => { if (event.target.name) state.briefs[state.scenario][event.target.name] = event.target.value; updateDemo(); });
  $$("[data-tone]").forEach((button) => button.addEventListener("click", () => { state.tone = button.dataset.tone; $$("[data-tone]").forEach((item) => { const selected = item === button; item.classList.toggle("is-selected", selected); item.setAttribute("aria-pressed", String(selected)); }); updateDemo(); }));
  $$("[data-prompt-mode]").forEach((button) => button.addEventListener("click", () => { state.promptMode = button.dataset.promptMode; $$("[data-prompt-mode]").forEach((item) => { const selected = item === button; item.classList.toggle("is-active", selected); item.setAttribute("aria-selected", String(selected)); }); updateDemo(); }));
  $("#copyPrompt").addEventListener("click", () => copyText($("#promptOutput").textContent, $("#copyStatus"), $("#copyPrompt")));
  renderScenarioFields(); updateDemo();
}

function initSkillBuilder() {
  readRecipes();
  renderSavedRecipes();
  renderSkillBuilder();
  $("#recipeName").addEventListener("input", () => { $("#skillRecipeOutput").textContent = skillRecipeText(); });
  $("#copySkillRecipe").addEventListener("click", () => copyText($("#skillRecipeOutput").textContent, $("#skillRecipeStatus"), $("#copySkillRecipe")));
  $("#saveSkillRecipe").addEventListener("click", saveCurrentRecipe);
  $("#savedRecipeList").addEventListener("click", (event) => {
    const loadButton = event.target.closest("[data-load-recipe]");
    const deleteButton = event.target.closest("[data-delete-recipe]");
    if (loadButton) loadRecipe(Number(loadButton.dataset.loadRecipe));
    if (deleteButton) deleteRecipe(Number(deleteButton.dataset.deleteRecipe));
  });
}

function renderGuide() {
  const goal = guideData[state.guide.goal]; const risk = riskData[state.guide.risk]; const scale = scaleData[state.guide.scale];
  $("#guideTitle").textContent = `从“${goal.template}”模板开始`; $("#guideSummary").textContent = goal.base;
  $("#guideAction").textContent = `${goal.fields}。${scale.action}`; $("#guideConstraint").textContent = risk.constraint; $("#guideMeasure").textContent = risk.measure;
  $("#guidePrompt").textContent = `使用 gpt-image-2-style-library，为我的${goal.noun}选择模板。先向我确认${goal.fields}和必须避免的错误，${scale.ending}`;
}

function initGuide() {
  $$('[data-guide-group] button').forEach((button) => button.addEventListener("click", () => { const group = button.closest("[data-guide-group]").dataset.guideGroup; state.guide[group] = button.dataset.guideValue; button.closest(".guide-options").querySelectorAll("button").forEach((item) => { const selected = item === button; item.classList.toggle("is-selected", selected); item.setAttribute("aria-pressed", String(selected)); }); renderGuide(); }));
  $("#copyGuide").addEventListener("click", () => copyText($("#guidePrompt").textContent, $("#guideCopyStatus"), $("#copyGuide"))); renderGuide();
}

initCapabilities();
initCatalog();
initDemo();
initSkillBuilder();
initGuide();
