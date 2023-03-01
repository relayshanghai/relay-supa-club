import type { UsageType } from 'types';

export type SimpleUsage = {
    type: UsageType;
    created_at: string | null;
};
export const getCurrentPeriodUsages = (
    usages: SimpleUsage[],
    periodStart: Date,
    periodEnd: Date,
) => {
    if (!usages) {
        return null;
    }
    const currentPeriodUsages = usages.filter(({ created_at }) => {
        if (!created_at) {
            return false;
        }
        const createdAt = new Date(created_at);
        return createdAt >= periodStart && createdAt <= periodEnd;
    });
    return currentPeriodUsages;
};
