import { Page, expect } from '@playwright/test';
import { createLogger  } from '../utils/logger';

const log = createLogger('NavBar');

export class Navbar {
  constructor(private page: Page) {}

  static Items = {
    Home: { label: 'Home', url: '/fashionhub/' },
    Account: { label: 'Account', url: 'account' },
    Clothing: { label: 'Clothing', url: 'products' },
    Cart: { label: 'Shopping bag', url: 'cart' },
    About: { label: 'About', url: 'about' }
  } as const;

  // --- NAVIGATION ---
 
  async navigateTo(item: (typeof Navbar.Items)[keyof typeof Navbar.Items]) {
    await this.page.click(`nav a[href*="${item.url}"]`);
    log(`Navigating to ${item.label} (${item.url})`);
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