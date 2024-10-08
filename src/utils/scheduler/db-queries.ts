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
    async ({ queue, limit, status }: GetJobsFilters) => {
        const { data, error } = await supabase.rpc('fetch_pending_jobs', {
            job_queue: queue,
            queue_limit: limit,
            job_status: status,
            run_time: now(),
        });

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

export const createJobsDb = (supabase: RelayDatabase) => async (jobs: Omit<Jobs['Insert'], 'id' | 'status'>[]) => {
    const { data, error } = await supabase.from('jobs').insert(jobs).select('*');
    if (error) throw error;
    return data;
};

export const createJobDb =
    (supabase: RelayDatabase) => async (id: string, job: Omit<Jobs['Insert'], 'id' | 'status'>) => {
        const status = JOB_STATUS.pending;
        const { data, error } = await supabase
            .from('jobs')
            .upsert({ ...job, status, id })
            .limit(1)
            .select()
            .single();
        if (error) throw error;
        return data;
    };

/**
 * if the job failed, increment the retry_count
 */
export const finishJobDb =
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

export const getJobs =
    (supabase: RelayDatabase) =>
    async (filters: GetJobsFilters = { queue: 'default', status: JOB_STATUS.pending, limit: 0 }) => {
        const dbquery = supabase.from('jobs').select('*').eq('status', filters.status).eq('queue', filters.queue);

        if (filters.limit > 0) {
            dbquery.limit(filters.limit);
        }

        if (filters.owner) {
            dbquery.eq('owner', filters.owner);
        }

        const { data, error } = await dbquery;

        if (error) throw error;
        return data;
    };

export const deleteJobs = (supabase: RelayDatabase) => async (ids: string[]) =>
    await supabase.from('jobs').delete().in('id', ids);

export const getFailedOrPendingSequenceSendJobs = (supabase: RelayDatabase) => async () =>
    await supabase.from('jobs').select('*').in('status', ['failed', 'pending']).eq('name', 'sequence_step_send');
