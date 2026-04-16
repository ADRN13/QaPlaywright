
import { IS_LOG_ENABLED } from '../config/env';

export function createLogger(prefix: string) {
  const base = (...args: any[]) => {
    if (IS_LOG_ENABLED) {
      const time = new Date().toISOString();
      console.log(`[${time}] [${prefix}]`, ...args);
    }
  };

  base.error = (...args: any[]) => {
    const time = new Date().toISOString();
    console.error(`[${time}] [ERROR] [${prefix}]`, ...args);
  };

  return base;
}