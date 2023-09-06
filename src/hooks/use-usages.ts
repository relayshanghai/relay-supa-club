import useSWR from 'swr';
import type { UsageType } from 'types';
import type { UsagesGetQueries, UsagesGetResponse } from 'pages/api/usages';
import { nextFetchWithQueries } from 'src/utils/fetcher';
import { useCompany } from './use-company';

export type StartEndDates = { thisMonthStartDate: Date; thisMonthEndDate: Date };

export const useUsages = (useRange?: boolean, startEndDates?: StartEndDates) => {
    const { company } = useCompany();
    const {
        subscription_status,
        trial_profiles_limit,
        trial_searches_limit,
        trial_ai_email_generator_limit,
        profiles_limit,
        searches_limit,
        ai_email_generator_limit,
    } = company || {};

    const { data, mutate: refreshUsages } = useSWR(
        company?.id ? ['usages', startEndDates?.thisMonthStartDate, startEndDates?.thisMonthEndDate] : null,
        async ([path, startDate, endDate]) => {
            if (!company?.id) {
                return;
            }
            if (useRange && (!startDate || !endDate)) {
                return;
            }
            const body = { startDate: startDate?.toISOString(), endDate: endDate?.toISOString(), id: company?.id };
            return await nextFetchWithQueries<UsagesGetQueries, UsagesGetResponse>(path, body);
        },
    );

    const limits = company
        ? subscription_status === 'trial'
            ? {
                  profile: Number(trial_profiles_limit),
                  search: Number(trial_searches_limit),
                  ai_email: Number(trial_ai_email_generator_limit),
              }
            : {
                  profile: Number(profiles_limit),
                  search: Number(searches_limit),
                  ai_email: Number(ai_email_generator_limit),
              }
        : { profile: 0, search: 0, ai_email: 0 };

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
        aiEmail: {
            limit: limits.ai_email,
            current: countUsages('ai_email'),
            remaining: countRemainingUsages('ai_email'),
        },
    };

    return {
        usages,
        refreshUsages,
    };
};
