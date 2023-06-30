import type { SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';

export type SalesType = {
    campaign_id: string;
    company_id: string;
    amount: number;
};

export const addSales = (db: SupabaseClient<DatabaseWithCustomTypes>) => async (body: SalesType) => {
    const { error } = await db.from('sales').insert({
        campaign_id: body.campaign_id,
        company_id: body.company_id,
        amount: body.amount,
    });

    if (error) {
        return -1;
    }
    return 0;
};

export const getSales = (db: SupabaseClient<DatabaseWithCustomTypes>) => async (companyId: string) => {
    const { data, error } = await db.from('sales').select('amount').eq('company_id', companyId);

    if (error) {
        return 0;
    }

    const totalAmount = data.reduce((sum: number, row: any) => sum + row.amount, 0);

    return totalAmount;
};
