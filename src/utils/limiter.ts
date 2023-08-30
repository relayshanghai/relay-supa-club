import Bottleneck from 'bottleneck';
import { serverLogger } from 'src/utils/logger-server';
import { clientLogger } from 'src/utils/logger-client';

// limited to 7 requests per second to be slightly below the 10 request per second IQData limit
const REQUEST_INTERVAL = 1000 / 7;
const RETRY_LIMIT = 10;

const limiter = new Bottleneck({ minTime: REQUEST_INTERVAL });

limiter.on('failed', async (error, jobInfo) => {
    const { retryCount, options } = jobInfo;
    const logger = typeof window === 'undefined' ? serverLogger : clientLogger;

    logger(`Job ${options.id} failed: ${error}, retries: ${retryCount}`, 'warn');

    if (retryCount < RETRY_LIMIT) {
        return REQUEST_INTERVAL;
    }
});

export { limiter };
