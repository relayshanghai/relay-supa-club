import type { ApiPayload } from '../types';
import { IQDATA_URL } from '.';
import { headers } from 'src/utils/api/iqdata/constants';
import { apiFetch as apiFetchOriginal } from '../api-fetch';
import { logDailyTokensError, logRateLimitError } from '../slack/handle-alerts';
import { forensicTrack } from '../forensicTrack';

/**
 * For fetching IQData API
 */
export const apiFetch = async <T extends object>(url: string, payload: ApiPayload, options: RequestInit = {}) => {
    const { context, ...strippedPayload } = payload;
    const content = await apiFetchOriginal<T>(IQDATA_URL + url, strippedPayload, {
        ...options,
        headers,
    });

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
