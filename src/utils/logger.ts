import * as Sentry from '@sentry/nextjs';
/* eslint-disable no-console */

const parseError = (error: any) => {
    if (error && error.message) {
        if ('stack' in error) return error;
        return error.message;
    }
    if (typeof error === 'string') return error;
    return JSON.stringify(error);
};
export type LogLevel = 'log' | 'info' | 'error' | 'warn';
/**
 * TODO: replace with a proper logger library
 */
export const clientLogger = (message: any, level: LogLevel = 'log') => {
    if (level === 'error') {
        // if the error is just a string, we need to wrap it in an Error object so we can get a stack trace
        Sentry.captureException(typeof message === 'string' ? new Error(message) : message);
    } else {
        console[level](parseError(message));
    }
};

/**
 * TODO: replace with a proper logger library
 */
export const serverLogger = (message: any, level: LogLevel = 'log') => {
    if (level === 'error') {
        // if the error is just a string, we need to wrap it in an Error object so we can get a stack trace
        Sentry.captureException(typeof message === 'string' ? new Error(message) : message);
    } else {
        console[level](parseError(message));
    }
};
