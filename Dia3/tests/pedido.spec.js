const { test, expect } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

const loja = pathToFileURL(path.join(__dirname, '..', 'loja.html')).href;

test.beforeEach(async ({ page }) => {
  await page.goto(loja);
});

test('exibe o nome da cafeteria', async ({ page }) => {
  await expect(page).toHaveTitle('Código & Café');
  await expect(page.getByRole('heading', { name: 'Código & Café' })).toBeVisible();
});

test('cliente finaliza um pedido completo', async ({ page }) => {
  await page.getByLabel('Nome do cliente').fill('Maria Silva');
  await page.getByLabel('Tipo de café').selectOption({ label: 'Cappuccino — R$ 25,00' });
  await page.getByLabel('Quantidade').fill('2');
  await page.getByLabel('Cupom de desconto').fill('CAFE10');
  await page.getByRole('button', { name: 'Aplicar cupom' }).click();
  await page.getByLabel('Cartão').check();
  await page.getByLabel('Embalar para viagem').check();

  await expect(page.locator('#total')).toHaveText('R$ 45,00');

  await page.getByRole('button', { name: 'Finalizar pedido' }).click();

  await expect(page.getByRole('heading', { name: 'Pedido confirmado' })).toBeVisible();
  await expect(page.locator('#detalhes')).toContainText('Obrigado, Maria Silva!');
  await expect(page.locator('#detalhes')).toContainText('2x Cappuccino');
  await expect(page.locator('#detalhes')).toContainText('pagamento via Cartão');
  await expect(page.locator('#detalhes')).toContainText('Embalado para viagem');
});

test('total acompanha tipo e quantidade', async ({ page }) => {
  await expect(page.locator('#total')).toHaveText('R$ 20,00');

  await page.getByLabel('Quantidade').fill('3');
  await expect(page.locator('#total')).toHaveText('R$ 60,00');

  await page.getByLabel('Tipo de café').selectOption({ label: 'Latte — R$ 30,00' });
  await expect(page.locator('#total')).toHaveText('R$ 90,00');
});

test('cupom válido aplica 10% de desconto', async ({ page }) => {
  await page.getByLabel('Quantidade').fill('2');
  await page.getByLabel('Cupom de desconto').fill('cafe10');
  await page.getByRole('button', { name: 'Aplicar cupom' }).click();

  await expect(page.getByRole('status')).toContainText('Cupom CAFE10 aplicado');
  await expect(page.locator('#desconto')).toHaveText('R$ 4,00');
  await expect(page.locator('#total')).toHaveText('R$ 36,00');
});

test('cupom inválido mostra erro e não altera o total', async ({ page }) => {
  await page.getByLabel('Cupom de desconto').fill('INVALIDO');
  await page.getByRole('button', { name: 'Aplicar cupom' }).click();

  await expect(page.getByRole('status')).toHaveText('Cupom inválido');
  await expect(page.locator('#total')).toHaveText('R$ 20,00');
});

test('nome é obrigatório para finalizar', async ({ page }) => {
  await page.getByRole('button', { name: 'Finalizar pedido' }).click();

  await expect(page.getByRole('alert')).toHaveText('Informe o nome do cliente');
  await expect(page.getByRole('heading', { name: 'Pedido confirmado' })).toBeHidden();
});

test('permite fazer um novo pedido após confirmar', async ({ page }) => {
  await page.getByLabel('Nome do cliente').fill('João');
  await page.getByRole('button', { name: 'Finalizar pedido' }).click();
  await page.getByRole('button', { name: 'Fazer novo pedido' }).click();

  await expect(page.getByLabel('Nome do cliente')).toHaveValue('');
  await expect(page.locator('#total')).toHaveText('R$ 20,00');
});
