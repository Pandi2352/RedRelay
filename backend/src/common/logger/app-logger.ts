import { Logger } from '@nestjs/common';

/**
 * Standard reusable logger wrapper ensuring consistent logging format with context and metadata.
 */
export class AppLogger {
  private readonly nestLogger: Logger;

  constructor(private readonly context: string) {
    this.nestLogger = new Logger(context);
  }

  log(message: string, meta?: Record<string, unknown>): void {
    if (meta && Object.keys(meta).length > 0) {
      this.nestLogger.log(`${message} ${JSON.stringify(meta)}`);
    } else {
      this.nestLogger.log(message);
    }
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    if (meta && Object.keys(meta).length > 0) {
      this.nestLogger.warn(`${message} ${JSON.stringify(meta)}`);
    } else {
      this.nestLogger.warn(message);
    }
  }

  error(message: string, trace?: string, meta?: Record<string, unknown>): void {
    const metaStr = meta && Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    this.nestLogger.error(`${message}${metaStr}`, trace);
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    if (meta && Object.keys(meta).length > 0) {
      this.nestLogger.debug(`${message} ${JSON.stringify(meta)}`);
    } else {
      this.nestLogger.debug(message);
    }
  }
}

/** Convenience factory for obtaining an AppLogger instance. */
export function createLogger(context: string): AppLogger {
  return new AppLogger(context);
}
