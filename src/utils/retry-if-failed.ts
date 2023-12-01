export const retryIfFailed: <T>(fn: () => Promise<T>, retries?: number, delay?: number) => Promise<T> = async (
    fn,
    retries = 3,
    delay = 100,
) => {
    try {
        return await fn();
    } catch (error: any) {
        if (retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            return await retryIfFailed(fn, retries - 1, delay * 2);
        }
        throw error;
    }
};
