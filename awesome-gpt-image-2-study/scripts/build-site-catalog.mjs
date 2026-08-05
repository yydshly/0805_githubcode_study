import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(scriptDir, "..");
const upstreamDataDir = path.join(projectDir, "upstream", "awesome-gpt-image-2", "data");
const siteDataPath = path.join(projectDir, "site", "catalog-data.js");
const snapshot = "76fcd0e6b3961ef2b041547aac654f1efd1ef270";

const [caseSource, librarySource] = await Promise.all([
  readFile(path.join(upstreamDataDir, "cases.json"), "utf8"),
  readFile(path.join(upstreamDataDir, "style-library.json"), "utf8")
]);

const casesData = JSON.parse(caseSource);
const libraryData = JSON.parse(librarySource);

const payload = {
  snapshot,
  repository: casesData.repository,
  totals: {
    cases: casesData.cases.length,
    templates: libraryData.templates.length,
    categories: casesData.categories.length,
    styles: casesData.styles.length,
    scenes: casesData.scenes.length
  },
  categories: libraryData.categories.map((category) => ({
    id: category.id,
    value: category.value,
    title: category.title,
    description: category.description
  })),
  styles: casesData.styles,
  scenes: casesData.scenes,
  templates: libraryData.templates.map((template) => ({
    id: template.id,
    title: template.title,
    description: template.description,
    category: template.category,
    styles: template.styles,
    scenes: template.scenes,
    tags: template.tags,
    useWhen: template.useWhen,
    guidance: template.guidance,
    pitfalls: template.pitfalls,
    exampleCases: template.exampleCases
  })),
  cases: casesData.cases.map((item) => ({
    id: item.id,
    title: item.title,
    image: item.image,
    imageAlt: item.imageAlt,
    localImageUrl: `../upstream/awesome-gpt-image-2/data${item.image}`,
    remoteImageUrl: `https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/${snapshot}/data${item.image}`,
    sourceLabel: item.sourceLabel,
    sourceUrl: item.sourceUrl,
    githubUrl: item.githubUrl,
    prompt: item.prompt,
    promptPreview: item.promptPreview,
    category: item.category,
    styles: item.styles,
    scenes: item.scenes,
    featured: item.featured
  }))
};

const banner = "// Generated from upstream data at snapshot 76fcd0e6. Run scripts/build-site-catalog.mjs to refresh.\n";
await writeFile(siteDataPath, `${banner}window.AWESOME_IMAGE_CATALOG = ${JSON.stringify(payload)};\n`, "utf8");

console.log(`Wrote ${payload.totals.templates} templates and ${payload.totals.cases} cases to ${siteDataPath}`);
