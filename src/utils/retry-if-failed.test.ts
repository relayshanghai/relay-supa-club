import { describe, it, expect } from 'vitest';
import { retryIfFailed } from './retry-if-failed';

describe('retryIfFailed', () => {
    it('should return the result of the function if it succeeds', async () => {
        const call = async () => {
            return 'result';
        };

        const result = await retryIfFailed(call, 3, 100);
        expect(result).toBe('result');
    });
    it('should throw an error if the function fails', async () => {
        const call = async () => {
            throw new Error('error');
        };
        try {
            await retryIfFailed(call, 3, 100);
        } catch (error: any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('error');
        }
    });
    it('should retry the function if it fails', async () => {
        let count = 0;
        const call = async () => {
            count++;
            if (count === 1) throw new Error('error');
            return 'result';
        };
        const result = await retryIfFailed(call, 3, 100);
        expect(result).toBe('result');
    });
    it('should throw an error if the function fails more than the number of retries', async () => {
        const call = async () => {
            throw new Error('error');
        };
        try {
            await retryIfFailed(call, 3, 100);
        } catch (error: any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('error');
        }
    });
});
