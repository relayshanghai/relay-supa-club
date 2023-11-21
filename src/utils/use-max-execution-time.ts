export const useMaxExecutionTime = async (func: () => Promise<any>, maxTime: number) => {
    const timeout = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('Job timed out'));
        }, maxTime);
    });
    return await Promise.race([func(), timeout]);
};
