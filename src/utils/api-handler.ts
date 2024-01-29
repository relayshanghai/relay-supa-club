import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger-server';
import type { ApiError } from 'src/errors/api-error';
import type { ZodTypeAny } from 'zod';
import { ZodError, z } from 'zod';
import type { ApiPayload } from './api/types';
import { nanoid } from 'nanoid';
import { setUser } from '@sentry/nextjs';
import type { Session, SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { RelayError } from 'src/errors/relay-error';
import type { RelayDatabase } from './api/db';
import { db } from './database';
import { companies, profiles } from 'drizzle/schema';
import { eq } from 'drizzle-orm';
import { RequestContext } from './request-context/request-context';
import awaitToError from './await-to-error';
import { UnauthorizedError, type HttpError } from './error/http-error';

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

type RelayApiRequest = NextApiRequest & {
    supabase: SupabaseClient<RelayDatabase>;
    session?: Session;
    profile?: typeof profiles.$inferSelect;
};

export type ActionHandler<TRes = unknown> = (req: RelayApiRequest, res: NextApiResponse<TRes | ApiError>) => void;

export type ApiHandlerParams = {
    getHandler?: NextApiHandler | ActionHandler;
    postHandler?: NextApiHandler | ActionHandler;
    deleteHandler?: NextApiHandler | ActionHandler;
    putHandler?: NextApiHandler | ActionHandler;
    requireAuth?: boolean;
};

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
        httpCode: error.httpCode || httpCodes.INTERNAL_SERVER_ERROR,
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

    return e;
};

const determineHandler = (req: NextApiRequest, params: ApiHandlerParams) => {
    if (req.method === 'GET' && params.getHandler !== undefined) {
        return params.getHandler;
    }

    if (req.method === 'POST' && params.postHandler !== undefined) {
        return params.postHandler;
    }

    if (req.method === 'PUT' && params.putHandler !== undefined) {
        return params.putHandler;
    }

    if (req.method === 'DELETE' && params.deleteHandler !== undefined) {
        return params.deleteHandler;
    }

    return false;
};

/**
 * Replace this with APIHandlerWithContext instead
 * @deprecated
 * @returns
 */
export const ApiHandler = (params: ApiHandlerParams) => async (req: RelayApiRequest, res: NextApiResponse) => {
    req.supabase = createServerSupabaseClient<RelayDatabase>({ req, res });
    const {
        data: { session },
    } = await req.supabase.auth.getSession();
    if (session) {
        req.session = session;
        setUser({
            id: session.user.id,
            email: session.user.email,
        });

        const rows = await db().select().from(profiles).where(eq(profiles.id, req.session.user.id)).limit(1);

        if (rows.length !== 1) {
            const context = { id: req.session.user.id };
            serverLogger('Cannot get profile from session', (scope) => {
                return scope.setContext('User', context);
            });
        }

        req.profile = rows[0];
    }

    const handler = determineHandler(req, params);

    if (handler === false) {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({
            error: 'Method not allowed',
        });
    }

    try {
        return await handler(req, res);
    } catch (error) {
        const tag = nanoid(6);
        const e = createErrorObject(error, tag);

        serverLogger(error, (scope) => {
            return scope.setTag('error_code_tag', e.tag);
        });

        return res.status(e.httpCode).json({ error: e.message });
    }
};
/**
 * handle data of request flow to support request context
 * @param params
 * @returns
 */
export const ApiHandlerWithContext =
    (params: ApiHandlerParams) => async (req: RelayApiRequest, res: NextApiResponse) => {
        const handler = determineHandler(req, params);

        if (handler === false) {
            return res.status(httpCodes.METHOD_NOT_ALLOWED).json({
                error: 'Method not allowed',
            });
        }
        req.supabase = createServerSupabaseClient<RelayDatabase>({ req, res });
        const [error, resp] = await awaitToError<HttpError>(
            RequestContext.startContext(async () => {
                RequestContext.setContext({ request: req });
                const {
                    data: { session },
                } = await req.supabase.auth.getSession();
                if (session) {
                    const [row] = await db()
                        .select()
                        .from(profiles)
                        .fullJoin(companies, eq(companies.id, profiles.company_id))
                        .where(eq(profiles.id, session.user.id))
                        .limit(1);

                    RequestContext.setContext({
                        session,
                        customerId: row?.companies?.cus_id,
                        companyId: row?.companies?.id,
                    });
                    if (!row) {
                        const context = { id: session.user.id };
                        serverLogger('Cannot get profile from session', (scope) => {
                            return scope.setContext('User', context);
                        });
                    }
                } else if (params.requireAuth) {
                    throw new UnauthorizedError('Unauthorized');
                }

                return await handler(req, res);
            }),
        );
        if (error) {
            const tag = nanoid(6);
            const e = createErrorObject(error, tag);

            serverLogger(error, (scope) => {
                return scope.setTag('error_code_tag', e.tag);
            });

            return res.status(e.httpCode).json({ error: e.message });
        }
        return res.status(httpCodes.OK).json(resp);
    };
