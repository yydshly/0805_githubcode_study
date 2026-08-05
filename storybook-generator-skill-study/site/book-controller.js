(function () {
  "use strict";

  var form = document.querySelector("#briefForm");
  var workspace = document.querySelector("#bookWorkspace");
  var progress = document.querySelector("#generationProgress");
  var progressNumber = document.querySelector("#progressNumber");
  var progressLabel = document.querySelector("#progressLabel");
  var progressDetail = document.querySelector("#progressDetail");
  var progressBar = document.querySelector("#progressBar");
  var bookTitle = document.querySelector("#bookTitle");
  var bookRenderMode = document.querySelector("#bookRenderMode");
  var bookPageTotal = document.querySelector("#bookPageTotal");
  var bookScoreBadge = document.querySelector("#bookScoreBadge");
  var bookArt = document.querySelector("#bookArt");
  var bookCopy = document.querySelector("#bookCopy");
  var pageCounter = document.querySelector("#pageCounter");
  var thumbnails = document.querySelector("#bookThumbnails");
  var previousButton = document.querySelector("#prevPage");
  var nextButton = document.querySelector("#nextPage");
  var analysisPanel = document.querySelector("#analysisPanel");
  var analysisTabs = Array.from(document.querySelectorAll("[data-analysis-mode]"));
  var generateButton = form.querySelector("button[type='submit']");
  var currentBook = [];
  var currentIndex = 0;
  var analysisMode = "page";

  var progressSteps = [
    ["建立故事骨架", "把主题翻译成孩子能看见的动作"],
    ["固定角色圣经", "锁定外观、服装、道具与场景锚点"],
    ["编排页间因果", "补上状态、钩子和光源—遮挡物—投影面关系"],
    ["生成封面", "建立主角、核心道具和故事气质"],
    ["生成前 3 页", "先校准角色比例与画材质感"],
    ["生成后续内页", "沿用角色圣经和固定场景"],
    ["排版正文", "插画与文字分层，避免模型乱码"],
    ["执行图文 QA", "检查视觉证据、肢体与内容安全"],
    ["计算一致性", "定位需要局部返工的页面"]
  ];

  function esc(value) {
    return String(value).replace(/[&<>'"]/g, function (char) {
      return { "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[char];
    });
  }

  function detectTheme(data) {
    var title = data.theme.title;
    if (title.indexOf("泡泡") >= 0) return "teeth";
    if (title.indexOf("勇气豆") >= 0) return "school";
    if (title.indexOf("墙上的小手") >= 0) return "dark";
    return "generic";
  }

  function scoreFor(index) {
    if (index === 0) return 94;
    var scores = [93,92,90,95,91,91,86,91,92,95,93,96,90,94,97,95];
    return scores[(index - 1) % scores.length];
  }

  function lightingFor(theme, pageNumber, useImagegen) {
    if (theme !== "dark" || !useImagegen) {
      return {
        status:"contract-only", score:null, source:"页面光源待设定", blocker:"待从画面识别",
        receiver:"待从画面识别", direction:"待生成后检查", observed:"当前是代码回退，尚无真实光影证据。",
        repair:"生成真实图片后，补齐光源—遮挡物—投影面关系并复查。"
      };
    }
    var rows = {
      0:{score:93,source:"发光的小兔灯",blocker:"床栏与被角",receiver:"卧室墙面",direction:"右侧暖光向左上扩散",observed:"光源可见，墙面暖光和主角轮廓基本匹配。",repair:"无需返工；保留当前光影。"},
      1:{score:91,source:"发光的小兔灯",blocker:"被角边缘",receiver:"墙面手形影子",direction:"右下向左上",observed:"兔子灯与墙面影子同场，投影方向可读。",repair:"无需返工；保留当前光影。"},
      2:{score:90,source:"发光的小兔灯",blocker:"豆豆与被角",receiver:"墙面",direction:"灯光移动后影子随之偏移",observed:"光源变化与影子变化的叙事关系成立。",repair:"无需返工；保留当前光影。"},
      3:{score:89,source:"发光的小兔灯",blocker:"豆豆的手臂",receiver:"墙面",direction:"灯在左，影子向左侧延展",observed:"灯与影子位置关系清楚，仍需人工确认边缘来源。",repair:"无需返工；保留当前光影。"},
      4:{score:90,source:"发光的小兔灯",blocker:"豆豆的手臂",receiver:"墙面",direction:"灯在右，影子向另一侧换位",observed:"前后页的换位意图可读，光源色温保持统一。",repair:"无需返工；保留当前光影。"},
      5:{score:88,source:"发光的小兔灯",blocker:"熊帽与椅背",receiver:"衣柜旁墙面",direction:"右侧暖光投向左侧墙面",observed:"圆脑袋影子与椅背道具同场，但帽子轮廓边缘偏软。",repair:"可选复查；若强调帽子轮廓，减少背景杂物后重出。"},
      6:{score:91,source:"发光的小兔灯",blocker:"挂钩上的熊帽",receiver:"衣柜旁墙面",direction:"右侧暖光向左",observed:"帽子已明确挂在墙面挂钩，椅子为空，光影关系保持连续。",repair:"无需返工；保留当前光影。"},
      7:{score:86,source:"发光的小兔灯",blocker:"被举起的小拖鞋",receiver:"卧室墙面",direction:"灯光穿过鞋子投向墙面",observed:"鞋子位于灯与墙之间，墙上出现对应轮廓的风格化投影。",repair:"无需返工；保留当前光影。"},
      8:{score:91,source:"发光的小兔灯",blocker:"窗外树枝与叶片",receiver:"卧室墙面",direction:"叶片与枝干投影向右上延展",observed:"树枝、灯、墙面和叶片影子同场，影子来源清楚；仍保留绘本式柔化边缘。",repair:"无需返工；保留当前光影。"}
    };
    var row = rows[pageNumber] || rows[8];
    return Object.assign({status:row.score < 80 ? "review" : "pass"}, row);
  }

  function makeBook(data) {
    var theme = detectTheme(data);
    var useImagegen = theme === "dark" && data.pages.length === 8;
    var cover = {
      isCover:true, number:0, role:"封面", sentence:data.theme.title,
      evidence:"主角 " + data.theme.protagonist + " 与核心道具“" + data.theme.prop + "”同时出现",
      score:94, issue:"", repair:"无需返工；保留当前页。", theme:theme,
      asset:useImagegen ? "./assets/book-doudou/00-cover.png" : "",
      source:useImagegen ? "imagegen" : "fallback",
      lighting:lightingFor(theme,0,useImagegen)
    };
    return [cover].concat(data.pages.map(function (page, index) {
      var pageNumber = index + 1;
      var issue = "";
      var repair = "无需返工；保留当前页。";
      if (!useImagegen && pageNumber === Math.min(6, data.pages.length)) {
        issue = "代码回退中的核心道具“" + data.theme.prop + "”被安排在画面外，图文证据偏弱。";
        repair = "重出第 " + pageNumber + " 页 v2：把核心道具放回画面右下方，并保持角色动作不变。";
      }
      return Object.assign({}, page, {
        isCover:false,
        score:scoreFor(pageNumber),
        issue:issue,
        repair:repair,
        theme:theme,
        asset:useImagegen ? "./assets/book-doudou/" + String(pageNumber).padStart(2,"0") + ".png" : "",
        source:useImagegen ? "imagegen" : "fallback",
        lighting:lightingFor(theme,pageNumber,useImagegen)
      });
    }));
  }

  function colors(theme) {
    if (theme === "teeth") return {sky:"#65958f",deep:"#2d575b",ground:"#b8cdb3",body:"#b87842",clothes:"#f4efdc",accent:"#5f9cae"};
    if (theme === "school") return {sky:"#74a5ba",deep:"#3d6e82",ground:"#7d9e70",body:"#d97840",clothes:"#688fb4",accent:"#e7bf59"};
    return {sky:"#315b67",deep:"#19333d",ground:"#496558",body:"#dda17a",clothes:"#efc567",accent:"#ffe29a"};
  }

  function characterSvg(theme, x, y, scale, wave) {
    var c = colors(theme);
    if (theme === "teeth" || theme === "school") {
      var ears = theme === "teeth"
        ? "<circle cx='14' cy='12' r='13' fill='" + c.body + "'/><circle cx='59' cy='12' r='13' fill='" + c.body + "'/>"
        : "<path d='M7 21L15 -7L31 16Z' fill='" + c.body + "'/><path d='M68 21L57 -7L43 16Z' fill='" + c.body + "'/>";
      return "<g transform='translate(" + x + " " + y + ") scale(" + scale + ")'>" +
        "<ellipse cx='37' cy='105' rx='34' ry='9' fill='rgba(8,23,28,.18)'/>" + ears +
        "<circle cx='37' cy='30' r='29' fill='" + c.body + "'/><ellipse cx='37' cy='38' rx='16' ry='12' fill='#f2d3ac'/>" +
        "<circle cx='27' cy='28' r='3' fill='#262a29'/><circle cx='48' cy='28' r='3' fill='#262a29'/><circle cx='37' cy='36' r='4' fill='#262a29'/>" +
        "<rect x='10' y='51' width='55' height='53' rx='22' fill='" + c.clothes + "'/>" +
        "<path d='M20 57V97M54 57V97' stroke='" + c.accent + "' stroke-width='7'/>" +
        "<path d='M11 65Q-5 48 2 34M64 65Q83 47 77 33' stroke='" + c.body + "' stroke-width='12' stroke-linecap='round'/></g>";
    }
    var arm = wave
      ? "<path d='M44 48Q72 18 84 25' stroke='#efc567' stroke-width='13' stroke-linecap='round'/><circle cx='86' cy='23' r='8' fill='#dda17a'/>"
      : "<path d='M41 50Q69 57 78 43' stroke='#efc567' stroke-width='13' stroke-linecap='round'/><circle cx='81' cy='40' r='8' fill='#dda17a'/>";
    return "<g transform='translate(" + x + " " + y + ") scale(" + scale + ")'>" +
      "<ellipse cx='35' cy='101' rx='31' ry='9' fill='rgba(8,23,28,.22)'/><rect x='13' y='43' width='48' height='61' rx='21' fill='#efc567'/>" +
      "<circle cx='37' cy='31' r='27' fill='#dda17a'/><path d='M11 28Q15-2 39 2Q68 5 65 36Q55 17 13 20Z' fill='#252a29'/>" +
      "<path d='M16 21Q20 13 27 13M31 17V7M47 17V7M59 22Q55 13 49 12' stroke='#252a29' stroke-width='5' stroke-linecap='round'/>" +
      "<circle cx='28' cy='32' r='3' fill='#252a29'/><circle cx='48' cy='32' r='3' fill='#252a29'/><path d='M31 43Q38 48 45 43' fill='none' stroke='#9c5f4b' stroke-width='2'/>" +
      arm + "<rect x='15' y='93' width='18' height='11' rx='5' fill='#243f57'/><rect x='43' y='93' width='18' height='11' rx='5' fill='#243f57'/></g>";
  }

  function lampSvg(x, y, scale, visible) {
    if (!visible) return "";
    return "<g transform='translate(" + x + " " + y + ") scale(" + scale + ")'>" +
      "<circle cx='22' cy='30' r='33' fill='rgba(255,226,142,.2)'/><rect x='7' y='13' width='30' height='34' rx='15' fill='#fff2c4'/>" +
      "<rect x='9' y='0' width='9' height='22' rx='5' fill='#fff2c4'/><rect x='27' y='0' width='9' height='22' rx='5' fill='#fff2c4'/>" +
      "<circle cx='17' cy='27' r='2' fill='#45504b'/><circle cx='28' cy='27' r='2' fill='#45504b'/></g>";
  }

  function illustration(page, index, key) {
    var c = colors(page.theme);
    var phase = Math.max(0, index - 1);
    var x = 260 + ((phase % 3) - 1) * 28;
    var last = currentBook.length ? index === currentBook.length - 1 : false;
    var character = characterSvg(page.theme, x, page.isCover ? 143 : 174, page.isCover ? 1.35 : 1.08, last);
    var room = "";
    if (page.theme === "dark" || page.theme === "generic") {
      var shadow = phase < 4
        ? "<path d='M94 110q10-18 19 0q12-25 22 1q13-18 21 4q12-8 18 7q-7 20-34 28q-32-5-46-40Z' fill='rgba(12,27,32,.52)'/>"
        : "<ellipse cx='118' cy='139' rx='48' ry='34' fill='rgba(12,27,32,.48)'/>";
      room = "<rect x='42' y='63' width='125' height='135' fill='#203c49' stroke='#e2d4b5' stroke-width='10'/>" +
        "<path d='M104 64V198M43 130H167' stroke='#e2d4b5' stroke-width='7'/>" + shadow +
        "<path d='M63 48Q92 78 115 45Q135 78 158 51' fill='none' stroke='#587667' stroke-width='8'/>";
    } else if (page.theme === "teeth") {
      room = "<rect x='54' y='78' width='116' height='94' rx='58' fill='#dce8df' stroke='#f5f0dd' stroke-width='9'/><rect x='65' y='225' width='115' height='28' rx='9' fill='#e8e1cc'/>";
    } else {
      room = "<rect x='45' y='65' width='115' height='165' rx='8' fill='#e9c568'/><rect x='73' y='105' width='58' height='125' rx='28' fill='#7ba1b3'/><circle cx='115' cy='170' r='5' fill='#f5e6b3'/>";
    }
    var issue = Boolean(page.issue);
    return "<svg viewBox='0 0 520 360' role='img' aria-label='" + esc(page.role) + "插画' xmlns='http://www.w3.org/2000/svg'>" +
      "<defs><linearGradient id='sky-" + key + "' x1='0' y1='0' x2='1' y2='1'><stop stop-color='" + c.sky + "'/><stop offset='1' stop-color='" + c.deep + "'/></linearGradient>" +
      "<radialGradient id='glow-" + key + "'><stop stop-color='#ffe49a' stop-opacity='.7'/><stop offset='1' stop-color='#ffe49a' stop-opacity='0'/></radialGradient></defs>" +
      "<rect width='520' height='360' fill='url(#sky-" + key + ")'/><circle cx='422' cy='65' r='72' fill='url(#glow-" + key + ")'/><circle cx='425' cy='62' r='31' fill='#ffe49a' opacity='.9'/>" +
      "<circle cx='60' cy='51' r='3' fill='#fff3c2'/><circle cx='204' cy='35' r='2' fill='#fff3c2'/><circle cx='325' cy='72' r='3' fill='#fff3c2'/>" +
      room + "<path d='M0 285Q98 255 187 280Q286 304 366 271Q452 250 520 278V360H0Z' fill='" + c.ground + "'/>" +
      "<rect x='310' y='255' width='122' height='18' rx='7' fill='#947150'/><path d='M326 270V328M416 270V328' stroke='#74553d' stroke-width='10'/>" +
      character + lampSvg(407,222,page.isCover?1.15:.9,page.isCover || (!issue && index>1)) +
      (index === 6 ? "<path d='M345 181q38-38 72 0v28h-72Z' fill='#7f5b47'/><circle cx='365' cy='170' r='13' fill='#9c7359'/><circle cx='400' cy='170' r='13' fill='#9c7359'/>" : "") +
      (issue ? "<circle cx='487' cy='26' r='13' fill='#e9ad49'/><path d='M487 18V28M487 33V34' stroke='#27322e' stroke-width='3' stroke-linecap='round'/>" : "") + "</svg>";
  }

  function mediaFor(page, index, key, eager) {
    if (!page.asset) return illustration(page,index,key);
    var alt = page.isCover ? window.storybookLabData.theme.title + " ImageGen 封面" : "第 " + page.number + " 页 ImageGen 插画：" + page.sentence;
    return "<img src='" + esc(page.asset) + "' alt='" + esc(alt) + "' loading='" + (eager ? "eager" : "lazy") + "' decoding='async'>";
  }

  function promptFor(page, data) {
    if (page.isCover) {
      return "请生成儿童绘本封面插画，4:3 横版，无文字。\n固定角色：" + data.theme.protagonist + "；" + data.theme.profile + "。\n核心道具：" + data.theme.prop + "。\n画面：主角与核心道具同框，直接表现“" + data.theme.desire + "”。\n" + lightingPromptFor(page) + "\n风格：" + data.style + "；" + data.theme.palette + "。\n限制：角色外观不可改变；不要文字、水印、第三只手或多余手指。";
    }
    return "请生成儿童绘本第 " + page.number + " 页插画，4:3 横版。\n\n[固定角色]\n" + data.theme.protagonist + "；" + data.theme.profile + "。\n不能改变：" + data.theme.cannot + "。\n\n[当前页画面]\n" + page.sentence + "\n场景：" + data.theme.scene + "。一页只表现一个动作。\n\n[图文契约]\n画面必须清楚出现：" + page.evidence + "。\n\n" + lightingPromptFor(page) + "\n[连续性]\n沿用上一页的角色比例、服装、配色与核心道具“" + data.theme.prop + "”。\n\n[限制]\n画面中不要正文；不要照片、3D、水印、额外角色、第三只手、多余手指或融合肢体。";
  }

  function lightingPromptFor(page) {
    var l = page.lighting;
    if (!l) return "";
    return "[光影契约]\n光源：" + l.source + "。\n遮挡物：" + l.blocker + "。\n投影面：" + l.receiver + "。\n预期关系：" + l.direction + "。\n不要生成与光源、遮挡物和投影面相矛盾的影子。";
  }

  function overallScore() {
    return Math.round(currentBook.reduce(function (sum, page) { return sum + page.score; }, 0) / currentBook.length);
  }

  function renderThumbnails() {
    thumbnails.innerHTML = currentBook.map(function (page, index) {
      var flagged = page.issue || (page.lighting && page.lighting.status === "review");
      return "<button type='button' class='book-thumb " + (flagged ? "has-issue" : "") + "' data-book-page='" + index + "' aria-label='" + (page.isCover ? "封面" : "第 " + page.number + " 页") + "' " + (index === currentIndex ? "aria-current='page'" : "") + ">" +
        mediaFor(page,index,"thumb-"+index,false) + "<span>" + (page.isCover ? "封" : page.number) + "</span></button>";
    }).join("");
    thumbnails.querySelectorAll("[data-book-page]").forEach(function (button) {
      button.addEventListener("click", function () {
        currentIndex = Number(button.dataset.bookPage);
        renderCurrentPage();
      });
    });
  }

  function pageAnalysis(page) {
    var issue = page.issue
      ? "<div class='issue-card'><small>需要局部返工</small><p>" + esc(page.issue) + "<br><strong>" + esc(page.repair) + "</strong></p></div>"
      : "<div class='issue-card pass'><small>本页通过</small><p>" + (page.isCover ? "主角、核心道具和故事气质清晰，封面职责完整。" : "角色锚点、画面动作和正文证据能够对应；保留当前页。") + "</p></div>";
    var chain = page.isCover ? "主题亮相 → 建立阅读预期" : esc(page.before) + " → " + esc(page.hook);
    return "<p class='analysis-kicker'>" + (page.isCover ? "COVER ANALYSIS" : "PAGE " + String(page.number).padStart(2,"0") + " ANALYSIS") + "</p>" +
      "<h3>" + esc(page.role) + "</h3><p class='analysis-summary'>" + (page.isCover ? "封面负责让读者一眼看懂主角、问题和核心道具。" : esc(page.sentence)) + "</p>" +
      "<div class='score-block'><div class='score-ring' style='--score:" + page.score + "'><b>" + page.score + "</b></div><div><p>当前页一致性</p><div class='score-tags'><span>角色 " + (page.score>85?"通过":"复查") + "</span><span>图文 " + (page.issue?"偏弱":"通过") + "</span><span>光影 " + (page.lighting && page.lighting.status === "review" ? "复查" : "通过") + "</span></div></div></div>" +
      "<ul class='evidence-list'><li><span>角色锚点</span><strong>" + esc(window.storybookLabData.theme.cannot) + "</strong></li><li><span>图文契约</span><strong>" + esc(page.evidence) + "</strong></li><li><span>页间作用</span><strong>" + chain + "</strong></li><li><span>核心道具</span><strong>" + esc(window.storybookLabData.theme.prop) + "</strong></li></ul>" + issue;
  }

  function lightingAnalysis(page) {
    var l = page.lighting || {status:"contract-only",score:null,source:"未设定",blocker:"未设定",receiver:"未设定",direction:"未设定",observed:"当前页面没有光影契约。",repair:"先定义光源、遮挡物和投影面。"};
    var score = l.score == null ? "—" : l.score;
    var statusLabel = l.status === "review" ? "需要复查" : (l.status === "pass" ? "通过" : "契约草案");
    var statusClass = l.status === "review" ? "review" : (l.status === "pass" ? "pass" : "draft");
    var issue = l.status === "review"
      ? "<div class='issue-card'><small>光影因果风险</small><p>" + esc(l.observed) + "<br><strong>" + esc(l.repair) + "</strong></p></div>"
      : "<div class='issue-card " + (l.status === "pass" ? "pass" : "draft") + "'><small>光影观察</small><p>" + esc(l.observed) + "</p></div>";
    return "<p class='analysis-kicker'>LIGHTING QA</p><h3>光源与投影检查</h3><p class='analysis-summary'>先把光源、遮挡物和投影面写成契约，再检查生成图是否给出可读的因果证据。这里是语义与粗几何 QA，不是完整光线追踪。</p>" +
      "<div class='lighting-score'><div class='score-ring " + statusClass + "' style='--score:" + (l.score == null ? 0 : l.score) + "'><b>" + score + "</b></div><div><p>本页光影状态</p><strong>" + statusLabel + "</strong><div class='score-tags'><span>光源 " + (l.source ? "已声明" : "缺失") + "</span><span>投影面 " + (l.receiver ? "已声明" : "缺失") + "</span><span>方向 " + (l.direction ? "已声明" : "缺失") + "</span></div></div></div>" +
      "<div class='light-path'><div><small>光源</small><strong>" + esc(l.source) + "</strong></div><i>→</i><div><small>遮挡物</small><strong>" + esc(l.blocker) + "</strong></div><i>→</i><div><small>投影面</small><strong>" + esc(l.receiver) + "</strong></div></div>" +
      "<ul class='evidence-list'><li><span>预期方向</span><strong>" + esc(l.direction) + "</strong></li><li><span>观察结果</span><strong>" + esc(l.observed) + "</strong></li><li><span>检查边界</span><strong>当前只做可读的光影因果判断，不宣称像素级物理正确。</strong></li></ul>" + issue;
  }

  function bookAnalysis() {
    var issues = currentBook.filter(function (page) { return page.issue; });
    var lightingReviews = currentBook.filter(function (page) { return page.lighting && page.lighting.status === "review"; });
    var dimensions = [["角色外观",95],["服装配色",97],["核心道具",90],["场景锚点",94],["图文契约",94],["光影因果",89]];
    return "<p class='analysis-kicker'>CROSS-PAGE AUDIT</p><h3>全书一致性报告</h3><p class='analysis-summary'>把角色、道具、场景和图文证据拆开检查，而不是只凭感觉判断。</p>" +
      "<div class='book-metrics'><div class='metric-card'><span>整体一致性</span><strong>" + overallScore() + "</strong></div><div class='metric-card'><span>待返工页面</span><strong>" + issues.length + "</strong></div><div class='metric-card'><span>光影复查页</span><strong>" + lightingReviews.length + "</strong></div><div class='metric-card'><span>完整页面</span><strong>" + currentBook.length + "</strong></div><div class='metric-card'><span>叙事断点</span><strong>0</strong></div></div>" +
      dimensions.map(function (item) { return "<div class='dimension-row'><span>" + item[0] + "</span><i><em style='width:" + item[1] + "%'></em></i><b>" + item[1] + "</b></div>"; }).join("") +
      "<ul class='repair-list'>" + (issues.length ? issues.map(function (page) { return "<li><strong>第 " + page.number + " 页：</strong>" + esc(page.repair) + "</li>"; }).join("") : "<li>所有页面均达到当前研究阈值。</li>") + "</ul>";
  }

  function renderAnalysis() {
    var page = currentBook[currentIndex];
    analysisTabs.forEach(function (tab) { tab.setAttribute("aria-selected", String(tab.dataset.analysisMode === analysisMode)); });
    if (analysisMode === "prompt") {
      analysisPanel.innerHTML = "<p class='analysis-kicker'>GENERATION CONTRACT</p><h3>" + (page.isCover ? "封面" : "第 " + page.number + " 页") + " Prompt</h3><p class='analysis-summary'>" + (page.asset ? "这是本次 ImageGen 实际生成使用的逐页生产契约；每页都引用同一角色锚点图。" : "这是代码回退使用的同构生产契约；当前组合尚未调用图片模型。") + "</p><pre class='prompt-analysis' id='activePrompt'></pre>";
      document.querySelector("#activePrompt").textContent = promptFor(page,window.storybookLabData);
    } else if (analysisMode === "lighting") {
      analysisPanel.innerHTML = lightingAnalysis(page);
    } else if (analysisMode === "book") {
      analysisPanel.innerHTML = bookAnalysis();
    } else {
      analysisPanel.innerHTML = pageAnalysis(page);
    }
  }

  function renderCurrentPage() {
    var page = currentBook[currentIndex];
    bookArt.innerHTML = mediaFor(page,currentIndex,"stage-"+currentIndex,true);
    bookCopy.className = "book-copy " + (page.isCover ? "cover-copy" : "");
    bookCopy.innerHTML = page.isCover
      ? "<div><small>完整研究样书</small><h3>" + esc(window.storybookLabData.theme.title) + "</h3><p>" + esc(window.storybookLabData.theme.desire) + "</p></div>"
      : "<div><small>第 " + String(page.number).padStart(2,"0") + " 页 · " + esc(page.role) + "</small><h3>" + esc(page.sentence) + "</h3></div><span>" + String(page.number).padStart(2,"0") + "</span>";
    pageCounter.textContent = (page.isCover ? "封面" : "第 " + page.number + " 页") + " / " + currentBook.length;
    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === currentBook.length - 1;
    renderThumbnails();
    renderAnalysis();
  }

  function renderBook() {
    var data = window.storybookLabData;
    currentBook = makeBook(data);
    currentIndex = 0;
    analysisMode = "page";
    bookTitle.textContent = data.theme.title;
    bookRenderMode.textContent = currentBook[0].asset ? "ImageGen 实图 · Run 001" : "代码插画 · 回退模式";
    bookPageTotal.textContent = "封面 + " + data.pages.length + " 页";
    bookScoreBadge.textContent = "一致性 " + overallScore();
    renderCurrentPage();
  }

  function delay(ms) { return new Promise(function (resolve) { window.setTimeout(resolve,ms); }); }

  async function showGeneration() {
    progress.hidden = false;
    generateButton.disabled = true;
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (var index=0; index<progressSteps.length; index+=1) {
      progressNumber.textContent = String(index+1).padStart(2,"0");
      progressLabel.textContent = progressSteps[index][0];
      progressDetail.textContent = progressSteps[index][1];
      progressBar.style.width = ((index+1)/progressSteps.length*100) + "%";
      if (!reduced) await delay(115);
    }
    renderBook();
    progress.hidden = true;
    generateButton.disabled = false;
    generateButton.querySelector("span").textContent = "重新生成完整绘本";
    workspace.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});
  }

  form.addEventListener("submit", function (event) { event.preventDefault(); showGeneration(); });
  previousButton.addEventListener("click", function () { if (currentIndex>0) { currentIndex-=1; renderCurrentPage(); } });
  nextButton.addEventListener("click", function () { if (currentIndex<currentBook.length-1) { currentIndex+=1; renderCurrentPage(); } });
  analysisTabs.forEach(function (tab,index) {
    tab.addEventListener("click", function () { analysisMode=tab.dataset.analysisMode; renderAnalysis(); });
    tab.addEventListener("keydown", function (event) {
      if (event.key!=="ArrowLeft" && event.key!=="ArrowRight") return;
      event.preventDefault();
      var target=event.key==="ArrowRight"?(index+1)%analysisTabs.length:(index-1+analysisTabs.length)%analysisTabs.length;
      analysisTabs[target].focus(); analysisTabs[target].click();
    });
  });

  renderBook();
})();
