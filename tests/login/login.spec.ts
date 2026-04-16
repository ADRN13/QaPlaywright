import { LoginPage } from '../../pages/LoginPage';
import { invalidLoginTestCases, restLoginData, manyIncorrectLoginData, validLogin } from '../../test-data/login.data';
import { AccountPage } from '../../pages/AccountPage';
import { Navbar } from '../../pages/NavBar';
import { test, expect } from '../../fixtures/auth.fixture';




test.describe('Login: should login successfully with valid credentials', () => {
    test('Login: Authentication - valid login', async ({ page}) => {
      const { username, password } = validLogin;
      const loginPage = new LoginPage(page);
      const accountPage = new AccountPage(page);
      const navbar = new Navbar(page);


      await loginPage.goto();

      // pre-check
      await navbar.expectNoActiveItem();
      await loginPage.isErrorHidden();

      // action
      await loginPage.fullLogin(username, password);

      //results
      await accountPage.isOnThisPage();
      await accountPage.expectUsernameInWelcome(username);
      await navbar.expectActiveItem(Navbar.Items.Account);

    });
});

test.describe('Login: Authentication - invalid credentials', () => {
  invalidLoginTestCases.forEach(({ name, username, password  }) => {
    test(`Login: invalid credentials - ${name}`, async ({ page, authMockState }) => {
      const loginPage = new LoginPage(page);
      const navbar = new Navbar(page);
      authMockState.loginSuccess = false;

      await loginPage.goto();

      // pre-check
      await loginPage.isOnThisPage();
      await navbar.expectNoActiveItem();
      await loginPage.isErrorHidden();

      // action
      await loginPage.fullLogin(username, password);

      //results
      await loginPage.isOnThisPage();
      await loginPage.isErrorVisible();
      await navbar.expectNoActiveItem();

    });
  });
});


test.describe('Login:should show validation error when username is empty', () => {
  test('Login: Validation - username field - empty input', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const navbar = new Navbar(page);

    await loginPage.goto();
    // pre-check
    await navbar.expectNoActiveItem();
    await loginPage.isErrorHidden();
    // action
    await loginPage.clickLogin();
    //results
    await loginPage.isUsernameFieldInvalid();

  });
});

test.describe('Login:should show validation error for empty password', () => {
  test('Login: Validation - password field - empty input', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const navbar = new Navbar(page);

    await loginPage.goto();
    // pre-check
    await navbar.expectNoActiveItem();
    await loginPage.isErrorHidden();
    // action
    await loginPage.enterUsername('usser');
    await loginPage.clickLogin();
    //results
    await loginPage.isPasswordFieldInvalid();

  });
});


test.describe('Login: should allow login after multiple failed attempts', () => {
  manyIncorrectLoginData.forEach(({ name, validUsername, validPassword, invalidUsername, invalidPassword, numberOfRepetitions }) => {
    test(`Login: Authentication - multiple failed attempts - ${name}`, async ({ page, authMockState }) => {
      const loginPage = new LoginPage(page);
      const accountPage = new AccountPage(page);
      const navbar = new Navbar(page);


      await loginPage.goto();
      // pre-check       
      await loginPage.isErrorHidden();
      await navbar.expectNoActiveItem();
      await loginPage.isOnThisPage()

      for (let i = 0; i < numberOfRepetitions; i++) {
         
        // action
        authMockState.loginSuccess = false;
        await loginPage.fullLogin(invalidUsername, invalidPassword);
        //results
        await loginPage.isOnThisPage();
        await loginPage.isErrorVisible();
        await navbar.expectNoActiveItem();
      }
      // action - login with valid credentials
      authMockState.loginSuccess = true;
      await loginPage.fullLogin(validUsername, validPassword);
      //results
      await accountPage.isOnThisPage();
      await accountPage.expectUsernameInWelcome(validUsername);
      await navbar.expectActiveItem(Navbar.Items.Account);


    });
  });
});



test.describe('Login:should stay on login page when navigating to account while not logged in', () => {
  test('Login: Navigation - login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const navbar = new Navbar(page);

    await loginPage.goto();
    // pre-check
    await navbar.expectNoActiveItem();
    await loginPage.isErrorHidden();
    // action
    await navbar.navigateTo(Navbar.Items.Account);
    //results
    await loginPage.isOnThisPage();
    await navbar.expectNoActiveItem();
    await loginPage.isErrorHidden();

  });
});


// App uses client-side authentication (localStorage)
test.skip('Login:should return correct status code for login request (no backend yet)', () => {
  restLoginData.forEach(({ name, username, password, expectedStatus  }) => {
    test(`Login: Authentication API' - ${name}`, async ({ page, authMockState }) => {
      const loginPage = new LoginPage(page);
      const navbar = new Navbar(page);


      await loginPage.goto();

      // pre-check
      await navbar.expectNoActiveItem();
      await loginPage.isErrorHidden();

      // action
      await loginPage.enterUsername(username);
      await loginPage.enterPassword(password);

      if (expectedStatus === 200) {
        authMockState.loginSuccess = true;
      } else {
        authMockState.loginSuccess = false;
      }

      const result = await loginPage.loginAndGetResponse();

      //results
      // request
      expect(result.sent).toBe(true)
      // response
      expect(result.status).toBe(expectedStatus);

    });
  });
});