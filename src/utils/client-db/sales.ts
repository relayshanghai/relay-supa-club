import type { SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';

export type SalesType = {
    campaign_id: string;
    company_id: string;
    amount: number;
};

export type RowType = {
    amount: number;
};

export const addSales = (db: SupabaseClient<DatabaseWithCustomTypes>) => async (body: SalesType) => {
    const { error } = await db.from('sales').insert(body);

    if (error) {
        throw 'Error inserting sales data: ' + error.message;
    }
};

export const getSales = (db: SupabaseClient<DatabaseWithCustomTypes>) => async (companyId: string) => {
    if (companyId.length <= 0) throw 'Company ID missing!';

    const { data, error } = await db.from('sales').select('amount').eq('company_id', companyId);

    if (error) {
        throw 'Error getting sales data' + error.message;
    }

    const totalAmount = data.reduce((sum: number, row: RowType) => sum + row.amount, 0);

    return totalAmount;
};

export const deleteSales = (db: SupabaseClient<DatabaseWithCustomTypes>) => async (companyId: string) => {
    if (companyId.length <= 0) throw 'Company ID missing!';

    const { error } = await db.from('sales').delete().eq('company_id', companyId);

    if (error) {
        throw 'Error deleting sales data: ' + error.message;
    }

    return 'Sales data deleted successfully.';
};
