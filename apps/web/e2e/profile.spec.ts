import { test, expect } from '@playwright/test';

test.describe('profile', () => {
  test('full-stack profile flow', async ({ page }) => {
    const suffix = Math.random().toString(36).slice(2, 8);
    const email = `e2e-${suffix}@example.com`;
    const username = `e2e-${suffix}`;
    const password = 'correct horse battery staple';
    const profileName = `Profile ${suffix}`;
    const fullName = `User ${suffix}`;
    const locale = 'en-US';

    // 1. Register a unique user via current UI using randomized valid email/username/password; assert home.
    await page.goto('/register');
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/^username/i).fill(username);
    await page.getByLabel(/^password$/i).fill(password);
    await page.getByLabel(/confirm password/i).fill(password);
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByText(`Welcome, ${username}`)).toBeVisible();

    // 2. Navigate to /profile; assert empty profile state and create CTA.
    await page.goto('/profile');
    await expect(page.getByText(/no profile yet/i)).toBeVisible();
    await expect(
      page.getByRole('button', { name: /create profile/i }),
    ).toBeVisible();

    // 3. Create profile with exact dialog fields name/fullName/email/locale=`en-US`; assert navigation to /profile/{uuid} and API-loaded name/profile UI.
    await page.getByRole('button', { name: /create profile/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    // use dialog-scoped label locators
    await dialog.getByLabel('Profile name').fill(profileName);
    await dialog.getByLabel('Full name').fill(fullName);
    await dialog.getByLabel('Email', { exact: true }).fill(email);
    await dialog.getByLabel('Locale').fill(locale);
    await dialog.getByRole('button', { name: /^create$/i }).click();

    await expect(page).toHaveURL(
      /\/profile\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
    );
    // API-loaded name/profile UI: header fullName via EditableField display, and summary empty state
    await expect(
      page.getByRole('button', { name: 'Edit Full name' }),
    ).toContainText(fullName);
    // name appears in profile selector
    await expect(
      page.getByRole('combobox', { name: /select profile/i }),
    ).toContainText(profileName);
    await expect(
      page.getByRole('button', { name: 'Edit Summary' }),
    ).toContainText('Not set');

    const versionList = page.getByRole('list', { name: /profile versions/i });
    // deterministic: create v1
    await expect(versionList).toBeVisible();
    const v1Item = versionList
      .getByRole('listitem')
      .filter({ hasText: 'Version 1' });
    await expect(v1Item).toBeVisible();
    await expect(v1Item.getByText('Current')).toBeVisible();

    // 4. Inline-edit Summary from `Not set` to `First summary`; wait for save/version refresh. Reload and assert persisted.
    const summaryDisplay = page.getByRole('button', { name: 'Edit Summary' });
    await expect(summaryDisplay).toContainText('Not set');
    await summaryDisplay.dblclick();
    const summaryInput = page.getByLabel('Summary');
    await expect(summaryInput).toBeVisible();
    await summaryInput.fill('First summary');
    await summaryInput.press('Enter');
    await expect(
      page.getByRole('button', { name: 'Edit Summary' }),
    ).toContainText('First summary');
    // wait for version refresh: v2 current
    const v2Item = versionList
      .getByRole('listitem')
      .filter({ hasText: 'Version 2' });
    await expect(v2Item).toBeVisible();
    await expect(v2Item.getByText('Current')).toBeVisible();

    await page.reload();
    await expect(
      page.getByRole('button', { name: 'Edit Summary' }),
    ).toContainText('First summary');
    await expect(
      page
        .getByRole('list', { name: /profile versions/i })
        .getByRole('listitem')
        .filter({ hasText: 'Version 2' })
        .getByText('Current'),
    ).toBeVisible();

    // 5. Edit Summary to `Second summary`; assert latest current UI and version history contains appropriate new version.
    const summaryDisplay2 = page.getByRole('button', { name: 'Edit Summary' });
    await expect(summaryDisplay2).toContainText('First summary');
    await summaryDisplay2.dblclick();
    const summaryInput2 = page.getByLabel('Summary');
    await expect(summaryInput2).toBeVisible();
    await summaryInput2.fill('Second summary');
    await summaryInput2.press('Enter');
    await expect(
      page.getByRole('button', { name: 'Edit Summary' }),
    ).toContainText('Second summary');
    const v3Item = versionList
      .getByRole('listitem')
      .filter({ hasText: 'Version 3' });
    await expect(v3Item).toBeVisible();
    await expect(v3Item.getByText('Current')).toBeVisible();
    // history contains new version and prior still present
    await expect(v2Item).toBeVisible();
    await expect(v1Item).toBeVisible();

    // 6. Preview prior version; assert `First summary` and Summary edit control is read-only/disabled. Exit preview.
    const priorItem = versionList
      .getByRole('listitem')
      .filter({ hasText: 'Version 2' });
    await priorItem.getByRole('button', { name: 'Preview' }).click();
    await expect(page.getByText(/previewing version 2/i)).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Edit Summary' }),
    ).toContainText('First summary');
    await expect(
      page.getByRole('button', { name: 'Edit Summary' }),
    ).toHaveAttribute('aria-disabled', 'true');
    // exit preview
    await page.getByRole('button', { name: /exit preview/i }).click();
    await expect(page.getByText(/previewing version 2/i)).not.toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Edit Summary' }),
    ).toContainText('Second summary');
    await expect(
      page.getByRole('button', { name: 'Edit Summary' }),
    ).toHaveAttribute('aria-disabled', 'false');

    // 7. Activate prior version through existing two-step Activate/Confirm UI; assert current profile becomes `First summary` and current version marker changes appropriately. Reload and assert activation persists.
    const activateItem = versionList
      .getByRole('listitem')
      .filter({ hasText: 'Version 2' });
    await activateItem
      .getByRole('button', { name: /activate version 2/i })
      .click();
    await expect(activateItem.getByText(/confirm activation/i)).toBeVisible();
    await activateItem.getByRole('button', { name: /^confirm$/i }).click();
    // assert current profile becomes First summary
    await expect(
      page.getByRole('button', { name: 'Edit Summary' }),
    ).toContainText('First summary');
    await expect(activateItem.getByText('Current')).toBeVisible();
    // version 3 should no longer be current
    await expect(
      versionList
        .getByRole('listitem')
        .filter({ hasText: 'Version 3' })
        .getByText('Current'),
    ).not.toBeVisible();

    await page.reload();
    await expect(
      page.getByRole('button', { name: 'Edit Summary' }),
    ).toContainText('First summary');
    await expect(
      page
        .getByRole('list', { name: /profile versions/i })
        .getByRole('listitem')
        .filter({ hasText: 'Version 2' })
        .getByText('Current'),
    ).toBeVisible();
  });
});
