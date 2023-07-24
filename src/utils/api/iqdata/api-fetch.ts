import type { ApiPayload } from '../types';
import { IQDATA_URL } from '.';
import { headers } from 'src/utils/api/iqdata/constants';
import { apiFetch as apiFetchOriginal } from '../api-fetch';
import { logDailyTokensError, logRateLimitError } from '../slack/handle-alerts';
import { getUserSession } from '../analytics';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { DatabaseWithCustomTypes } from 'types';

export const apiFetch = async <T extends object>(url: string, payload: ApiPayload, options: RequestInit = {}) => {
    const { context, ...strippedPayload } = payload;
    const content = await apiFetchOriginal<T>(IQDATA_URL + url, strippedPayload, {
        ...options,
        headers,
    });

    if (!context) {
        throw new Error('No Context Provided!');
    }

    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>(context);
    const { user_id, company_id } = await getUserSession(supabase)();
    if (content && 'status' in content && 'error' in content) {
        if (content.status === 429) {
            logRateLimitError(url, { user_id, company_id });
        }
        if (content.error === 'daily_tokens_limit_exceeded') {
            logDailyTokensError(url, { user_id, company_id });
        }
    }
    return content;
};
