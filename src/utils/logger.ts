/* eslint-disable no-console */

const parseError = (error: any) => {
    if (error && 'message' in error) return error.message;
    if (typeof error === 'string') return error;
    return JSON.stringify(error);
};
/**
 * TODO: replace with a proper logger library
 */
export const clientLogger = (
    message: unknown,
    level: 'log' | 'info' | 'error' | 'warn' = 'log'
) => {
    console[level](parseError(message));
};

/**
 * TODO: replace with a proper logger library
 */
export const serverLogger = (
    message: unknown,
    level: 'log' | 'info' | 'error' | 'warn' = 'log'
) => {
    console[level](parseError(message));
};
