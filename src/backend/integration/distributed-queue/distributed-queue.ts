import KVService from '../kv';

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const UseDistributedQueue =
    (concurrencyPerSecond: number, delayCheck = 10): MethodDecorator =>
    (target, method, description: PropertyDescriptor) => {
        const originalMethod = description.value;
        description.value = async function (...args: any[]) {
            const key = `${target.constructor.name}-${method.toString()}`;
            const queueKey = `${key}-queue`;
            // check if the queue full, if full, wait for a while
            let queue = [];

            while (true) {
                queue = (await KVService.getService().get<number[]>(queueKey)) || [];
                if (queue.length < concurrencyPerSecond) {
                    break;
                }
                if (queue[queue.length - 1] < Date.now() - 1000) {
                    queue.pop();
                    await KVService.getService().set(queueKey, queue);
                    break;
                }
                await delay(delayCheck);
            }
            const now = Date.now();
            queue = [now, ...queue];
            await KVService.getService().set(queueKey, queue);

            const result = await originalMethod.apply(this, args);
            return result;
        };
    };
