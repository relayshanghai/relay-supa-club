import type { RelayDatabase, Jobs } from '../api/db';
import { now } from '../datetime';
import { JOB_QUEUE, JOB_STATUS } from './types';

type GetJobFilters = {
    queue: JOB_QUEUE;
    status: JOB_STATUS;
    limit: number;
    owner?: string;
};

export const getJobs =
    (supabase: RelayDatabase) =>
    async (filters: GetJobFilters = { queue: JOB_QUEUE.default, status: JOB_STATUS.pending, limit: 1 }) => {
        const ts = now();

        let dbquery = supabase
            .from('jobs')
            .update({ status: JOB_STATUS.running })
            .eq('status', filters.status)
            .eq('queue', filters.queue)
            .lte('run_at', ts);

        if (filters.owner) {
            dbquery = dbquery.eq('owner', filters.owner);
        }

        dbquery = dbquery.limit(filters.limit).order('created_at');

        const { data, error } = await dbquery.select();

        if (error) throw error;
        return data;
    };

export const getJob = (supabase: RelayDatabase) => async (id: string) => {
    const { data, error } = await supabase.from('jobs').select().eq('id', id).maybeSingle();

    if (error) throw error;
    return data;
};

export const createJob =
    (supabase: RelayDatabase) => async (id: string, job: Omit<Jobs['Insert'], 'id' | 'status'>) => {
        const status = JOB_STATUS.pending;
        const { data, error } = await supabase
            .from('jobs')
            .upsert({ ...job, status, id })
            .select();
        if (error) throw error;
        return data;
    };

export const finishJob =
    (supabase: RelayDatabase) =>
    async (
        job: Jobs['Row'],
        status: JOB_STATUS.success | JOB_STATUS.failed = JOB_STATUS.success,
        result: any = null,
    ) => {
        const retry_count = status === JOB_STATUS.failed ? (job.retry_count ?? 0) + 1 : job.retry_count;

        const { data, error } = await supabase
            .from('jobs')
            .update({ status, result, retry_count })
            .eq('id', job.id)
            .select();

        if (error) throw error;
        return data;
    };
