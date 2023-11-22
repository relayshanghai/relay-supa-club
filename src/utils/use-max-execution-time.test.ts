import { describe, it, expect } from 'vitest';
import { useMaxExecutionTime } from './use-max-execution-time';
import { wait } from './utils';

describe('useMaxExecutionTime', () => {
    it('should return the result of the function if it finishes before the timeout', async () => {
        const result = await useMaxExecutionTime(async () => {
            await wait(100);
            return 'result';
        }, 1000);
        expect(result).toBe('result');
    });
    it('should throw an error if the function takes longer than the timeout', async () => {
        try {
            await useMaxExecutionTime(async () => {
                await wait(2000);
                return 'result';
            }, 1000);
        } catch (error: any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Job timed out');
        }
    });
});
