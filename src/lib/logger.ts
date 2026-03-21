import pino from 'pino';

/**
 * Structured logging utility using Pino
 * 
 * Log levels (in order of severity):
 * - fatal: Application crash, requires immediate attention
 * - error: Error events that might still allow the app to continue
 * - warn: Warning events, potentially harmful situations
 * - info: Informational messages highlighting progress
 * - debug: Fine-grained debug information
 * - trace: Very detailed debug information
 * 
 * Usage:
 *   logger.info('User logged in', { userId: 123 });
 *   logger.error('Payment failed', { error, orderId });
 *   logger.debug('Cache hit', { key: 'blog:123' });
 */

const LOG_LEVEL = process.env.LOG_LEVEL || 
  (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

// Create logger without transport to avoid worker thread issues with Next.js bundler
// Use JSON output in development, pipe through pino-pretty at runtime if needed
export const logger = pino({
  level: LOG_LEVEL,
  browser: {
    asObject: true
  },
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
});

export default logger;
