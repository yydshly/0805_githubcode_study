(function () {
  "use strict";

  const form = document.querySelector("#briefForm");
  const storyInput = document.querySelector("#storyIdea");
  const ageSelect = document.querySelector("#age");
  const styleSelect = document.querySelector("#style");
  const outputTitle = document.querySelector("#outputTitle");
  const outputSummary = document.querySelector("#outputSummary");
  const stagePanel = document.querySelector("#stagePanel");
  const tabs = Array.from(document.querySelectorAll("[data-stage]"));
  const resetButton = document.querySelector("#resetButton");
  const sceneCaption = document.querySelector("#sceneCaption");
  const heroScene = document.querySelector("#heroScene");

  const DEFAULT_IDEA = "一个怕黑的小女孩，通过检查房间里的影子，学会自己找到光源。";
  const pageSelections = {
    8: [0, 2, 4, 6, 8, 11, 13, 15],
    12: [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 12, 15],
    16: Array.from({ length: 16 }, (_, index) => index)
  };

  const themes = {
    dark: {
      match: /黑|影子|夜|灯|害怕/,
      title: "《豆豆和墙上的小手》",
      protagonist: "豆豆，5 岁小女孩",
      profile: "圆脸、黑色齐刘海、黄色睡衣、深蓝拖鞋",
      prop: "发光的小兔灯",
      scene: "卧室、蓝窗框、床头星星贴纸",
      palette: "深蓝夜色、奶油黄灯光、低饱和珊瑚色",
      cannot: "黄色睡衣、小兔灯、黑色齐刘海、圆圆黑眼睛",
      desire: "想弄清墙上的影子到底是什么",
      obstacle: "每次灯光变化，影子都会换一个样子",
      turn: "她发现影子会跟着光源和物体移动",
      ending: "豆豆主动举灯验证最后一个影子，并给它取了名字",
      sentences: [
        "天黑了，豆豆把被角拉到鼻尖。", "墙上轻轻晃着一只黑色的小手。", "豆豆闭上眼，可小手还在脑袋里摇。", "她摸到床边的小兔灯。",
        "灯往左，小手也往左。", "灯往右，小手就跑到另一边。", "豆豆把灯举高一点。", "原来，是窗边的树叶在挥手。",
        "衣柜旁又冒出一个圆脑袋。", "豆豆没有躲，她把灯慢慢转过去。", "圆脑袋是椅背上的小熊帽。", "豆豆把帽子请回了挂钩。",
        "最后一个长影子躺在门边。", "她看见自己的小拖鞋正挡着光。", "豆豆关掉小兔灯，又重新打开。", "墙上的小手回来了：晚安，树叶先生。"
      ],
      evidence: ["被角与紧张表情", "墙面手形影子", "闭眼与被窝", "床边小兔灯", "灯在左、影子向左", "灯在右、影子换位", "举高的两只手", "树叶与对应投影", "衣柜旁圆形影子", "转动灯光", "小熊帽与椅背", "挂钩上的帽子", "门边长影子", "拖鞋挡住光线", "熄灭再点亮", "树叶手影与放松表情"]
    },
    teeth: {
      match: /牙|刷|泡泡|小熊/,
      title: "《小熊的泡泡牙刷队》",
      protagonist: "团团，4 岁小熊",
      profile: "蜂蜜色圆耳朵、绿色短裤、白色小背心",
      prop: "蓝色星星牙刷",
      scene: "奶油色洗手间、圆镜子、绿色漱口杯",
      palette: "蜂蜜黄、薄荷绿、泡泡蓝",
      cannot: "蜂蜜色圆耳朵、绿色短裤、星星牙刷",
      desire: "想不刷牙也能让牙齿城堡干净",
      obstacle: "躲在牙缝里的糖点小怪兽越来越热闹",
      turn: "团团发现泡泡和小圆圈动作能赶走糖点",
      ending: "团团自己完成刷牙，把牙刷放回绿色杯子",
      sentences: ["团团不想刷牙。", "镜子里的牙齿城堡亮起小红点。", "糖点小怪兽躲进最里面。", "团团拿起星星牙刷。", "泡泡先走过门牙。", "小圆圈绕过每颗牙。", "怪兽们抱头逃跑。", "最里面还有一颗糖点。", "团团张大嘴巴再检查。", "牙刷转到小小的角落。", "清水瀑布冲走泡泡。", "城堡重新发光。", "团团数了数洁白的牙齿。", "牙刷回到绿色杯子。", "小怪兽隔着镜子挥挥手。", "明晚，泡泡队还会准时出发。"],
      evidence: Array(16).fill("星星牙刷、泡泡与明确刷牙动作")
    },
    school: {
      match: /幼儿园|上学|妈妈|入园|分离/,
      title: "《口袋里的三颗勇气豆》",
      protagonist: "栗栗，5 岁小狐狸",
      profile: "橘红毛色、白色尾巴尖、蓝色背带裤",
      prop: "三颗绿色勇气豆",
      scene: "幼儿园门口、黄色小门、窗边绿植物",
      palette: "暖橙、天空蓝、豆荚绿",
      cannot: "白色尾巴尖、蓝色背带裤、三颗绿色豆子",
      desire: "想带着想念走进幼儿园",
      obstacle: "每走一步，口袋里的想念就变得重一点",
      turn: "每完成一件小事，栗栗就摸一颗勇气豆",
      ending: "放学时，他把今天的新故事装进同一个口袋",
      sentences: ["幼儿园的小门今天特别高。", "栗栗握紧妈妈给的三颗豆。", "第一颗豆陪他挂好小书包。", "门里传来积木碰撞的声音。", "第二颗豆陪他走到地毯边。", "一座积木桥正缺最后一块。", "栗栗把蓝色积木递过去。", "新朋友给桥插上小旗。", "第三颗豆在口袋里变暖了。", "栗栗举手选择了故事书。", "午睡前，他还想了一会儿妈妈。", "他摸摸已经空掉的豆荚。", "放学铃响时，小门变矮了。", "栗栗跑向妈妈。", "他从口袋里掏出三件新故事。", "明天，勇气豆可以留在家里。"],
      evidence: Array(16).fill("三颗勇气豆、蓝色背带裤与幼儿园场景锚点")
    },
    generic: {
      match: /.*/,
      title: "《一个小小发现》",
      protagonist: "米米，5 岁孩子",
      profile: "圆脸、短发、珊瑚色外套、绿色小背包",
      prop: "一枚星星徽章",
      scene: "固定的日常空间、蓝色门框、窗边绿植物",
      palette: "奶油白、鼠尾草绿、珊瑚红",
      cannot: "珊瑚色外套、绿色背包、星星徽章",
      desire: "想解决眼前这个具体的小麻烦",
      obstacle: "第一次尝试没有成功",
      turn: "通过观察和验证，找到一个自己能完成的方法",
      ending: "主角用行动解决问题，开头的场景出现温暖回声",
      sentences: Array.from({ length: 16 }, (_, i) => `第 ${i + 1} 个可见动作让故事向前走了一步。`),
      evidence: Array(16).fill("固定角色外观、核心道具和单一可见动作")
    }
  };

  const roles = ["建立日常", "愿望出现", "麻烦出现", "第一次尝试", "反馈", "误解加深", "情绪低点", "获得线索", "主动验证", "第二次尝试", "发现关键", "自主选择", "解决行动", "结果落地", "回望变化", "结尾回声"];

  let state = { stage: "outline", selectedPage: 0, data: null };

  function escapeHTML(value) {
    return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  }

  function getTheme(idea) {
    return Object.values(themes).find(theme => theme.match.test(idea)) || themes.generic;
  }

  function getChecked(name) {
    return form.querySelector(`input[name="${name}"]:checked`).value;
  }

  function compileData() {
    const idea = storyInput.value.trim() || DEFAULT_IDEA;
    const theme = getTheme(idea);
    const pageCount = Number(getChecked("pages"));
    const indices = pageSelections[pageCount];
    const pages = indices.map((sourceIndex, index) => ({
      number: index + 1,
      role: roles[sourceIndex],
      sentence: theme.sentences[sourceIndex],
      evidence: theme.evidence[sourceIndex],
      before: index === 0 ? "日常尚未被打破" : theme.sentences[indices[index - 1]],
      trigger: theme.sentences[sourceIndex],
      hook: index === indices.length - 1 ? "用动作回应开头" : theme.sentences[indices[index + 1]]
    }));

    return {
      idea,
      theme,
      age: ageSelect.value,
      style: styleSelect.value,
      language: getChecked("language"),
      pageCount,
      pages
    };
  }

  function renderOutline(data) {
    const t = data.theme;
    return `
      <div class="panel-titleline"><div><small>STORY ARCHITECTURE</small><br><strong>五句话故事骨架</strong></div><p>先确认因果，再写逐页正文。<br>主题必须从行动中长出来。</p></div>
      <div class="beat-list">
        <article class="beat-card"><span>01 · 主角</span><h4>${escapeHTML(t.protagonist)}</h4><p>${escapeHTML(t.desire)}</p></article>
        <article class="beat-card"><span>02 · 世界规则</span><h4>具体限制</h4><p>${escapeHTML(t.obstacle)}</p></article>
        <article class="beat-card"><span>03 · 第一次尝试</span><h4>允许失败</h4><p>主角先按直觉行动，得到一个可见但不完整的反馈。</p></article>
        <article class="beat-card"><span>04 · 关键发现</span><h4>不靠说教</h4><p>${escapeHTML(t.turn)}</p></article>
        <article class="beat-card"><span>05 · 结尾回声</span><h4>状态改变</h4><p>${escapeHTML(t.ending)}</p></article>
      </div>`;
  }

  function renderBible(data) {
    const t = data.theme;
    return `
      <div class="panel-titleline"><div><small>CHARACTER & STYLE BIBLE</small><br><strong>一致性圣经</strong></div><p>不是写“同一个角色”，<br>而是每页重复不可改变的特征。</p></div>
      <div class="bible-grid">
        <article class="bible-card"><span>主角固定外观</span><h4>${escapeHTML(t.protagonist)}</h4><div class="token-list">${t.profile.split("、").map(x => `<i>${escapeHTML(x)}</i>`).join("")}</div></article>
        <article class="bible-card"><span>场景与道具锚点</span><h4>${escapeHTML(t.prop)}</h4><p>${escapeHTML(t.scene)}。核心道具不能无故消失、换色或改变拿取方式。</p></article>
        <article class="bible-card"><span>主风格</span><h4>${escapeHTML(data.style)}</h4><p>${escapeHTML(t.palette)}；全书保持同一画材质感、线条密度和角色比例。</p></article>
        <article class="bible-card"><span>肢体规则</span><h4>只描述可见关系</h4><p>正常两只手、两条手臂；有人物与道具互动时写清左右手用途与遮挡。</p></article>
        <article class="bible-card wide"><span>不能改变</span><h4>跨页身份锚点</h4><div class="token-list">${t.cannot.split("、").map(x => `<i>${escapeHTML(x)}</i>`).join("")}</div></article>
      </div>`;
  }

  function renderPages(data) {
    const selected = data.pages[state.selectedPage] || data.pages[0];
    return `
      <div class="panel-titleline"><div><small>PAGE-BY-PAGE CAUSALITY</small><br><strong>${data.pageCount} 页因果链</strong></div><p>选择任意页，检查它如何<br>承接上一页并推动下一页。</p></div>
      <div class="page-layout">
        <div class="page-list">${data.pages.map((page, index) => `<button type="button" class="page-button ${index === state.selectedPage ? "active" : ""}" data-page-index="${index}"><b>${String(page.number).padStart(2,"0")}</b><span>${escapeHTML(page.role)}<small>${escapeHTML(page.sentence)}</small></span></button>`).join("")}</div>
        <article class="page-detail"><span>PAGE ${String(selected.number).padStart(2,"0")} · ${escapeHTML(selected.role)}</span><h4>${escapeHTML(selected.sentence)}</h4><div class="detail-chain"><div><small>上一页状态</small><p>${escapeHTML(selected.before)}</p></div><span>→</span><div><small>本页触发</small><p>${escapeHTML(selected.trigger)}</p></div><span>→</span><div><small>下一页钩子</small><p>${escapeHTML(selected.hook)}</p></div></div><p class="visual-evidence"><b>图文契约：</b>${escapeHTML(selected.evidence)}必须清楚出现在画面里；看不见的细节不能由正文硬解释。</p></article>
      </div>`;
  }

  function buildPrompt(data) {
    const page = data.pages[state.selectedPage] || data.pages[0];
    const t = data.theme;
    return `请生成一张儿童绘本插画，4:3 横版。

项目：${t.title} · 第 ${page.number} 页
读者：${data.age} 岁

[固定角色]
${t.protagonist}；${t.profile}。
不可改变：${t.cannot}。

[当前页画面]
${page.sentence}
场景：${t.scene}。一页只表现一个动作或发现。

[图文契约]
画面必须清楚出现：${page.evidence}。

[肢体约束]
只露出合理数量的手脚；如拿取 ${t.prop}，写清左右手用途；
不要第三只手、多余手指或融合手臂。

[风格]
${data.style}；${t.palette}；干净构图，保留安全文字区。

[限制]
画面中不要出现正文文字；不要照片、3D、商业海报、水印、logo、
知名版权角色、恐怖或成人化表达。`;
  }

  function renderPrompt(data) {
    return `
      <div class="panel-titleline"><div><small>PAGE PROMPT CONTRACT</small><br><strong>第 ${state.selectedPage + 1} 页 Prompt</strong></div><p>角色字段会重复出现，<br>但这仍然只是软约束。</p></div>
      <div class="prompt-box"><div class="prompt-toolbar"><span>prompts/page-${String(state.selectedPage + 1).padStart(2,"0")}.md</span><span>NO MODEL CALL</span></div><pre id="promptText"></pre></div>
      <div class="prompt-legend"><span>角色身份</span><span>单页动作</span><span>视觉证据</span><span>肢体约束</span><span>负面约束</span></div>
      <p class="prompt-note">模拟器只展示上游模板的编排方式；真实生产时由 Agent 将此类 Prompt 交给 image_gen 或其他图片模型。</p>`;
  }

  function renderQA() {
    const checks = ["页与页之间存在因果", "每页只有一个主要动作", "角色服装与配饰跨页一致", "核心道具没有无故消失", "正文名词都有视觉证据", "人物没有异常手脚", "画面不含正文乱码", "内容适龄且解决方式温和"];
    return `
      <div class="panel-titleline"><div><small>QUALITY GATE</small><br><strong>交付前 QA</strong></div><p>失败项决定返工层级：<br>改文案、改 Prompt、重出图或重排版。</p></div>
      <div class="qa-header"><div><strong id="qaScore">63%</strong><span>当前通过率</span></div><span id="qaMessage">还有 3 项必须处理</span></div>
      <div class="qa-list">${checks.map((check, index) => `<label class="qa-item"><input type="checkbox" ${index < 5 ? "checked" : ""}><span>${check}</span></label>`).join("")}</div>`;
  }

  function renderStage() {
    const data = state.data;
    if (!data) return;
    const renderers = { outline: renderOutline, bible: renderBible, pages: renderPages, prompt: renderPrompt, qa: renderQA };
    stagePanel.innerHTML = renderers[state.stage](data);
    if (state.stage === "prompt") document.querySelector("#promptText").textContent = buildPrompt(data);
    if (state.stage === "pages") bindPageButtons();
    if (state.stage === "qa") bindQA();
  }

  function bindPageButtons() {
    document.querySelectorAll("[data-page-index]").forEach(button => button.addEventListener("click", () => {
      state.selectedPage = Number(button.dataset.pageIndex);
      renderStage();
    }));
  }

  function bindQA() {
    const checks = Array.from(stagePanel.querySelectorAll(".qa-item input"));
    const update = () => {
      const passed = checks.filter(check => check.checked).length;
      const percent = Math.round((passed / checks.length) * 100);
      document.querySelector("#qaScore").textContent = `${percent}%`;
      document.querySelector("#qaMessage").textContent = passed === checks.length ? "可以进入样书导出" : `还有 ${checks.length - passed} 项必须处理`;
    };
    checks.forEach(check => check.addEventListener("change", update));
  }

  function updateScene(data) {
    const sceneClass = data.theme === themes.teeth ? "scene-teeth" : data.theme === themes.school ? "scene-school" : "scene-dark";
    heroScene.className = `storybook-scene ${sceneClass}`;
    sceneCaption.textContent = data.pages[Math.min(7, data.pages.length - 1)].sentence;
  }

  function compile(options = {}) {
    state.data = compileData();
    globalThis.storybookLabData = state.data;
    state.selectedPage = 0;
    state.stage = options.keepStage ? state.stage : "outline";
    outputTitle.textContent = state.data.theme.title;
    outputSummary.innerHTML = [state.data.age + " 岁", state.data.pageCount + " 页", state.data.language, state.data.style].map(item => `<span>${escapeHTML(item)}</span>`).join("");
    tabs.forEach(tab => tab.setAttribute("aria-selected", String(tab.dataset.stage === state.stage)));
    updateScene(state.data);
    renderStage();
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    compile();
  });

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      state.stage = tab.dataset.stage;
      tabs.forEach(item => item.setAttribute("aria-selected", String(item === tab)));
      renderStage();
    });
    tab.addEventListener("keydown", event => {
      if (!(["ArrowLeft", "ArrowRight"].includes(event.key))) return;
      event.preventDefault();
      const nextIndex = event.key === "ArrowRight" ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
    });
  });

  document.querySelectorAll(".sample-chip").forEach(button => button.addEventListener("click", () => {
    storyInput.value = button.dataset.sample;
    storyInput.focus();
  }));

  resetButton.addEventListener("click", () => {
    form.reset();
    storyInput.value = DEFAULT_IDEA;
    compile();
  });

  compile();
})();
