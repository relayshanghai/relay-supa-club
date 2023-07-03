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
    const { error } = await db.from('sales').insert({
        campaign_id: body.campaign_id,
        company_id: body.company_id,
        amount: body.amount,
    });

    if (error) {
        throw 'Error inserting sales data';
    }
};

export const getSales = (db: SupabaseClient<DatabaseWithCustomTypes>) => async (companyId: string) => {
    if (companyId.length <= 0) throw 'Company ID missing!';

    const { data, error } = await db.from('sales').select('amount').eq('company_id', companyId);

    if (error) {
        throw 'Error getting sales data';
    }

    const totalAmount = data.reduce((sum: number, row: RowType) => sum + row.amount, 0);

    return totalAmount;
};
