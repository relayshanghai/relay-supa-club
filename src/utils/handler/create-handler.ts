import type { NextApiResponse } from 'next';
import { createErrorObject } from '../api-handler';
import type { RelayApiRequest } from '../api-handler';
import httpCodes from 'src/constants/httpCodes';
import { getHandlerMetadata, getStatusCode } from './decorators/api-decorator';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { RelayDatabase } from '../api/db';
import awaitToError from '../await-to-error';
import type { HttpError } from '../error/http-error';
import { nanoid } from 'nanoid';
import { serverLogger } from '../logger-server';
import { RequestContext } from '../request-context/request-context';
import { getHostnameFromRequest } from '../get-host';
import { zhCN } from 'src/constants';
import i18n from 'i18n/index';
import { getAuthMetadata } from './decorators/api-auth-decorator';
import { ProfileRepository } from 'src/backend/database/profile/profile-repository';
import apm from 'src/utils/apm';

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
                const authMetadata = getAuthMetadata(instance, handlerStr);

                if (authMetadata) {
                    await authMetadata.auth(req);
                }
                const language = req.cookies['language'] || zhCN;
                i18n.changeLanguage(language);

                const { appUrl } = getHostnameFromRequest(req);
                RequestContext.setContext({ request: req, requestUrl: appUrl, translation: i18n.t });
                const {
                    data: { session },
                } = await req.supabase.auth.getSession();

                if (session) {
                    const [row] = await ProfileRepository.getRepository().find({
                        where: {
                            id: session.user.id,
                        },
                        relations: {
                            company: true,
                        },
                    });

                    RequestContext.setContext({
                        session,
                        customerId: row?.company?.cusId,
                        companyId: row?.company?.id,
                        profile: row,
                    });
                    if (!row) {
                        const context = { id: session.user.id };
                        serverLogger('Cannot get profile from session', (scope) => {
                            return scope.setContext('User', context);
                        });
                    }
                    apm.setUserContext({
                        email: session.user.email,
                        id: session.user.id,
                        username: row.company?.name || undefined,
                    });
                    apm.setCustomContext(row);
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
            return res.status(e.httpCode).json({
                ...error,
                message: error.message,
            });
        }
        const status = getStatusCode(instance, handlerStr) || 200;
        return res.status(status).json(resp);
    };
};
