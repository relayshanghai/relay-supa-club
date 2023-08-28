import Bottleneck from 'bottleneck';

// limited to 7 requests per second to be slightly below the 10 request per second IQData limit
const REQUEST_INTERVAL = 1000 / 7;
const RETRY_LIMIT = 10;

const limiter = new Bottleneck({ minTime: REQUEST_INTERVAL });

limiter.on('failed', async (error, jobInfo) => {
    const { retryCount, options } = jobInfo;
    // eslint-disable-next-line no-console
    console.warn(`Job ${options.id} failed: ${error}, retries:`, retryCount);

    if (retryCount < RETRY_LIMIT) {
        return REQUEST_INTERVAL;
    }
});

export { limiter };
