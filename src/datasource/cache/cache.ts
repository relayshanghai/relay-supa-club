import { Memory } from './drivers/memory';
import type { CacheInterface, DataSourceCacheDrivers } from './types';

export class Cache<T extends DataSourceCacheDrivers> implements CacheInterface<T> {
    protected cache: CacheInterface<T>;

    constructor(_cache?: CacheInterface<T>) {
        this.cache = _cache || Cache.getDefaultDriver();
    }

    static getDefaultDriver(): CacheInterface<Memory> {
        return new Memory();
    }

    getCache(): CacheInterface<T> {
        return this.cache;
    }

    async save(key: string, data: any) {
        return await this.cache.save(key, data);
    }

    async get(key: string) {
        return await this.cache.get(key);
    }

    async remove(key: string) {
        return await this.cache.remove(key);
    }
}
