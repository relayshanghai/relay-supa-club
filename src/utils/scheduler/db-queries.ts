import type { RelayDatabase, Jobs } from '../api/db';
import { now } from '../datetime';
import { JOB_STATUS } from './types';
import type { JOB_QUEUE } from './queues';
import { maxExecutionTime } from '../max-execution-time';
import { retryIfFailed } from '../retry-if-failed';

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
        const job = async () =>
            supabase.rpc('fetch_pending_jobs', {
                job_queue: queue,
                queue_limit: limit,
                job_status: status,
                run_time: now(),
            });
        // if the job failed within 1 second, will retry up to 100 times, with a delay of 100ms
        const { data, error } = await retryIfFailed(() => maxExecutionTime(job(), 1000), 100, 100);
        if (error) throw error;
        return data;
    };

export const getJob =
    (supabase: RelayDatabase) =>
    async (id: string, filters: GetJobFilters = {}) => {
        const job = async () => {
            const dbquery = supabase.from('jobs').select().eq('id', id);

            if (filters.owner) {
                dbquery.eq('owner', filters.owner);
            }

            return await dbquery.maybeSingle();
        };
        const { data, error } = await retryIfFailed(() => maxExecutionTime(job(), 1000), 100, 100);
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
        const job = async () => {
            const dbquery = supabase.from('jobs').select('*').eq('status', filters.status).eq('queue', filters.queue);

            if (filters.limit > 0) {
                dbquery.limit(filters.limit);
            }

            if (filters.owner) {
                dbquery.eq('owner', filters.owner);
            }

            return await dbquery;
        };
        const { data, error } = await retryIfFailed(() => maxExecutionTime(job(), 1000), 100, 100);
        if (error) throw error;
        return data;
    };
