import { describe, expect, it, vi } from 'vitest';
import { requestNewReport } from './index';
import type { CreatorReport } from '../../../../types';

const kvSetMocked = vi.fn();
const kvGetMocked = vi.fn();

vi.mock('kv', () => ({
    kv: {
        set: kvSetMocked,
        get: kvGetMocked,
    },
}));

const data: Record<string, any> = {};

kvSetMocked.mockImplementation(async <T>(key: string, value: T) => {
    data[key] = value;
});
kvGetMocked.mockImplementation(async <T>(key: string): Promise<T> => {
    return data[key];
});
describe('iqdata requests', () => {
    it('requestNewReport: reports/new', async () => {
        // matches the mock returned by src/mocks/server.ts. Mock data is in './iqdata/reports-newWWE.json'
        const creatorId = 'UCJ5v_MCY6GNUBTO8-D3XoAg';
        const result: CreatorReport = await requestNewReport('youtube', creatorId);
        expect(result.success).toBe(true);
        expect(result.user_profile.fullname).toBe('WWE');
    });
});
