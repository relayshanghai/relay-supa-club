import { supabase } from 'src/utils/supabase-client';

export const getCompanyUsageLimitById = async (id: string) =>
    await supabase.from('companies').select('usage_limit').eq('id', id).single();
