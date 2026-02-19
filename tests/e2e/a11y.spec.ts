import { expect, test } from "@playwright/test";
import axe from "axe-core";

test("no serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  await page.addScriptTag({ content: axe.source });

  const results = await page.evaluate(async () => {
    return await (window as any).axe.run();
  });

  const serious = results.violations.filter((violation: any) =>
    ["serious", "critical"].includes(violation.impact)
  );

  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
});
