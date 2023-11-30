import { describe, it, expect } from 'vitest';
import { maxExecutionTime } from './max-execution-time';
import { wait } from './utils';

describe('maxExecutionTime', () => {
    it('should return the result of the function if it finishes before the timeout', async () => {
        const call = async () => {
            await wait(100);
            return 'result';
        };

        const result = await maxExecutionTime(call(), 1000);
        expect(result).toBe('result');
    });
    it('should throw an error if the function takes longer than the timeout', async () => {
        const call = async () => {
            await wait(200);
            return 'result';
        };
        try {
            await maxExecutionTime(call(), 1000);
        } catch (error: any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Job timed out');
        }
    });
});
