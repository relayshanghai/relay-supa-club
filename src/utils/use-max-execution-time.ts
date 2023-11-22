import { wait } from './utils';

export const useMaxExecutionTime = async (func: () => Promise<any>, maxTime: number) => {
    const timeout = async () => {
        await wait(maxTime);
        throw new Error('Job timed out');
    };
    return await Promise.race([await func(), await timeout]);
};
