import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger-server';
import type { ZodTypeAny } from 'zod';
import { ZodError, z } from 'zod';
import type { ApiPayload } from './api/types';
import { nanoid } from 'nanoid';
import { setUser } from '@sentry/nextjs';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export type ApiError = { error: any };

// Create a immutable symbol for "key error" for ApiRequest utility type
//
//  Even though you can shape ApiRequests with invalid keys
//
//        export type ApiRequestType = ApiRequest<{
//            foo: { id: string },
//            query: { bar: string }
//        }>
//
// This will enforce the type of the invalid key to this
// ApiRequestKeyError symbol which cannot be recreated
const ApiRequestKeyError = Symbol('Invalid ApiRequest Key Error');

/**
 * Utility type for building request types if you cannot use zod
 */
export type ApiRequest<S extends ApiPayload> = {
    [K in keyof S]: K extends keyof ApiPayload ? S[K] : typeof ApiRequestKeyError;
};

/**
 * Utility function for building zod request objects
 */
export const createApiRequest = <T extends { [k in 'path' | 'query' | 'body']?: ZodTypeAny }>(shape: T) => {
    return z.object(shape);
};

export type ApiResponse<T> = T | ApiError;

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

const createErrorObject = (error: any, tag: string) => {
    const e: {
        httpCode: number;
        message: any;
        tag: string;
    } = {
        httpCode: httpCodes.INTERNAL_SERVER_ERROR,
        message: `Unknown Error - ERR:${tag}`,
        tag,
    };

    if (error instanceof Error) {
        e.message = `${error.message} - ERR:${tag}`;
    }

    if (error instanceof ZodError) {
        e.message = error.issues;
    }

    if (error instanceof RelayError) {
        e.httpCode = error.httpCode;
        e.message = `${error.message} - ERR:${tag}`;
    }

    if (typeof error === 'string') {
        e.message = `${error} - ERR:${tag}`;
    }

    if (isJsonable(error)) {
        const message = JSON.stringify(error);
        e.message = `${message} - ERR:${tag}`;
    }

    // Hide server errors if not in development
    if (e.httpCode >= 500 && process.env.NODE_ENV !== 'development') {
        e.message = `Error occurred - ERR:${tag}`;
    }

    return e;
};

export const exceptionHandler = <T = any>(fn: NextApiHandler<T>) => {
    return async (req: NextApiRequest, res: NextApiResponse<T | ApiError>) => {
        try {
            await fn(req, res);
        } catch (error) {
            const tag = nanoid(6);
            const e = createErrorObject(error, tag);

            serverLogger(error, (scope) => {
                return scope.setTag('error_code_tag', e.tag);
            });

            return res.status(e.httpCode).json({ error: e.message });
        }
    };
};

export const ApiHandler =
    <T = any>(params: ApiHandlerParams) =>
    async (req: NextApiRequest, res: NextApiResponse) => {
        const supabase = createServerSupabaseClient({ req, res });
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (session) {
            setUser({
                id: session.user.id,
                email: session.user.email,
            });
        }

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
