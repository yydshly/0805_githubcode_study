const SOURCE_ROOT = "https://github.com/nihe0909/xiaohongshu-ai-workbench/blob/464ccec036139f0d9bd2b31af9c7b75296f3161a";

const skills = [
  {
    id: "suite",
    name: "总控路由",
    code: "xiaohongshu-suite",
    level: "编排层",
    summary: "当问题横跨主页、选题、标题、评论和行动路径时，判断应该先做哪一步，并把任务交给最具体的子 Skill。它不替代子 Skill 完成长输出。",
    inputs: ["模糊的账号或运营问题", "用户已有产品与材料", "本次最想解决的目标"],
    outputs: ["问题类型判断", "最短处理顺序", "整理后的下一步输入"],
    boundary: "只负责路由；明确的单点请求不扩展为全账号诊断。",
    source: `${SOURCE_ROOT}/xiaohongshu-suite/SKILL.md`
  },
  {
    id: "profile",
    name: "主页体检",
    code: "xiaohongshu-profile",
    level: "承接层",
    summary: "检查一个新用户进入主页后三秒内，能否看懂你是谁、帮谁、解决什么、为什么可信以及下一步做什么。",
    inputs: ["昵称、头像和简介", "置顶笔记", "账号定位、产品与目标用户"],
    outputs: ["主页第一眼判断", "问题优先级", "简介版本与置顶建议"],
    boundary: "不编造粉丝量、信任材料和转化率；单改简介时不输出完整诊断。",
    source: `${SOURCE_ROOT}/xiaohongshu-profile/SKILL.md`
  },
  {
    id: "magazine",
    name: "母题与栏目",
    code: "xiaohongshu-magazine",
    level: "战略层",
    summary: "把账号当成一本杂志：先定读者最终记住的母题，再区分围绕业务或个人，建立长期栏目和选题库。",
    inputs: ["账号定位和目标读者", "产品、服务或个人经历", "已有素材与长期表达方向"],
    outputs: ["唯一母题", "4–6 个固定栏目", "信任/喜欢选题库与优先级"],
    boundary: "负责长期选题骨架，不负责 7/14/30 天日历。每篇内容都必须挂回母题。",
    source: `${SOURCE_ROOT}/xiaohongshu-magazine/SKILL.md`
  },
  {
    id: "planner",
    name: "发布规划",
    code: "xiaohongshu-topic-planner",
    level: "战术层",
    summary: "把定位、读者处境、产品和目标拆成可连续发布的选题系统，并按吸引、共鸣、信任、教育、转化和互动分类。",
    inputs: ["账号定位与目标用户", "产品、目标与素材", "7/14/30 天周期"],
    outputs: ["内容主线与选题池", "发布优先级", "逐篇角度、标题方向与目的"],
    boundary: "不查询实时趋势，也不承诺爆款、涨粉或搜索排名。",
    source: `${SOURCE_ROOT}/xiaohongshu-topic-planner/SKILL.md`
  },
  {
    id: "title",
    name: "标题外科",
    code: "xiaohongshu-title",
    level: "包装层",
    summary: "从真实内容中抓具体场景、用户处境和传播钩子，用快速、诊断或优化模式生成适合封面与搜索的标题。",
    inputs: ["正文、选题或卖点", "目标用户与内容目标", "已有标题或画面描述"],
    outputs: ["快速模式 24 个标题", "诊断模式 4 方向 20 个标题", "原标题诊断与改写"],
    boundary: "限制长度、套话、虚构数字和绝对效果；输入没有的结果不能写成确定承诺。",
    source: `${SOURCE_ROOT}/xiaohongshu-title/SKILL.md`
  },
  {
    id: "comment",
    name: "评论回复",
    code: "xiaohongshu-comment-reply",
    level: "互动层",
    summary: "让回复先回应对方说了什么，再补充边界和下一步；目标是延续真实对话，而不是把每条评论都推向私信。",
    inputs: ["笔记主题与评论", "账号人设和语气", "互动目标与不能说的话"],
    outputs: ["友好、专业、评论区口吻", "置顶评论", "私信引导与风险提醒"],
    boundary: "不争辩、不阴阳、不硬推；高风险话题不承诺价格、效果、法律、医疗或财务结果。",
    source: `${SOURCE_ROOT}/xiaohongshu-comment-reply/SKILL.md`
  },
  {
    id: "conversion",
    name: "行动路径",
    code: "xiaohongshu-conversion-path",
    level: "转化层",
    summary: "把刷到内容、进入主页、建立信任、采取行动和再次访问串起来。免费产品的转化也可以是体验、收藏、反馈和分享。",
    inputs: ["账号、产品与用户", "交付方式与用户顾虑", "体验、咨询、购买或反馈目标"],
    outputs: ["用户阻力与内容分工", "主页和置顶承接", "评论动作、筛选问题与下一步"],
    boundary: "设计路径而不承诺成交；私信先筛选需求，不一上来成交。",
    source: `${SOURCE_ROOT}/xiaohongshu-conversion-path/SKILL.md`
  }
];

const titles = [
  ["犀利吐槽", "别把这套 Skill 当代运营", "它连账号都不会登录"],
  ["情绪定性", "我差点把工作台理解反了", "想自动发笔记的人会失望"],
  ["悬念代价", "装完 7 个 Skill，我先删掉一个期待", "用它之前，先看清这个边界"],
  ["反常识", "会运营，不等于会替你发布", "这套工作台真正省的是判断"],
  ["冷知识", "`.skill` 文件里装的不是模型", "这套工作台最值钱的不是代码"],
  ["强反转", "我以为是代运营，结果更像主编", "没有数据后台，却能管 6 个环节"],
  ["人话口吻", "我懂了，它负责想清楚", "先别让 AI 急着写正文"],
  ["趣味夸张", "7 个 Skill，开了一场选题会", "一个文件，管住 AI 的营销腔"],
  ["评论区", "所以它更像运营教练？", "这不就是给 AI 的运营手册吗"],
  ["对话提问", "你要代运营，还是先想清内容？", "你真的需要自动发笔记吗？"],
  ["数字焦虑", "7 个 Skill，把运营拆成 6 段", "看完 27 个样例，我发现一个缺口"],
  ["独体句", "运营说明书，不是外挂", "它负责判断，不负责发"]
];

const workflow = [
  {
    id: "profile",
    name: "主页",
    title: "先让读者三秒看懂",
    sourceLabel: "xiaohongshu-profile",
    source: `${SOURCE_ROOT}/xiaohongshu-profile/SKILL.md`,
    plainText: `主页结论：GitHub Code Study 能说明研究对象，但用户收益藏在项目名称后。\n\n推荐简介：\n研究 AI 开源项目｜固定源码、拆原理、做演示｜帮你判断：能做什么，值不值得用｜先看置顶总览\n\n置顶：研究方法、项目总目录、最新完整研究。`,
    render: () => `
      <div class="output-head"><div><small>STEP 01 · PROFILE</small><h3>先让读者三秒看懂</h3></div><span>主页承接</span></div>
      <p class="output-lede">当前项目名能说明“研究什么”，但用户收益藏在项目名称之后。主页需要把“研究项目”翻译成“帮你判断值不值得用”。</p>
      <div class="result-card accent"><span>首推简介</span><h4>研究 AI 开源项目｜固定源码、拆原理、做演示</h4><p>帮你判断：能做什么，值不值得用｜先看置顶总览</p></div>
      <span class="output-label">四种表达方向</span>
      <div class="bio-grid">
        <div><span>清晰专业</span><p>研究 AI 开源项目｜固定源码、拆原理、做演示｜帮你判断：能做什么，值不值得用</p></div>
        <div><span>亲近人话</span><p>我替你把 AI 开源项目跑明白｜不搬运 README，只讲能力、原理和坑</p></div>
        <div><span>行动引导</span><p>每次研究一个 AI 开源项目｜来源可追溯，结论有边界｜完整演示看置顶</p></div>
        <div><span>个人 IP</span><p>一个认真逛 GitHub 的产品研究者｜把复杂项目拆成能看懂、能体验、能判断的研究站</p></div>
      </div>
      <div class="result-card"><span>三篇置顶</span><ul class="output-list"><li><b>01</b><span>这个账号怎样研究一个 GitHub 项目</span></li><li><b>02</b><span>项目总目录：按图像、视频、Agent 和方法论导航</span></li><li><b>03</b><span>最新完整研究：持续替换为当前最值得体验的研究站</span></li></ul></div>`
  },
  {
    id: "magazine",
    name: "母题",
    title: "把账号办成一本研究杂志",
    sourceLabel: "xiaohongshu-magazine",
    source: `${SOURCE_ROOT}/xiaohongshu-magazine/SKILL.md`,
    plainText: `刊魂：替你把 AI 开源项目研究清楚，再告诉你值不值得用。\n\n围绕业务：读者订阅稳定的项目判断与研究成果。\n\n栏目：这个库到底能做什么；原理拆开讲；我跑过以后发现；值不值得装；暂不研究清单；研究者工作台。`,
    render: () => `
      <div class="output-head"><div><small>STEP 02 · MAGAZINE</small><h3>把账号办成一本研究杂志</h3></div><span>内容战略</span></div>
      <p class="output-lede">账号不是十个孤立项目，而是一份长期回答同一问题的“研究杂志”。读者订阅的是稳定的判断方法与研究结果。</p>
      <div class="result-card accent"><span>刊魂 / 唯一母题</span><h4>替你把 AI 开源项目研究清楚，再告诉你值不值得用。</h4><p>围绕业务：研究者本人是判断和边界的提供者，研究成果才是读者持续回来订阅的主体。</p></div>
      <span class="output-label">固定栏目</span>
      <div class="column-grid">
        <div><span>信任 · 能力</span><p><strong>这个库到底能做什么</strong><br />把功能翻译成用户结果。</p></div>
        <div><span>信任 · 原理</span><p><strong>原理拆开讲</strong><br />打开技术与工作流黑箱。</p></div>
        <div><span>信任 · 验证</span><p><strong>我跑过以后发现</strong><br />展示源码证据和验证过程。</p></div>
        <div><span>信任 · 判断</span><p><strong>值不值得装</strong><br />给出带边界的采用建议。</p></div>
        <div><span>喜欢 · 选择</span><p><strong>暂不研究清单</strong><br />公开资源、硬件和需求边界。</p></div>
        <div><span>喜欢 · 日常</span><p><strong>研究者工作台</strong><br />呈现真实过程与失败。</p></div>
      </div>`
  },
  {
    id: "planner",
    name: "日历",
    title: "把十个研究项目排成七天内容",
    sourceLabel: "xiaohongshu-topic-planner",
    source: `${SOURCE_ROOT}/xiaohongshu-topic-planner/SKILL.md`,
    plainText: `Day 1 研究一个 GitHub 项目的方法；Day 2 小红书 AI 工作台是什么；Day 3 .skill 文件如何工作；Day 4 把研究库交给 Skill；Day 5 适合谁、不适合谁；Day 6 为什么暂不研究某些项目；Day 7 下一个项目研究什么。`,
    render: () => `
      <div class="output-head"><div><small>STEP 03 · TOPIC PLANNER</small><h3>把现有研究排成七天内容</h3></div><span>战术排期</span></div>
      <p class="output-lede">先用方法与实际案例建立信任，再给边界判断，最后用真实问题收集下一项研究需求。</p>
      <div class="calendar-wrap"><table class="calendar"><thead><tr><th>日</th><th>功能</th><th>选题</th><th>内容角度</th><th>目的</th></tr></thead><tbody>
        <tr><td>D1</td><td>信任</td><td>我如何研究一个 GitHub 项目</td><td>固定版本、证据、边界与演示</td><td>建立方法可信度</td></tr>
        <tr><td>D2</td><td>吸引</td><td>小红书 AI 工作台是什么</td><td>从“代运营误解”切入</td><td>吸引正确读者</td></tr>
        <tr><td>D3</td><td>教育</td><td><code>.skill</code> 文件怎样工作</td><td>触发、步骤、约束、模板</td><td>降低理解门槛</td></tr>
        <tr><td>D4</td><td>信任</td><td>我把自己的研究库交给它</td><td>展示本次真实运行</td><td>证明可迁移性</td></tr>
        <tr><td>D5</td><td>筛选</td><td>它适合谁、不适合谁</td><td>列出数据与执行缺口</td><td>校准预期</td></tr>
        <tr><td>D6</td><td>喜欢</td><td>我为什么暂不研究热门项目</td><td>硬件、需求和验证成本</td><td>建立真实感</td></tr>
        <tr><td>D7</td><td>互动</td><td>下一个项目研究什么</td><td>候选方向与选择标准</td><td>收集真实需求</td></tr>
      </tbody></table></div>`
  },
  {
    id: "title",
    name: "标题",
    title: "为 Day 2 生成十二组标题",
    sourceLabel: "xiaohongshu-title",
    source: `${SOURCE_ROOT}/xiaohongshu-title/SKILL.md`,
    plainText: `首推：我以为是代运营，结果更像主编\n\n${titles.map(([style, a, b]) => `${style}\nA. ${a}\nB. ${b}`).join("\n\n")}`,
    render: () => `
      <div class="output-head"><div><small>STEP 04 · TITLE</small><h3>为 Day 2 生成十二组标题</h3></div><span>快速模式 · 24 个</span></div>
      <p class="output-lede">输入事实只有三个：7 个 Skills、无平台执行、核心是运营工作流。标题不能编造效果或把它说成自动化产品。</p>
      <div class="title-pick"><span>EDITOR'S PICK</span><h4>我以为是代运营，结果更像主编</h4><p>保留真实误读和反转，同时准确表达“内容判断强、平台执行弱”。</p></div>
      <details class="title-groups" open><summary>查看全部 12 组 / 24 个标题</summary><div class="title-grid">${titles.map(([style, a, b]) => `<p><span>${style} · A</span>${a}</p><p><span>${style} · B</span>${b}</p>`).join("")}</div></details>`
  },
  {
    id: "comment",
    name: "评论",
    title: "回答最关键的误读",
    sourceLabel: "xiaohongshu-comment-reply",
    source: `${SOURCE_ROOT}/xiaohongshu-comment-reply/SKILL.md`,
    plainText: `原评论：所以这个能自动发小红书吗？\n\n推荐回复：仓库里没有登录、抓取或发布接口，主体是 7 个 Codex Skills；适合内容策划，不是账号自动化。\n\n置顶：我把 7 个 Skill、27 个规则样例和打包代码都拆开看了。你更想看标题、选题，还是行动路径的策划过程？`,
    render: () => `
      <div class="output-head"><div><small>STEP 05 · COMMENT REPLY</small><h3>回答最关键的误读</h3></div><span>评论运营</span></div>
      <div class="result-card accent"><span>原评论</span><h4>“所以这个能自动发小红书吗？”</h4></div>
      <div class="reply-grid">
        <div><span>友好回复</span><p>不能，它目前更像内容运营参谋，帮你整理主页、栏目、选题、标题和承接路径，发布还是要自己完成。</p></div>
        <div class="recommended"><span>推荐 · 专业回复</span><p>仓库里没有登录、抓取或发布接口，主体是 7 个 Codex Skills；适合内容决策，不是账号自动化。</p></div>
        <div><span>更像评论区</span><p>不能自动发，它负责把“发什么、怎么讲”先想清楚。</p></div>
        <div><span>不建议</span><p>“装上就能全自动运营。”——仓库没有平台执行能力，也不能承诺运营效果。</p></div>
      </div>
      <div class="result-card green"><span>置顶评论</span><p>我把它的 7 个 Skill、27 个规则样例和打包代码都拆开看了。完整研究会区分“它能指导什么”和“它完全不会做什么”。你更想看标题、选题，还是行动路径的策划过程？</p></div>`
  },
  {
    id: "conversion",
    name: "路径",
    title: "从一篇笔记走到完整研究站",
    sourceLabel: "xiaohongshu-conversion-path",
    source: `${SOURCE_ROOT}/xiaohongshu-conversion-path/SKILL.md`,
    plainText: `免费研究产品路径：\n1. 用“不是自动代运营”纠正误读。\n2. 明确适合与不适合人群。\n3. 展示固定提交、源码和实际结果。\n4. 引导看置顶总览或完整演示。\n5. 评论反馈下一项研究。\n6. 系列栏目形成复访。\n\n下一步：先发布研究方法说明置顶笔记。`,
    render: () => `
      <div class="output-head"><div><small>STEP 06 · CONVERSION PATH</small><h3>从一篇笔记走到完整研究站</h3></div><span>免费产品路径</span></div>
      <p class="output-lede">这里没有购买。“转化”是读者愿意收藏判断、进入完整演示、反馈需求，并在下一次研究时再次回来。</p>
      <ol class="path-list">
        <li><div><strong>吸引</strong><p>用“它不是自动代运营”纠正常见误读。</p></div></li>
        <li><div><strong>筛选</strong><p>明确适合有真实产品和材料的人，不适合寻找流量保证的人。</p></div></li>
        <li><div><strong>信任</strong><p>展示固定提交、源码证据、规则样例和策划运行结果。</p></div></li>
        <li><div><strong>行动</strong><p>引导先看置顶项目总览或打开完整交互演示。</p></div></li>
        <li><div><strong>反馈</strong><p>请读者评论最想看的能力或下一个研究对象，不强推私信。</p></div></li>
        <li><div><strong>复访</strong><p>使用固定栏目持续发布，让读者形成稳定预期。</p></div></li>
      </ol>
      <div class="result-card accent"><span>下一步最该改</span><h4>先发布“研究方法说明”置顶笔记</h4><p>让后续每个单项目内容都有统一的信任承接页。</p></div>`
  }
];

const skillTabs = document.querySelector("#skillTabs");
const skillDetail = document.querySelector("#skillDetail");
const workflowTabs = document.querySelector("#workflowTabs");
const workflowOutput = document.querySelector("#workflowOutput");
const runButton = document.querySelector("#runWorkflow");
const copyButton = document.querySelector("#copyOutput");
const progressBar = document.querySelector("#progressBar");
const runState = document.querySelector("#runState");
const runLabel = document.querySelector("#runLabel");
const runMeta = document.querySelector("#runMeta");
const liveMessage = document.querySelector("#liveMessage");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let selectedSkill = 0;
let selectedWorkflow = -1;
let unlockedWorkflow = -1;
let runToken = 0;

function renderSkill(index, focusPanel = false) {
  selectedSkill = index;
  const skill = skills[index];
  [...skillTabs.children].forEach((button, buttonIndex) => {
    button.setAttribute("aria-selected", buttonIndex === index ? "true" : "false");
    button.tabIndex = buttonIndex === index ? 0 : -1;
  });
  skillDetail.innerHTML = `
    <div class="detail-top"><div><small>${skill.code}</small><h3>${skill.name}</h3></div><span>${skill.level}</span></div>
    <p class="detail-summary">${skill.summary}</p>
    <div class="detail-grid">
      <div><span>ACCEPTS / 输入</span><ul>${skill.inputs.map(item => `<li>${item}</li>`).join("")}</ul></div>
      <div><span>DELIVERS / 产物</span><ul>${skill.outputs.map(item => `<li>${item}</li>`).join("")}</ul></div>
    </div>
    <div class="detail-foot"><span>边界：${skill.boundary}</span><a href="${skill.source}" target="_blank" rel="noreferrer">查看固定源码 ↗</a></div>`;
  if (focusPanel) skillDetail.focus();
}

skills.forEach((skill, index) => {
  const button = document.createElement("button");
  button.className = "skill-tab";
  button.type = "button";
  button.role = "tab";
  button.id = `skill-tab-${skill.id}`;
  button.setAttribute("aria-controls", "skillDetail");
  button.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><strong>${skill.name}</strong><i>→</i>`;
  button.addEventListener("click", () => renderSkill(index));
  button.addEventListener("keydown", event => {
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (["ArrowDown", "ArrowRight"].includes(event.key)) next = (index + 1) % skills.length;
    if (["ArrowUp", "ArrowLeft"].includes(event.key)) next = (index - 1 + skills.length) % skills.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = skills.length - 1;
    renderSkill(next);
    skillTabs.children[next].focus();
  });
  skillTabs.append(button);
});

function renderWorkflow(index, shouldFocus = false) {
  if (index > unlockedWorkflow || index < 0) return;
  selectedWorkflow = index;
  const stage = workflow[index];
  [...workflowTabs.children].forEach((button, buttonIndex) => {
    button.setAttribute("aria-selected", buttonIndex === index ? "true" : "false");
    button.tabIndex = buttonIndex === index ? 0 : -1;
  });
  workflowOutput.innerHTML = `${stage.render()}<div class="source-note"><span>确定性策划记录 · 不是可发布成品 · 浏览器未调用模型</span><a href="${stage.source}" target="_blank" rel="noreferrer">规则来源：${stage.sourceLabel} ↗</a></div>`;
  copyButton.disabled = false;
  copyButton.textContent = "复制当前产物";
  if (shouldFocus) workflowOutput.focus();
}

workflow.forEach((stage, index) => {
  const button = document.createElement("button");
  button.className = "workflow-tab";
  button.type = "button";
  button.role = "tab";
  button.id = `workflow-tab-${stage.id}`;
  button.disabled = true;
  button.setAttribute("aria-controls", "workflowOutput");
  button.setAttribute("aria-selected", "false");
  button.tabIndex = -1;
  button.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><strong>${stage.name}</strong><i aria-hidden="true"></i>`;
  button.addEventListener("click", () => renderWorkflow(index));
  button.addEventListener("keydown", event => {
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const available = Math.max(0, unlockedWorkflow);
    let next = index;
    if (["ArrowDown", "ArrowRight"].includes(event.key)) next = index >= available ? 0 : index + 1;
    if (["ArrowUp", "ArrowLeft"].includes(event.key)) next = index <= 0 ? available : index - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = available;
    renderWorkflow(next);
    workflowTabs.children[next].focus();
  });
  workflowTabs.append(button);
});

function unlockStage(index) {
  unlockedWorkflow = Math.max(unlockedWorkflow, index);
  const button = workflowTabs.children[index];
  button.disabled = false;
  button.classList.add("complete");
  try {
    renderWorkflow(index);
  } catch (error) {
    runToken += 1;
    runState.textContent = "ERROR";
    runState.className = "";
    runLabel.textContent = `装配失败：${workflow[index].name}`;
    runMeta.textContent = "请重新运行或检查浏览器控制台";
    runButton.disabled = false;
    liveMessage.textContent = `第 ${index + 1} 段未能完成，工作流已停止。`;
    return false;
  }
  progressBar.style.width = `${((index + 1) / workflow.length) * 100}%`;
  runLabel.textContent = `已完成：${workflow[index].title}`;
  runMeta.textContent = `${index + 1} / ${workflow.length} · ${workflow[index].sourceLabel}`;
  return true;
}

function finishRun() {
  runState.textContent = "COMPLETE";
  runState.className = "complete";
  runLabel.textContent = "六段工作流已装配完成";
  runMeta.textContent = "所有结果均可逐项检查、复制并回到固定源码";
  runButton.disabled = false;
  runButton.querySelector("span").textContent = "重新运行策划样例";
  runButton.querySelector("i").textContent = "↻";
  liveMessage.textContent = "策划完成：已生成主页、母题、7 天日历、24 个标题、评论回复和行动路径；尚未生成完整正文与图片。";
}

function runWorkflow() {
  runToken += 1;
  const token = runToken;
  unlockedWorkflow = -1;
  selectedWorkflow = -1;
  copyButton.disabled = true;
  copyButton.textContent = "复制当前产物";
  [...workflowTabs.children].forEach(button => {
    button.disabled = true;
    button.classList.remove("complete");
    button.setAttribute("aria-selected", "false");
    button.tabIndex = -1;
  });
  workflowOutput.innerHTML = `<div class="empty-output"><span>↻</span><h3>正在装配策划记录</h3><p>依次通过主页、母题、日历、标题、评论和行动路径六个规则层；不会生成完整笔记或图片。</p></div>`;
  runButton.disabled = true;
  runState.textContent = "RUNNING";
  runState.className = "running";
  runLabel.textContent = "读取真实产品材料";
  runMeta.textContent = "0 / 6 · 不调用外部服务";
  progressBar.style.width = "0";
  liveMessage.textContent = "策划样例开始运行。";

  if (reduceMotion.matches) {
    workflow.forEach((_, index) => unlockStage(index));
    finishRun();
    return;
  }

  workflow.forEach((_, index) => {
    window.setTimeout(() => {
      if (token !== runToken) return;
      if (!unlockStage(index)) return;
      if (index === workflow.length - 1) finishRun();
    }, 330 * (index + 1));
  });
}

async function copyCurrentOutput() {
  if (selectedWorkflow < 0) return;
  const text = workflow[selectedWorkflow].plainText;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      textarea.remove();
      if (!copied) throw new Error("copy unavailable");
    }
    copyButton.textContent = "已复制";
    liveMessage.textContent = `已复制“${workflow[selectedWorkflow].name}”产物。`;
  } catch {
    copyButton.textContent = "复制不可用";
    liveMessage.textContent = "当前浏览器不允许自动复制，请直接选中页面内容。";
  }
  window.setTimeout(() => { if (selectedWorkflow >= 0) copyButton.textContent = "复制当前产物"; }, 1800);
}

renderSkill(0);
runButton.addEventListener("click", runWorkflow);
copyButton.addEventListener("click", copyCurrentOutput);
