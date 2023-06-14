import type { DatabaseWithCustomTypes } from 'types';
import type { CompanyDB } from '../../types';
import type { SupabaseClient } from '@supabase/supabase-js';

export const addCompanyCategory =
    (db: SupabaseClient<DatabaseWithCustomTypes>) => async (company: CompanyDB, category: string) => {
        const { data, error } = await db
            .from('company_categories')
            .insert({
                company_id: company.id,
                category,
            })
            .select();

        if (error) {
            throw error;
        }

        return data;
    };
