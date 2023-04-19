import type { CacheGet, CacheSet, CacheDelete, CacheClient } from '@gomomento/sdk';
import type { CacheInterface } from '../types';

export class Momento implements CacheInterface<Momento> {
    protected client: CacheClient;
    protected cacheName: string;

    constructor(client: CacheClient, cacheName = 'cache') {
        this.client = client;
        this.cacheName = cacheName;
    }

    async createCache() {
        this.client.createCache(this.cacheName);
        return this;
    }

    async save(key: string, data: any): Promise<CacheSet.Response | null> {
        await this.createCache();
        const result = await this.client.set('cache', key, data);
        return result;
    }

    async get(key: string): Promise<CacheGet.Response | null> {
        await this.createCache();
        const result = await this.client.get('cache', key);
        return result;
    }

    async remove(key: string): Promise<CacheDelete.Response> {
        await this.createCache();
        const result = await this.client.delete('cache', key);
        return result;
    }
}
