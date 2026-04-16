type EnvType = 'local' | 'staging' | 'prod';

const ENV = (process.env.ENV as EnvType) ?? 'prod';
const MOCK = process.env.MOCK === 'true';

const URLS: Record<EnvType, string> = {
  local: 'http://localhost:4000/fashionhub/',
  staging: 'https://staging-env/fashionhub/',
  prod: 'https://pocketaces2.github.io/fashionhub/'
};

if (!URLS[ENV]) {
  console.warn(`Invalid ENV: ${ENV}, fallback to prod`);
}
const LOG = process.env.LOG === 'true';

export const IS_LOG_ENABLED = LOG;
export const BASE_URL = URLS[ENV] ?? URLS.prod;
export const IS_MOCK_ENABLED = MOCK;
export const CURRENT_ENV = ENV;
