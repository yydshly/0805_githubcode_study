import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectDir = resolve(scriptDir, "..");
const sourceDir = resolve(projectDir, "site");
const outputDir = resolve(projectDir, "dist");
const clientDir = resolve(outputDir, "client");
const workerDir = resolve(outputDir, "server");

const workerSource = `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404 || new URL(request.url).pathname.includes(".")) {
      return response;
    }

    return env.ASSETS.fetch(new Request(new URL("/index.html", request.url), request));
  },
};
`;

await rm(outputDir, { recursive: true, force: true });
await mkdir(clientDir, { recursive: true });
await mkdir(workerDir, { recursive: true });
await cp(sourceDir, clientDir, { recursive: true });
await writeFile(resolve(workerDir, "index.js"), workerSource, "utf8");

console.log("Static deployment bundle created in dist/");
