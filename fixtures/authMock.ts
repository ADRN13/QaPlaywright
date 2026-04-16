
import { Page } from '@playwright/test';

export async function mockLogin(page: Page, success: boolean) {
  await page.route('**/login', route => {
    return route.fulfill({
      status: success ? 200 : 401
    });
  });
}

export async function mockLogout(page: Page, success: boolean) {
  await page.route('**/logout', route => {
    return route.fulfill({
      status: success ? 200 : 500
    });
  });
}