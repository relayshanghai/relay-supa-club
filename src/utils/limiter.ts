import Bottleneck from 'bottleneck';
import { serverLogger } from 'src/utils/logger-server';
import { clientLogger } from 'src/utils/logger-client';
import { usageErrors } from 'src/errors/usages';

/**
 * The interval between requests in milliseconds.
 */
const REQUEST_INTERVAL = 1000 / 8;

/**
 * The maximum number of concurrent requests.
 */
const MAX_CONCURRENT = 8;

/**
 * The maximum number of times a job can be retried before failing.
 */
const RETRY_LIMIT = 10;

/**
 * A rate limiter that limits the number of requests that can be made per second.
 * It allows running requests concurrently.
 * It has a built in retry mechanism.
 * Links to doc: https://github.com/SGrondin/bottleneck#clustering
 */
const limiter = new Bottleneck({ minTime: REQUEST_INTERVAL, maxConcurrent: MAX_CONCURRENT });

/**
 * Event listener that is triggered when a job fails.
 * If the job has not exceeded the retry limit, it will be retried after the REQUEST_INTERVAL.
 * @param error - The error that caused the job to fail.
 * @param jobInfo - Information about the failed job.
 * @returns The amount of time to wait before retrying the job.
 */
limiter.on('failed', async (error, jobInfo) => {
    const { retryCount, options } = jobInfo;
    const logger = typeof window === 'undefined' ? serverLogger : clientLogger;

    logger(`Job ${options.id} failed: ${error}, retries: ${retryCount}`, 'warning');

    if (error.message === usageErrors.limitExceeded) {
        return; // Don't retry if the error is due to our profile search usage being exceeded.
    }

    if (retryCount < RETRY_LIMIT) {
        return REQUEST_INTERVAL;
    }
});

export { limiter };
