import * as Sentry from '@sentry/nextjs';
import { isUnknownError } from './is-api-error';

export type LogLevel = Sentry.SeverityLevel;

const isLogLevel = (value: any): value is LogLevel => {
    return ['fatal', 'error', 'warning', 'log', 'info', 'debug'].includes(value);
};

export const logError = (message: unknown, captureContext?: Parameters<typeof Sentry.captureException>[1]) => {
    Sentry.captureException(message, captureContext);

    // eslint-disable-next-line no-console
    console.error(message);
};

export const log = (message: unknown) => {
    // eslint-disable-next-line no-console
    console.log(message);
};

/**
 * TODO: send server logs to rudderstack https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/295
 */
export const serverLogger = (message: unknown, captureContext?: LogLevel | Parameters<typeof logError>[1]) => {
    if (isUnknownError(message)) {
        message = JSON.stringify(message);
    }

    let level = 'error';

    if (isLogLevel(captureContext)) {
        level = captureContext;
        captureContext = undefined;
    }

    if (!isLogLevel(captureContext) && level === 'error') {
        return logError(message, captureContext);
    }

    return log(message);
};
