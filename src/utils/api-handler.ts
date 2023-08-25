import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger-server';
import { ZodError } from 'zod';

export type ApiError = { error: any };

export type ApiHandlerParams = {
    getHandler?: NextApiHandler;
    postHandler?: NextApiHandler;
    deleteHandler?: NextApiHandler;
    putHandler?: NextApiHandler;
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

const isJsonable = (error: any) => {
    return (
        !(error instanceof Error) && error !== null && typeof error === 'object' && error.constructor.name === 'Object'
    );
};

const createErrorObject = (error: any) => {
    const e: {
        httpCode: number;
        message: any;
    } = {
        httpCode: httpCodes.INTERNAL_SERVER_ERROR,
        message: 'Unknown Error',
    };

    if (error instanceof Error) {
        e.message = error.message;
    }

    if (error instanceof ZodError) {
        e.message = error.issues;
    }

    if (error instanceof RelayError) {
        e.httpCode = error.httpCode;
        e.message = error.message;
    }

    if (typeof error === 'string') {
        e.message = error;
    }

    if (isJsonable(error)) {
        e.message = JSON.stringify(error);
    }

    // Hide server errors if not in development
    if (e.httpCode >= 500 && process.env.NODE_ENV !== 'development') {
        e.message = 'Error occurred';
    }

    return e;
};

export const exceptionHandler = <T = any>(fn: NextApiHandler<T>) => {
    return async (req: NextApiRequest, res: NextApiResponse<T | ApiError>) => {
        try {
            await fn(req, res);
        } catch (error) {
            // if it's a RelayError, allow silencing the log
            if (error instanceof RelayError && error.shouldLog) {
                serverLogger(error, 'error', error.sendToSentry);
            }

            // if it's not a RelayError, log it by default
            if (!(error instanceof RelayError)) {
                serverLogger(error, 'error');
            }

            const e = createErrorObject(error);

            return res.status(e.httpCode).json({ error: e.message });
        }
    };
};

export const ApiHandler =
    <T = any>(params: ApiHandlerParams) =>
    async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method === 'GET' && params.getHandler !== undefined) {
            return await exceptionHandler<T>(params.getHandler)(req, res);
        }

        if (req.method === 'POST' && params.postHandler !== undefined) {
            return await exceptionHandler<T>(params.postHandler)(req, res);
        }
        if (req.method === 'PUT' && params.putHandler !== undefined) {
            return await exceptionHandler<T>(params.putHandler)(req, res);
        }

        if (req.method === 'DELETE' && params.deleteHandler !== undefined) {
            return await exceptionHandler<T>(params.deleteHandler)(req, res);
        }

        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({
            error: 'Method not allowed',
        });
    };
