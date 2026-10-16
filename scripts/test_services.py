import os
import sys
import time
from playwright.sync_api import sync_playwright

baseUrl = "http://localhost:3000"
outDir = "public/assets/screenshots/test"
os.makedirs(outDir, exist_ok=True)

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

def run():
    print(f"Launching Chrome from: {chrome_path}")
    total_errors = 0

    viewports = [
        {"name": "desktop_1360", "width": 1360, "height": 900, "isMobile": False, "hasTouch": False},
        {"name": "tablet_820", "width": 820, "height": 1180, "isMobile": False, "hasTouch": False},
        {"name": "mobile_390", "width": 390, "height": 844, "isMobile": True, "hasTouch": True},
    ]

    themes = ["dark", "light"]

    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=chrome_path,
            headless=True,
            args=["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"]
        )

        for vp in viewports:
            for theme in themes:
                print(f"\n=== Testing {vp['name']} [{theme.upper()}] ===")
                context = browser.new_context(
                    viewport={"width": vp["width"], "height": vp["height"]},
                    is_mobile=vp["isMobile"],
                    has_touch=vp["hasTouch"],
                    device_scale_factor=2,
                )
                page = context.new_page()

                console_errors = []
                page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
                page.on("pageerror", lambda err: console_errors.append(str(err)))

                page.goto(baseUrl, wait_until="networkidle")
                time.sleep(0.6)

                # Set theme
                page.evaluate(f"""() => {{
                    document.documentElement.setAttribute('data-theme', '{theme}');
                    localStorage.setItem('cyrolabz-theme', '{theme}');
                }}""")
                time.sleep(0.4)

                # 1. Measure runway geometry
                geom = page.evaluate("""() => {
                    const runway = document.getElementById("runway");
                    const H_storyScroll = runway ? Math.max(1, runway.offsetHeight - window.innerHeight) : 4000;
                    const dStory = 0.94 * H_storyScroll;
                    const dMorph = 0.85 * window.innerHeight;
                    return { H_storyScroll, dStory, dMorph };
                }""")

                # 2. Scroll to s=3.0 (Logo)
                print("  Scrolling to s=3.0 (Logo)...")
                page.evaluate(f"window.scrollTo({{ top: {geom['dStory']}, behavior: 'instant' }})")
                time.sleep(1.0)
                s_val = page.evaluate("() => window.__storyBus ? window.__storyBus.s : -1")
                print(f"  s at dStory: {s_val:.2f}")
                page.screenshot(path=os.path.join(outDir, f"{vp['name']}_{theme}_s3_logo.png"))

                # 3. Scroll to Morph (s = 3.55)
                print("  Scrolling to s=3.55 (Morphing into network)...")
                morph_y = geom['dStory'] + geom['dMorph'] * 0.55
                page.evaluate(f"window.scrollTo({{ top: {morph_y}, behavior: 'instant' }})")
                time.sleep(1.0)
                s_val = page.evaluate("() => window.__storyBus ? window.__storyBus.s : -1")
                print(f"  s at morph: {s_val:.2f}")
                page.screenshot(path=os.path.join(outDir, f"{vp['name']}_{theme}_s3_55_morph.png"))

                # 4. Scroll to Services Heading (s = 4.0)
                print("  Scrolling to Services section...")
                services_y = geom['dStory'] + geom['dMorph'] + 120
                page.evaluate(f"window.scrollTo({{ top: {services_y}, behavior: 'instant' }})")
                time.sleep(1.2)
                s_val = page.evaluate("() => window.__storyBus ? window.__storyBus.s : -1")
                print(f"  s at services heading: {s_val:.2f}")
                page.screenshot(path=os.path.join(outDir, f"{vp['name']}_{theme}_services_heading.png"))

                # 5. Scroll further into cards
                scroll_cards_y = services_y + 600
                page.evaluate(f"window.scrollTo({{ top: {scroll_cards_y}, behavior: 'instant' }})")
                time.sleep(1.0)

                # Test Hover glow
                if not vp["hasTouch"]:
                    first_card = page.query_selector("[data-service-card='true']")
                    if first_card:
                        first_card.hover()
                        time.sleep(0.5)
                        has_glow = page.evaluate("() => window.__storyBus && window.__storyBus.hoverGlow !== null")
                        print(f"  Desktop hover glow active on card: {has_glow}")
                else:
                    page.evaluate("() => window.dispatchEvent(new Event('scroll'))")
                    time.sleep(0.5)
                    has_glow = page.evaluate("() => window.__storyBus && window.__storyBus.hoverGlow !== null")
                    print(f"  Touch center-card glow active: {has_glow}")

                page.screenshot(path=os.path.join(outDir, f"{vp['name']}_{theme}_cards_glow.png"))

                # Check header visibility & styling
                header = page.query_selector("header")
                if header:
                    h_box = header.bounding_box()
                    print(f"  Header present and sticky at top: y={h_box['y']}")

                # Check console errors
                if console_errors:
                    print(f"  [!] Errors on {vp['name']} [{theme}]: {console_errors}")
                    total_errors += len(console_errors)
                else:
                    print("  ✓ Zero console errors.")

                context.close()

        # Check the 3 new service detail routes
        print("\n=== Testing Service Detail Pages ===")
        test_routes = ["/services/seo", "/services/aeo", "/services/geo"]
        for r in test_routes:
            p_test = browser.new_page()
            res = p_test.goto(baseUrl + r, wait_until="networkidle")
            print(f"  {r} -> HTTP {res.status}, Title: {p_test.title()}")
            if res.status != 200:
                total_errors += 1
            p_test.close()

        browser.close()

    print(f"\nVerification finished. Total errors: {total_errors}")
    if total_errors > 0:
        sys.exit(1)

if __name__ == "__main__":
    run()
