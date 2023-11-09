import type { CreatorPlatform, CreatorSearchByUsernameResult, CreatorSearchResult, SearchResultMetadata } from 'types';
import type { z } from 'zod';
import type { ServerContext } from '..';
import { withServerContext } from '..';
import { apiFetch } from '../api-fetch';
import { SearchInfluencersPayload } from './search-influencers-payload';

export type SearchInfluencersListPayloadInput = {
    username: string;
    platform: CreatorPlatform;
};

export type SearchInfluencersListPayloadQuery = {
    q: string;
    type: 'topic-tags' | 'search' | 'lookalike';
    platform: CreatorPlatform;
    limit: string;
};

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

export const searchInfluencersList = async (payload: SearchInfluencersListPayloadInput, context?: ServerContext) => {
    const { username, platform } = payload;

    const response = await apiFetch<
        CreatorSearchByUsernameResult & SearchResultMetadata,
        { query: SearchInfluencersListPayloadQuery } & { context?: ServerContext }
    >(
        `/dict/users?${new URLSearchParams({ q: username, type: 'topic-tags', platform, limit: '1' })}`,
        { query: { q: username, type: 'topic-tags', platform, limit: '1' }, context },
        { method: 'GET' },
    );

    return response.content;
};

export const searchInfluencersWithContext = withServerContext(searchInfluencers);

export const searchInfluencersListWithContext = withServerContext(searchInfluencersList);
