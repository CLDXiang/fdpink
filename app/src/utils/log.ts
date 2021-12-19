/* eslint-disable @typescript-eslint/no-explicit-any */
const IS_PRODUCTION_ENV = process.env.NODE_ENV === 'production';

export class Logger {
  constructor(private prefix = '') {}

  log(...args: any[]) {
    if (IS_PRODUCTION_ENV) return;
    console.log(this.prefix, ...args);
  }

  error(...args: any[]) {
    if (IS_PRODUCTION_ENV) return;
    console.error(this.prefix, ...args);
  }

  warn(...args: any[]) {
    if (IS_PRODUCTION_ENV) return;
    console.warn(this.prefix, ...args);
  }

  info(...args: any[]) {
    if (IS_PRODUCTION_ENV) return;
    console.info(this.prefix, ...args);
  }
}

export default new Logger();
