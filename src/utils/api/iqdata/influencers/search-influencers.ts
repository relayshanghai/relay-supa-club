import type { CreatorSearchResult, SearchResultMetadata } from 'types';
import type { z } from 'zod';
import type { ServerContext } from '..';
import { withServerContext } from '..';
import { apiFetch } from '../api-fetch';
import { SearchInfluencersPayload } from './search-influencers-payload';

type SearchInfluencersPayloadInput = z.input<typeof SearchInfluencersPayload>;

export const searchInfluencers = async (payload: SearchInfluencersPayloadInput, context?: ServerContext) => {
    // set type since passthrough breaks the typing
    const parsedPayload: z.infer<typeof SearchInfluencersPayload> =
        SearchInfluencersPayload.passthrough().parse(payload);

    const response = await apiFetch<
        CreatorSearchResult & SearchResultMetadata,
        SearchInfluencersPayloadInput & { context?: ServerContext }
    >('/search/newv1', { ...parsedPayload, context }, { method: 'POST' });

    return response.content;
};

export const searchInfluencersWithContext = withServerContext(searchInfluencers);
