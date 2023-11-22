import { wait } from './utils';

export const useMaxExecutionTime = <T>(func: Promise<T>, maxTime: number): Promise<T> | undefined => {
    const timeout = async () => {
        await wait(maxTime);
        throw new Error('Job timed out');
    };
    return Promise.race([func, timeout()]);
};
