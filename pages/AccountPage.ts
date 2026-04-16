import { Page, expect } from '@playwright/test';
import { createLogger  } from '../utils/logger';

const log = createLogger('AccountPage');

export class AccountPage {
  constructor(private page: Page) {}
  readonly url = 'account.html';
 

  // --- NAVIGATION ---
  async goto() {
    await this.page.goto(this.url);
    log("url: ",this.page.url());
  }

  // --- GET OBJECTS ---

  getLogoutButton() {
    return this.page.locator('logout-button button');
  }

  getWelcomeMessage() {
    return this.page.locator('.account-page h2');
  }

  // --- ACTIONS ---


  async clickLogout() {
    await this.getLogoutButton().click();
    log("Logout button clicked");
  }

  

  // --- ASSERTIONS ---

  async isOnThisPage() {
    await expect(this.page).toHaveURL(new RegExp(this.url));
    log("On Account page: ", this.page.url());
  }
  async isNotOnThisPage() {
    await expect(this.page).not.toHaveURL(new RegExp(this.url));
    log("Not on Account page: ", this.page.url());
  }

async expectUsernameInWelcome(username: string) {
  const text = await this.getWelcomeMessage().textContent();
  log('Welcome message text:', text , 'Expected username:', username);
  await expect(this.getWelcomeMessage()).toContainText(username);
}


}
