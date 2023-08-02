import { getUserSession } from './analytics';
import { serverLogger } from '../logger-server';
import callsites from 'callsites';
import type { ServerContext } from './iqdata';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { DatabaseWithCustomTypes } from 'types';

export const forensicTrack = async (context: ServerContext, error: string) => {
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
        };
    });
    const { metadata, ...strippedContext } = context;
    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>(strippedContext);
    const { user_id, company_id, fullname, email } = await getUserSession(supabase)();

    serverLogger({ user_id, company_id, fullname, email, metadata, ...sentryPayload }, 'error', true, error);
};
