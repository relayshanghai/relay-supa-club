import type { ApiPayload } from '../types';
import { IQDATA_URL } from '.';
import { headers } from 'src/utils/api/iqdata/constants';

import { apiFetch as apiFetchOriginal } from '../api-fetch';
import { logRateLimitError } from './rate_limit';

export const apiFetch = async <T extends object>(url: string, payload: ApiPayload, options: RequestInit = {}) => {
    const content = await apiFetchOriginal<T>(IQDATA_URL + url, payload, {
        ...options,
        headers,
    });
    if (content && 'status' in content && content.status === 429) {
        logRateLimitError();
    }
    return content;
};
