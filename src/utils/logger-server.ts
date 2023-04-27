import * as Sentry from '@sentry/nextjs';
import { parseError } from './utils';

export type LogLevel = 'log' | 'info' | 'error' | 'warn';

/**
 * TODO: send server logs to rudderstack https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/295
 */
export const serverLogger = (message: any, level: LogLevel = 'log', sendToSentry = false) => {
    if (level === 'error' && sendToSentry) {
        // if the error is just a string, we need to wrap it in an Error object so we can get a stack trace
        Sentry.captureException(typeof message === 'string' ? new Error(message) : message);
    }
    // eslint-disable-next-line no-console
    console[level](parseError(message));
};
