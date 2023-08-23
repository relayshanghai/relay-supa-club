import type { z } from 'zod';
import type { CreatorSearchResult, SearchResultMetadata } from 'types';
import { apiFetch } from '../api-fetch';
import { SearchInfluencersPayload } from './search-influencers-payload';
import { RelayError } from 'src/utils/api-handler';
import { withServerContext } from '..';

export const searchInfluencers = async (payload: z.input<typeof SearchInfluencersPayload>) => {
    const parsedPayload = SearchInfluencersPayload.parse(payload);

    const response = await apiFetch<CreatorSearchResult & SearchResultMetadata>('/search/newv1', parsedPayload, {
        method: 'POST',
    });

    if (!response) throw new RelayError('Error searching influencers');

    return response;
};

export const searchInfluencersWithContext = withServerContext(searchInfluencers);
