import os
import sys
from playwright.sync_api import sync_playwright

baseUrl = "http://localhost:3005"
outDir = "public/assets/screenshots"
os.makedirs(outDir, exist_ok=True)

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

viewports = [
    {"name": "desktop_1360", "width": 1360, "height": 900},
    {"name": "tablet_820", "width": 820, "height": 900},
    {"name": "mobile_390", "width": 390, "height": 844},
]

routes = [
    {"name": "home", "path": "/"},
    {"name": "services", "path": "/services"},
    {"name": "services_3d", "path": "/services/3d-interactive-design"},
    {"name": "work", "path": "/work"},
    {"name": "work_detail", "path": "/work/global-supply-chain-modernisation"},
    {"name": "about", "path": "/about"},
    {"name": "insights", "path": "/insights"},
    {"name": "contact", "path": "/contact"},
]

def run():
    print(f"Launching installed Chrome from: {chrome_path}")
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=chrome_path,
            headless=True,
            args=["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"]
        )

        for vp in viewports:
            print(f"\n=== Viewport: {vp['name']} ({vp['width']}x{vp['height']}) ===")
            context = browser.new_context(
                viewport={"width": vp["width"], "height": vp["height"]},
                device_scale_factor=1,
            )
            page = context.new_page()

            for route in routes:
                url = f"{baseUrl}{route['path']}"
                print(f"Capturing {route['name']}...")
                page.goto(url, wait_until="networkidle", timeout=25000)
                page.wait_for_timeout(1400)

                # 1. Light Theme
                page.evaluate("document.documentElement.setAttribute('data-theme', 'light')")
                page.wait_for_timeout(600)
                light_path = os.path.join(outDir, f"{route['name']}_{vp['name']}_light.png")
                page.screenshot(path=light_path)

                # 2. Dark Theme
                page.evaluate("document.documentElement.setAttribute('data-theme', 'dark')")
                page.wait_for_timeout(600)
                dark_path = os.path.join(outDir, f"{route['name']}_{vp['name']}_dark.png")
                page.screenshot(path=dark_path)

            context.close()

        browser.close()
    print("\nAll responsive screenshots captured successfully!")

if __name__ == "__main__":
    run()
