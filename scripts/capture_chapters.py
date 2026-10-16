import os
import sys
from playwright.sync_api import sync_playwright

baseUrl = "http://localhost:3005"
outDir = "public/assets/screenshots/chapters"
os.makedirs(outDir, exist_ok=True)

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

def run():
    print(f"Launching Chrome from: {chrome_path}")
    console_errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=chrome_path,
            headless=True,
            args=["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"]
        )

        chapters = [
            {"id": "01", "name": "ch01_foundation", "frac": 0.0},
            {"id": "02", "name": "ch02_connect", "frac": 1.0 / 3.0},
            {"id": "03", "name": "ch03_intelligence", "frac": 2.0 / 3.0},
            {"id": "04", "name": "ch04_cyrolabz", "frac": 1.0},
        ]

        # 1. Desktop Viewport (1360 x 900)
        for theme in ["dark", "light"]:
            print(f"\n--- Capturing Desktop 1360px in {theme.upper()} mode ---")
            context = browser.new_context(
                viewport={"width": 1360, "height": 900},
                device_scale_factor=1,
                color_scheme=theme,
            )
            context.add_init_script(f"try {{ localStorage.setItem('cyrolabz-theme', '{theme}'); }} catch(e) {{}}")
            page = context.new_page()
            page.on("console", lambda msg: console_errors.append(f"[{theme}] {msg.text}") if msg.type == "error" else None)
            page.on("pageerror", lambda err: console_errors.append(f"[{theme}] {err}"))

            page.goto(baseUrl, wait_until="networkidle", timeout=30000)
            page.wait_for_timeout(1500)

            runway_h = page.evaluate("""() => {
                const el = document.getElementById('story-runway');
                return el ? el.getBoundingClientRect().height : window.innerHeight * 5.6;
            }""")

            for ch in chapters:
                target_y = (runway_h - 900) * ch["frac"]
                page.evaluate(f"window.scrollTo({{ top: {target_y}, behavior: 'instant' }})")
                page.wait_for_timeout(1400)
                path = os.path.join(outDir, f"desktop_{ch['name']}_{theme}.png")
                page.screenshot(path=path)
                print(f"Captured: {path}")

            context.close()

        # 2. Mobile Viewport (390 x 844)
        for theme in ["dark", "light"]:
            print(f"\n--- Capturing Mobile 390px in {theme.upper()} mode ---")
            context = browser.new_context(
                viewport={"width": 390, "height": 844},
                device_scale_factor=1,
                color_scheme=theme,
            )
            context.add_init_script(f"try {{ localStorage.setItem('cyrolabz-theme', '{theme}'); }} catch(e) {{}}")
            page = context.new_page()
            page.on("console", lambda msg: console_errors.append(f"[mobile-{theme}] {msg.text}") if msg.type == "error" else None)
            page.on("pageerror", lambda err: console_errors.append(f"[mobile-{theme}] {err}"))

            page.goto(baseUrl, wait_until="networkidle", timeout=30000)
            page.wait_for_timeout(1500)

            runway_h = page.evaluate("""() => {
                const el = document.getElementById('story-runway');
                return el ? el.getBoundingClientRect().height : window.innerHeight * 5.6;
            }""")

            for ch in chapters:
                target_y = (runway_h - 844) * ch["frac"]
                page.evaluate(f"window.scrollTo({{ top: {target_y}, behavior: 'instant' }})")
                page.wait_for_timeout(1400)
                path = os.path.join(outDir, f"mobile_{ch['name']}_{theme}.png")
                page.screenshot(path=path)
                print(f"Captured: {path}")

            context.close()

        browser.close()

    print("\n--- Console Errors Recorded ---")
    if console_errors:
        for err in console_errors:
            print("ERROR:", err)
    else:
        print("Zero console errors!")
    print("\nAll 16 screenshots captured successfully!")

if __name__ == "__main__":
    run()
