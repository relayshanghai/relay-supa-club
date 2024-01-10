import type { SaveSearchResultsBody } from 'pages/api/save-search-results';
import type { SearchTableInfluencer } from 'types';
import { apiFetch } from './api/api-fetch';

export const saveSearchResults = async (influencers: SearchTableInfluencer[]) =>
    await apiFetch<void, SaveSearchResultsBody>('save-search-results', {
        influencers,
    });
