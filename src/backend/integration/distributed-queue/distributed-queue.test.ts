import { describe, expect, it, vi } from 'vitest';
import { UseDistributedQueue } from './distributed-queue';
import KVService from '../kv';

const kvSetMocked = vi.fn();
const kvGetMocked = vi.fn();

const data: Record<string, any> = {};

kvSetMocked.mockImplementation(async <T>(key: string, value: T) => {
    data[key] = value;
});
kvGetMocked.mockImplementation(async <T>(key: string): Promise<T> => {
    return data[key];
});

KVService.prototype.get = kvGetMocked;
KVService.prototype.set = kvSetMocked;
describe('src/backend/integration/distributed-queue/distributed-queue.ts', () => {
    describe('UseDistributedQueue', () => {
        it('should await to queue when it does not queued', async () => {
            class Test {
                @UseDistributedQueue(5)
                async shouldBeRunning5CallsPerSecond() {
                    return 1;
                }
            }
            const test = new Test();
            const startTime = Date.now();
            for (let i = 0; i < 5; i++) {
                // lock first 5 request in a second
                await test.shouldBeRunning5CallsPerSecond();
            }
            expect(Date.now() - startTime).lessThan(1000);
            // the sixth request should be delayed for 1 second
            await test.shouldBeRunning5CallsPerSecond();
            expect(Date.now() - startTime).greaterThan(1000);
        });
    });
});
