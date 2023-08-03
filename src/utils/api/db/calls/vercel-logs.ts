import type { RelayDatabase } from '../types';

export type VercelLog = {
    id: string;
    message: string;
    type: 'stdout' | 'stderr';
    source: 'build' | 'static' | 'external' | 'lambda' | 'edge';
    deployment_id: string;
    timestamp: string;
    data: any;
};

export const insertVercelLog = (supabase: RelayDatabase) => async (insert: VercelLog) => {
    const { data, error } = await supabase.from('vercel_logs').insert(insert).select();

    if (error) throw error;

    return data;
};
