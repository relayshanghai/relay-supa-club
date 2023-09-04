import * as Sentry from '@sentry/nextjs';
import { isUnknownError } from './is-api-error';
import { parseError } from './utils';

export type LogLevel = 'log' | 'info' | 'error' | 'warn';

/**
 * TODO: send server logs to rudderstack https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/295
 */
export const serverLogger = (message: any, level: LogLevel = 'log', sendToSentry = false, title?: string) => {
    if (level === 'error' && sendToSentry) {
        // if the error is just a string, we need to wrap it in an Error object so we can get a stack trace
        title
            ? Sentry.withScope((scope) => {
                  scope.setExtra('additionalData', message); // Add additional data
                  Sentry.captureMessage(title); // Send the error with additional data to Sentry
              })
            : Sentry.captureException(typeof message === 'string' ? new Error(message) : new Error(title, message));
    }
    // eslint-disable-next-line no-console
    console[level](parseError(message));
};

export const logError = (message: unknown) => {
    if (isUnknownError(message)) {
        message = JSON.stringify(message)
    }

    Sentry.captureException(message)

    // eslint-disable-next-line no-console
    console.error(message)
}

export const log = (message: unknown) => {
    if (isUnknownError(message)) {
        message = JSON.stringify(message)
    }

    // eslint-disable-next-line no-console
    console.log(message)
}
