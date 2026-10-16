const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const baseUrl = "http://localhost:3005";
const outDir = path.join(__dirname, "../public/assets/screenshots/chapters");

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log("Launching Chromium...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1360, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  console.log("Navigating to home page...");
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Set dark theme
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  });
  await page.waitForTimeout(400);

  // Measure total runway height to scroll accurately
  const runwayHeight = await page.evaluate(() => {
    const el = document.getElementById("story-runway");
    return el ? el.getBoundingClientRect().height : window.innerHeight * 5.6;
  });

  const scrollPoints = [
    { name: "ch01_foundation", s: 0.0, scrollFraction: 0.0 },
    { name: "trans_01_to_02", s: 0.45, scrollFraction: 0.45 / 3 },
    { name: "ch02_connect", s: 1.0, scrollFraction: 1.0 / 3 },
    { name: "trans_02_to_03", s: 1.45, scrollFraction: 1.45 / 3 },
    { name: "ch03_intelligence", s: 2.0, scrollFraction: 2.0 / 3 },
    { name: "ch04_cyrolabz", s: 3.0, scrollFraction: 1.0 },
  ];

  for (const pt of scrollPoints) {
    console.log(`Scrolling to ${pt.name} (s ≈ ${pt.s})...`);
    const scrollTarget = (runwayHeight - 900) * pt.scrollFraction;

    await page.evaluate((targetY) => {
      window.scrollTo({ top: targetY, behavior: "instant" });
    }, scrollTarget);

    // Give RAF and storyBus time to ease and settle
    await page.waitForTimeout(1200);

    const shotPath = path.join(outDir, `${pt.name}_dark.png`);
    await page.screenshot({ path: shotPath });
    console.log(`Saved: ${shotPath}`);
  }

  // Also capture Chapter 1 and Chapter 2 in light theme
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "light");
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(1200);
  const ch01Light = path.join(outDir, `ch01_foundation_light.png`);
  await page.screenshot({ path: ch01Light });
  console.log(`Saved: ${ch01Light}`);

  await browser.close();
  console.log("\nChapter screenshots completed successfully!");
}

run().catch((err) => {
  console.error("Error during screenshot capture:", err);
  process.exit(1);
});
