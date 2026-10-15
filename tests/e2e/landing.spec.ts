import { expect, test } from "@playwright/test";

test("preview explains scope and does not offer fake sign-in", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /fewer lost enquiries/i })).toBeVisible();
  await expect(page.getByText(/no sign-in or data collection is enabled/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /explore the product direction/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /sign in|log in/i })).toHaveCount(0);
});
