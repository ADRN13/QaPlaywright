import { Page } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { validLogin } from '../../test-data/login.data';
import { AccountPage } from '../../pages/AccountPage';
import { Navbar } from '../../pages/NavBar';
import { test, expect } from '../../fixtures/auth.fixture';
import { mockLogout } from '../../fixtures/authMock';


type LoginDataType = {
  username: string;
  password: string;
};

async function loginAsUser(
  page: Page , 
  loginData: LoginDataType = validLogin
): Promise<string> {
  const loginPage = new LoginPage(page);
   // Assuming we want to use the first valid login test case
  await loginPage.goto();
  await loginPage.fullLogin(loginData.username, loginData.password);
  return loginData.username;
}

test.describe('Account:should display correct username for logged in user', () => {
    test('Account page', async ({ page }) => {

      const accountPage = new AccountPage(page);
      const navbar = new Navbar(page);

      // precondition
      const useUsername = await loginAsUser(page);
      await accountPage.isOnThisPage();
      //results
      await accountPage.expectUsernameInWelcome(useUsername);
      await navbar.expectActiveItem(Navbar.Items.Account);

    });
});

test.describe('Account:should log out the user and navigate to the login page', () => {
    test('Account: Logout', async ({ page }) => {

      const loginPage = new LoginPage(page);
      const accountPage = new AccountPage(page);
      const navbar = new Navbar(page);

      // precondition
      const useUsername = await loginAsUser(page);
      await accountPage.isOnThisPage();
      //Action
      await accountPage.clickLogout();

      //results 
      await loginPage.isOnThisPage();
      await navbar.expectNoActiveItem();

    });
});

test.describe('Account: should navigate to the account page', () => {
    test('Account: Navbar navigation', async ({ page }) => {


      const accountPage = new AccountPage(page);
      const navbar = new Navbar(page);

      // precondition
      const useUsername = await loginAsUser(page);
      await accountPage.isOnThisPage();
      //Action
      await navbar.navigateTo(Navbar.Items.Account);

      //results 
      await accountPage.isOnThisPage();
      await navbar.expectActiveItem(Navbar.Items.Account);

    });
});

test.describe('Account: should switch navigation and return to account page', () => {
    test('Account: Navbar navigation and return', async ({ page }) => {


      const accountPage = new AccountPage(page);
      const navbar = new Navbar(page);

      // precondition
      const useUsername = await loginAsUser(page);
      await accountPage.isOnThisPage();
      //Action
      await navbar.navigateTo(Navbar.Items.Home);
      await navbar.expectActiveItem(Navbar.Items.Home);
      await accountPage.isNotOnThisPage();
      await navbar.navigateTo(Navbar.Items.Account);

      //results 
      await accountPage.isOnThisPage();
      await navbar.expectActiveItem(Navbar.Items.Account);

    });
});

test.describe('Account:should not allow access to account page when not logged in', () => {
    test('Account: Access control', async ({ page }) => {

      const loginPage = new LoginPage(page);
      const accountPage = new AccountPage(page);
      const navbar = new Navbar(page);

      // precondition

      //Action
      await accountPage.goto();

      //results  
      await accountPage.isNotOnThisPage();
      await loginPage.isOnThisPage();      
      await navbar.expectNoActiveItem();

    });
});

test.describe('Account: should still be logged in after refresh', () => {
    test('Account: Refresh', async ({ page }) => {


      const accountPage = new AccountPage(page);
      const navbar = new Navbar(page);

      // precondition
      const useUsername = await loginAsUser(page);
      await accountPage.isOnThisPage();
      //Action
      await page.reload();


      //results  
      await accountPage.isOnThisPage();
      await accountPage.expectUsernameInWelcome(useUsername);
      await navbar.expectActiveItem(Navbar.Items.Account);

      //Action
      await navbar.navigateTo(Navbar.Items.Home);
      await navbar.expectActiveItem(Navbar.Items.Home);
      await navbar.navigateTo(Navbar.Items.Account)

      //results     
      await accountPage.isOnThisPage();
      await accountPage.expectUsernameInWelcome(useUsername);
      await navbar.expectActiveItem(Navbar.Items.Account)

    });
});

// NOTE: 
// This test is relevant only when logout is handled via backend API.
// Currently skipped because logout is implemented using localStorage.
test.skip('Account: should stay on account page when logout API fails (no backend yet)', () => {
    test('Account: Failed logout test', async ({ page, authMockState  }) => {

      const loginPage = new LoginPage(page);
      const accountPage = new AccountPage(page);
      const navbar = new Navbar(page);

      // precondition
      
      const useUsername = await loginAsUser(page);
      await accountPage.isOnThisPage();
      // Simulate logout failure
      authMockState.logoutSuccess = false;
      await mockLogout(page, false);  // use the mockLogout function to set up the failure response. independent of ENV.MOCK state.
      //Action
      await accountPage.clickLogout();

      //results  
      // In a real implementation, we would check for an error message or some indication of failure.
      await accountPage.isOnThisPage();
      await loginPage.isNotOnThisPage();      
      await navbar.expectActiveItem(Navbar.Items.Account);

    });
});