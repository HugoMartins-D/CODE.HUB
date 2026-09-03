import { expect, test } from "@playwright/test";

test("cadastro leva uma nova pessoa ao feed", async ({ page }) => {
  await page.goto("/cadastro");
  await page.getByPlaceholder("Digite seu nome completo").fill("Pessoa Teste");
  await page.getByPlaceholder("seu@email.com").fill("teste@example.com");
  await page.getByPlaceholder("Crie uma senha (mín. 8 caracteres)").fill("12345678");
  await page.getByPlaceholder("Repita a senha").fill("12345678");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Criar conta", exact: true }).click();
  await expect(page).toHaveURL(/\/feed$/);
  await expect(page.getByText("O que você está construindo hoje?")).toBeVisible();
});
