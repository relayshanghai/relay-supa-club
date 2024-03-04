import { kv, createClient } from '@vercel/kv';
import type { Nullable } from 'types/nullable';

export default class KVService {
    static service: KVService = new KVService();
    static getService(): KVService {
        return KVService.service;
    }
    kv = createClient({
        token: process.env.KV_REST_API_TOKEN || '',
        url: process.env.KV_REST_API_URL || '',
    });
    async get<T>(key: string): Promise<Nullable<T>> {
        const data = await kv.get<T>(key);
        return data || undefined;
    }

    async set<T>(key: string, value: T): Promise<void> {
        await kv.set<T>(key, value);
    }

    async delete(key: string): Promise<void> {
        await kv.del(key);
    }
}
