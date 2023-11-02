import type { SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';
import type { SearchParameters } from '../types';

export const insertSearchParameters =
    (db: SupabaseClient<DatabaseWithCustomTypes>) =>
    async (data: SearchParameters['Insert']): Promise<SearchParameters['Row']> => {
        const result = await db
            .from('search_parameters')
            .upsert(data, {
                onConflict: 'hash',
            })
            .select()
            .single();

        if (result.error) {
            throw result.error;
        }

        return result.data;
    };

export const getSearchParameterByHash =
    (db: SupabaseClient<DatabaseWithCustomTypes>) =>
    async (hash: string): Promise<SearchParameters['Row'] | null> => {
        const result = await db.from('search_parameters').select().eq('hash', hash).maybeSingle();

        if (result.error) {
            throw result.error;
        }

        return result.data;
    };

export const getOrInsertSearchParameter =
    (db: SupabaseClient<DatabaseWithCustomTypes>) =>
    async (data: SearchParameters['Insert']): Promise<SearchParameters['Row']> => {
        const { hash } = data;

        const row = await getSearchParameterByHash(db)(hash);

        if (row) return row;

        return await insertSearchParameters(db)({
            hash,
            data: data,
        });
    };
