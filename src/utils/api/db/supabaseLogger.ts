import { supabase } from 'src/utils/supabase-client';

export const supabaseLogger = async (data: any) => {
    supabase.from('logs').insert(data);
};
