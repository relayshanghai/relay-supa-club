import { headers } from 'src/utils/api/iqdata/constants';
import { rudderstack } from 'src/utils/rudderstack';
import type { ServerContext } from '.';
import { IQDATA_URL } from '.';
import type { ApiPayloadParam } from '../api-fetch';
import { apiFetch as baseApiFetch } from '../api-fetch';
import { forensicTrack } from '../forensicTrack';
import { logDailyTokensError, logRateLimitError } from '../slack/handle-alerts';
import { serverLogger } from 'src/utils/logger-server';
import { nanoid } from 'nanoid';

/**
 * For fetching IQData API
 */
export const apiFetch: typeof baseApiFetch = async <TRes, TReq>(
    url: string,
    payload: ApiPayloadParam<TReq> & { context?: ServerContext },
    options: RequestInit = {},
) => {
    const { context, ...strippedPayload } = payload;
    // @note We cast the stripped payload to fit the shape required by the baseApiFetch
    // since we already know that it omitted the context already on the line above
    const content = await baseApiFetch<TRes, TReq>(IQDATA_URL + url, strippedPayload as ApiPayloadParam<TReq>, {
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
            const errorTag = nanoid();

            logRateLimitError(url, context, errorTag);
            await forensicTrack(context, 'IQData: rate_limit_error', errorTag);
        }
        if (content.error === 'daily_tokens_limit_exceeded') {
            const errorTag = nanoid();

            logDailyTokensError(url, context, errorTag);
            await forensicTrack(context, 'IQData: daily_tokens_limit_exceeded', errorTag);
        }
    }
    return content;
};
