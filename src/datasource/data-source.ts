import type { CacheInterface, DataSourceCacheDrivers } from './cache/types';
import { CachedDataSource } from './cached-data-source';
import { IQDataDriver } from './drivers/iqdata';
import type { DataSourceDrivers, DataSourceInterface } from './types';

export class DataSource<T extends DataSourceDrivers> implements DataSourceInterface<T> {
    protected datasource: DataSourceInterface<T>;

    constructor(_datasource?: DataSourceInterface<T>) {
        this.datasource = _datasource || DataSource.getDefaultDriver();
    }

    withDriver<TDriver extends DataSourceDrivers>(driver: DataSourceInterface<TDriver>) {
        return new DataSource<TDriver>(driver);
    }

    static getDefaultDriver(): DataSourceInterface<IQDataDriver> {
        return new IQDataDriver();
    }

    withCache<C extends DataSourceCacheDrivers>(cache?: CacheInterface<C>) {
        return new CachedDataSource<T, C>(this, cache);
    }

    getDataSource() {
        return this.datasource;
    }

    getSourceName() {
        return this.datasource.getSourceName();
    }

    async getInfluencer(id: Parameters<T['getInfluencer']>[0]) {
        return await this.datasource.getInfluencer(id);
    }

    async searchInfluencers(
        query: Parameters<T['searchInfluencers']>[0],
        filters: Parameters<T['searchInfluencers']>[1],
    ) {
        return await this.datasource.searchInfluencers(query, filters);
    }
}
