import { wait } from './utils';

/**
 * @throws {Error} will throw when timeout() resolves first
 */
export const maxExecutionTime = <T extends Promise<any>>(func: T, maxTime = 1000) => {
    const timeout = async () => {
        await wait(maxTime);
        throw new Error('Job timed out');
    };
    return Promise.race<T>([func, timeout()]);
};
