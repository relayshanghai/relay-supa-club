import { wait } from './utils';

// 2900mb max memory in bytes
const MAX_MEMORY = 3040870400;
const ERR_JOB_TIMEOUT = 2;
const ERR_JOB_MEMORYEXCEEDED = 4;

export const maxExecutionTimeAndMemory = <T extends Promise<any>>(func: T, maxTime: number) => {
    const timeout = async () => {
        let memoryUsage = 0;

        const wait = () =>
            new Promise((resolve) => {
                // check memory usage every 10s and resolve if max_memory is exceeded
                const memCheckIntervalId = setInterval(() => {
                    memoryUsage = process.memoryUsage.rss();

                    if (memoryUsage > MAX_MEMORY) {
                        clearInterval(memCheckIntervalId);
                        resolve(ERR_JOB_MEMORYEXCEEDED);
                    }
                }, 10000);

                // create a timeout that resolves in maxTime
                setTimeout(() => {
                    clearInterval(memCheckIntervalId);
                    resolve(ERR_JOB_TIMEOUT);
                }, maxTime);
            });

        const result = await wait();

        if (result === ERR_JOB_TIMEOUT) {
            throw new Error('Job timed out');
        }

        if (result === ERR_JOB_MEMORYEXCEEDED) {
            throw new Error(`Memory exceeded: ${memoryUsage / (1024 * 1024)}mb`);
        }

        throw new Error('Unknown Error');
    };

    return Promise.race<T>([func, timeout()]);
};

/**
 * @throws {Error} will throw when timeout() resolves first
 */
export const maxExecutionTime = <T extends Promise<any>>(func: T, maxTime: number) => {
    const timeout = async () => {
        await wait(maxTime);
        throw new Error('Job timed out');
    };

    return Promise.race<T>([func, timeout()]);
};
