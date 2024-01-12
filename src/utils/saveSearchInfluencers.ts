import type { SaveSearchResultsBody } from 'pages/api/save-search-results';
import type { SearchTableInfluencer } from 'types';
import { apiFetch } from 'src/utils/api/api-fetch';

export const saveSearchResults = async (influencers: SearchTableInfluencer[]) =>
    await apiFetch<SaveSearchResultsBody, any>('api/save-search-results', {
        method: 'POST',
        body: influencers,
    });
