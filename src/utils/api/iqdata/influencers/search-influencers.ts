import { apiFetch } from '../api-fetch';
import type { CreatorSearchResult } from 'types';
import { SearchInfluencersPayload } from './search-influencers-payload';
import type { z } from 'zod';

export const searchInfluencers = async (payload: z.input<typeof SearchInfluencersPayload>) => {
    const parsedPayload = SearchInfluencersPayload.parse(payload);

    const response = await apiFetch<CreatorSearchResult>('/search/newv1', parsedPayload, {
        method: 'POST',
    });

    return response;
};
