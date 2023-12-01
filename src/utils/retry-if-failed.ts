import { wait } from './utils';

/**
 * @summary Retry a function if it fails
 * @description Will retry a function if it fails, up to a maximum number of retries. Each retry will be delayed by a amount of time. Passing increaseDelay as true will double the delay time after each retry.
 */
export const retryIfFailed: <T>(fn: () => Promise<T>, retries?: number, delay?: number) => Promise<T> = async (
    fn,
    retries = 3,
    delay = 100,
    increaseDelay = true,
) => {
    try {
        return await fn();
    } catch (error: any) {
        if (retries > 0) {
            await wait(delay);
            return await retryIfFailed(fn, retries - 1, delay * (increaseDelay ? 2 : 1));
        }
        throw error;
    }
};
