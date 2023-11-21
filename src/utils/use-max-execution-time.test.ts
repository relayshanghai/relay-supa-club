import { describe, it, expect } from 'vitest';
import { useMaxExecutionTime } from './use-max-execution-time';

describe('useMaxExecutionTime', () => {
    it('should return the result of the function if it finishes before the timeout', async () => {
        const result = await useMaxExecutionTime(() => Promise.resolve('result'), 1000);
        expect(result).toBe('result');
    });
    it('should throw an error if the function takes longer than the timeout', async () => {
        try {
            await useMaxExecutionTime(() => new Promise((resolve) => setTimeout(() => resolve('result'), 1000)), 500);
        } catch (error: any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Job timed out');
        }
    });
});
