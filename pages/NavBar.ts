import { Page, expect } from '@playwright/test';
import { createLogger  } from '../utils/logger';

const log = createLogger('NavBar');

export class Navbar {
  constructor(private page: Page) {}

  static Items = {
    Home: { label: 'Home' },
    Account: { label: 'Account' },
    Clothing: { label: 'Clothing' },
    Cart: { label: 'Shopping bag' },
    About: { label: 'About' }
  } as const;

  // --- NAVIGATION ---
 
  async navigateTo(item: (typeof Navbar.Items)[keyof typeof Navbar.Items]) {
    await this.page.getByRole('link', { name: item.label }).click();
    log(`Navigating to ${item.label} page`);
  }

  // --- ACTIVE STATE ---
  private activeItem = this.page.locator('nav a.current');

  async getCurrentActive(): Promise<string> {
    return (await this.activeItem.textContent())?.trim() ?? '';
  }

  async expectActiveItem(item: (typeof Navbar.Items)[keyof typeof Navbar.Items]) {
    await expect(this.activeItem).toContainText(item.label);
    log(`Expected active item: ${item.label}`);
  }

  async expectNoActiveItem() {
  await expect(this.page.locator('nav a.current')).toHaveCount(0);
}
}