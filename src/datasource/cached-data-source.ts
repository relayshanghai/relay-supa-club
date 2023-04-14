import { DataSource } from './data-source';
import type { DataSourceDrivers, DataSourceFilters, DataSourceInterface, SocialPlatformID } from './types';
import { Cache } from './cache/cache';
import type { CacheInterface, DataSourceCacheDrivers } from './cache/types';
import { createKey } from './cache/utils';

export class CachedDataSource<T extends DataSourceDrivers, C extends DataSourceCacheDrivers>
    implements DataSourceInterface<T>
{
    protected datasource: DataSourceInterface<T>;
    protected cache: CacheInterface<C>;

    constructor(_datasource?: DataSourceInterface<T>, _cache?: CacheInterface<C>) {
        this.datasource = _datasource || DataSource.getDefaultDriver();
        this.cache = _cache || Cache.getDefaultDriver();
    }

    getCache() {
        return this.cache;
    }

    getSourceName(): string {
        return this.datasource.getSourceName();
    }

    async getInfluencer(id: SocialPlatformID) {
        const key = createKey(id, this.datasource.getSourceName(), 'getInfluencer');

        // @todo: we will need to create a cache-item type
        let influencer: any = await this.cache.get(key);

        if (!influencer) {
            influencer = await this.datasource.getInfluencer(id);
            await this.cache.save(key, influencer);
        }

        return influencer;
    }

    async searchInfluencers(query: string, filters: DataSourceFilters) {
        return await this.datasource.searchInfluencers(query, filters);
    }
}
