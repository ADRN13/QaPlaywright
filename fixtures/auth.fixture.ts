import { test as base } from '@playwright/test';
import { IS_MOCK_ENABLED } from '../config/env';
import { mockLogin, mockLogout } from '../fixtures/authMock';

type AuthMockState = {
  loginSuccess: boolean;
  logoutSuccess: boolean;
};

// NOTE:
// This fixture was designed with future backend communication in mind.
// It provides a structure for mocking authentication-related endpoints
// such as login and logout.
//
// However, the current application operates entirely on the client side
// (using localStorage) and does not perform real API calls.
// Because of that, the mock implementation is only partially utilized
// and serves mainly as a placeholder for future extension.
//
// In a real-world scenario with backend integration, this fixture would
// intercept network requests and simulate server responses accordingly.

export const test = base.extend<{
  authMockState: AuthMockState;
}>({

  //  default state
  authMockState: async ({}, use) => {
    await use({
      loginSuccess: true,
      logoutSuccess: true
    });
  },

  // pseudo-mock - Temporary implementation for client-side auth
  page: async ({ page, authMockState }, use) => {

    if (IS_MOCK_ENABLED) {

      // --- LOGIN --- 
      await mockLogin(page, authMockState.loginSuccess);

      // --- LOGOUT ---
      await mockLogout(page, authMockState.logoutSuccess);
    }

    await use(page);
  }
});

export { expect } from '@playwright/test';