import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email:" }).click();
  await page.getByRole("textbox", { name: "Email:" }).fill("ivan@email.com");
  await page.getByRole("textbox", { name: "Contraseña:" }).click();
  await page.getByRole("textbox", { name: "Contraseña:" }).fill("pass");
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.getByRole("listitem").filter({ hasText: "Nuevo" }).click();
  await page.getByRole("textbox", { name: "Titulo:" }).click();
  await page.getByRole("textbox", { name: "Titulo:" }).fill("Nuevo anime");
  await page.getByRole("textbox", { name: "Descripción:" }).click();
  await page
    .getByRole("textbox", { name: "Descripción:" })
    .fill("Desde Playwright");
  await page.getByRole("button", { name: "Guardar" }).click();
  await page.getByRole("link").filter({ hasText: "Nuevo animeDesde" }).click();
});
