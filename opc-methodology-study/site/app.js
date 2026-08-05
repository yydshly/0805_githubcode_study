const githubBase = "https://github.com/easychen/opc-methodology/blob/master/";

const chapters = [
  {
    id: "overview",
    order: "01",
    module: "定义一人企业",
    title: "新版方法论概述",
    summary: "新版把“一人企业”从单个独立项目扩展为一个可以持续重组资产、承载多个业务的系统；技术、NoCode 与 AI 让非技术个体也可能搭起可验证的业务原型。",
    takeaways: ["目标节点是先达到可持续的最低可行利润，而非一开始追逐“超级个体”。", "书更强调思考工具，而不是宣称提供永远有效的结论。", "作者承认经验边界：它更能描述从普通个体到工作自由前后的阶段。"],
    question: "我把它当作一本创业成功学，还是一套帮助自己少走弯路的分析语言？",
    transfer: "对研究库而言，最有用的迁移是：不要只记录结果，也要记录每次决策的假设、证据与可复用中间成果。",
    caveat: "作者经历本身是重要但有限的样本；其结论适合拿来生成问题，不应直接当作概率保证。",
    source: "src/opb-methodology-new-version-and-author.md"
  },
  {
    id: "definition",
    order: "02",
    module: "定义一人企业",
    title: "一人企业的定义",
    summary: "一人企业是以个体或个人品牌为主导的业务体，不必等于注册公司，也不必绝对只有一个人；它的区别在于依靠资产与杠杆，而非单纯出售时间。",
    takeaways: ["它可以是副业，也可以有小团队或外包协作。", "员工少、资源少、以小博大既是约束，也是设计前提。", "一人企业与个体户、融资型创业公司不是同一个概念。"],
    question: "我的项目是在出售我的工时，还是在形成会持续发挥价值的东西？",
    transfer: "用“个体主导的业务系统”而非“单人完成一切”理解研究项目，更容易接受协作、外包和工具化。",
    caveat: "“资产”和“被动收入”容易被浪漫化；大多数数字资产仍需要维护、营销和风险管理。",
    source: "src/define-opb.md"
  },
  {
    id: "thinking-big",
    order: "03",
    module: "规划一人企业",
    title: "为什么以小博大是可能的",
    summary: "书认为技术、传播路径和政策边界的变化会打开大公司难以及时进入的新支流；个人的机会不在正面硬拼，而在识别正在移动的边界。",
    takeaways: ["机会来自变化，而不只是资源多少。", "关键问题是：大公司为什么看得到却不愿意追？", "技术、分发和监管都会改变旧市场的最优解。"],
    question: "我看到的是一时热点，还是一个让原有方案失效的真实边界变化？",
    transfer: "对研究选题来说，把“变化是什么、谁受影响、旧玩家为何不动”写下来，比直接想产品更有价值。",
    caveat: "边界变化并不天然带来机会；很多所谓窗口只是竞争更快、验证成本更低。",
    source: "src/why-thinking-big-is-possible.md"
  },
  {
    id: "scalability",
    order: "04",
    module: "规划一人企业",
    title: "为什么规模化是可能的",
    summary: "代码、媒体与数字化内容拥有较低复制成本，外包、众包与按需租用基础设施降低了个体对人力和资本杠杆的依赖。",
    takeaways: ["优先区分传统杠杆与无需许可的新杠杆。", "“以租代建”能降低前期成本，也能换取扩展性。", "新杠杆适合数字领域，不能消除实体、服务和获客的成本。"],
    question: "我的方案中，究竟哪一部分能随着用户增加而不同比例增加人力？",
    transfer: "把你反复使用的调研模板、分析脚本、组件和知识卡变成可复用材料，就是研究场景中的杠杆。",
    caveat: "复制成本接近零，不等于获取、支持、合规和留存成本为零。",
    source: "src/why-scalability-is-possible.md"
  },
  {
    id: "assets",
    order: "05",
    module: "规划一人企业",
    title: "资产和被动收入",
    summary: "出售时间有天然上限，因此书主张持有能持续产生收入的资产；评估资产时要同时看投入、产出、持续性、风险与门槛。",
    takeaways: ["资产不是数量越多越好，要持续维护和再配置。", "购买资产需有协同效应，而非只看短期 MRR。", "低风险资产保温饱，高风险资产求发展。"],
    question: "我手上的资料、工具或内容，哪一个已经能在未来反复节省时间或带来价值？",
    transfer: "在本研究库中，每一个完成的项目都应产生“资产清单”：结论、工具、数据、模板和未完成但可再用的半成品。",
    caveat: "书中的资产评分没有明确权重和外部校准，适合作为检查表，不宜视为精确模型。",
    source: "src/assets-and-passive-income.md"
  },
  {
    id: "snowball",
    order: "06",
    module: "规划一人企业",
    title: "滚雪球和链式传播",
    summary: "增长不是只有收入复利：用户、内容、信任和传播都可能形成正反馈。真正值得研究的是哪些环节能把一次投入变成下一次投入的起点。",
    takeaways: ["复利需要时间、可累积的反馈与稳定的留存。", "链式传播依赖产品、内容或社交关系中的传递动机。", "先找到可累积变量，再谈增长速度。"],
    question: "我的项目是否存在一个“用得越多、下次越容易”的真实循环？",
    transfer: "研究笔记若能被下一项目复用、被未来的你快速检索，就是最小的知识滚雪球。",
    caveat: "正反馈也可能迅速衰减；不要把一次爆发误认为拥有长期复利。",
    source: "src/snowballing-and-chain-propagation.md"
  },
  {
    id: "niche",
    order: "07",
    module: "规划一人企业",
    title: "一人企业如何选择赛道",
    summary: "作者建议远离拥挤的大众刚需，寻找对小众人群足够强烈、又可以低成本触达的需求；市场小并非问题，无法触达才是问题。",
    takeaways: ["大众的弱需求，可能是小众群体的强需求。", "细分后仍要验证是否有低成本触达路径。", "内容、SEO 与侧项目可以是接近小众人群的方式。"],
    question: "这个问题对谁是必须解决的？我能在哪里观察到他们，而不是假设他们存在？",
    transfer: "你的研究选题不一定要“市场大”，但要能找到足够具体的对象和证据来源。",
    caveat: "越小众越不等于越容易；很多利基市场存在非常高的信任、专业或合规门槛。",
    source: "src/race-track-selection-for-opb.md"
  },
  {
    id: "noncompetition",
    order: "08",
    module: "规划一人企业",
    title: "不竞争策略",
    summary: "不竞争不是没有竞品，而是通过进入成熟生态、选择非标准化或弱替代性品类、重构认知来降低正面可比性。",
    takeaways: ["优先考虑成为大生态的补充者，而非替代者。", "个性化、个人化和跨界混搭能削弱价格比较。", "没有对比不代表没有风险，仍要验证用户是否愿意付费。"],
    question: "我能利用哪一个已有生态的长尾空白，而不是试图从零建立全部市场？",
    transfer: "对研究而言，先接入现有社区、资料库或工具链，比重新制造一个“新体系”更容易获得反馈。",
    caveat: "平台生态有流量优势，也有规则、抽成与被平台复制的风险。",
    source: "src/non-competition-strategy.md"
  },
  {
    id: "structural",
    order: "09",
    module: "规划一人企业",
    title: "结构化优势",
    summary: "结构化优势来自竞品难以修正的固有弱点，例如商业模式冲突、路径依赖、成本结构或无法提供个性化服务。",
    takeaways: ["副产品、第三方聚合、低成本和专属服务都可能是结构化优势。", "优势应针对具体对手的“看得见但改不动”。", "低固定成本可以换取长期试错耐心。"],
    question: "我的优势是“我做得更努力”，还是竞争者即使想学也不方便复制的结构？",
    transfer: "在研究中，独特的数据访问、长期积累的语境和可复用工具，比泛泛的能力自信更接近结构化优势。",
    caveat: "把大公司描述为“不会追”是一种假设，必须定期重新验证。",
    source: "src/structured-advantage.md"
  },
  {
    id: "canvas",
    order: "10",
    module: "规划一人企业",
    title: "一人企业画布和月报",
    summary: "OPB 画布将客户、价值主张、渠道、竞争策略、关键业务、成本收入与资产评分放在一个页面；月报则把多个业务放回同一个企业视角。",
    takeaways: ["渠道和价值主张是最应优先验证的假设。", "开发周期在一人场景中是战略变量，而非纯执行问题。", "月报避免只盯单个项目而忽略资产组合。"],
    question: "我的项目有哪些关键假设？其中哪一个一旦错误，后面所有工作都会失效？",
    transfer: "你可以把画布替换成研究画布：对象、问题、证据、方法、时间成本、复用资产和风险。",
    caveat: "画布让复杂问题显得整齐，但它无法替代实际访谈、数据与实验。",
    source: "src/opb-canvas-and-opb-report.md"
  },
  {
    id: "portfolio",
    order: "11",
    module: "构建一人业务",
    title: "一人企业不等于一人业务",
    summary: "业务失败不应清空企业。多个业务可以共享用户、品牌、内容与基础能力；有些业务甚至可以先为获取资源和用户服务，而非立即盈利。",
    takeaways: ["失败项目的中间成果可以成为下一项目的台阶。", "统一品牌和基础能力能降低后续启动成本。", "月初目标与月末复盘帮助管理业务组合。"],
    question: "如果这个项目停止，哪些成果值得留下，哪些边界应该和其他项目共享？",
    transfer: "这是本研究库最直接的原则：每个子项目结束前都要完成一次“资产回收”。",
    caveat: "共享过度也会形成耦合和维护负担；并非所有项目都应硬塞进同一品牌或技术底座。",
    source: "src/one-person-enterprise-does-not-equal-one-person-business.md"
  },
  {
    id: "byproduct",
    order: "12",
    module: "构建一人业务",
    title: "副产品优势",
    summary: "工作过程里产生的方法论、知识库、半成品、人脉与内容，常常比原项目更容易转化为下一次机会；副产品是把一次投入拆成多次回报。",
    takeaways: ["记录工作流与备选方案，才能看见副产品。", "行业知识库和关系网络也是可积累资源。", "AI 可以帮助把阅读与资料处理转为可复用服务。"],
    question: "我正在做的工作，除了主结果外，还会稳定地产生哪些别人愿意使用的副产物？",
    transfer: "把调研过程拆成“问题库、资料卡、分析模板、代码片段”，能让研究输出不止一份报告。",
    caveat: "副产品不是越多越好；如果没有复用场景，整理本身可能变成新的拖延。",
    source: "src/discovery-of-by-product-advantages.md"
  },
  {
    id: "sideproject",
    order: "13",
    module: "构建一人业务",
    title: "从副业开始",
    summary: "副业允许在现金流和生活压力仍由主业承担时验证方向，借助低成本和副产品优势获得更长的试错周期。",
    takeaways: ["先控制下行风险，再扩大投入。", "副业的时间限制迫使项目更聚焦。", "低成本不等于没有机会成本。"],
    question: "我能否给这个研究项目设定一个不伤害主线工作的时间与资金上限？",
    transfer: "为每个子项目先设定“研究预算”和停止条件，能让好奇心不吞掉整个研究库。",
    caveat: "副业模式并不适合所有人；精力、家庭责任与职业边界都需要真实考虑。",
    source: "src/start-from-side-project.md"
  },
  {
    id: "uncertainty",
    order: "14",
    module: "构建一人业务",
    title: "管理和利用不确定性",
    summary: "将不确定性前置：用 MVP、落地页、预售或众筹验证核心假设；同时通过小步试错、冗余、选择权和不对称交易限制下行。",
    takeaways: ["先验证价值主张和渠道，不要先完成产品。", "真实付费通常比口头反馈更有信息量。", "自建+多发可以缓解平台单点风险。"],
    question: "哪一种验证能让我以最小损失，最快发现这个假设是错的？",
    transfer: "你的最小实验不一定是产品：一次访谈、一张信息页、一份可用样稿或一场小范围演示都可以。",
    caveat: "预售/众筹有强情境依赖；并非每个产品、研究或合规场景都适合先收钱。",
    source: "src/managing-and-utilizing-uncertaint.md"
  },
  {
    id: "productbuild",
    order: "15",
    module: "构建一人业务",
    title: "从零构建软件产品或服务",
    summary: "产品构建从价值主张、客户细分、场景、功能优先级和界面组织逐步展开，强调先定义要解决的任务，而不是先堆功能。",
    takeaways: ["价值主张与客户细分必须彼此对应。", "从具体使用场景推导功能，而不是由功能猜场景。", "分期交付让资源有限的团队保持聚焦。"],
    question: "如果只保留一个用户场景，我的项目还必须具备什么能力？",
    transfer: "为你的研究网站或工具先写“读者在什么情境下需要它”，再决定页面与功能，能防止功能扩张。",
    caveat: "部分具体设计工具示例会随时间过时，应保留场景与分期的原则，而非照抄工具选择。",
    source: "src/building-software-products-or-services-from-scratch.md"
  },
  {
    id: "infrastructure",
    order: "16",
    module: "基础设施及搭建",
    title: "理想的一人企业基础设施",
    summary: "作者主张在使用平台的同时拥有可控基础设施，重点是低成本、可迁移、个人可用、开放和有生态，避免业务被平台或供应商锁死。",
    takeaways: ["自有基础设施不是拒绝平台，而是避免单点依赖。", "小规模阶段要先追求低成本与可迁移性。", "开放生态和个人可用性决定了起步难度。"],
    question: "如果一个平台、插件或服务明天不可用，我最重要的数据、内容和用户关系还在吗？",
    transfer: "对研究库而言，原始资料、你的分析和运行记录都应保存在你可控制的目录与版本库中。",
    caveat: "自建并非天然更安全；安全、备份、运维和合规责任会转移到你身上。",
    source: "src/what-is-the-ideal-one-person-business-infrastructure.md"
  },
  {
    id: "users",
    order: "17",
    module: "基础设施及搭建",
    title: "用户池和触达能力",
    summary: "用户池的关键不是关注量，而是能否直接、稳定、低成本地触达用户；原生用户与平台用户的区别在于控制权和通知自由度。",
    takeaways: ["区分能直接触达的人和平台上暂时可见的人。", "登录、消息与联系信息是基础能力。", "渠道能力需要随平台规则变化而重新评估。"],
    question: "我拥有的是观众数字，还是在合理边界内可持续联系的关系？",
    transfer: "研究项目也可定义自己的“用户池”：愿意接受更新、参与访谈或重复使用研究成果的人。",
    caveat: "收集与触达用户信息涉及隐私、反垃圾规则和当地法律，不能只从转化角度理解。",
    source: "src/infrastructure-user-pool-reach-capability.md"
  },
  {
    id: "content",
    order: "18",
    module: "基础设施及搭建",
    title: "内容池和自动化能力",
    summary: "内容应先沉淀在自己可控的中心，再分发到平台；自动化可以降低重复发布和整理成本，但仍不能替代关系维护与内容判断。",
    takeaways: ["自建+多发是为了保留内容与入口控制权。", "不同内容形态可使用不同承载和分发方式。", "自动化适合处理重复流程，人工保留在判断与例外处。"],
    question: "我的内容从哪里开始、在哪里留档、怎样在不重复劳动的前提下分发？",
    transfer: "本网站本身就是内容池的一个小例子：原始仓库、独立分析和可交互阅读被清晰地分层保存。",
    caveat: "自动化发布可能违反平台规则或造成低质量内容泛滥；效率不能替代编辑责任。",
    source: "src/content-pool-and-automation-capability.md"
  },
  {
    id: "payment",
    order: "19",
    module: "基础设施及搭建",
    title: "产品池和支付能力",
    summary: "当多个业务共享用户、内容和订单基础时，单个业务可以成为可插拔模块；支付能力被视为连接产品、验证和商业模式的基础。",
    takeaways: ["共享订单与支付能力减少重复建设。", "众筹本质上可理解为一种带有达标条件的支付能力。", "不同支付方案受个人资质、平台和地区规则限制。"],
    question: "哪些基础能力值得共享，哪些为了隔离风险应该保持独立？",
    transfer: "把研究库的共用能力拆出：项目模板、资料抓取、分析页面和版本记录都可以减少重复启动成本。",
    caveat: "支付、资质和税务建议高度依赖时间与地区，实际采用前必须重新核实。",
    source: "src/product-pool-and-payment-capability.md"
  },
  {
    id: "crowdsourcing",
    order: "20",
    module: "基础设施及搭建",
    title: "众包能力",
    summary: "当任务可被拆分、验收条件清晰且回报足够合理时，用户或社区可以共同完成大规模但低复杂度的工作。",
    takeaways: ["任务颗粒度越清晰，协作越容易。", "验收标准必须提前写明。", "奖励可以是金钱、权益、身份或共同目标。"],
    question: "我的问题中，有没有一小部分可被他人低成本、明确地贡献？",
    transfer: "研究中可以通过公开征集案例、校对标签、补充资料或共同维护目录，测试协作的可行性。",
    caveat: "众包不是免费劳动力；质量控制、激励、公平性和版权归属都需要设计。",
    source: "src/crowdsourcing-capability.md"
  },
  {
    id: "setup",
    order: "21",
    module: "基础设施及搭建",
    title: "搭建一人企业基础设施",
    summary: "书提供了自行开发、基于 WordPress 混搭等搭建路径，重点不在某一套技术，而在让业务能力覆盖用户、内容、产品与自动化。",
    takeaways: ["先按能力覆盖思考，再选择技术路径。", "共用后台和清晰边界能提升后续项目启动速度。", "产品界面仍需服务真实用户任务。"],
    question: "我是在为真正会复用的能力建设基础，还是因为技术兴趣过早搭建大平台？",
    transfer: "从轻量模板、静态站点和版本库开始，只有当重复使用确实出现时再升级基础设施。",
    caveat: "方法论中的实现案例带有作者技术栈偏好；工具应由项目约束决定。",
    source: "src/setup-a-one-person-business-infrastructure.md"
  }
];

const modules = ["全部", "定义一人企业", "规划一人企业", "构建一人业务", "基础设施及搭建"];
const skills = {
  strategy: [
    ["01", "资源盘点"], ["02", "利基定位"], ["03", "价值主张"],
    ["04", "商业模式"], ["06", "MVP 设计"], ["07", "转化闭环"]
  ],
  loop: [["08", "资产沉淀"], ["09", "经营复盘"]]
};

const state = {
  query: "",
  module: "全部",
  selectedId: localStorage.getItem("opc-study-selected") || chapters[0].id,
  expanded: false,
  completed: new Set(JSON.parse(localStorage.getItem("opc-study-completed") || "[]"))
};

const els = {
  filters: document.querySelector("#module-filters"),
  search: document.querySelector("#chapter-search"),
  chapterList: document.querySelector("#chapter-list"),
  empty: document.querySelector("#empty-state"),
  resultCount: document.querySelector("#result-count"),
  total: document.querySelector("#progress-total"),
  progress: document.querySelector("#progress-count"),
  readerModule: document.querySelector("#reader-module"),
  readerTitle: document.querySelector("#reader-title"),
  readerSummary: document.querySelector("#reader-summary"),
  readerTakeaways: document.querySelector("#reader-takeaways"),
  readerQuestion: document.querySelector("#reader-question"),
  readerTransfer: document.querySelector("#reader-transfer"),
  readerCaveat: document.querySelector("#reader-caveat"),
  markRead: document.querySelector("#mark-read"),
  analysisToggle: document.querySelector("#analysis-toggle"),
  deepAnalysis: document.querySelector("#deep-analysis"),
  personalNote: document.querySelector("#personal-note"),
  noteStatus: document.querySelector("#note-status"),
  sourceChapter: document.querySelector("#source-chapter"),
  themeToggle: document.querySelector("#theme-toggle"),
  randomChapter: document.querySelector("#random-chapter"),
  resetFilters: document.querySelector("#reset-filters")
};

function getSelectedChapter() {
  return chapters.find((chapter) => chapter.id === state.selectedId) || chapters[0];
}

function getFilteredChapters() {
  const query = state.query.trim().toLowerCase();
  return chapters.filter((chapter) => {
    const matchModule = state.module === "全部" || chapter.module === state.module;
    const searchable = [chapter.title, chapter.module, chapter.summary, ...chapter.takeaways, chapter.question].join(" ").toLowerCase();
    return matchModule && (!query || searchable.includes(query));
  });
}

function saveCompleted() {
  localStorage.setItem("opc-study-completed", JSON.stringify([...state.completed]));
}

function renderFilters() {
  els.filters.innerHTML = modules.map((module) => `
    <button class="filter-chip" type="button" data-module="${module}" aria-pressed="${state.module === module}">${module}</button>
  `).join("");

  els.filters.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.module = button.dataset.module;
      renderFilters();
      renderChapterList();
    });
  });
}

function renderChapterList() {
  const filtered = getFilteredChapters();
  const byModule = filtered.reduce((groups, chapter) => {
    (groups[chapter.module] ||= []).push(chapter);
    return groups;
  }, {});
  els.resultCount.textContent = `${filtered.length} 节`;
  els.empty.hidden = filtered.length !== 0;
  els.chapterList.hidden = filtered.length === 0;

  els.chapterList.innerHTML = Object.entries(byModule).map(([module, moduleChapters]) => `
    <p class="module-heading">${module}</p>
    ${moduleChapters.map((chapter) => `
      <button class="chapter-item" type="button" data-chapter="${chapter.id}" aria-current="${chapter.id === state.selectedId}">
        <span class="chapter-order">${chapter.order}</span>
        <span class="chapter-title">${chapter.title}</span>
        <span class="chapter-done" aria-label="${state.completed.has(chapter.id) ? "已标记理解" : "未标记"}">${state.completed.has(chapter.id) ? "●" : ""}</span>
      </button>
    `).join("")}
  `).join("");

  els.chapterList.querySelectorAll(".chapter-item").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedId = button.dataset.chapter;
      localStorage.setItem("opc-study-selected", state.selectedId);
      state.expanded = false;
      renderChapterList();
      renderReader();
      if (window.matchMedia("(max-width: 760px)").matches) {
        document.querySelector(".reader-panel").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

function renderProgress() {
  els.total.textContent = chapters.length;
  els.progress.textContent = state.completed.size;
}

function renderReader() {
  const chapter = getSelectedChapter();
  const noteKey = `opc-study-note-${chapter.id}`;
  const isDone = state.completed.has(chapter.id);
  els.readerModule.textContent = `${chapter.order} / ${chapter.module}`;
  els.readerTitle.textContent = chapter.title;
  els.readerSummary.textContent = chapter.summary;
  els.readerTakeaways.innerHTML = chapter.takeaways.map((item) => `<li>${item}</li>`).join("");
  els.readerQuestion.textContent = chapter.question;
  els.readerTransfer.textContent = chapter.transfer;
  els.readerCaveat.textContent = chapter.caveat;
  els.markRead.textContent = isDone ? "✓ 已理解" : "标记理解";
  els.markRead.setAttribute("aria-pressed", String(isDone));
  els.analysisToggle.setAttribute("aria-expanded", String(state.expanded));
  els.analysisToggle.querySelector("span:first-child").textContent = state.expanded ? "收起研究者分析" : "展开研究者分析";
  els.deepAnalysis.hidden = !state.expanded;
  els.personalNote.value = localStorage.getItem(noteKey) || "";
  els.noteStatus.textContent = els.personalNote.value ? "已从本地恢复" : "未保存";
  els.sourceChapter.href = githubBase + chapter.source;
}

function renderSkills() {
  const template = (items) => items.map(([index, title]) => `
    <span class="skill-pill"><em>${index}</em><strong>${title}</strong></span>
  `).join("");
  document.querySelector("#strategy-skills").innerHTML = template(skills.strategy);
  document.querySelector("#loop-skills").innerHTML = template(skills.loop);
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("opc-study-theme", theme);
  els.themeToggle.setAttribute("aria-label", theme === "light" ? "切换到深色主题" : "切换到浅色主题");
}

function initialiseTheme() {
  const saved = localStorage.getItem("opc-study-theme");
  const systemLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  setTheme(saved || (systemLight ? "light" : "dark"));
}

els.search.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderChapterList();
});

els.markRead.addEventListener("click", () => {
  const chapter = getSelectedChapter();
  if (state.completed.has(chapter.id)) state.completed.delete(chapter.id);
  else state.completed.add(chapter.id);
  saveCompleted();
  renderProgress();
  renderChapterList();
  renderReader();
});

els.analysisToggle.addEventListener("click", () => {
  state.expanded = !state.expanded;
  renderReader();
});

let noteTimer;
els.personalNote.addEventListener("input", () => {
  const chapter = getSelectedChapter();
  els.noteStatus.textContent = "正在保存…";
  window.clearTimeout(noteTimer);
  noteTimer = window.setTimeout(() => {
    localStorage.setItem(`opc-study-note-${chapter.id}`, els.personalNote.value);
    els.noteStatus.textContent = "已保存到本地";
  }, 250);
});

els.themeToggle.addEventListener("click", () => {
  setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light");
});

els.randomChapter.addEventListener("click", () => {
  const available = chapters.filter((chapter) => chapter.id !== state.selectedId);
  state.selectedId = available[Math.floor(Math.random() * available.length)].id;
  localStorage.setItem("opc-study-selected", state.selectedId);
  state.expanded = false;
  state.module = "全部";
  state.query = "";
  els.search.value = "";
  renderFilters();
  renderChapterList();
  renderReader();
  document.querySelector("#reading-desk").scrollIntoView({ behavior: "smooth", block: "start" });
});

els.resetFilters.addEventListener("click", () => {
  state.query = "";
  state.module = "全部";
  els.search.value = "";
  renderFilters();
  renderChapterList();
});

initialiseTheme();
renderFilters();
renderProgress();
renderChapterList();
renderReader();
renderSkills();
