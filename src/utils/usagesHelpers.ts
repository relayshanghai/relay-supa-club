import type { UsageType } from 'types';
import type { FetchCreatorsFilteredParams } from './api/iqdata/transforms';
import type { CompanyDB } from 'src/utils/api/db';
import type { SubscriptionGetResponse } from 'pages/api/subscriptions';
import { unixEpochToISOString } from './utils';
import { clientLogger } from './logger-client';

export type SimpleUsage = {
    type: UsageType;
    created_at: string | null;
};

export function getCurrentMonthPeriod(
    subscriptionStartDate: Date /** instead of getting the current date from `new Date()`, you can pass a specific date to compare with */,
    currentDate?: Date,
): {
    thisMonthStartDate: Date;
    thisMonthEndDate: Date;
} {
    const now = currentDate ?? new Date();

    const yearsPassed = now.getUTCFullYear() - subscriptionStartDate.getUTCFullYear();
    const monthsPassed = now.getUTCMonth() - subscriptionStartDate.getUTCMonth();

    const thisMonthStartDate = new Date(subscriptionStartDate);

    now.getUTCFullYear() - subscriptionStartDate.getUTCFullYear();
    thisMonthStartDate.setUTCFullYear(subscriptionStartDate.getUTCFullYear() + yearsPassed);
    thisMonthStartDate.setUTCMonth(subscriptionStartDate.getUTCMonth() + monthsPassed);
    // if we are already past the day(date) the subscription started, we need to start the period from the previous month
    if (subscriptionStartDate.getUTCDate() >= now.getUTCDate()) {
        thisMonthStartDate.setUTCMonth(thisMonthStartDate.getUTCMonth() - 1);
    }
    // set the date time to midnight of that day
    thisMonthStartDate.setUTCHours(0, 0, 0, 0);

    const thisMonthEndDate = new Date(thisMonthStartDate);
    thisMonthEndDate.setUTCMonth(thisMonthEndDate.getUTCMonth() + 1);
    thisMonthEndDate.setUTCHours(0, 0, 0, 0);
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

export const checkStripeAndDatabaseMatch = (company?: CompanyDB, subscription?: SubscriptionGetResponse) => {
    const periodStart = unixEpochToISOString(subscription?.current_period_start);

    const currentMonth = periodStart
        ? getCurrentMonthPeriod(new Date(periodStart))
        : { thisMonthStartDate: undefined, thisMonthEndDate: undefined };
    const thisMonthStartDate = currentMonth.thisMonthStartDate;
    const thisMonthEndDate = currentMonth.thisMonthEndDate;
    // company?.subscription_current_period_start and end are updated when we detect current period has ended (in utils/api/db/usages), we query stripe and update the company
    if (company?.subscription_current_period_start && thisMonthStartDate && thisMonthEndDate) {
        // a debug, just to warn a developer if these aren't matching, maybe there is something wrong with the data
        const { thisMonthStartDate: companyThisMonthStartDate, thisMonthEndDate: companyThisMonthEndDate } =
            getCurrentMonthPeriod(new Date(company?.subscription_current_period_start));
        if (
            companyThisMonthStartDate.toISOString() !== thisMonthStartDate.toISOString() ||
            companyThisMonthEndDate.toISOString() !== thisMonthEndDate.toISOString()
        ) {
            clientLogger(
                `Company subscription this month period start/end does not match subscription this month period start/end. companyPeriodStart ${companyThisMonthStartDate.toISOString()} periodStart ${thisMonthStartDate.toISOString()}companyPeriodEnd ${companyThisMonthEndDate.toISOString()} periodEnd ${thisMonthEndDate.toISOString()}`,
                'warning',
            );
        }
    }
};
