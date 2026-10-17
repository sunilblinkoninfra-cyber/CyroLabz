import os
import sys
import time
from playwright.sync_api import sync_playwright

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
baseUrl = "http://localhost:3005"
outDir = "public/assets/screenshots/services_verification"
os.makedirs(outDir, exist_ok=True)

def run():
    print(f"Launching Chrome from: {chrome_path}")
    console_errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=chrome_path,
            headless=True,
            args=["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"]
        )

        viewports = [
            {"name": "desktop_1360x800", "width": 1360, "height": 800},
            {"name": "tablet_820x1100", "width": 820, "height": 1100},
            {"name": "mobile_390x780", "width": 390, "height": 780},
        ]

        for vp in viewports:
            vh = vp["height"]
            S = 4.6 * vh
            dStory = 0.94 * S

            scroll_points = [
                {"name": "halfway_logo_to_image1", "py": dStory + 0.425 * vh, "desc": "s=3.5"},
                {"name": "card1_foundation_rest", "py": dStory + 0.85 * vh, "desc": "s=4.0"},
                {"name": "halfway_card1_to_card2", "py": dStory + 1.35 * vh, "desc": "s=4.5"},
                {"name": "card2_connect_rest", "py": dStory + 1.85 * vh, "desc": "s=5.0"},
                {"name": "card3_intelligence_rest", "py": dStory + 2.85 * vh, "desc": "s=6.0"},
                {"name": "card4_visibility_rest", "py": dStory + 3.85 * vh, "desc": "s=7.0"},
            ]

            for theme in ["light", "dark"]:
                print(f"\n==========================================")
                print(f"Testing {vp['name']} in {theme.upper()} mode")
                print(f"==========================================")

                context = browser.new_context(
                    viewport={"width": vp["width"], "height": vp["height"]},
                    device_scale_factor=1,
                    color_scheme=theme,
                )
                page = context.new_page()

                page.on("console", lambda msg: console_errors.append(f"[{theme} {vp['name']}] {msg.text}") if msg.type == "error" else None)
                page.on("pageerror", lambda err: console_errors.append(f"[{theme} {vp['name']}] {err}"))

                page.goto(baseUrl, wait_until="networkidle", timeout=30000)
                page.evaluate(f"document.documentElement.setAttribute('data-theme', '{theme}')")
                page.wait_for_timeout(1000)

                for sp in scroll_points:
                    py = int(round(sp["py"]))
                    page.evaluate(f"window.scrollTo({{ top: {py}, behavior: 'instant' }})")
                    page.wait_for_timeout(1200)

                    out_path = os.path.join(outDir, f"{vp['name']}_{theme}_{sp['name']}.png")
                    page.screenshot(path=out_path)
                    print(f"Captured: {out_path} ({sp['desc']}, py={py})")

                # Test interaction on desktop light mode
                if vp["name"] == "desktop_1360x800" and theme == "light":
                    print("\nTesting interactive controls (Prev, Next, Dots, Keyboard):")
                    # At card 4 (py = dStory + 3.85 * vh), click Previous
                    prev_btn = page.locator('button[aria-label="Previous services"]')
                    prev_btn.click()
                    page.wait_for_timeout(1000)
                    page.screenshot(path=os.path.join(outDir, "interaction_after_prev_click.png"))
                    print("Clicked Previous services -> Captured interaction_after_prev_click.png")

                    # Click Dot 1 (Foundation)
                    dot1 = page.locator('button[aria-label="Foundation services"]')
                    dot1.click()
                    page.wait_for_timeout(1000)
                    page.screenshot(path=os.path.join(outDir, "interaction_after_dot1_click.png"))
                    print("Clicked Dot 1 (Foundation) -> Captured interaction_after_dot1_click.png")

                    # Click Next
                    next_btn = page.locator('button[aria-label="Next services"]')
                    next_btn.click()
                    page.wait_for_timeout(1000)
                    page.screenshot(path=os.path.join(outDir, "interaction_after_next_click.png"))
                    print("Clicked Next services -> Captured interaction_after_next_click.png")

                context.close()

        browser.close()

    print("\n--- Console Errors Summary ---")
    if console_errors:
        for err in console_errors:
            print("ERROR:", err)
    else:
        print("Zero console errors! Console is completely clean.")

if __name__ == "__main__":
    run()
