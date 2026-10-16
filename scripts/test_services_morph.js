const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const baseUrl = "http://localhost:3000";
const outDir = path.join(__dirname, "../public/assets/screenshots/test");

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log("Starting full verification at 1360px, 820px, and 390px...");
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: "desktop_1360", width: 1360, height: 900 },
    { name: "tablet_820", width: 820, height: 1180 },
    { name: "mobile_390", width: 390, height: 844, isMobile: true, hasTouch: true },
  ];

  const themes = ["dark", "light"];
  let totalErrors = 0;

  for (const vp of viewports) {
    for (const theme of themes) {
      console.log(`\n=== Testing ${vp.name} [${theme.toUpperCase()}] ===`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        isMobile: !!vp.isMobile,
        hasTouch: !!vp.hasTouch,
        deviceScaleFactor: 2,
      });

      const page = await context.newPage();
      const consoleErrors = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });
      page.on("pageerror", (err) => {
        consoleErrors.push(err.message);
      });

      await page.goto(baseUrl, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);

      // Apply theme
      await page.evaluate((th) => {
        document.documentElement.setAttribute("data-theme", th);
        localStorage.setItem("cyrolabz-theme", th);
      }, theme);
      await page.waitForTimeout(400);

      // 1. Initial State (s = 0)
      const initialS = await page.evaluate(() => window.__storyBus ? window.__storyBus.s : null);
      console.log(`  [Initial] Story s:`, initialS);

      // 2. Measure runway and scroll geometry
      const geom = await page.evaluate(() => {
        const runway = document.getElementById("runway");
        const H_storyScroll = runway ? Math.max(1, runway.offsetHeight - window.innerHeight) : 4000;
        const dStory = 0.94 * H_storyScroll;
        const dMorph = 0.85 * window.innerHeight;
        return { H_storyScroll, dStory, dMorph };
      });

      // 3. Scroll to Chapter 4 (Logo, s = 3.0)
      console.log(`  Scrolling to s=3.0 (Logo)...`);
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), geom.dStory);
      await page.waitForTimeout(900);
      let sVal = await page.evaluate(() => window.__storyBus ? window.__storyBus.s : -1);
      console.log(`  s at dStory:`, sVal.toFixed(2));
      await page.screenshot({ path: path.join(outDir, `${vp.name}_${theme}_s3_logo.png`) });

      // 4. Scroll to Morph (s = 3.55)
      console.log(`  Scrolling to s=3.55 (Morphing into network)...`);
      const morphY = geom.dStory + geom.dMorph * 0.55;
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), morphY);
      await page.waitForTimeout(900);
      sVal = await page.evaluate(() => window.__storyBus ? window.__storyBus.s : -1);
      console.log(`  s at morph:`, sVal.toFixed(2));
      await page.screenshot({ path: path.join(outDir, `${vp.name}_${theme}_s3_55_morph.png`) });

      // 5. Scroll to Network Complete (s = 4.0) and Services Heading
      console.log(`  Scrolling to Services section (s = 4.0)...`);
      const servicesY = geom.dStory + geom.dMorph + 100;
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), servicesY);
      await page.waitForTimeout(1000);
      sVal = await page.evaluate(() => window.__storyBus ? window.__storyBus.s : -1);
      console.log(`  s at services:`, sVal.toFixed(2));
      await page.screenshot({ path: path.join(outDir, `${vp.name}_${theme}_services_heading.png`) });

      // 6. Scroll further into Services cards
      const servicesEl = await page.$("#services");
      if (servicesEl) {
        const box = await servicesEl.boundingBox();
        if (box) {
          const scrollCardY = servicesY + 500;
          await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), scrollCardY);
          await page.waitForTimeout(900);

          // Test hover glow on first card if desktop/tablet
          if (!vp.hasTouch) {
            const firstCard = await page.$("[data-service-card='true']");
            if (firstCard) {
              await firstCard.hover();
              await page.waitForTimeout(400);
              const hasGlow = await page.evaluate(() => {
                return window.__storyBus && window.__storyBus.hoverGlow !== null;
              });
              console.log(`  Desktop hover glow active on card:`, hasGlow);
            }
          } else {
            // Touch device: check auto glow targeting center card
            await page.evaluate(() => window.dispatchEvent(new Event("scroll")));
            await page.waitForTimeout(400);
            const hasGlow = await page.evaluate(() => {
              return window.__storyBus && window.__storyBus.hoverGlow !== null;
            });
            console.log(`  Touch center-card glow active:`, hasGlow);
          }

          await page.screenshot({ path: path.join(outDir, `${vp.name}_${theme}_cards_glow.png`) });
        }
      }

      // Check header overlap
      const headerBox = await page.$("header");
      const hRect = headerBox ? await headerBox.boundingBox() : null;
      console.log(`  Header visible:`, !!hRect);

      // Check console errors
      if (consoleErrors.length > 0) {
        console.error(`  [!] Errors logged on ${vp.name} [${theme}]:`, consoleErrors);
        totalErrors += consoleErrors.length;
      } else {
        console.log(`  ✓ Zero console errors.`);
      }

      await context.close();
    }
  }

  // Also test /services/seo, /services/aeo, /services/geo routes
  console.log("\n=== Testing new service detail routes ===");
  const testRoutes = ["/services/seo", "/services/aeo", "/services/geo"];
  const page = await browser.newPage();
  for (const r of testRoutes) {
    const res = await page.goto(baseUrl + r, { waitUntil: "networkidle" });
    const status = res.status();
    const title = await page.title();
    console.log(`  Route ${r} -> HTTP ${status}, Title: "${title}"`);
    if (status !== 200) totalErrors++;
  }

  await browser.close();
  console.log(`\nVerification complete. Total errors: ${totalErrors}`);
  process.exit(totalErrors > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
