import { addDays } from 'date-fns';
import { describe, it, expect, vitest } from 'vitest';
import { checkForIgnoredEmails } from './check-for-ignored-emails';

describe('check-for-ignored-emails', () => {
    it('checks if there are any ignored emails and sends update', async () => {
        const updateMock = vitest.fn();
        updateMock.mockReturnValue(Promise.resolve({ id: '123' } as any));
        const influencer = {
            id: '123',
            funnel_status: 'In Sequence',
        };
        const tenDaysAgo = addDays(new Date(), -10);
        const fifteenDaysAgo = addDays(new Date(), -15);

        const notOver14Days = await checkForIgnoredEmails({
            sequenceInfluencer: influencer as any,
            lastEmail: { email_send_at: tenDaysAgo } as any,
            updateSequenceInfluencer: updateMock,
        });
        expect(notOver14Days).toBe(null);
        expect(updateMock.mock.calls.length).toBe(0);

        const over14Days = await checkForIgnoredEmails({
            sequenceInfluencer: influencer as any,
            lastEmail: { email_send_at: fifteenDaysAgo } as any,
            updateSequenceInfluencer: updateMock,
        });
        expect(over14Days).not.toBe(null);
        expect(updateMock.mock.calls.length).toBe(1);
        expect(updateMock.mock.calls[0][0]).toEqual({
            id: '123',
            funnel_status: 'Ignored',
        });
    });
});
