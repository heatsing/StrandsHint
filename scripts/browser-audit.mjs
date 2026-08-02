import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const outDir = path.join(root, "out");
const port = 4177;
const baseUrl = `http://127.0.0.1:${port}`;
const failures = [];
const fallbackChromium = path.join(
  process.env.LOCALAPPDATA || "",
  "ms-playwright",
  "chromium_headless_shell-1228",
  "chrome-headless-shell-win64",
  "chrome-headless-shell.exe",
);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function resolveFile(url) {
  const pathname = decodeURIComponent(new URL(url, baseUrl).pathname);
  let file = path.join(outDir, pathname);
  if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!existsSync(file) && !path.extname(file)) file = path.join(outDir, pathname, "index.html");
  if (!existsSync(file)) file = path.join(outDir, "404.html");
  return file;
}

const server = createServer((request, response) => {
  const file = resolveFile(request.url || "/");
  const ext = path.extname(file);
  response.writeHead(file.endsWith("404.html") ? 404 : 200, {
    "content-type": contentTypes[ext] || "application/octet-stream",
  });
  response.end(readFileSync(file));
});

function record(message) {
  failures.push(message);
  console.error(`Browser audit failed: ${message}`);
}

async function checkPage(page, route, viewportName) {
  const consoleErrors = [];
  const pageErrors = [];
  const notFoundResources = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("response", (response) => {
    if (response.status() === 404) notFoundResources.push(response.url());
  });

  const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
  if (!response || response.status() >= 400) record(`${viewportName} ${route} returned ${response?.status() || "no response"}`);

  const title = await page.title();
  if (!title.trim()) record(`${viewportName} ${route} has empty title`);

  const h1Count = await page.locator("h1").count();
  if (h1Count !== 1) record(`${viewportName} ${route} should have one H1, found ${h1Count}`);

  const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (hasHorizontalScroll) {
    const overflow = await page.evaluate(() => {
      const width = window.innerWidth;
      return Array.from(document.querySelectorAll("body *"))
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            tag: element.tagName,
            text: (element.textContent || "").trim().slice(0, 80),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
            className: String(element.getAttribute("class") || "").slice(0, 120),
          };
        })
        .filter((item) => item.right > width + 1 || item.left < -1)
        .slice(0, 5);
    });
    record(`${viewportName} ${route} has horizontal scroll: ${JSON.stringify(overflow)}`);
  }

  const meaningfulConsoleErrors = consoleErrors.filter((message) => !message.includes("Failed to load resource"));
  if (meaningfulConsoleErrors.length) record(`${viewportName} ${route} console errors: ${meaningfulConsoleErrors.join(" | ")}`);
  if (notFoundResources.length) record(`${viewportName} ${route} 404 resources: ${notFoundResources.join(" | ")}`);
  if (pageErrors.length) record(`${viewportName} ${route} runtime errors: ${pageErrors.join(" | ")}`);
}

async function exerciseTools(page) {
  await page.goto(`${baseUrl}/solvers/wordle-solver/`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Load example" }).click();
  await page.getByRole("button", { name: "Find possible words" }).click();
  const wordleCount = await page.locator("text=APPLE").count();
  if (!wordleCount) record("Wordle Solver example did not produce APPLE");

  await page.goto(`${baseUrl}/solvers/spelling-bee-solver/`, { waitUntil: "networkidle" });
  await page.getByLabel("Center letter").fill("E");
  for (const [index, letter] of ["A", "B", "L", "T", "C", "N"].entries()) {
    await page.getByLabel(`Outer letter ${index + 1}`).fill(letter);
  }
  await page.getByRole("button", { name: "Find All Words" }).click();
  const beeResultCount = await page.locator("text=ELECT").count();
  if (!beeResultCount) record("Spelling Bee Solver example did not produce ELECT");

  await page.goto(`${baseUrl}/solvers/anagram-solver/`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Load example" }).click();
  await page.getByRole("button", { name: "Unscramble letters" }).click();
  const anagramCount = await page.locator("text=TRACE").count();
  if (!anagramCount) record("Anagram Solver example did not produce TRACE");
}

await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || (existsSync(fallbackChromium) ? fallbackChromium : undefined),
});
try {
  const routes = [
    "/",
    "/all-solvers/",
    "/daily-hints/",
    "/solvers/wordle-solver/",
    "/solvers/spelling-bee-solver/",
    "/solvers/anagram-solver/",
    "/hints/strands/2026-08-02/",
    "/today/",
  ];

  for (const [viewportName, viewport] of [
    ["desktop", { width: 1440, height: 1000 }],
    ["mobile", { width: 390, height: 844 }],
  ]) {
    const page = await browser.newPage({ viewport });
    for (const route of routes) await checkPage(page, route, viewportName);
    await page.close();
  }

  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await exerciseTools(page);
  await page.close();
} finally {
  await browser.close();
  server.close();
}

if (failures.length) process.exit(1);
console.log("Browser audit passed.");
