import useSWR from 'swr';
import type { UsageType } from 'types';
import type { UsagesGetQueries, UsagesGetResponse } from 'pages/api/usages';
import { nextFetchWithQueries } from 'src/utils/fetcher';
import { useCompany } from './use-company';
import { useSubscription } from './v2/use-subscription';
import { SubscriptionStatus } from 'src/backend/database/subcription/subscription-entity';

export type StartEndDates = { thisMonthStartDate: Date; thisMonthEndDate: Date };

export const useUsages = (useRange?: boolean, startEndDates?: StartEndDates) => {
    const { company } = useCompany();
    const { subscription } = useSubscription();
    const { trial_profiles_limit, trial_searches_limit, profiles_limit, searches_limit } = company || {};

    const { data, mutate: refreshUsages } = useSWR(
        company?.id ? ['usages', company.id, startEndDates?.thisMonthStartDate, startEndDates?.thisMonthEndDate] : null,
        async ([path, companyId, startDate, endDate]) => {
            if (useRange && (!startDate || !endDate)) {
                return;
            }
            const body = { startDate: startDate?.toISOString(), endDate: endDate?.toISOString(), id: companyId };
            return await nextFetchWithQueries<UsagesGetQueries, UsagesGetResponse>(path, body);
        },
        // need to have a poll for this so that we can show the error on the boostbot page that usages are exceeded
        { refreshInterval: 1000 * 30, revalidateOnFocus: true },
    );

    const limits = company
        ? [SubscriptionStatus.TRIAL, SubscriptionStatus.TRIAL_CANCELLED, SubscriptionStatus.TRIAL_EXPIRED].includes(
              subscription?.status as SubscriptionStatus,
          )
            ? {
                  profile: Number(trial_profiles_limit),
                  search: Number(trial_searches_limit),
              }
            : {
                  profile: Number(profiles_limit),
                  search: Number(searches_limit),
              }
        : { profile: 0, search: 0 };

    const countUsages = (type: string) => data?.filter(({ type: usageType }) => usageType === type).length ?? 0;
    const countRemainingUsages = (type: UsageType) => limits[type] - countUsages(type);

    const usages = {
        profile: {
            limit: limits.profile,
            current: countUsages('profile'),
            remaining: countRemainingUsages('profile'),
        },
        search: {
            limit: limits.search,
            current: countUsages('search'),
            remaining: countRemainingUsages('search'),
        },
    };

    return {
        usages,
        isUsageLoaded: usages.profile.limit !== 0 && usages.search.limit !== 0,
        refreshUsages,
    };
};
