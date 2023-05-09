import { describe, expect, it } from 'vitest';
import { reportIsStale } from './use-report';
describe('checkForStaleReport', () => {
    it('should return true if the report is stale (over 59 days old) and true if not', () => {
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        const result = reportIsStale(fiveDaysAgo.toISOString());
        expect(result).toBe(false);

        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        const result2 = reportIsStale(sixtyDaysAgo.toISOString());
        expect(result2).toBe(true);
    });
});
