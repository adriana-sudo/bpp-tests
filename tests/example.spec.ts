import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';

test('backend is running', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/products`);
  expect(res.status()).toBe(200);
});

test('products endpoint returns a list', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/products`);
  const body = await res.json();
  expect(Array.isArray(body)).toBeTruthy();
  expect(body.length).toBeGreaterThan(0);
});

test('each product has required fields', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/products`);
  const body = await res.json();
  for (const product of body) {
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('collection');
  }
});

test('bits collection returns products', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/products/collection/bits`);
  const body = await res.json();
  expect(body.length).toBeGreaterThan(0);
  expect(body[0].collection).toBe('bits');
});

test('pieces collection returns products', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/products/collection/pieces`);
  const body = await res.json();
  expect(body.length).toBeGreaterThan(0);
  expect(body[0].collection).toBe('pieces');
});

test('pauses collection returns products', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/products/collection/pauses`);
  const body = await res.json();
  expect(body.length).toBeGreaterThan(0);
  expect(body[0].collection).toBe('pauses');
});

test('unknown collection returns empty list', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/products/collection/unknown`);
  const body = await res.json();
  expect(Array.isArray(body)).toBeTruthy();
  expect(body.length).toBe(0);
  });
 test('homepage loads with store name', async ({ page }) => {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('h1')).toContainText('Bits');
});

test('enter the shop button navigates to shop', async ({ page }) => {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.locator('a[href="/shop"]').click();
  await expect(page).toHaveURL('http://localhost:3000/shop');
});

test('shop page shows all three collections', async ({ page }) => {
  await page.goto('http://localhost:3000/shop');
  await expect(page.locator('text=BITS')).toBeVisible();
  await expect(page.locator('text=PIECES')).toBeVisible();
  await expect(page.locator('text=PAUSES')).toBeVisible();
});

test('shop page shows product names and prices', async ({ page }) => {
  await page.goto('http://localhost:3000/shop');
  await expect(page.locator('text=Linen Notebook').first()).toBeVisible();
  await expect(page.locator('text=£18.99').first()).toBeVisible();
});