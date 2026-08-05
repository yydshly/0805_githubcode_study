import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const studyRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const upstreamRoot = join(studyRoot, 'upstream', 'awesome-gpt-image-2');
const outputDir = join(studyRoot, 'research', 'generated');

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function duplicates(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) || 0) + 1);
  return [...counts.entries()].filter(([, count]) => count > 1).map(([value, count]) => ({ value, count }));
}

function distribution(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) || 0) + 1);
  return Object.fromEntries([...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
}

function percentile(sorted, ratio) {
  if (!sorted.length) return 0;
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * ratio))];
}

function localImageExists(image) {
  if (!image?.startsWith('/images/')) return false;
  return existsSync(join(upstreamRoot, 'data', image.slice(1)));
}

function missingValues(values, allowed) {
  return [...new Set(values.filter((value) => !allowed.has(value)))].sort();
}

const caseRoot = readJson(join(upstreamRoot, 'data', 'cases.json'));
const library = readJson(join(upstreamRoot, 'data', 'style-library.json'));
const cases = caseRoot.cases || [];
const templates = library.templates || [];
const ids = cases.map((item) => Number(item.id)).filter(Number.isFinite);
const idSet = new Set(ids);
const minId = Math.min(...ids);
const maxId = Math.max(...ids);
const promptLengths = cases.map((item) => String(item.prompt || '').length).sort((a, b) => a - b);
const templateDoc = readFileSync(join(upstreamRoot, 'docs', 'templates.md'), 'utf8');
const anchors = new Set([...templateDoc.matchAll(/<a name="([^"]+)"><\/a>/g)].map((match) => match[1]));

const caseCategories = new Set(caseRoot.categories || []);
const caseStyles = new Set(caseRoot.styles || []);
const caseScenes = new Set(caseRoot.scenes || []);
const libraryCategories = new Set((library.categories || []).map((item) => item.value));
const libraryStyles = new Set((library.styles || []).map((item) => item.value));
const libraryScenes = new Set((library.scenes || []).map((item) => item.value));

const audit = {
  generatedAt: new Date().toISOString(),
  sourceCommit: readJson(join(studyRoot, 'research', 'source-lock.json')).commit,
  summary: {
    declaredCases: Number(caseRoot.totalCases || 0),
    actualCases: cases.length,
    idRange: [minId, maxId],
    categories: caseCategories.size,
    styles: caseStyles.size,
    scenes: caseScenes.size,
    templates: templates.length,
    imageFiles: readdirSync(join(upstreamRoot, 'data', 'images')).length
  },
  integrity: {
    declaredCountMatches: Number(caseRoot.totalCases) === cases.length,
    duplicateCaseIds: duplicates(ids),
    duplicateCaseTitles: duplicates(cases.map((item) => item.title).filter(Boolean)),
    missingIdsInRange: Array.from({ length: maxId - minId + 1 }, (_, index) => minId + index).filter((id) => !idSet.has(id)),
    casesWithoutTitle: cases.filter((item) => !item.title).map((item) => item.id),
    casesWithoutPrompt: cases.filter((item) => !item.prompt).map((item) => item.id),
    casesExceedingWebsitePromptLimit: cases.filter((item) => String(item.prompt || '').length > 6000).map((item) => ({ id: item.id, length: item.prompt.length })),
    casesWithoutSourceUrl: cases.filter((item) => !item.sourceUrl).map((item) => item.id),
    casesWithoutImage: cases.filter((item) => !item.image).map((item) => item.id),
    casesWithMissingLocalImage: cases.filter((item) => !localImageExists(item.image)).map((item) => ({ id: item.id, image: item.image })),
    unknownCaseCategories: missingValues(cases.map((item) => item.category), caseCategories),
    unknownCaseStyles: missingValues(cases.flatMap((item) => item.styles || []), caseStyles),
    unknownCaseScenes: missingValues(cases.flatMap((item) => item.scenes || []), caseScenes),
    categoryCatalogDrift: {
      onlyInCases: [...caseCategories].filter((value) => !libraryCategories.has(value)).sort(),
      onlyInLibrary: [...libraryCategories].filter((value) => !caseCategories.has(value)).sort()
    },
    styleCatalogDrift: {
      onlyInCases: [...caseStyles].filter((value) => !libraryStyles.has(value)).sort(),
      onlyInLibrary: [...libraryStyles].filter((value) => !caseStyles.has(value)).sort()
    },
    sceneCatalogDrift: {
      onlyInCases: [...caseScenes].filter((value) => !libraryScenes.has(value)).sort(),
      onlyInLibrary: [...libraryScenes].filter((value) => !caseScenes.has(value)).sort()
    },
    duplicateTemplateIds: duplicates(templates.map((item) => item.id)),
    templatesWithUnknownCategory: templates.filter((item) => !libraryCategories.has(item.category)).map((item) => item.id),
    templatesWithUnknownStyles: templates.flatMap((item) => (item.styles || []).filter((value) => !libraryStyles.has(value)).map((value) => ({ template: item.id, value }))),
    templatesWithUnknownScenes: templates.flatMap((item) => (item.scenes || []).filter((value) => !libraryScenes.has(value)).map((value) => ({ template: item.id, value }))),
    templatesWithMissingExamples: templates.flatMap((item) => (item.exampleCases || []).filter((id) => !idSet.has(Number(id))).map((id) => ({ template: item.id, caseId: id }))),
    templatesWithMissingAnchors: templates.filter((item) => !anchors.has(item.anchor)).map((item) => ({ template: item.id, anchor: item.anchor })),
    templatesWithMissingCovers: templates.filter((item) => !localImageExists(item.cover)).map((item) => ({ template: item.id, cover: item.cover }))
  },
  distributions: {
    categories: distribution(cases.map((item) => item.category)),
    styles: distribution(cases.flatMap((item) => item.styles || [])),
    scenes: distribution(cases.flatMap((item) => item.scenes || [])),
    featured: cases.filter((item) => item.featured).length
  },
  promptLengths: {
    minimum: promptLengths[0] || 0,
    median: percentile(promptLengths, 0.5),
    p95: percentile(promptLengths, 0.95),
    maximum: promptLengths.at(-1) || 0,
    average: Math.round(promptLengths.reduce((sum, value) => sum + value, 0) / Math.max(1, promptLengths.length))
  }
};

function countIssues(integrity) {
  let count = 0;
  for (const value of Object.values(integrity)) {
    if (Array.isArray(value)) count += value.length;
    else if (value && typeof value === 'object') count += Object.values(value).reduce((sum, items) => sum + (Array.isArray(items) ? items.length : 0), 0);
    else if (value === false) count += 1;
  }
  return count;
}

const issueCount = countIssues(audit.integrity);
const top = (object, count = 5) => Object.entries(object).slice(0, count).map(([name, value]) => `${name} (${value})`).join('、');
const markdown = `# 数据审计快照

生成时间：${audit.generatedAt}
固定提交：\`${audit.sourceCommit}\`

## 摘要

- 案例声明数 / 实际数：${audit.summary.declaredCases} / ${audit.summary.actualCases}
- ID 范围：${minId}–${maxId}；范围内缺失 ${audit.integrity.missingIdsInRange.length} 个 ID
- 类别 / 风格 / 场景 / 模板：${audit.summary.categories} / ${audit.summary.styles} / ${audit.summary.scenes} / ${audit.summary.templates}
- 图片文件：${audit.summary.imageFiles}
- 结构化问题计数：${issueCount}（同一根因可能在多个检查项中出现）

## 分布

- 案例最多的类别：${top(audit.distributions.categories)}
- 使用最多的风格：${top(audit.distributions.styles)}
- 使用最多的场景：${top(audit.distributions.scenes)}
- Featured 案例：${audit.distributions.featured}

## Prompt 长度

- 最短：${audit.promptLengths.minimum} 字符
- 中位数：${audit.promptLengths.median} 字符
- 平均：${audit.promptLengths.average} 字符
- P95：${audit.promptLengths.p95} 字符
- 最长：${audit.promptLengths.maximum} 字符

## 完整性结果

- 重复案例 ID：${audit.integrity.duplicateCaseIds.length}
- 重复案例标题：${audit.integrity.duplicateCaseTitles.length}
- 缺 Prompt：${audit.integrity.casesWithoutPrompt.length}
- 超过网站 6000 字符限制的 Prompt：${audit.integrity.casesExceedingWebsitePromptLimit.length}
- 缺来源 URL：${audit.integrity.casesWithoutSourceUrl.length}
- 缺本地图片：${audit.integrity.casesWithMissingLocalImage.length}
- 模板引用不存在的案例：${audit.integrity.templatesWithMissingExamples.length}
- 模板锚点缺失：${audit.integrity.templatesWithMissingAnchors.length}
- 模板封面缺失：${audit.integrity.templatesWithMissingCovers.length}
- 类别目录漂移：${audit.integrity.categoryCatalogDrift.onlyInCases.length + audit.integrity.categoryCatalogDrift.onlyInLibrary.length}
- 风格目录漂移：${audit.integrity.styleCatalogDrift.onlyInCases.length + audit.integrity.styleCatalogDrift.onlyInLibrary.length}
- 场景目录漂移：${audit.integrity.sceneCatalogDrift.onlyInCases.length + audit.integrity.sceneCatalogDrift.onlyInLibrary.length}

详细条目见同目录下的 \`data-audit.json\`。该报告只检查结构一致性，不评价案例版权、提示词质量或生成效果。
`;

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, 'data-audit.json'), `${JSON.stringify(audit, null, 2)}\n`, 'utf8');
writeFileSync(join(outputDir, 'data-audit.md'), markdown, 'utf8');
console.log(JSON.stringify({ outputDir, issueCount, summary: audit.summary }, null, 2));
