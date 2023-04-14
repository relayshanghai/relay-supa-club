import type { Supabase } from './drivers/supabase';

export type DataSourceCacheDrivers = Supabase;

export interface CacheInterface<T extends DataSourceCacheDrivers> {
    save(key: string, data: any): Promise<ReturnType<T['save']>> | ReturnType<T['save']>;

    get(key: string): Promise<ReturnType<T['get']>> | ReturnType<T['get']>;

    remove(key: string): Promise<ReturnType<T['remove']>> | ReturnType<T['remove']>;
}
