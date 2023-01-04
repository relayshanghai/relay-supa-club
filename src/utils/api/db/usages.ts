import { supabase } from 'src/utils/supabase-client';
import { CompanyDB, UsagesDB } from 'types';

export const recordReportUsage = async (
    company_id: string,
    user_id: string,
    creator_id: string
) => {
    const { data: company, error: companyError } = await supabase
        .from<CompanyDB>('companies')
        .select('usage_limit')
        .eq('id', company_id)
        .single();
    if (!company || companyError) return { error: 'Company not found' };

    const limit = Number(company.usage_limit);
    const { data: usagesData, error: usagesError } = await supabase
        .from<UsagesDB>('usages')
        .select('id')
        .eq('company_id', company_id)
        .eq('type', 'report');

    if (usagesError || (usagesData?.length && usagesData.length >= limit)) {
        return { error: 'Usage limit exceeded' };
    }

    // We only charge once per creator, not report
    const usageRecordExists = usagesData?.find((usage) => usage.item_id === creator_id);
    if (usageRecordExists) return { error: null };

    const usage = {
        company_id,
        user_id,
        type: 'search',
        item_id: creator_id
    };
    const { error: insertError } = await supabase.from<UsagesDB>('usages').insert([usage]);
    if (insertError) return { error: 'Error recording usage' };

    return { error: null };
};
