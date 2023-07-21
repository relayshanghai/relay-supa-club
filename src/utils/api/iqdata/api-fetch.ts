import type { ApiPayload } from '../types';
import { IQDATA_URL } from '.';
import { headers } from 'src/utils/api/iqdata/constants';

import { apiFetch as apiFetchOriginal } from '../api-fetch';

export const apiFetch = async <T = any>(url: string, payload: ApiPayload, options: RequestInit = {}) => {
    const content = await apiFetchOriginal<T>(IQDATA_URL + url, payload, {
        ...options,
        headers,
    });
    return content;
};
