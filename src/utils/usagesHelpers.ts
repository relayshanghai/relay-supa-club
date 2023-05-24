import type { UsageType } from 'types';
import type { FetchCreatorsFilteredParams } from './api/iqdata/transforms';

export type SimpleUsage = {
    type: UsageType;
    created_at: string | null;
};

/** gets all usages between the start and end date */
export const getPeriodUsages = (usages: SimpleUsage[], periodStart: Date, periodEnd: Date) => {
    if (!usages) {
        return [];
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

export function getCurrentMonthPeriod(
    subscriptionStartDate: Date /** instead of getting the current date from `new Date()`, you can pass a specific date to compare with */,
    currentDate?: Date,
): {
    thisMonthStartDate: Date;
    thisMonthEndDate: Date;
} {
    const now = currentDate ?? new Date();

    const monthsPassed =
        (now.getFullYear() - subscriptionStartDate.getFullYear()) * 12 +
        (now.getMonth() - subscriptionStartDate.getMonth());

    const thisMonthStartDate = new Date(subscriptionStartDate);
    thisMonthStartDate.setMonth(thisMonthStartDate.getMonth() + monthsPassed);

    const thisMonthEndDate = new Date(thisMonthStartDate);
    thisMonthEndDate.setMonth(thisMonthEndDate.getMonth() + 1);

    return { thisMonthStartDate, thisMonthEndDate };
}

const defaultSearchParams: FetchCreatorsFilteredParams = {
    tags: [],
    username: '',
    influencerLocation: [],
    audienceLocation: [],
    resultsPerPageLimit: 10,
    page: 0,
    audience: [null, null],
    views: [null, null],
};

export const hasCustomSearchParams = (params: FetchCreatorsFilteredParams) => {
    // check if any search filters have been set so we don't record usages for default search
    for (const key of Object.keys(defaultSearchParams)) {
        const typedKey = key as keyof FetchCreatorsFilteredParams;
        if (JSON.stringify(params[typedKey]) !== JSON.stringify(defaultSearchParams[typedKey])) {
            return true;
            break;
        }
    }
    return false;
};
