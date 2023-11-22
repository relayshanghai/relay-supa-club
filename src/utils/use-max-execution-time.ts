import { wait } from './utils';

export const useMaxExecutionTime = (func: Promise<any>, maxTime: number) => {
    const timeout = async () => {
        await wait(maxTime);
        throw new Error('Job timed out');
    };
    return Promise.race([func, timeout()]);
};
