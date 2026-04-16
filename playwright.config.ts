import { defineConfig } from '@playwright/test';
import { BASE_URL, CURRENT_ENV } from './config/env';

const now = new Date().toISOString().replace(/[:.]/g, '-');

export default defineConfig({
  testDir: './tests',

  use: {
    baseURL:  process.env.BASE_URL || BASE_URL,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  reporter: [
    ['html', { outputFolder: `playwright-report/report-${CURRENT_ENV}-${now}`, open: 'never' }]
  ],
  
  outputDir: `reports/test-results/${CURRENT_ENV}-${now}`,

  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
});
