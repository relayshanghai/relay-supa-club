import { DataSource } from './data-source';
import { generatePlatformID } from './utils';
import { createKey } from './cache/utils';
import { server } from 'src/mocks/server';

jest.setTimeout(10000);

describe('Data Source', () => {
    // @note: too noisy, suppress temporarily
    beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));

    test('should search "hami korean" and first item should match generated social-platform-id', async () => {
        const datasource = new DataSource();
        const searchResults = await datasource.searchInfluencers('hami korean', { platform: 'youtube' });
        const socialPlatformId = generatePlatformID(searchResults.accounts[0].account.user_profile.user_id, 'youtube');
        const influencer = await datasource.getInfluencer(socialPlatformId);

        expect(influencer?.user_profile?.user_id).toBe(searchResults.accounts[0].account.user_profile.user_id);
    });

    test('should search "hami korean" and cache the influencer data', async () => {
        const datasource = new DataSource().withCache();
        const searchResults = await datasource.searchInfluencers('hami korean', { platform: 'youtube' });
        const socialPlatformId = generatePlatformID(searchResults.accounts[0].account.user_profile.user_id, 'youtube');
        const influencer = await datasource.getInfluencer(socialPlatformId);

        // manually get cache item
        const key = createKey(socialPlatformId, datasource.getSourceName(), 'getInfluencer');
        const cacheItem = await datasource.getCache().get(key);
        const isDeleted = await datasource.getCache().remove(key);

        expect(isDeleted).toBe(1);
        expect(cacheItem).not.toBeNull();
        expect(influencer?.user_profile?.user_id).toBe(searchResults.accounts[0].account.user_profile.user_id);
    });
});
