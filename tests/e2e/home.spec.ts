import { expect, test } from "@playwright/test";

test("shows the mobile pilot landing page", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Decide tu próximo look/i })).toBeVisible();
  await expect(page.getByText(/código QR del salón/i)).toBeVisible();
});
