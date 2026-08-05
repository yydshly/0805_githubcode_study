const stages = [
  {
    kicker: "ACTIVATION",
    title: "入口只负责加载规则",
    summary: "用户显式调用或宿主根据描述激活 Skill，随后把 SKILL.md 正文加入当前上下文。",
    does: ["识别 Skill 名称与用途描述", "将十条规则、例外和检查表加入上下文", "建立“本会话继续应用”的软状态"],
    doesNot: ["不改写用户原始问题", "不调用第二个大模型", "不开始领域问题分析"],
    calloutLabel: "当前结果",
    callout: "规则已进入上下文，用户问题还没有被修改。"
  },
  {
    kicker: "BASE REASONING",
    title: "基础模型照常分析任务",
    summary: "理解需求、读取代码、推断原因、调用工具和形成业务结论，仍由宿主模型完成。",
    does: ["使用模型已有知识和当前项目上下文", "根据任务形成候选原因与解决路径", "必要时结合文件、日志和工具结果"],
    doesNot: ["Skill 不提供 HTTP、代码或业务知识", "不保证基础分析正确", "不决定是否允许危险操作"],
    calloutLabel: "关键边界",
    callout: "如果基础分析错了，Skill 只能把错误答案表达得更清楚。"
  },
  {
    kicker: "EXCEPTION ROUTER",
    title: "先判断默认规则是否适用",
    summary: "详细解释、危险操作、调试循环、真实歧义和上层规则冲突会改变回答路径。",
    does: ["为当前任务选择默认或例外分支", "保护安全、完整性和任务正确性", "连续失败时停止无依据迭代"],
    doesNot: ["不机械追求最短回答", "不越过系统和安全规则", "不在真实歧义下替用户做重大选择"],
    calloutLabel: "当前结果",
    callout: "不同任务可以加载同一个 Skill，却生成完全不同的回答形态。"
  },
  {
    kicker: "OUTPUT SHAPING",
    title: "选择、排序并压缩已有分析",
    summary: "模型从完整分析中选出当前最有用的信息，按行动、步骤、状态和唯一下一步重新组织。",
    does: ["把最小有用动作放在第一行", "将多步工作切成编号单动作", "隐藏支线并限制一次展示量", "突出进度、错误原因和已完成结果"],
    doesNot: ["不创造新的事实证据", "不删除任务必须的内容", "不把时间估计变成可靠承诺"],
    calloutLabel: "本质",
    callout: "这是信息选择和回答排序，不是用户 Prompt 优化。"
  },
  {
    kicker: "PRE-SEND CHECK",
    title: "模型自行删除输出噪声",
    summary: "发送前检查会删除计划公告、题外话、无信息的缓和语和客套结尾，并核对首尾是否可行动。",
    does: ["删除“让我来分析”等前言", "删除“顺便说一句”支线", "保留真实的不确定性说明", "确认结尾只有一个具体下一步"],
    doesNot: ["不是程序化校验器", "没有失败重试或自动评分", "不能保证模型每次完全遵守"],
    calloutLabel: "实现限制",
    callout: "“检查”仍是一条自然语言指令，属于软约束。"
  }
];

const scenarios = {
  debug: {
    branch: "默认行动路径",
    input: "登录接口返回 401，怎么排查？",
    analysis: ["401 表示请求未通过认证", "优先检查 Authorization 请求头", "其次检查 Token 过期与服务端中间件"],
    route: "没有例外：使用默认输出塑形",
    stageOutputs: [
      "Skill 已加载，等待模型处理用户任务。",
      "模型已形成候选原因：请求头、Token、Cookie 和鉴权中间件。",
      "没有危险操作或真实歧义，进入默认行动路径。",
      "先打开失败请求，检查 Authorization 请求头。\n\n1. 打开浏览器开发者工具\n2. 重新执行登录\n3. 选择返回 401 的请求\n\n下一步：确认请求头是否包含 Bearer Token。",
      "先打开失败请求，检查 Authorization 请求头。\n\n1. 打开浏览器开发者工具\n2. 重新执行登录\n3. 选择返回 401 的请求\n\n下一步：确认请求头是否包含 Bearer Token。"
    ],
    rules: [[], [], ["默认路径"], ["行动置顶", "编号步骤", "抑制支线", "唯一下一步"], ["删除前言", "删除客套"]],
    before: "这个问题通常可能涉及多个部分，包括认证中间件、Token 校验、Cookie 设置和请求头。建议你先检查一下相关配置，也可以查看后端日志，并确认依赖版本是否存在问题。如果需要的话，还可以进一步检查数据库里的会话状态。",
    after: "先打开失败请求，检查 Authorization 请求头。\n\n1. 打开浏览器开发者工具\n2. 重新执行登录\n3. 选择返回 401 的请求\n\n下一步：确认请求头是否包含 Bearer Token。",
    notes: ["行动置顶", "步骤编号", "唯一下一步"]
  },
  explain: {
    branch: "详细解释例外",
    input: "详细解释 JWT 登录流程，以及每一步为什么需要。",
    analysis: ["需要覆盖凭据验证、签发、保存、携带和校验", "用户明确要求解释原理", "过度压缩会损失答案本身"],
    route: "例外 1：允许完整展开，用标题保持可扫描",
    stageOutputs: [
      "Skill 已加载，用户的“详细解释”要求保持原样。",
      "模型已形成 JWT 五阶段分析和每阶段的安全目的。",
      "检测到“详细解释”：完整性优先于简短。",
      "JWT 登录可分为五个阶段：\n\n1. 验证凭据：确认用户身份\n2. 签发 Token：把身份声明签名\n3. 客户端保存：维持后续会话\n4. 请求携带：向服务端提交身份凭证\n5. 服务端校验：验证签名、过期时间和权限\n\n接下来逐阶段解释风险与设计理由。",
      "保留完整解释，删除无信息开场，并使用标题与编号方便回看。"
    ],
    rules: [[], [], ["解释例外"], ["完整展开", "编号结构", "无前言"], ["保留必要背景"]],
    before: "JWT 是一种常见的认证方式。关于 JWT 登录，有很多方面值得讨论。总体来说，前端和后端需要互相配合，Token 也需要妥善保存。下面我可以从多个角度为你介绍。",
    after: "JWT 登录分为五个阶段：凭据验证、签发 Token、客户端保存、请求携带、服务端校验。\n\n每个阶段分别解决“你是谁、凭证是否可信、如何延续会话、如何携带身份、服务端如何验证”五个问题。下面按阶段完整解释。",
    notes: ["触发解释例外", "保留原理", "结构可扫描"]
  },
  danger: {
    branch: "危险操作例外",
    input: "帮我清空生产数据库，然后重新跑迁移。",
    analysis: ["清空生产数据库具有不可逆数据风险", "必须确认目标、备份和恢复路径", "不能把“行动置顶”理解为立即执行"],
    route: "例外 2：安全高于简短与行动优先",
    stageOutputs: [
      "Skill 已加载，危险请求尚未执行。",
      "模型识别到不可逆删除、生产环境和迁移风险。",
      "检测到破坏性操作：必须先确认影响和恢复条件。",
      "该操作会不可逆地删除生产数据。执行前需要确认目标数据库、最近可恢复备份和回滚方案。\n\n下一步：提供目标数据库标识和最近一次可恢复备份时间。",
      "保留风险说明与确认条件；不输出可直接破坏生产数据的命令。"
    ],
    rules: [[], [], ["危险操作例外", "安全优先"], ["风险置顶", "唯一确认动作"], ["不删安全说明"]],
    before: "可以，通常可以先执行数据库清空命令，然后运行迁移。不同数据库使用的命令有所不同，你可能还需要重新创建种子数据。",
    after: "该操作会不可逆地删除生产数据。执行前需要确认目标数据库、最近可恢复备份和回滚方案。\n\n下一步：提供目标数据库标识和最近一次可恢复备份时间。",
    notes: ["危险操作例外", "先确认", "安全优先"]
  },
  ambiguous: {
    branch: "真实歧义例外",
    input: "帮我把这个发布掉。",
    analysis: ["“这个”缺少明确项目或产物", "“发布”可能指测试环境、生产环境或公开 Pages", "不同目标会产生实质不同的外部影响"],
    route: "例外 4：只询问一个会改变执行方向的问题",
    stageOutputs: [
      "Skill 已加载，原问题仍然缺少发布目标。",
      "模型发现至少三种发布路径，不能安全地任选一种。",
      "检测到真实歧义：停止猜测，只问一个关键问题。",
      "你要发布到哪个目标：本地预览、测试环境，还是公开生产环境？",
      "只保留一个决定执行方向的问题，不同时追问域名、账号和发布说明。"
    ],
    rules: [[], [], ["真实歧义例外"], ["一个澄清问题", "抑制次要问题"], ["删除多余追问"]],
    before: "当然可以。发布通常需要先构建项目、配置环境变量、选择托管平台、检查域名、设置 CI/CD，然后进行部署。你使用的是哪个平台？项目路径在哪里？需要生产环境还是测试环境？",
    after: "你要发布到哪个目标：本地预览、测试环境，还是公开生产环境？",
    notes: ["真实歧义例外", "只问一个问题", "不擅自选择"]
  }
};

const rules = [
  { title: "第一行直接给下一步", purpose: "先降低“从知道到开始”的摩擦，再补充必要背景。", trigger: "回答中存在明确可执行动作", target: "答案顺序，不是业务结论", risk: "可能把必要背景推得太后", bad: "“你的认证流程有几个组成部分……”", good: "“先检查失败请求的 Authorization 请求头。”", interpretation: "这是排序约束：模型仍可保留背景，但必须先暴露最小有用动作。" },
  { title: "多步骤任务使用编号", purpose: "把连续工作切成少量、可完成和可回看的动作。", trigger: "任务需要两个或更多动作", target: "步骤颗粒度与视觉结构", risk: "切得太细会制造额外负担", bad: "“打开文件、找到函数、修改后运行测试，然后……”", good: "“1. 打开文件  2. 替换函数  3. 运行测试”", interpretation: "编号不是装饰；每一步都应有清晰完成条件，且不包含多次“然后”。" },
  { title: "结尾只留一个具体下一步", purpose: "让用户完成当前回复后，不需要再次决定从哪里开始。", trigger: "任务尚未完全结束", target: "回复的最后一个行动提示", risk: "选错下一步会放大方向错误", bad: "“你还可以检查日志、依赖、数据库和代理配置。”", good: "“下一步：把第一条失败日志贴出来。”", interpretation: "它把多个候选动作收敛成一个两分钟内能开始的动作。" },
  { title: "先完成当前问题，再处理支线", purpose: "避免模型展示所有联想到的问题，让用户失去当前方向。", trigger: "分析中出现与主问题无关的附加发现", target: "内容选择与回答范围", risk: "可能隐藏值得立即提醒的相关风险", bad: "“这里修好了。顺便，你的 README、依赖和测试也……”", good: "“当前认证问题已修复。依赖更新作为单独任务处理。”", interpretation: "模型可以发现支线，但默认不在当前回复中展开；安全相关发现不应被隐藏。" },
  { title: "每轮重述当前状态", purpose: "减少用户回看历史消息和在工作记忆中保存进度的需要。", trigger: "跨多轮或多步骤任务", target: "进度、已完成项和下一项", risk: "重述过长会变成重复总结", bad: "“完成了。继续下一部分？”", good: "“第 3/5 步完成：结构已更新。下一步：回填数据。”", interpretation: "只重述当前状态差异，而不是每轮复制完整计划。" },
  { title: "使用具体时间单位", purpose: "把“需要一点时间”转换为用户能比较和安排的范围。", trigger: "任务存在明显执行成本", target: "时间表达", risk: "模型估计可能缺乏真实依据", bad: "“这需要一些时间。”", good: "“有现成测试约 15 分钟；没有测试约半天。”", interpretation: "具体不代表准确。好的估计会同时说明影响时间的条件。" },
  { title: "让已完成结果可见", purpose: "明确显示现在已经能做什么，而不是把成果埋在总结中。", trigger: "某项改变或验证已经完成", target: "完成反馈与验证入口", risk: "可能把未验证结果表述成完成", bad: "“我对认证流程做了一些调整。”", good: "“魔法链接登录现已可用：启动项目后打开 /login。”", interpretation: "完成声明必须绑定可观察结果；仅修改代码不等于功能已经工作。" },
  { title: "错误按位置、原因、修复表达", purpose: "去掉情绪化语气，把失败转换成可诊断信息。", trigger: "测试、构建、运行或操作失败", target: "错误反馈结构与语气", risk: "原因未确认时可能制造过度确定", bad: "“糟糕，测试好像出了一点问题。”", good: "“auth.spec.ts:42：预期 200，实际 401。请求缺少认证头。”", interpretation: "应区分已证实原因和当前假设，平实不等于假装确定。" },
  { title: "单个列表最多五项", purpose: "限制用户一次需要扫描和选择的认知单元。", trigger: "列表超过五个同级项目", target: "分组和一次展示量", risk: "机械截断会漏掉必要信息", bad: "一个没有优先级的十项检查清单", good: "“现在检查”三项，“之后检查”四项", interpretation: "规则要求重组和分层，不是简单删除第六项之后的内容。" },
  { title: "删除前言、复盘和客套结尾", purpose: "减少不承载任务信息的 Token 与阅读距离。", trigger: "草稿包含计划公告、重复总结或社交性结尾", target: "开头、结尾和语言噪声", risk: "过度删除会让复杂沟通显得生硬", bad: "“好问题！让我来看看……希望这对你有帮助。”", good: "从答案开始，在答案完成时结束。", interpretation: "这是一种语体选择，不应删除必要的风险提示、来源说明和真实不确定性。" }
];

let currentScenario = "debug";
let currentStage = 0;
let currentRule = 0;
let skillMarkdownText = "";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const formatNumber = (value) => new Intl.NumberFormat("zh-CN").format(value);

function fillList(element, items) {
  element.replaceChildren(...items.map((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    return li;
  }));
}

function renderStage(index, moveFocus = false) {
  currentStage = Math.max(0, Math.min(stages.length - 1, index));
  const stage = stages[currentStage];
  const scenario = scenarios[currentScenario];

  $("#stageIndex").textContent = `${String(currentStage + 1).padStart(2, "0")} / 05`;
  $("#stageKicker").textContent = stage.kicker;
  $("#stageTitle").textContent = stage.title;
  $("#stageSummary").textContent = stage.summary;
  fillList($("#stageDoes"), stage.does);
  fillList($("#stageDoesNot"), stage.doesNot);
  $("#stageCalloutLabel").textContent = stage.calloutLabel;
  $("#stageCallout").textContent = currentStage === 2 ? scenario.route : stage.callout;

  $$(".stage-tab").forEach((button, buttonIndex) => {
    const active = buttonIndex === currentStage;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
    button.tabIndex = active ? 0 : -1;
  });
  $("#stagePanel").setAttribute("aria-labelledby", `stage-tab-${currentStage}`);

  $("#stagePrev").disabled = currentStage === 0;
  $("#stageNext").disabled = currentStage === stages.length - 1;
  $("#stageNext").innerHTML = currentStage === stages.length - 1
    ? "流程完成"
    : `下一步：${["基础分析", "例外判断", "输出塑形", "发送前检查"][currentStage]} <span aria-hidden="true">→</span>`;

  renderTrace();
  if (moveFocus) $(`.stage-tab[data-stage="${currentStage}"]`).focus();
}

function renderTrace() {
  const scenario = scenarios[currentScenario];
  $("#scenarioBranch").textContent = scenario.branch;
  $("#traceInput").textContent = scenario.input;
  fillList($("#traceAnalysis"), currentStage >= 1 ? scenario.analysis : ["尚未开始业务分析"]);
  $("#traceRoute").textContent = currentStage >= 2 ? scenario.route : "尚未判断";
  $("#traceOutput").textContent = scenario.stageOutputs[currentStage];
  $("#traceRules").replaceChildren(...scenario.rules[currentStage].map((rule) => {
    const span = document.createElement("span");
    span.textContent = rule;
    return span;
  }));
}

function renderScenario(key) {
  currentScenario = key;
  const scenario = scenarios[key];
  $$(".scenario-button").forEach((button) => {
    const active = button.dataset.scenario === key;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  $("#beforeAnswer").textContent = scenario.before;
  $("#afterAnswer").textContent = scenario.after;
  $("#beforeCount").textContent = `约 ${scenario.before.replace(/\s/g, "").length} 字`;
  $("#afterCount").textContent = `约 ${scenario.after.replace(/\s/g, "").length} 字`;
  $("#afterNotes").replaceChildren(...scenario.notes.map((note) => {
    const span = document.createElement("span");
    span.textContent = note;
    return span;
  }));

  renderStage(currentStage);
}

function renderRule(index, moveFocus = false) {
  currentRule = Math.max(0, Math.min(rules.length - 1, index));
  const rule = rules[currentRule];
  $("#ruleNumber").textContent = `RULE ${String(currentRule + 1).padStart(2, "0")}`;
  $("#ruleTitle").textContent = rule.title;
  $("#rulePurpose").textContent = rule.purpose;
  $("#ruleTrigger").textContent = rule.trigger;
  $("#ruleTarget").textContent = rule.target;
  $("#ruleRisk").textContent = rule.risk;
  $("#ruleBad").textContent = rule.bad;
  $("#ruleGood").textContent = rule.good;
  $("#ruleInterpretation").textContent = rule.interpretation;
  $("#rulePanel").setAttribute("aria-labelledby", `rule-tab-${currentRule}`);

  $$(".rule-button").forEach((button, buttonIndex) => {
    const active = buttonIndex === currentRule;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
    button.tabIndex = active ? 0 : -1;
  });
  if (moveFocus) $(`.rule-button[data-rule="${currentRule}"]`).focus();
}

function renderTokenLedger() {
  const skillTokens = Number($("#skillTokens").value);
  const normalTokens = Number($("#normalTokens").value);
  const shapedTokens = Number($("#shapedTokens").value);
  const avoidedTurns = Number($("#avoidedTurns").value);
  const normalTotal = normalTokens * (1 + avoidedTurns);
  const skillTotal = skillTokens + shapedTokens;
  const difference = normalTotal - skillTotal;
  const max = Math.max(normalTotal, skillTotal, 1);

  $("#skillTokensValue").textContent = `${formatNumber(skillTokens)} tokens`;
  $("#normalTokensValue").textContent = `${formatNumber(normalTokens)} tokens`;
  $("#shapedTokensValue").textContent = `${formatNumber(shapedTokens)} tokens`;
  $("#avoidedTurnsValue").textContent = `${avoidedTurns} 轮`;
  $("#normalTotal").textContent = formatNumber(normalTotal);
  $("#skillTotal").textContent = formatNumber(skillTotal);
  $("#normalBar").style.width = `${(normalTotal / max) * 100}%`;
  $("#skillBar").style.width = `${(skillTotal / max) * 100}%`;

  const verdict = $("#tokenVerdict");
  const isSaving = difference >= 0;
  verdict.classList.toggle("is-saving", isSaving);
  verdict.classList.toggle("is-costing", !isSaving);
  verdict.querySelector("strong").textContent = isSaving
    ? `预计节省 ${formatNumber(difference)} tokens`
    : `预计增加 ${formatNumber(Math.abs(difference))} tokens`;
  verdict.querySelector("p").textContent = isSaving
    ? avoidedTurns > 0
      ? "输出缩短并减少重复沟通，覆盖了规则输入开销。"
      : "仅靠本轮输出缩短，已经覆盖规则输入开销。"
    : "规则输入开销高于当前输出节省；短任务尤其可能出现这种情况。";
}

function setupTabKeyboard(buttons, render) {
  buttons.forEach((button, index) => {
    button.addEventListener("keydown", (event) => {
      let next = null;
      if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (index + 1) % buttons.length;
      if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = buttons.length - 1;
      if (next !== null) {
        event.preventDefault();
        render(next, true);
      }
    });
  });
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";
  $("#themeToggle").setAttribute("aria-pressed", String(isDark));
  $("#themeToggle").setAttribute("aria-label", isDark ? "切换到浅色主题" : "切换到深色主题");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatInline(value) {
  return escapeHtml(value).replace(/`([^`]+)`/g, "<code>$1</code>");
}

function renderSkillMarkdown(markdown) {
  const sectionIds = new Map([
    ["持续生效", "skill-persistence"],
    ["ADHD 会怎样影响阅读", "skill-reading"],
    ["规则", "skill-rules"],
    ["什么时候应当打破这些规则", "skill-exceptions"],
    ["发送前检查", "skill-presend"]
  ]);
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const output = [];
  let index = 0;

  if (lines[0] === "---") {
    const end = lines.indexOf("---", 1);
    if (end > 0) {
      output.push(`<pre class="skill-frontmatter"><code>${escapeHtml(lines.slice(1, end).join("\n"))}</code></pre>`);
      index = end + 1;
    }
  }

  let inCode = false;
  let codeLines = [];
  let listType = null;
  const closeList = () => {
    if (listType) output.push(`</${listType}>`);
    listType = null;
  };

  for (; index < lines.length; index += 1) {
    const line = lines[index];

    if (line.startsWith("```")) {
      closeList();
      if (!inCode) {
        inCode = true;
        codeLines = [];
      } else {
        output.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        inCode = false;
      }
      continue;
    }
    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (!line.trim()) {
      closeList();
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      closeList();
      const level = heading[1].length;
      const text = heading[2];
      const id = sectionIds.get(text);
      const className = level === 3 && /^\d+\./.test(text) ? " class=\"skill-rule-heading\"" : "";
      output.push(`<h${level}${id ? ` id="${id}" data-skill-section` : ""}${className}>${formatInline(text)}</h${level}>`);
      continue;
    }

    const ordered = line.match(/^\d+\.\s+(.+)$/);
    const unordered = line.match(/^[-*]\s+(.+)$/);
    if (ordered || unordered) {
      const nextListType = ordered ? "ol" : "ul";
      if (listType !== nextListType) {
        closeList();
        listType = nextListType;
        output.push(`<${listType}>`);
      }
      output.push(`<li>${formatInline((ordered || unordered)[1])}</li>`);
      continue;
    }

    closeList();
    if (line.startsWith("> ")) {
      output.push(`<blockquote><p>${formatInline(line.slice(2))}</p></blockquote>`);
    } else if (line.startsWith("错误示例：")) {
      output.push(`<p class="example-bad">${formatInline(line.slice(5))}</p>`);
    } else if (line.startsWith("正确示例：")) {
      output.push(`<p class="example-good">${formatInline(line.slice(5))}</p>`);
    } else {
      output.push(`<p>${formatInline(line)}</p>`);
    }
  }
  closeList();
  return output.join("\n");
}

async function loadFullSkill() {
  const documentPanel = $("#skillDocument");
  try {
    const response = await fetch("./i-have-adhd.zh-CN.md", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    skillMarkdownText = await response.text();
    documentPanel.innerHTML = renderSkillMarkdown(skillMarkdownText);
  } catch (error) {
    documentPanel.innerHTML = `<p class="skill-loading">中文版加载失败。请使用上方“下载 Markdown”读取完整内容。</p>`;
  }
}

async function copyFullSkill() {
  const status = $("#copyStatus");
  if (!skillMarkdownText) await loadFullSkill();
  try {
    await navigator.clipboard.writeText(skillMarkdownText);
    status.textContent = "已复制完整中文版";
  } catch (error) {
    const textarea = document.createElement("textarea");
    textarea.value = skillMarkdownText;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    status.textContent = copied ? "已复制完整中文版" : "复制失败，请下载 Markdown";
  }
  window.setTimeout(() => { status.textContent = ""; }, 2500);
}

function init() {
  const savedTheme = localStorage.getItem("ihadhd-study-theme");
  const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  applyTheme(savedTheme || preferredTheme);

  $("#themeToggle").addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem("ihadhd-study-theme", nextTheme);
  });

  $$(".scenario-button").forEach((button) => button.addEventListener("click", () => renderScenario(button.dataset.scenario)));
  $$(".stage-tab").forEach((button) => button.addEventListener("click", () => renderStage(Number(button.dataset.stage))));
  $("#stagePrev").addEventListener("click", () => renderStage(currentStage - 1));
  $("#stageNext").addEventListener("click", () => {
    if (currentStage < stages.length - 1) renderStage(currentStage + 1);
  });
  setupTabKeyboard($$(".stage-tab"), renderStage);

  $$(".rule-button").forEach((button) => button.addEventListener("click", () => renderRule(Number(button.dataset.rule))));
  setupTabKeyboard($$(".rule-button"), renderRule);

  ["skillTokens", "normalTokens", "shapedTokens", "avoidedTurns"].forEach((id) => {
    $(`#${id}`).addEventListener("input", renderTokenLedger);
  });
  $("#copySkill").addEventListener("click", copyFullSkill);

  renderScenario(currentScenario);
  renderRule(currentRule);
  renderTokenLedger();
  loadFullSkill();
}

init();
