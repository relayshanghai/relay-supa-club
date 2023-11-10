import { headers } from 'src/utils/api/iqdata/constants';
import { rudderstack } from 'src/utils/rudderstack';
import type { ServerContext } from '.';
import { IQDATA_URL } from '.';
import { apiFetch as apiFetchOriginal } from '../api-fetch';
import { forensicTrack } from '../forensicTrack';
import { logDailyTokensError, logRateLimitError } from '../slack/handle-alerts';
import type { ApiPayload } from '../types';
import { serverLogger } from 'src/utils/logger-server';

/**
 * For fetching IQData API
 */
export const apiFetch = async <TRes = any, TReq extends ApiPayload = any>(
    url: string,
    payload: TReq & { context?: ServerContext },
    options: RequestInit = {},
) => {
    const { context, ...strippedPayload } = payload;
    const content = await apiFetchOriginal<TRes, Omit<TReq, 'context'>>(IQDATA_URL + url, strippedPayload, {
        ...options,
        headers,
    });

    if (context) {
        await rudderstack.identify(context);
        const identity = rudderstack.getIdentity();
        try {
            await rudderstack.send(content);
        } catch (error: unknown) {
            serverLogger(error, (scope) => {
                return scope.setContext('Rudderstack Identity', identity);
            });
        }
    }

    // @note refactor. content should return the Response object itself
    if (context && content && 'status' in content && 'error' in content) {
        if (content.status === 429) {
            logRateLimitError(url, context);
            forensicTrack(context, 'rate_limit_error');
        }
        if (content.error === 'daily_tokens_limit_exceeded') {
            logDailyTokensError(url, context);
            forensicTrack(context, 'daily_tokens_limit_exceeded');
        }
    }
    return content;
};
