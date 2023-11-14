import type { RelayDatabase, Jobs } from '../api/db';
import { now } from '../datetime';
import { JOB_STATUS } from './types';
import type { JOB_QUEUE } from './queues';

type GetJobsFilters = {
    queue: JOB_QUEUE;
    status: JOB_STATUS;
    limit: number;
    owner?: string;
};

type GetJobFilters = {
    owner?: string;
};

/**
 * Fetch jobs matching the filter marking them `running`
 */
export const fetchJobs =
    (supabase: RelayDatabase) =>
    async (filters: GetJobsFilters = { queue: 'default', status: JOB_STATUS.pending, limit: 1 }) => {
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

export const getJob =
    (supabase: RelayDatabase) =>
    async (id: string, filters: GetJobFilters = {}) => {
        const dbquery = supabase.from('jobs').select().eq('id', id);

        if (filters.owner) {
            dbquery.eq('owner', filters.owner);
        }

        const { data, error } = await dbquery.maybeSingle();

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
    async (job: Jobs['Row'], status: Omit<JOB_STATUS, 'running'> = JOB_STATUS.success, result: any = null) => {
        const retry_count = status !== JOB_STATUS.success ? (job.retry_count ?? 0) + 1 : job.retry_count;
        const _status = status as string;

        const { data, error } = await supabase
            .from('jobs')
            .update({ status: _status, result, retry_count })
            .eq('id', job.id)
            .select();

        if (error) throw error;
        return data;
    };
