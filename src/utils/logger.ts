/* eslint-disable no-console */

const parseError = (error: any) => {
    if (error && 'message' in error) {
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
    console[level](parseError(message));
};

/**
 * TODO: replace with a proper logger library
 */
export const serverLogger = (message: any, level: LogLevel = 'log') => {
    console[level](parseError(message));
};
