import { apiFetch } from '../api-fetch';
import type { CreatorSearchResult } from 'types';
import { SearchInfluencersPayload } from './search-influencers-payload';
import type { z } from 'zod';

export const searchInfluencers = async (
    accountInfo: { company_id: string; user_id: string },
    payload: z.input<typeof SearchInfluencersPayload>,
) => {
    const parsedPayload = SearchInfluencersPayload.parse(payload);
    const response = await apiFetch<CreatorSearchResult>('/search/newv1', accountInfo, parsedPayload, {
        method: 'POST',
    });

    return response;
};
