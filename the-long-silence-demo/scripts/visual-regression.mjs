import { spawn } from 'node:child_process';
import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { chromium } from 'playwright-core';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const visualRoot = path.join(root, 'tests', 'visual');
const baselineDir = path.join(visualRoot, 'baseline');
const actualDir = path.join(visualRoot, 'actual');
const diffDir = path.join(visualRoot, 'diff');
const update = process.argv.includes('--update');
const port = Number(process.env.VISUAL_PORT || 4191);
const origin = `http://127.0.0.1:${port}`;

const cases = [
  { name: 'desktop-study', viewport: { width: 1280, height: 720 }, path: '/?qa=1', mode: '3d' },
  { name: 'desktop-fallback', viewport: { width: 1280, height: 720 }, path: '/?webgl=off&qa=1', mode: 'fallback' },
  { name: 'mobile-study', viewport: { width: 375, height: 844 }, path: '/?qa=1', mode: '3d' },
  { name: 'mobile-fallback', viewport: { width: 375, height: 844 }, path: '/?webgl=off&qa=1', mode: 'fallback' },
];

async function waitForServer(url, timeoutMs = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch { /* server is still starting */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`visual server did not start at ${url}`);
}

async function launchInstalledBrowser() {
  const channels = [process.env.VISUAL_BROWSER_CHANNEL, 'msedge', 'chrome'].filter(Boolean);
  const errors = [];
  for (const channel of [...new Set(channels)]) {
    try {
      return await chromium.launch({ channel, headless: true });
    } catch (error) {
      errors.push(`${channel}: ${error.message.split('\n')[0]}`);
    }
  }
  throw new Error(`No installed Chromium browser was available. ${errors.join(' | ')}`);
}

async function compareCase(browser, testCase) {
  const page = await browser.newPage({ viewport: testCase.viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  page.setDefaultTimeout(20000);
  await page.goto(origin + testCase.path, { waitUntil: 'networkidle' });
  await page.waitForFunction((mode) => document.documentElement.dataset.renderMode === mode, testCase.mode);
  await page.addStyleTag({ content: `
    *,*::before,*::after { animation: none !important; transition: none !important; caret-color: transparent !important; }
    html { scrollbar-width: none !important; }
    ::-webkit-scrollbar { display: none !important; }
  ` });
  await page.evaluate(async () => {
    await document.fonts.ready;
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(250);

  const actualPath = path.join(actualDir, `${testCase.name}.png`);
  const baselinePath = path.join(baselineDir, `${testCase.name}.png`);
  const diffPath = path.join(diffDir, `${testCase.name}.png`);
  await page.screenshot({ path: actualPath, fullPage: true, animations: 'disabled' });
  await page.close();

  if (update) {
    await writeFile(baselinePath, await readFile(actualPath));
    await rm(diffPath, { force: true });
    return { name: testCase.name, status: 'updated', ratio: 0 };
  }

  try {
    await access(baselinePath);
  } catch {
    return { name: testCase.name, status: 'missing baseline', ratio: 1 };
  }

  const baseline = PNG.sync.read(await readFile(baselinePath));
  const actual = PNG.sync.read(await readFile(actualPath));
  if (baseline.width !== actual.width || baseline.height !== actual.height) {
    return { name: testCase.name, status: `size ${baseline.width}x${baseline.height} -> ${actual.width}x${actual.height}`, ratio: 1 };
  }
  const diff = new PNG({ width: actual.width, height: actual.height });
  const changed = pixelmatch(baseline.data, actual.data, diff.data, actual.width, actual.height, { threshold: 0.12, includeAA: false });
  const ratio = changed / (actual.width * actual.height);
  if (ratio > 0.01) {
    await writeFile(diffPath, PNG.sync.write(diff));
    return { name: testCase.name, status: 'changed', ratio };
  }
  await rm(diffPath, { force: true });
  return { name: testCase.name, status: 'pass', ratio };
}

await Promise.all([baselineDir, actualDir, diffDir].map((directory) => mkdir(directory, { recursive: true })));
const viteBin = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');
const server = spawn(process.execPath, [viteBin, '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'pipe'],
  windowsHide: true,
});
let browser;
try {
  await waitForServer(origin);
  browser = await launchInstalledBrowser();
  const results = [];
  for (const testCase of cases) results.push(await compareCase(browser, testCase));
  for (const result of results) {
    const ratio = `${(result.ratio * 100).toFixed(3)}%`;
    console.log(`${result.status === 'pass' || result.status === 'updated' ? 'PASS' : 'FAIL'} ${result.name} ${result.status} ${ratio}`);
  }
  if (results.some((result) => result.status !== 'pass' && result.status !== 'updated')) process.exitCode = 1;
} finally {
  await browser?.close();
  server.kill();
}
