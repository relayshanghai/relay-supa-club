import type { RelayDatabase, VercelLogs } from '../types';

export type VercelLog = {
    id: string;
    message: string;
    type: 'stdout' | 'stderr';
    source: 'build' | 'static' | 'external' | 'lambda' | 'edge';
    deploymentId: string;
    timestamp: string;
    data: any;
};

export const insertVercelLog = (supabase: RelayDatabase) => async (insert: VercelLogs['Insert']) => {
    const { data, error } = await supabase.from('vercel_logs').insert(insert).select();

    if (error) throw error;

    return data;
};
