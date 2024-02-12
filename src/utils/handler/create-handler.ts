import type { NextApiResponse } from 'next';
import { createErrorObject } from '../api-handler';
import type { RelayApiRequest } from '../api-handler';
import httpCodes from 'src/constants/httpCodes';
import { getHandlerMetadata } from './decorators/api-decorator';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { RelayDatabase } from '../api/db';
import awaitToError from '../await-to-error';
import type { HttpError } from '../error/http-error';
import { nanoid } from 'nanoid';
import { serverLogger } from '../logger-server';
import { RequestContext } from '../request-context/request-context';
import { getHostnameFromRequest } from '../get-host';
import { db } from '../database';
import { companies, profiles } from 'drizzle/schema';
import { eq } from 'drizzle-orm';

export const createHandler = (target: new () => any) => {
    const instance = new target();
    return async (req: RelayApiRequest, res: NextApiResponse) => {
        const handlerStr = getHandlerMetadata(instance, req.method as string);
        if (handlerStr === undefined) {
            return res.status(httpCodes.METHOD_NOT_ALLOWED).json({ message: 'Method not allowed' });
        }
        req.supabase = createServerSupabaseClient<RelayDatabase>({ req, res });
        const [error, resp] = await awaitToError<HttpError>(
            RequestContext.startContext(async () => {
                const { appUrl } = getHostnameFromRequest(req);
                RequestContext.setContext({ request: req, requestUrl: appUrl });
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
                }
                const data = await instance[handlerStr].apply(this, [req, res]);
                return data;
            }),
        );
        if (error) {
            const tag = nanoid(6);
            const e = createErrorObject(error, tag);

            serverLogger(error, (scope) => {
                return scope.setTag('error_code_tag', e.tag);
            });

            return res.status(e.httpCode).json(error);
        }
        return res.status(httpCodes.OK).json(resp);
    };
};
