/* eslint-disable no-console */

import * as Sentry from '@sentry/nextjs';

export type LogLevel = 'log' | 'info' | 'error' | 'warn';
/**
 * TODO: replace with a proper logger library
 */
export const clientLogger = (message: any, level: Sentry.SeverityLevel = 'log') => {
    if (level === 'error') {
        Sentry.captureException(message);
    } else {
        Sentry.captureMessage(message, level);
    }
};

/**
 * TODO: replace with a proper logger library
 */
export const serverLogger = (message: any, level: Sentry.SeverityLevel = 'log') => {
    if (level === 'error') {
        Sentry.captureException(message);
    } else {
        Sentry.captureMessage(message, level);
    }
};
