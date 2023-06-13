import type { CreatorSearchResult } from 'types';
import { apiFetch } from '../../api-fetch';
import { headers } from 'src/utils/api/iqdata/constants';
import { SearchInfluencersPayload } from './search-influencers-payload';

export const searchInfluencers = async (payload: SearchInfluencersPayload) => {
    SearchInfluencersPayload.parse(payload);

    const response = await apiFetch<CreatorSearchResult>('https://socapi.icu/v2.0/api/search/newv1', payload, {
        method: 'POST',
        headers,
    });

    return response;
};
