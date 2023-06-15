import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger-server';

export type ApiHandlerParams = {
    getHandler?: NextApiHandler;
    postHandler?: NextApiHandler;
    deleteHandler?: NextApiHandler;
};

export type RelayErrorOptions = {
    shouldLog?: boolean;
    sendToSentry?: boolean;
};

export class RelayError extends Error {
    readonly _httpCode: number;
    readonly _shouldLog: boolean;
    readonly _sendToSentry: boolean;

    constructor(msg: string, httpCode = httpCodes.INTERNAL_SERVER_ERROR, options?: RelayErrorOptions) {
        super(msg);
        this._httpCode = httpCode;
        this._shouldLog = options?.shouldLog || true; // log to server by default
        this._sendToSentry = !!options?.sendToSentry && process.env.NODE_ENV !== 'development'; // Don’t send to sentry unless explicitly set in options, and only in production
    }

    get httpCode() {
        return this._httpCode;
    }

    get shouldLog() {
        return this._shouldLog;
    }

    get sendToSentry() {
        return this._sendToSentry;
    }
}

export const exceptionHandler = <T = any>(fn: NextApiHandler<T>) => {
    return async (req: NextApiRequest, res: NextApiResponse<T | { error: string }>) => {
        try {
            await fn(req, res);
        } catch (error) {
            const e = {
                httpCode: httpCodes.INTERNAL_SERVER_ERROR,
                message: 'Unknown Error',
            };

            if (error instanceof Error) {
                e.message = error.message;
            }

            if (error instanceof RelayError) {
                e.httpCode = error.httpCode;
                e.message = error.message;

                // if it's a RelayError, allow silencing the log
                if (error.shouldLog) serverLogger(error, 'error', error.sendToSentry);
            }

            if (typeof error === 'string') {
                e.message = error;
            }

            if (error !== null && typeof error === 'object' && error.constructor.name === 'Object') {
                e.message = JSON.stringify(error);
            }

            // Hide server errors if not in development
            if (e.httpCode >= 500 && process.env.NODE_ENV !== 'development') {
                e.message = 'Error occurred';
            }

            // if it's not a RelayError, log it by default
            if (!(error instanceof RelayError)) {
                serverLogger(error, 'error');
            }

            return res.status(e.httpCode).json({ error: e.message });
        }
    };
};

export const ApiHandler =
    <T = any>(params: ApiHandlerParams) =>
    async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method === 'GET' && params.getHandler !== undefined) {
            return await exceptionHandler<T>(params.getHandler)(req, res);
            // return await params.getHandler(req, res);
        }

        if (req.method === 'POST' && params.postHandler !== undefined) {
            return await exceptionHandler<T>(params.postHandler)(req, res);
        }

        if (req.method === 'DELETE' && params.deleteHandler !== undefined) {
            return await exceptionHandler<T>(params.deleteHandler)(req, res);
        }

        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({
            error: 'Method not allowed',
        });
    };
