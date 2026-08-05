# OPC Methodology Study Desk

这是为研读 [easychen/opc-methodology](https://github.com/easychen/opc-methodology) 制作的独立、静态分析网站。它不复制书稿全文，而是提供章节地图、研究性总结、批判性提示、Skills 工作流说明与本地学习标记。

它是 [0805 GitHub Code Study](../README.md) 的第一个研究子项目。仓库首页会持续收录后续研究主题。

## 结构

```text
opc-methodology-study/
├── upstream/opc-methodology/  # 只读上游资料（已被父仓库忽略）
├── site/                     # 可运行的静态研读网站
└── research/                 # 设计契约、覆盖清单与验证记录
```

上游资料固定在提交 `b3d0503a52298a2fbe4751231f3119d6a015eab5`（2026-04-23）。

## 在线访问

公开部署完成后，仓库首页会在项目导航中提供站点链接。

## 本地运行

在本目录执行：

```powershell
python -m http.server 4173 -d site
```

然后打开 `http://127.0.0.1:4173`。

## 交互

- 搜索或按模块筛选 21 个核心章节。
- 点击章节，查看摘要、阅读问题、可迁移洞察与局限提醒。
- 标记“已理解”，以及输入个人笔记；两者只保存到当前浏览器的 localStorage。
- 切换深浅主题；所有内容仍保存在静态本地页面中。

完整的界面和交互验收记录见 [research/browser-evidence.md](research/browser-evidence.md)。

## 版权与边界

原作品使用 CC BY-NC-SA 4.0。此项目保存上游资料供个人研究，并以独立语言总结和分析；不替代原书，也不复制原书全文。未来若要商业发布或复用原始内容，应先向作者取得授权。
