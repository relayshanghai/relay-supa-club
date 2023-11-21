# Scheduler

### Cron jobs in Supabase?
All these are made possible by these extensions:
- https://github.com/citusdata/pg_cron
- https://github.com/pramsey/pgsql-http

You can always read their docs for more info.

### What is a worker?
A `worker` is a scheduled job in Supabase that runs on a specified interval. It calls the *Run Endpoint* it was created with.

### What is a job?
A `job` is a scheduled task that is picked up and run by a `worker`

### The Run Endpoint
The `POST /api/jobs/run` endpoint is called by the `worker` and runs the matching jobs based on the filter

It currently supports the following filters:
- queue: The queue of the job to pick up. See `JOB_QUEUE` symbol for currently existing queues
- status: The status of the job to pick up. Can either be `pending` or `failed`.
- limit: The number of jobs to pick up. Defaults to *1*.

### What is a Queue?
Queues are groups of jobs that are run by a dedicated worker.

Currently, we have the following *base** queues:
- Default queue (`default`) - where jobs are created by default
- Failed queue (`failed`) - where jobs with failed `status` are rerun, defaults to `default` queue
- Blocking queue (`blocking`) - where incoming jobs won't be processed unless the previous job is finished

You can extend these **base** queues or create your own. After that, you need to create a worker dedicated to your custom queue:
```sql
SELECT create_queue_worker('worker-outreach-1', 'https://app.relay.club/api/jobs/run?queue=outreach', '123ABC', '* * * * *')

-- Make sure you to create a worker for the failed jobs in your custom query too
SELECT create_queue_worker('worker-outreach-failed-1', 'https://app.relay.club/api/jobs/run?queue=outreach&status=failed', '123ABC', '* * * * *')
```

### How to create a Worker
```sql
SELECT create_queue_worker('worker-default-1', 'https://app.relay.club/api/jobs/run', '123ABC', '* * * * *')
--                              |                    |                                   |            |-> the schedule
--                              |                    |                                   |-> The verification token
--                              |                    |-> the endpoint to call
--                              |-> the worker unique name/id
```

### Scheduling a job
To schedule a job, you can send a job to `POST /api/jobs` endpoint

```ts
{
    // The name of the Job. Lookup `JobNames` symbol
    name: JobNames,
    // The schedule when to run the job (in UTC). Must be ISO format
    run_at: string<ISODate>,
    // The json payload to send to the job. Must be serializable
    payload: Record<string, any>,
    // The queue the job belongs to. Defaults to `default`
    queue: JOB_QUEUE
}
```

or, call `createJob()`

```ts
createJob(jobName: JobNames, data: { run_at: string<ISODate>, queue: JOB_QUEUE, payload: Record<string, any> });
```

### Checking the job status
To check the status of a job, you will need to get the info from `GET /api/jobs/[id]` endpoint or use `getJob()`

### Setting up
Run this on the database

```sql
-- Workers for pending jobs
SELECT create_queue_worker('worker-default-1', 'https://app.relay.club/api/jobs/run', '123ABC', '* * * * *');
SELECT create_queue_worker('worker-default-2', 'https://app.relay.club/api/jobs/run', '123ABC', '* * * * *');

-- Create workers for failed jobs (for retrying)
SELECT create_queue_worker('worker-failed-1', 'https://app.relay.club/api/jobs/run?status=failed', '123ABC', '* * * * *');

-- or create workers for your custom queues
-- SELECT create_queue_worker('worker-myqueue-1', 'https://app.relay.club/api/jobs/run?queue=myqueue', '123ABC', '* * * * *');

-- Cleanup job details
SELECT cron.schedule('cleanup-cron-details', '0 0 * * *', $$ DELETE FROM cron.job_run_details WHERE end_time < now() - interval '7 days' $$);
```

### Scaling
So you are probably now have an idea that you can create as many workers as you want. But how many is enough?
It depends on how you want to scale. You can scale it via two ways:

- **Increase worker count**

  Increasing worker count will enable us to run multiple jobs every interval
  The caveat is that it will clog the `cron.job_run_details` table faster

- **Increase worker limit**

  Increasing worker limit will enable us to run multiple jobs every worker
  The caveat is that each running worker will take more time to finish and might hit the http extension timeout

### Removing a worker
In any case that you need to stop/remove a worker, just run this SQL command

```sql
SELECT cron.unschedule('worker-default-1');
```

### Local Development

Because Supabase pgsql_http extension cannot make requests to your locally running Next app on `localhost:3000`, you need to expose it with `ngrok http 3000`. Copy the `Forwarding` line e.g. 
```
Forwarding                    https://b4d9-118-107-244-171.ngrok.io -> http://localhost:3000       
```
paste it into the create worker call (e.g. for sequence_send)
`SELECT create_queue_worker('sequence_send', 'https://b4d9-118-107-244-171.ngrok.io/api/jobs/run?queue=sequence_send', '123ABC', '* * * * *');`
and it will call the run job endpoint.

### More Reading
- https://github.com/citusdata/pg_cron
- https://github.com/pramsey/pgsql-http
- https://supabase.com/docs/guides/database/extensions/pg_cron
- https://supabase.com/blog/postgres-as-a-cron-server
