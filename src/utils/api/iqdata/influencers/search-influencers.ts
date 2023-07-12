import type { CreatorSearchResult, SearchResultMetadata } from 'types';
import { apiFetch } from '../../api-fetch';
import { headers } from 'src/utils/api/iqdata/constants';
import { SearchInfluencersPayload } from './search-influencers-payload';
import type { z } from 'zod';

export const searchInfluencers = async (payload: z.input<typeof SearchInfluencersPayload>) => {
    const parsedPayload = SearchInfluencersPayload.parse(payload);

    const response = await apiFetch<CreatorSearchResult & SearchResultMetadata>(
        'https://socapi.icu/v2.0/api/search/newv1',
        parsedPayload,
        {
            method: 'POST',
            headers,
        },
    );

    return response;
};
