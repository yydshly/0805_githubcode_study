(() => {
  "use strict";
  const data = window.GRAPHIFY_STUDY_DATA;
  if (!data) return;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const fmt = (n) => new Intl.NumberFormat("zh-CN").format(n);

  function setView(name, focus = true) {
    $$('[data-view-panel]').forEach((panel) => { const active = panel.dataset.viewPanel === name; panel.hidden = !active; panel.classList.toggle("active", active); });
    $('.lab-header nav button.active')?.removeAttribute("aria-current");
    $$('.lab-header nav button').forEach((button) => { const active = button.dataset.view === name; button.classList.toggle("active", active); if (active) button.setAttribute("aria-current", "page"); });
    history.replaceState(null, "", `#${name}`); window.scrollTo({ top: 0, behavior: "auto" });
    if (focus) $(`[data-view-panel="${name}"] h1`)?.focus({ preventScroll: true });
  }
  $$('[data-view]').forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));

  const themeButton = $('#lab-theme');
  function setTheme(theme) { document.documentElement.dataset.theme = theme; themeButton.textContent = theme === "dark" ? "☼" : "◐"; themeButton.setAttribute("aria-label", `切换${theme === "dark" ? "浅色" : "深色"}主题`); localStorage.setItem("graphify-lab-theme", theme); }
  setTheme(localStorage.getItem("graphify-lab-theme") || (matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark'));
  themeButton.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));

  const extracted = data.final.confidence.EXTRACTED;
  const metrics = [["CODE FILES", data.final.files, "实际扫描文件"],["GRAPH NODES", data.final.nodes, "符号、文件与配置"],["RELATIONS", data.final.edges, `${Math.round(extracted / data.final.edges * 100)}% 直接提取`],["COMMUNITIES", data.final.communities, "聚类结果非稳定接口"]];
  $('#metric-grid').innerHTML = metrics.map(([label,value,note]) => `<article><span>${label}</span><strong>${fmt(value)}</strong><small>${note}</small></article>`).join('');
  $('#architecture-count').textContent = fmt(data.final.nodes);
  $('#lab-meta').textContent = `${data.subject.commit.slice(0,8)} · ${fmt(data.final.nodes)} nodes · ${data.generatedAt}`;

  function bars(target, items, limit = 6) { const rows = items.slice(0, limit); const max = Math.max(...rows.map(x => x.value)); $(target).innerHTML = rows.map(item => `<div class="bar-row"><span title="${item.label}">${item.label}</span><div class="bar-track"><i style="width:${Math.max(3,item.value/max*100)}%"></i></div><b>${fmt(item.value)}</b></div>`).join(''); }
  bars('#package-bars', data.packages); bars('#relation-bars', data.topRelations);

  const positions = {AgentSession:[430,285],Agent:[145,115],Model:[430,80],Context:[690,78],ExtensionRunner:[700,245],ToolDefinition:[755,430],ExtensionAPI:[605,505],ModelRuntime:[395,500],SessionManager:[175,460],SettingsManager:[115,285],InteractiveMode:[295,170],TUI:[170,215]};
  const nodes = data.architecture.nodes.filter(node => positions[node.label]); const nodeById = new Map(nodes.map(node => [node.id,node])); const svg = $('#architecture-graph'); const ns = 'http://www.w3.org/2000/svg';
  const makeSvg = (name, attrs={}) => { const el=document.createElementNS(ns,name); Object.entries(attrs).forEach(([key,value])=>el.setAttribute(key,value)); return el; };
  data.architecture.edges.forEach(edge => { const source=nodeById.get(edge.source), target=nodeById.get(edge.target); if(!source||!target)return; const [x1,y1]=positions[source.label],[x2,y2]=positions[target.label]; svg.appendChild(makeSvg('line',{x1,y1,x2,y2,class:'graph-edge','data-source':source.id,'data-target':target.id})); });
  nodes.forEach(node => { const [x,y]=positions[node.label]; const group=makeSvg('g',{class:`graph-node ${node.degree>=150?'core':'support'}`,transform:`translate(${x} ${y})`,tabindex:'0',role:'button','aria-label':`${node.label}，连接度 ${node.degree}`,'data-id':node.id}); group.appendChild(makeSvg('circle',{r:node.degree>=150?26:21})); const text=makeSvg('text',{x:0,y:node.degree>=150?45:38,'text-anchor':'middle'}); text.textContent=node.label; group.appendChild(text); svg.appendChild(group); });
  function inspect(id){ const node=nodeById.get(id); if(!node)return; $$('.graph-node').forEach(el=>el.classList.toggle('active',el.dataset.id===id)); $$('.graph-edge').forEach(el=>el.classList.toggle('active',el.dataset.source===id||el.dataset.target===id)); $('#node-inspector').innerHTML=`<span class="tag">${node.degree>=150?'GOD NODE':'SUPPORT NODE'}</span><h2>${node.label}</h2><p class="path">${node.source}:${node.location}</p><dl><div><dt>连接度</dt><dd>${node.degree}</dd></div><div><dt>社区</dt><dd>${node.community}</dd></div><div><dt>证据</dt><dd>EXTRACTED</dd></div></dl><p>图谱用于定位候选关系；实际职责仍需回到源码核验。</p>`; }
  $$('.graph-node').forEach(el=>{el.addEventListener('click',()=>inspect(el.dataset.id));el.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();inspect(el.dataset.id)}})}); inspect(nodes.find(node=>node.label==='AgentSession')?.id||nodes[0].id);
  $('#node-ranking').innerHTML=data.topNodes.slice(0,7).map((node,index)=>`<div class="rank-item"><span>${String(index+1).padStart(2,'0')}</span><button data-node-label="${node.label}">${node.label}</button><b>${node.degree}</b></div>`).join('');
  $$('[data-node-label]').forEach(button=>button.addEventListener('click',()=>{const node=nodes.find(item=>item.label===button.dataset.nodeLabel);if(node)inspect(node.id)}));
  $('#community-ranking').innerHTML=data.communities.slice(0,7).map((item,index)=>`<div class="rank-item"><span>${String(index+1).padStart(2,'0')}</span><button type="button">${item.name}</button><b>${item.size}</b></div>`).join('');

  $('#run-timeline').innerHTML=data.runs.map((run,index)=>`<div class="run"><span>RUN ${String(index+1).padStart(2,'0')}</span><b>${run.elapsedSeconds}s</b><small>${run.label}</small><small class="mode">${run.mode}</small></div>`).join('');
  const status={useful:'有效',noisy:'噪声',risk:'风险'};
  function renderQueries(filter='all'){ const list=data.queryCases.filter(item=>filter==='all'||item.status===filter); $('#query-grid').innerHTML=list.map(item=>`<article class="query-card" data-status="${item.status}"><div><code>${item.question}</code><span class="badge">${status[item.status]}</span></div><p>${item.verdict}</p></article>`).join(''); }
  renderQueries(); $$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{$$('[data-filter]').forEach(item=>item.classList.toggle('active',item===button));renderQueries(button.dataset.filter)}));
  const requested=location.hash.slice(1); setView(['overview','architecture','experiments','verdict'].includes(requested)?requested:'overview',false);
})();
