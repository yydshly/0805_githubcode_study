(() => {
  "use strict";

  const dataset = window.GRAPHIFY_STUDY_DATA;
  const learning = dataset?.learning;
  const systemMap = dataset?.systemMap;
  const deepResearch = dataset?.deepDives;
  if (!dataset || !learning || !systemMap || !deepResearch) {
    document.body.innerHTML = "<p style='padding:2rem;font-family:system-ui'>学习数据未加载，请先运行 scripts/build_summary_data.py。</p>";
    return;
  }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const validViews = new Set(["home", "method", "architecture", "memory", "runtime", "review"]);

  function setView(name, moveFocus = true) {
    const next = validViews.has(name) ? name : "home";
    $$('[data-view-panel]').forEach((panel) => {
      const active = panel.dataset.viewPanel === next;
      panel.hidden = !active;
      panel.classList.toggle("active", active);
    });
    $('nav [data-view].active')?.removeAttribute("aria-current");
    $$('nav [data-view]').forEach((button) => {
      const active = button.dataset.view === next;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "page");
    });
    history.replaceState(null, "", `#${next}`);
    window.scrollTo({ top: 0, behavior: "auto" });
    if (moveFocus) $(`[data-view-panel="${next}"] h1`)?.focus({ preventScroll: true });
  }

  $$('[data-view]').forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
  window.addEventListener("hashchange", () => setView(location.hash.slice(1), false));

  const themeToggle = $("#theme-toggle");
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeToggle.textContent = theme === "dark" ? "☼" : "◐";
    themeToggle.setAttribute("aria-label", `切换${theme === "dark" ? "浅色" : "深色"}主题`);
    localStorage.setItem("pi-study-theme", theme);
  }
  setTheme(localStorage.getItem("pi-study-theme") || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));
  themeToggle.addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));

  $("#object-grid").innerHTML = learning.fourObjects.map((item, index) => `
    <article class="object-card">
      <div><span>0${index + 1}</span><b>${item.role}</b></div>
      <h3>${item.label}</h3>
      <p>${item.description}</p>
      <code>${item.path}</code>
    </article>`).join("");

  let selectedMethod = learning.researchSteps[0].id;
  function renderMethod() {
    $("#method-steps").innerHTML = learning.researchSteps.map((step) => `
      <li><button class="${step.id === selectedMethod ? "active" : ""}" data-method="${step.id}" ${step.id === selectedMethod ? 'aria-current="step"' : ""}>
        <span>${step.number}</span><b>${step.title}</b><i aria-hidden="true">→</i>
      </button></li>`).join("");
    const step = learning.researchSteps.find((item) => item.id === selectedMethod);
    $("#method-detail").innerHTML = `
      <div class="detail-kicker"><span>STEP ${step.number}</span><i>研究工作流</i></div>
      <h2>${step.title}</h2>
      <dl class="detail-list">
        <div><dt>输入</dt><dd>${step.input}</dd></div>
        <div><dt>让 AI 做什么</dt><dd>${step.action}</dd></div>
        <div><dt>应当产出</dt><dd>${step.output}</dd></div>
        <div class="done-row"><dt>完成标准</dt><dd>${step.done}</dd></div>
      </dl>`;
    $$('[data-method]').forEach((button) => button.addEventListener("click", () => {
      selectedMethod = button.dataset.method;
      renderMethod();
    }));
  }
  renderMethod();

  $("#evidence-levels").innerHTML = learning.evidenceLevels.map((item) => `
    <article><span>${item.level}</span><small>${item.trust}</small><h3>${item.label}</h3><p>${item.description}</p></article>`).join("");
  $("#prompt-template").textContent = learning.promptTemplate;
  $("#copy-prompt").addEventListener("click", async (event) => {
    const button = event.currentTarget;
    try {
      await navigator.clipboard.writeText(learning.promptTemplate);
      button.textContent = "已复制，可以直接交给 AI";
    } catch {
      const range = document.createRange();
      range.selectNodeContents($("#prompt-template"));
      getSelection().removeAllRanges();
      getSelection().addRange(range);
      button.textContent = "已选中文本，请复制";
    }
    setTimeout(() => { button.textContent = "复制研究指令"; }, 2200);
  });

  $("#architecture-stats").innerHTML = [
    [systemMap.meta.layerCount, "架构层级"], [systemMap.meta.packageCount, "正式 packages"],
    [systemMap.meta.sourceFileCount, "TypeScript 源文件"], [2, "并存的 session 架构"]
  ].map(([value, label]) => `<article><strong>${value}</strong><span>${label}</span></article>`).join("");

  let selectedLayer = systemMap.layers[0].id;
  let selectedModule = systemMap.layers[0].modules[0].name;
  function renderSystemLayer() {
    $("#system-layer-rail").innerHTML = systemMap.layers.map((layer) => `
      <li><button data-system-layer="${layer.id}" class="${layer.id === selectedLayer ? "active" : ""}" ${layer.id === selectedLayer ? 'aria-current="step"' : ""}>
        <span>${layer.number}</span><b>${layer.name}</b><small>${layer.modules.length} modules</small>
      </button></li>`).join("");
    const layer = systemMap.layers.find((item) => item.id === selectedLayer);
    if (!layer.modules.some((item) => item.name === selectedModule)) selectedModule = layer.modules[0].name;
    $("#system-layer-header").innerHTML = `<div><span>LAYER ${layer.number} · ${layer.position}</span><code>${layer.packages.join(" + ")}</code></div><h2>${layer.name}</h2><p>${layer.summary}</p><aside><b>控制流</b><span>${layer.controlFlow}</span></aside>`;
    $("#system-module-grid").innerHTML = layer.modules.map((module, index) => `
      <button data-system-module="${module.name}" class="${module.name === selectedModule ? "active" : ""}" aria-pressed="${module.name === selectedModule}">
        <span>${String(index + 1).padStart(2, "0")}</span><b>${module.name}</b><small>${module.status}</small>
      </button>`).join("");
    const module = layer.modules.find((item) => item.name === selectedModule);
    $("#system-module-detail").innerHTML = `<div><span>SELECTED MODULE</span><b>${module.status}</b></div><h3>${module.name}</h3><p>${module.role}</p><code>${module.source}</code>`;
    $$('[data-system-layer]').forEach((button) => button.addEventListener("click", () => { selectedLayer = button.dataset.systemLayer; selectedModule = systemMap.layers.find((item) => item.id === selectedLayer).modules[0].name; renderSystemLayer(); }));
    $$('[data-system-module]').forEach((button) => button.addEventListener("click", () => { selectedModule = button.dataset.systemModule; renderSystemLayer(); }));
  }
  renderSystemLayer();

  $("#system-package-catalog").innerHTML = systemMap.packages.map((pkg, index) => `
    <article><span>${String(index + 1).padStart(2, "0")}</span><div><h3>${pkg.name}</h3><p>${pkg.role}</p><small>${pkg.dependsOn.length ? `依赖 ${pkg.dependsOn.join(", ")}` : "无内部 package 依赖"}</small></div><strong>${pkg.sourceFiles}<small>src files</small></strong><b>${pkg.status}</b></article>`).join("");
  $("#maturity-atlas").innerHTML = deepResearch.maturityAtlas.map((item) => `
    <article><span>${item.level}</span><div><small>${item.label}</small><h3>${item.items}</h3><p>${item.meaning}</p><code>${item.evidence}</code></div></article>`).join("");

  const agentGuide = deepResearch.agentDevelopmentGuide;
  $("#agent-builder-thesis").textContent = agentGuide.thesis;
  let selectedAgentRoute = agentGuide.routes[0].id;
  function renderAgentRoute() {
    $("#agent-route-tabs").innerHTML = agentGuide.routes.map((route) => `
      <button role="tab" data-agent-route="${route.id}" aria-selected="${route.id === selectedAgentRoute}" class="${route.id === selectedAgentRoute ? "active" : ""}"><span>${route.number}</span><b>${route.name}</b><small>${route.id === "durable" ? "观察路线" : "可实施路线"}</small></button>`).join("");
    const route = agentGuide.routes.find((item) => item.id === selectedAgentRoute);
    $("#agent-route-detail").innerHTML = `<header><span>ROUTE ${route.number}</span><b>${route.fit}</b></header><h3>${route.name}</h3><dl><div><dt>复用 pi</dt><dd>${route.reuse}</dd></div><div><dt>自己负责</dt><dd>${route.own}</dd></div><div><dt>取舍</dt><dd>${route.tradeoff}</dd></div><div><dt>从这里开始</dt><dd><code>${route.start}</code></dd></div></dl>`;
    $$('[data-agent-route]').forEach((button) => button.addEventListener("click", () => { selectedAgentRoute = button.dataset.agentRoute; renderAgentRoute(); }));
  }
  renderAgentRoute();
  $("#agent-capability-body").innerHTML = agentGuide.capabilities.map((item) => `<tr><th scope="row"><strong>${item.layer}</strong><code>${item.read}</code></th><td>${item.piProvides}</td><td>${item.youOwn}</td><td><b>${item.decision}</b></td></tr>`).join("");
  $("#agent-learning-path").innerHTML = agentGuide.learningPath.map((item) => `<li><span>${item.number}</span><div><h4>${item.name}</h4><p>${item.goal}</p><code>${item.files}</code></div></li>`).join("");
  $("#agent-pitfalls").innerHTML = agentGuide.pitfalls.map((item) => `<li>${item}</li>`).join("");
  $("#architecture-findings").innerHTML = systemMap.architectureFindings.map((finding) => `<li>${finding}</li>`).join("");

  let selectedMemory = systemMap.memoryModel[0].id;
  function renderMemory() {
    $("#memory-rail").innerHTML = systemMap.memoryModel.map((item, index) => `
      <li><button data-memory="${item.id}" class="${item.id === selectedMemory ? "active" : ""}" ${item.id === selectedMemory ? 'aria-current="step"' : ""}><span>${String(index + 1).padStart(2, "0")}</span><b>${item.name}</b><small>${item.persistence}</small></button></li>`).join("");
    const item = systemMap.memoryModel.find((entry) => entry.id === selectedMemory);
    $("#memory-detail").innerHTML = `<div class="detail-kicker"><span>${item.owner}</span><i>${item.lifetime}</i></div><h2>${item.name}</h2><dl><div><dt>保存什么</dt><dd>${item.contents}</dd></div><div><dt>如何持久化</dt><dd>${item.persistence}</dd></div><div><dt>所有者</dt><dd>${item.owner}</dd></div><div><dt>源码入口</dt><dd><code>${item.source}</code></dd></div></dl>`;
    $$('[data-memory]').forEach((button) => button.addEventListener("click", () => { selectedMemory = button.dataset.memory; renderMemory(); }));
  }
  renderMemory();

  $("#state-matrix-body").innerHTML = deepResearch.stateMatrix.map((item) => `
    <tr><th scope="row"><strong>${item.name}</strong><code>${item.evidence}</code></th><td>${item.owner}<small>${item.scope}</small></td><td>${item.reads}</td><td>${item.writes}</td><td><b>${item.persistence}</b></td></tr>`).join("");
  $("#session-entry-grid").innerHTML = deepResearch.sessionEntries.map((item, index) => `
    <article><span>${String(index + 1).padStart(2, "0")}</span><code>${item.type}</code><p>${item.purpose}</p><dl><div><dt>进入 Context</dt><dd>${item.context}</dd></div><div><dt>写入者</dt><dd>${item.writtenBy}</dd></div></dl></article>`).join("");

  let selectedRuntime = learning.runtimeFlow[0].id;
  function renderRuntime() {
    $("#runtime-steps").innerHTML = learning.runtimeFlow.map((step) => `
      <li><button class="${step.id === selectedRuntime ? "active" : ""}" data-runtime="${step.id}" ${step.id === selectedRuntime ? 'aria-current="step"' : ""}>
        <span>${step.number}</span><b>${step.title}</b><small>${step.actor}</small>
      </button></li>`).join("");
    const step = learning.runtimeFlow.find((item) => item.id === selectedRuntime);
    $("#runtime-detail").innerHTML = `
      <div class="detail-kicker"><span>STEP ${step.number}</span><i>${step.actor}</i></div>
      <h2>${step.title}</h2><p class="runtime-description">${step.description}</p>
      <div class="runtime-output"><span>这一阶段产出</span><strong>${step.output}</strong></div>
      <div class="runtime-source"><span>从这里核验</span><code>${step.source}</code></div>`;
    $$('[data-runtime]').forEach((button) => button.addEventListener("click", () => {
      selectedRuntime = button.dataset.runtime;
      renderRuntime();
    }));
  }
  renderRuntime();

  let selectedDive = deepResearch.deepDives[0].id;
  let selectedDiveStep = deepResearch.deepDives[0].steps[0].number;
  function renderDeepDive() {
    $("#deep-dive-tabs").innerHTML = deepResearch.deepDives.map((dive) => `
      <button role="tab" data-dive="${dive.id}" aria-selected="${dive.id === selectedDive}" class="${dive.id === selectedDive ? "active" : ""}"><span>${dive.number}</span><b>${dive.name}</b><small>${dive.status}</small></button>`).join("");
    const dive = deepResearch.deepDives.find((item) => item.id === selectedDive);
    if (!dive.steps.some((step) => step.number === selectedDiveStep)) selectedDiveStep = dive.steps[0].number;
    $("#deep-dive-summary").innerHTML = `<div><span>${dive.status}</span><strong>${dive.question}</strong></div><p>${dive.summary}</p><b>${dive.steps.length} 个源码步骤</b>`;
    $("#deep-dive-steps").innerHTML = dive.steps.map((step) => `
      <li><button data-dive-step="${step.number}" class="${step.number === selectedDiveStep ? "active" : ""}" ${step.number === selectedDiveStep ? 'aria-current="step"' : ""}><span>${step.number}</span><b>${step.title}</b><small>${step.actor}</small></button></li>`).join("");
    const step = dive.steps.find((item) => item.number === selectedDiveStep);
    $("#deep-dive-detail").innerHTML = `
      <header><div><span>STEP ${step.number}</span><i>${step.actor}</i></div><h3>${step.title}</h3><code>${step.source}</code></header>
      <dl class="mechanism-detail-list">
        <div><dt>输入</dt><dd>${step.input}</dd></div><div><dt>执行动作</dt><dd>${step.action}</dd></div>
        <div><dt>产出</dt><dd>${step.output}</dd></div><div><dt>状态变化</dt><dd>${step.state}</dd></div>
        <div><dt>事件 / Hook</dt><dd>${step.event}</dd></div><div class="warning"><dt>失败与边界</dt><dd>${step.failure}</dd></div>
      </dl>`;
    $$('[data-dive]').forEach((button) => button.addEventListener("click", () => {
      selectedDive = button.dataset.dive;
      selectedDiveStep = deepResearch.deepDives.find((item) => item.id === selectedDive).steps[0].number;
      renderDeepDive();
    }));
    $$('[data-dive-step]').forEach((button) => button.addEventListener("click", () => { selectedDiveStep = button.dataset.diveStep; renderDeepDive(); }));
  }
  renderDeepDive();

  let selectedHook = 0;
  function renderHooks() {
    $("#hook-rail").innerHTML = deepResearch.extensionLifecycle.map((item, index) => `
      <li><button data-hook="${index}" class="${index === selectedHook ? "active" : ""}" ${index === selectedHook ? 'aria-current="step"' : ""}><span>${String(index + 1).padStart(2, "0")}</span><b>${item.stage}</b><small>${item.hooks}</small></button></li>`).join("");
    const item = deepResearch.extensionLifecycle[selectedHook];
    $("#hook-detail").innerHTML = `<div><span>EXTENSION STAGE ${String(selectedHook + 1).padStart(2, "0")}</span><b>${item.control}</b></div><h3>${item.stage}</h3><code>${item.hooks}</code><p>${item.can}</p><aside><span>源码定义</span><code>${item.source}</code></aside>`;
    $$('[data-hook]').forEach((button) => button.addEventListener("click", () => { selectedHook = Number(button.dataset.hook); renderHooks(); }));
  }
  renderHooks();

  const reviewKey = "pi-study-reviewed";
  let reviewed = new Set();
  try { reviewed = new Set(JSON.parse(localStorage.getItem(reviewKey) || "[]")); } catch { reviewed = new Set(); }
  const expanded = new Set();

  function updateReviewProgress() {
    const total = learning.reviewCards.length;
    const count = reviewed.size;
    const percent = Math.round((count / total) * 100);
    $("#review-progress").value = count;
    $("#review-progress").max = total;
    $("#review-score").textContent = `${percent}%`;
    $("#header-progress").textContent = `${count} / ${total} 已复习`;
    localStorage.setItem(reviewKey, JSON.stringify([...reviewed]));
  }

  function renderReviews() {
    $("#review-grid").innerHTML = learning.reviewCards.map((card, index) => {
      const isExpanded = expanded.has(card.id);
      const isDone = reviewed.has(card.id);
      return `<article class="review-card ${isDone ? "completed" : ""}">
        <div class="review-card-head"><span>Q${String(index + 1).padStart(2, "0")}</span><i>${isDone ? "已掌握" : "待复习"}</i></div>
        <h2>${card.question}</h2>
        <div class="review-answer" ${isExpanded ? "" : "hidden"}><span>参考答案</span><p>${card.answer}</p></div>
        <div class="review-card-actions">
          <button data-answer="${card.id}" aria-expanded="${isExpanded}">${isExpanded ? "收起答案" : "展开答案"}</button>
          <button class="master-button" data-master="${card.id}" aria-pressed="${isDone}">${isDone ? "✓ 已掌握" : "标记已掌握"}</button>
        </div>
      </article>`;
    }).join("");
    $$('[data-answer]').forEach((button) => button.addEventListener("click", () => {
      const id = button.dataset.answer;
      expanded.has(id) ? expanded.delete(id) : expanded.add(id);
      renderReviews();
    }));
    $$('[data-master]').forEach((button) => button.addEventListener("click", () => {
      const id = button.dataset.master;
      reviewed.has(id) ? reviewed.delete(id) : reviewed.add(id);
      updateReviewProgress();
      renderReviews();
    }));
    updateReviewProgress();
  }
  renderReviews();
  $("#reset-review").addEventListener("click", () => {
    reviewed.clear();
    expanded.clear();
    renderReviews();
  });

  $("#evidence-question-grid").innerHTML = deepResearch.evidenceIndex.map((item, index) => `
    <details><summary><span>${String(index + 1).padStart(2, "0")}</span><b>${item.question}</b><small>${item.level}</small></summary><div><p>${item.why}</p>${item.sources.map((source) => `<code>${source}</code>`).join("")}</div></details>`).join("");
  $("#glossary-grid").innerHTML = deepResearch.glossary.map((item) => `<div><dt>${item.term}</dt><dd>${item.meaning}</dd></div>`).join("");

  const number = new Intl.NumberFormat("zh-CN");
  $("#build-meta").textContent = `${learning.meta.subjectCommit.slice(0, 8)} · ${number.format(dataset.final.nodes)} nodes · ${learning.meta.updatedAt}`;
  setView(location.hash.slice(1), false);
})();
