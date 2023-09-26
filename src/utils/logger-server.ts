import * as Sentry from '@sentry/nextjs';
import { isUnknownError } from './is-api-error';

export type LogLevel = Sentry.SeverityLevel;

type CaptureContext = Parameters<typeof Sentry.captureException>[1];

const isLogLevel = (value: any): value is LogLevel => {
    return ['fatal', 'error', 'warning', 'log', 'info', 'debug'].includes(value);
};

export const logError = (message: unknown, captureContext?: CaptureContext) => {
    Sentry.captureException(message, captureContext);

    // eslint-disable-next-line no-console
    console.error(message);
};

export const log = (message: unknown) => {
    // eslint-disable-next-line no-console
    console.log(message);
};

/**
 * Logs a message to server
 *
 * @desc
 * Logs a message to the server's console.
 * In production, messages logged will be sent to Sentry as an error.
 * This prevents us from using `serverLogger` as a replacement to `console.log`.
 * This also pushes us to promote the use of Sentry and will allow us to
 * debug errors better.
 *
 * Adding a `serverLogger` means it is your intent to push that message
 * to the server logs which in production should mean Sentry.
 *
 * The second parameter accepts a `Sentry.SeverityLevel` type.
 * Only severity levels with type `error` are logged to Sentry
 *
 * The second parameter also accepts a `CaptureContext` type.
 * This type can either be:
 *
 * - a `Scope` type
 * - a `ScopeContext` type
 * - or a function that accepts a `Scope` object and returns a `Scope` object
 * ```ts
 * (scope: Scope) => Scope
 * ```
 *
 * This allows you to customize the scope of the message that is to be logged.
 *
 * The **Scope** contains the data for identifying and defining the boundaries of the problem.
 *
 * For better understanding, you can read Sentry's documentation
 * via the links that are added below for your convenience.
 *
 * ---
 * If you still want to push into production a `serverLogger` call without sending to Sentry,
 * you can do the following
 * @example
 * ```ts
 * serverLogger(message, 'log')
 * ```
 *
 * ---
 * Passing contexts (`ScopeContext` type)
 * @example
 * ```ts
 * Sentry.captureException(new Error("something went wrong"), {
 *    tags: {
 *      section: "articles",
 *    },
 *  });
 * ```
 * Allowed context keys: `tags`, `extra`, `contexts`, `user`, `level`, `fingerprint`.
 *
 * ---
 * For passing custom-valued contexts
 * @example
 * ```ts
 * Sentry.captureException(new Error("something went wrong"), (scope) => {
 *      scope.setExtras({
 *          'whatever-key': whateverValue
 *      })
 * });
 * ```
 *
 * ---
 * For customizing the Scope
 * @example
 * ```ts
 * Sentry.captureException(new Error("something went wrong"), (scope) => {
 *      // ...do something with the `scope`
 * });
 * ```
 *
 * ---
 * For more info regarding Scopes
 * @see https://docs.sentry.io/platforms/node/enriching-events/scopes/
 *
 * ---
 * For more info about how you can passing the context
 * @see https://docs.sentry.io/platforms/node/enriching-events/context/#passing-context-directly
 *
 * ---
 * For `CaptureContext` type
 * @see https://github.com/getsentry/sentry-javascript/blob/master/packages/types/src/scope.ts#L15
 *
 * ---
 * For `Scope` type
 * @see https://github.com/getsentry/sentry-javascript/blob/master/packages/types/src/scope.ts#L33
 *
 * These `types`` are also currently available in your editor by jumping to the
 * [type definition](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-type-definition)
 *
 * ---
 * @todo send server logs to rudderstack https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/295
 */
export const serverLogger = (message: unknown, captureContext?: LogLevel | CaptureContext) => {
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
