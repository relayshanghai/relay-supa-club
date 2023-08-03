import type { CompanyDB, RelayDatabase } from '../types';

export const addCompanyCategory = (db: RelayDatabase) => async (company: CompanyDB, category: string) => {
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
