import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import callsites from 'callsites';
import type { DatabaseWithCustomTypes } from 'types';
import { serverLogger } from '../logger-server';
import { getUserSession } from './analytics';
import type { ServerContext } from './iqdata';
import type { NextApiRequest, NextApiResponse } from 'next';
import { logRateLimitError, logDailyTokensError } from 'src/utils/api/slack/handle-alerts';
import { nanoid } from 'nanoid';

export const forensicTrack = async (context: ServerContext, error: string, uuid: string) => {
    const calls = await callsites();
    const sentryPayload = calls.map((call) => {
        return {
            lineNumber: call.getLineNumber(),
            columnNumber: call.getColumnNumber(),
            evalOrigin: call.getEvalOrigin(),
            fileName: call.getFileName(),
            functionName: call.getFunctionName(),
            function: call.getFunction(),
            method: call.getMethodName(),
            this: call.getThis(),
            typename: call.getTypeName(),
            isConstructor: call.isConstructor(),
            isEval: call.isEval(),
            isNative: call.isNative(),
            isToplevel: call.isToplevel(),
            eventId: uuid,
        };
    });
    const { metadata, ...strippedContext } = context;
    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>(strippedContext);
    const { user_id, company_id, fullname, email } = await getUserSession(supabase)();

    serverLogger(new Error(error), (scope) => {
        return scope.setContext('forensic_track', { user_id, company_id, fullname, email, metadata, ...sentryPayload });
    });
};

export const logIqdataLimits = async (
    res: Response,
    action: string,
    context?: { req: NextApiRequest; res: NextApiResponse },
) => {
    if (res.status.toString().startsWith('2') || !context) {
        return;
    }

    if (res.status === 429) {
        const uuid = nanoid();

        await logRateLimitError(action, context, uuid);
        forensicTrack(context, 'rate_limit_error', uuid);
    }

    const clone = res.clone();
    const json = await clone.json();

    if (json.error === 'daily_tokens_limit_exceeded') {
        const uuid = nanoid();

        await logDailyTokensError(action, context, uuid);
        forensicTrack(context, 'daily_tokens_limit_exceeded', uuid);
    }
};
