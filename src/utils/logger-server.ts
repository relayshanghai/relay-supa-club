import * as Sentry from '@sentry/nextjs';
import { parseError } from './utils';

export type LogLevel = 'log' | 'info' | 'error' | 'warn';

/**
 * TODO: replace with a proper logger library
 */
export const serverLogger = (message: any, level: LogLevel = 'log') => {
    if (level === 'error') {
        // if the error is just a string, we need to wrap it in an Error object so we can get a stack trace
        Sentry.captureException(message?.message ? message : new Error(message));
    } else {
        // eslint-disable-next-line no-console
        console[level](parseError(message));
    }
};
