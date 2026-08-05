import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repositoryDir = resolve(scriptDir, "..");
const outputDir = resolve(repositoryDir, ".pages-dist");

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

await cp(resolve(repositoryDir, "pages"), outputDir, { recursive: true });
await cp(
  resolve(repositoryDir, "opc-methodology-study", "site"),
  resolve(outputDir, "opc-methodology-study"),
  { recursive: true },
);
await writeFile(resolve(outputDir, ".nojekyll"), "", "utf8");

console.log("GitHub Pages bundle created in .pages-dist/");
