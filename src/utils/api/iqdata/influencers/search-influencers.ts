/* eslint-disable no-console */
// TODO: Fix all eslint warnings
import type { z } from 'zod';
import type { CreatorSearchResult, SearchResultMetadata } from 'types';
import { apiFetch } from '../api-fetch';
import { SearchInfluencersPayload } from './search-influencers-payload';
import { limiter } from 'src/utils/limiter';
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

export const bulkSearchInfluencers = async (payloads: SearchInfluencersPayload[]) => {
    const searchInfluencersPromises = payloads.map((payload) => limiter.schedule(() => searchInfluencers(payload)));
    const searchInfluencersResults = await Promise.all(searchInfluencersPromises);
    console.log('searchInfluencersResults :>> ', searchInfluencersResults);
    const flattenedAccounts = searchInfluencersResults
        .map((result) => result.accounts.map((creator) => creator.account))
        .flat();
    const uniqueInfluencers = flattenedAccounts.filter(
        (currentAccount, index, self) =>
            self.findIndex((account) => account.user_profile.user_id === currentAccount.user_profile.user_id) === index,
    );

    return uniqueInfluencers;
};
