import { test, expect } from '@playwright/test';

test.describe('auth', () => {
  test('register, reload remains authenticated, second tab, logout both', async ({
    page,
    browser,
  }) => {
    const suffix = Math.random().toString(36).slice(2, 8);
    const email = `e2e-${suffix}@example.com`;
    const username = `e2e-${suffix}`;
    const password = 'correct horse battery staple';

    // Register
    await page.goto('/register');
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/^username/i).fill(username);
    await page.getByLabel(/^password$/i).fill(password);
    await page.getByLabel(/confirm password/i).fill(password);
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByText(`Welcome, ${username}`)).toBeVisible();

    // Reload remains authenticated (cookie-based refresh)
    await page.reload();
    await expect(page.getByText(`Welcome, ${username}`)).toBeVisible();

    // Second tab should also be authenticated via shared cookie
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    await page2.goto('/');
    await expect(page2.getByText(`Welcome, ${username}`)).toBeVisible();

    // Logout in first tab should clear both
    await page.getByRole('button', { name: /log out/i }).click();
    await expect(page).toHaveURL('/login');

    // Second tab should become anonymous after broadcast (or on next navigation)
    await page2.reload();
    await expect(page2).toHaveURL('/login');

    await context2.close();
  });

  test('protected redirect and public-only redirect', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/login');

    const suffix = Math.random().toString(36).slice(2, 8);
    const email = `e2e2-${suffix}@example.com`;
    const username = `e2e2-${suffix}`;
    const password = 'correct horse battery staple';

    await page.goto('/register');
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/^username/i).fill(username);
    await page.getByLabel(/^password$/i).fill(password);
    await page.getByLabel(/confirm password/i).fill(password);
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page).toHaveURL('/');

    // Authenticated visiting /login should redirect to /
    await page.goto('/login');
    await expect(page).toHaveURL('/');

    // Invalid login
    await page.getByRole('button', { name: /log out/i }).click();
    await page.goto('/login');
    await page.getByLabel(/username/i).fill('nonexistent');
    await page.getByLabel(/password/i).fill('wrong');
    await page.getByRole('button', { name: /log in/i }).click();
    await expect(page.getByText(/invalid username or password/i)).toBeVisible();
  });
});
