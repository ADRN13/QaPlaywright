import { Page, expect, Locator} from '@playwright/test';
import { createLogger  } from '../utils/logger';
import { BASE_URL } from '../config/env';


const log = createLogger('LoginPage');

export class LoginPage {
  constructor(private page: Page) {}
    readonly url = `${BASE_URL}login.html`;

  // --- NAVIGATION ---
  async goto() {
    await this.page.goto(this.url);
    log("url: ",this.page.url());
  }


  // --- LOCATORS  ---
  getUsernameField() {
    return this.page.locator('#username');
  }

  getPasswordField() {
    return this.page.locator('#password');
  }

  getErrorMessage() {
    return this.page.locator('#errorMessage');
  }

  getSubmitButton() {
    return this.page.locator('input[type="submit"]');
  }


  // --- invalid input 
  async isFieldInvalid(field: Locator): Promise<boolean> {
    return await field.evaluate(
      (el: HTMLInputElement) => !el.checkValidity()
    );
  }

  // --- ACTIONS ---
  async enterUsername(username: string) {
    await this.getUsernameField().fill(username);
    log("Username entered: ", username);
  }
  
  
  async enterPassword(password: string) {
    await this.getPasswordField().fill(password);
    log("Password entered: ", '*'.repeat(password.length));
  }

  async clickLogin() {
    await this.getSubmitButton().click();
    log("Login button clicked");
  }



  // --- ASSERTIONS ---

  async isOnThisPage() {
    await expect(this.page).toHaveURL(this.url);
    log("On this page: ", this.page.url());
  }
  async isNotOnThisPage() {
    await expect(this.page).not.toHaveURL(this.url);
    log("Not on this page: ", this.page.url());
  }

  async isErrorVisible() {
    const result= await this.getErrorMessage().isVisible();
    expect(result).toBe(true);
    log("Error message is visible: ", result);
  }

  async isErrorHidden() {
    const result= await this.getErrorMessage().isHidden();
    expect(result).toBe(true);
    log("Error message is hidden: ", result);
  }

  async isUsernameFieldInvalid() {
    const isInvalid = await this.isFieldInvalid(this.getUsernameField());
    log('Username field invalid:', isInvalid);
    await expect(isInvalid).toBe(true);
  } 
  async isPasswordFieldInvalid() {
    const isInvalid = await this.isFieldInvalid(this.getPasswordField());
    log('Password field invalid:', isInvalid);
    await expect(isInvalid).toBe(true);
  }


  // --- WRAPPER ---

  async fullLogin(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }


  // --- REST TestS ---

  // Note:
  // Network validation assumes login triggers API request.
  // In this demo app, authentication may be handled client-side,
  // so request/response may not exist in all environments.
  async loginAndGetResponse(): Promise<{ sent: boolean; status: number | null }> {
    try {
      const [request, response] = await Promise.all([
        this.page.waitForRequest(req =>
          req.url().includes('/login') && req.method() === 'POST'
        ),
        this.page.waitForResponse(resp =>
          resp.url().includes('/login') &&
          resp.request().method() === 'POST'
        ),
        this.clickLogin()
      ]);

      log('Login request sent:', !!request);
      log('Login response status:', response.status());

      return {
        sent: !!request,
        status: response.status()
      };

    } catch {
      log.error('Login request/response not detected');
      return {
        sent: false,
        status: null
      };
    }
  }


}
