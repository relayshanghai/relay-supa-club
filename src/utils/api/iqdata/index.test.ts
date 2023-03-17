import { requestNewReport } from './index';
import type { CreatorReport } from '../../../../types';
describe('iqdata requests', () => {
    test('requestNewReport: reports/new', async () => {
        const creatorId = 'UCJ5v_MCY6GNUBTO8-D3XoAg';
        const result: CreatorReport = await requestNewReport('youtube', creatorId);
        expect(result.success).toBe(true);
        expect(result.user_profile.fullname).toBe('WWE');
    });
});
