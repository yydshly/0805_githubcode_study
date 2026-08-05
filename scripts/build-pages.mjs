import { access, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repositoryDir = resolve(scriptDir, "..");
const outputDir = resolve(repositoryDir, ".pages-dist");
const configPath = resolve(repositoryDir, "projects.config.json");

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const resolveInsideRepository = (path, label) => {
  const resolved = resolve(repositoryDir, path);
  const pathFromRoot = relative(repositoryDir, resolved);

  if (pathFromRoot.startsWith("..") || isAbsolute(pathFromRoot)) {
    throw new Error(`${label} must stay inside the repository: ${path}`);
  }

  return resolved;
};

const readConfig = async () => {
  const config = JSON.parse(await readFile(configPath, "utf8"));

  if (!Array.isArray(config.projects) || config.projects.length === 0) {
    throw new Error("projects.config.json needs at least one project.");
  }

  const slugs = new Set();
  for (const project of config.projects) {
    if (!/^[a-z0-9-]+$/.test(project.slug ?? "")) {
      throw new Error(`Invalid project slug: ${project.slug}`);
    }
    if (slugs.has(project.slug)) {
      throw new Error(`Duplicate project slug: ${project.slug}`);
    }
    if (!project.title || !project.summary || !project.siteDirectory || !project.repositoryDirectory) {
      throw new Error(`Incomplete project configuration: ${project.slug}`);
    }
    slugs.add(project.slug);
  }

  return config;
};

const renderProjectCard = (project, repositoryUrl) => {
  const projectUrl = `./${encodeURIComponent(project.slug)}/`;
  const repositoryUrlForProject = `${repositoryUrl}/tree/main/${project.repositoryDirectory}`;
  const upstreamLink = project.upstreamUrl
    ? `<a class="button secondary" href="${escapeHtml(project.upstreamUrl)}">查看原始资料</a>`
    : "";
  const researchTargetLink = project.researchTargetUrl
    ? `<a class="button secondary" href="${escapeHtml(project.researchTargetUrl)}">查看研究目标库</a>`
    : "";

  return `
      <article class="project">
        <p class="label">第 ${String(project.order).padStart(2, "0")} 个项目 · ${escapeHtml(project.status)}</p>
        <h2>${escapeHtml(project.title)}</h2>
        <p>${escapeHtml(project.summary)}</p>
        <div class="links">
          <a class="button" href="${projectUrl}">进入项目</a>
          <a class="button secondary" href="${escapeHtml(repositoryUrlForProject)}">查看项目资料</a>
          ${upstreamLink}
          ${researchTargetLink}
        </div>
      </article>`;
};

const renderPortal = (config, projects) => `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(config.description)}" />
    <title>${escapeHtml(config.title)}</title>
    <style>
      :root { color-scheme: light; font-family: "Noto Serif SC", Georgia, serif; color: #222018; background: #f4efe5; }
      * { box-sizing: border-box; }
      body { margin: 0; min-width: 320px; }
      main { width: min(960px, calc(100% - 40px)); margin: 0 auto; padding: 12vh 0 72px; }
      .eyebrow { margin: 0 0 18px; color: #8b4d2a; font: 700 12px/1.2 ui-sans-serif, system-ui, sans-serif; letter-spacing: .14em; text-transform: uppercase; }
      h1 { max-width: 760px; margin: 0; font-size: clamp(42px, 8vw, 82px); line-height: .98; letter-spacing: -.055em; }
      .intro { max-width: 650px; margin: 30px 0 52px; font-size: 18px; line-height: 1.8; color: #5e584c; }
      .project-list { display: grid; gap: 18px; }
      .project { display: grid; gap: 20px; padding: 30px; border: 1px solid #d9cfbe; border-radius: 16px; background: #fffcf5; box-shadow: 0 18px 45px rgba(61, 47, 30, .08); }
      .label { margin: 0; color: #8b4d2a; font: 700 12px/1.2 ui-sans-serif, system-ui, sans-serif; letter-spacing: .12em; text-transform: uppercase; }
      h2 { margin: 0; font-size: clamp(26px, 4vw, 38px); letter-spacing: -.035em; }
      .project p { max-width: 650px; margin: 0; color: #5e584c; font-size: 16px; line-height: 1.75; }
      .links { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 4px; }
      a { color: inherit; }
      .button { display: inline-flex; align-items: center; min-height: 44px; padding: 10px 16px; border-radius: 999px; background: #25241f; color: #fffdf7; font: 700 14px/1 ui-sans-serif, system-ui, sans-serif; text-decoration: none; }
      .button.secondary { border: 1px solid #cfc3ae; background: transparent; color: #3b382f; }
      footer { margin-top: 56px; color: #81786b; font: 13px/1.6 ui-sans-serif, system-ui, sans-serif; }
    </style>
  </head>
  <body>
    <main>
      <p class="eyebrow">0805 GitHub Code Study</p>
      <h1>${escapeHtml(config.title)}</h1>
      <p class="intro">${escapeHtml(config.description)}</p>
      <section class="project-list" aria-label="研究项目列表">
${projects.map((project) => renderProjectCard(project, config.repositoryUrl)).join("\n")}
      </section>
      <footer>新项目只需加入 <code>projects.config.json</code>，推送到 main 后会自动出现在这里。</footer>
    </main>
  </body>
</html>`;

const config = await readConfig();
const projects = [...config.projects].sort((left, right) => left.order - right.order);

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

for (const project of projects) {
  const sourceDirectory = resolveInsideRepository(project.siteDirectory, `Site directory for ${project.slug}`);
  await access(resolve(sourceDirectory, "index.html"));
  await cp(sourceDirectory, resolve(outputDir, project.slug), { recursive: true });
}

await writeFile(resolve(outputDir, "index.html"), renderPortal(config, projects), "utf8");
await writeFile(resolve(outputDir, ".nojekyll"), "", "utf8");

console.log(`GitHub Pages bundle created for ${projects.length} project(s).`);
