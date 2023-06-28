import { supabase } from 'src/utils/supabase-client';

export const insertCampagnSales = async (data: any) => {
    const existingCampaign = await supabase
        .from('sales')
        .select('campaign_id, amount')
        .eq('campaign_id', data.id)
        .single();

    if (existingCampaign && existingCampaign.data) {
        // Campaign ID already exists, update the amount
        const updatedAmount = existingCampaign.data?.amount + data.amount;

        await supabase.from('sales').update({ amount: updatedAmount }).eq('campaign_id', data.id);
    } else {
        // Campaign ID doesn't exist, create a new entry
        await supabase.from('sales').insert({
            campaign_id: data.id,
            company_id: data.company_id,
            amount: data.amount,
        });
    }
};

export const getCampaignSales = async (companyId: any) => {
    const { data, error } = await supabase.from('sales').select('amount').eq('company_id', companyId);

    if (error) {
        // Handle the error, such as logging or displaying an error message
        return 0;
    }

    const totalAmount = data.reduce((sum: number, row: any) => sum + row.amount, 0);

    return totalAmount;
};
