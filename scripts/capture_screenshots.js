const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const baseUrl = "http://localhost:3005";
const outDir = path.join(__dirname, "../public/assets/screenshots");

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const viewports = [
  { name: "desktop_1360", width: 1360, height: 900 },
  { name: "tablet_820", width: 820, height: 900 },
  { name: "mobile_390", width: 390, height: 844 },
];

const routes = [
  { name: "home", path: "/" },
  { name: "services", path: "/services" },
  { name: "services_3d", path: "/services/3d-interactive-design" },
  { name: "work", path: "/work" },
  { name: "about", path: "/about" },
  { name: "insights", path: "/insights" },
  { name: "contact", path: "/contact" },
];

async function run() {
  console.log("Launching Chromium...");
  const browser = await chromium.launch({ headless: true });

  for (const vp of viewports) {
    console.log(`\n=== Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    for (const route of routes) {
      const url = `${baseUrl}${route.path}`;
      console.log(`Visiting ${url}...`);
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);

      // 1. Light Theme
      await page.evaluate(() => {
        document.documentElement.setAttribute("data-theme", "light");
      });
      await page.waitForTimeout(400);

      const lightPath = path.join(outDir, `${route.name}_${vp.name}_light.png`);
      await page.screenshot({ path: lightPath });
      console.log(`Saved: ${lightPath}`);

      // 2. Dark Theme
      await page.evaluate(() => {
        document.documentElement.setAttribute("data-theme", "dark");
      });
      await page.waitForTimeout(400);

      const darkPath = path.join(outDir, `${route.name}_${vp.name}_dark.png`);
      await page.screenshot({ path: darkPath });
      console.log(`Saved: ${darkPath}`);
    }

    await context.close();
  }

  await browser.close();
  console.log("\nAll screenshots captured successfully!");
}

run().catch((err) => {
  console.error("Error during screenshot capture:", err);
  process.exit(1);
});
