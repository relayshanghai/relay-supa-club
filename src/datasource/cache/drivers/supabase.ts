import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';
import type { CacheInterface } from '../types';

type SupabaseCacheItem = { [s: string]: any };

export class Supabase implements CacheInterface<Supabase> {
    protected client: SupabaseClient<DatabaseWithCustomTypes>;

    constructor(client?: SupabaseClient) {
        if (!client) {
            if (!process.env.SUPABASE_API_URL || !process.env.SUPABASE_SERVICE_KEY) {
                throw new Error('Cannot create a supabase client by default');
            }

            client = createClient<DatabaseWithCustomTypes>(
                process.env.SUPABASE_API_URL,
                process.env.SUPABASE_SERVICE_KEY,
            );
        }

        this.client = client;
    }

    async save(key: string, data: any): Promise<SupabaseCacheItem | null> {
        const row = await this.client
            .from('datasource_cache')
            .select()
            .eq('key', key)
            .order('created_at', { ascending: false });

        let upsertData = {};
        const rowData = {
            id: 0,
            key: key,
            data: data,
            updated_at: new Date().toISOString(),
        };

        if (row.data !== null && row.data.length === 1) {
            upsertData = { ...rowData, id: row.data[0].id };
        }

        if (row.data === null || row.data.length !== 1) {
            const { id: _, ...rowDataWithoutId } = rowData;
            upsertData = rowDataWithoutId;
        }

        const result = await this.client.from('datasource_cache').upsert(upsertData).select();

        if (result.error !== null) {
            throw new Error(JSON.stringify(result.error));
        }

        if (result.data.length <= 0) {
            return null;
        }

        return result.data[0].data;
    }

    async get(key: string): Promise<SupabaseCacheItem | null> {
        const result = await this.client
            .from('datasource_cache')
            .select()
            .eq('key', key)
            .order('created_at', { ascending: false });

        if (result.error !== null) {
            throw new Error(JSON.stringify(result.error));
        }

        if (result.data.length <= 0) {
            return null;
        }

        const item = result.data[0];

        // @todo add TTL
        // const staleDate = add(parseISO(item.updated_at), { weeks: 1 });
        // console.log('>', parseISO(item.updated_at), staleDate);

        return item.data;
    }

    async remove(key: string): Promise<number> {
        const result = await this.client
            .from('datasource_cache')
            .delete({
                count: 'estimated',
            })
            .eq('key', key);

        if (result.error !== null) {
            throw new Error(JSON.stringify(result.error));
        }

        return result.count || 0;
    }
}
