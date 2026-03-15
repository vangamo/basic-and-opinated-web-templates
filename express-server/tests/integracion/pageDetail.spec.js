import { test, expect } from "@playwright/test";

test("detail page has headings", async ({ page }) => {
  await page.goto("http://localhost:3000/works/1");
  await expect(
    page.getByRole("heading", { name: "Works list" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Learn about RESTful" })
  ).toBeVisible();
});

test("detail page has genre", async () => {
  await page.goto("http://localhost:3000/works/1");

  const genreElement = page.locator(".anime-card__genre");

  await expect(genreElement).toBeVisible();
  await expect(genreElement).toHaveText("Shonen");
});
