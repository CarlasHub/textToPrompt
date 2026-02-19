import { expect, test, type Page } from "@playwright/test";

async function tabUntilFocused(page: Page, selector: string, maxTabs = 12) {
  for (let i = 0; i < maxTabs; i += 1) {
    const focused = await page.evaluate((sel: string) => {
      const element = document.querySelector(sel);
      return element === document.activeElement;
    }, selector);
    if (focused) {
      return;
    }
    await page.keyboard.press("Tab");
  }
  throw new Error(`Failed to focus ${selector}`);
}

test("page loads with heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "textToPrompt" })).toBeVisible();
});

test("keyboard flow generates hard mode output", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator("#input-text")).toBeFocused();
  await page.keyboard.type("Draft a plan. Must include steps.");

  await page.keyboard.press("Tab");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("input[value='hard']")).toBeChecked();

  await tabUntilFocused(page, "#btn-generate");
  await page.keyboard.press("Enter");

  const output = page.locator("#panel-single .output");
  await expect(output).toContainText("## Two-Step Chain");
  await expect(output).toContainText("Plan only");
  await expect(output).toContainText("Execute and verify");
});

test("copy announces success", async ({ page }) => {
  await page.addInitScript(() => {
    if (!navigator.clipboard) {
      (navigator as any).clipboard = {};
    }
    navigator.clipboard.writeText = async () => {};
  });

  await page.goto("/");
  await page.fill("#input-text", "Test output");
  await page.click("#btn-generate");
  await page.click("#btn-copy");

  await expect(page.locator("#live-region")).toHaveText("Copied to clipboard.");
});

test("download produces markdown file", async ({ page }) => {
  await page.goto("/");
  await page.fill("#input-text", "Test download");
  await page.click("#btn-generate");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.click("#btn-download")
  ]);

  expect(download.suggestedFilename()).toMatch(/\.md$/);
});

test("preset save and load restores settings", async ({ page }) => {
  await page.goto("/");
  await page.check("input[value='hard']");

  await page.click("#btn-open-presets");
  await page.fill("#preset-name", "Hard Mode");
  await page.click("#btn-save-preset");
  await expect(page.getByText("Hard Mode")).toBeVisible();

  await page.click("[data-action='close-presets']");
  await page.check("input[value='easy']");

  await page.click("#btn-open-presets");
  await page.getByRole("button", { name: "Load preset Hard Mode" }).click();
  await expect(page.locator("input[value='hard']")).toBeChecked();
});

test("history restores previous output", async ({ page }) => {
  await page.goto("/");
  await page.fill("#input-text", "History sample");
  await page.click("#btn-generate");
  await page.click("#btn-clear");

  await page.click("#btn-open-history");
  await page.getByRole("button", { name: "Restore history entry" }).first().click();
  await expect(page.locator("#input-text")).toHaveValue("History sample");
});
