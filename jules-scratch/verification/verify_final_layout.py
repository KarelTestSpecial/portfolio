
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:3000")

    # Wait for the projects section to be visible and for the useEffect to run
    page.wait_for_timeout(500) # Give the script time to resize cards

    projects_section = page.locator("#projects")
    projects_section.wait_for()

    # Take a screenshot of the entire projects section
    projects_section.screenshot(path="jules-scratch/verification/final_verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
