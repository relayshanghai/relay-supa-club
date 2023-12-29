import { usageErrors } from 'src/errors/usages';
import { serverLogger } from 'src/utils/logger-server';
import { supabase } from 'src/utils/supabase-client';
import { unixEpochToISOString } from 'src/utils/utils';
import type { UsageType } from 'types';
import { getSubscription } from '../../stripe/helpers';
import type { RelayDatabase, UsagesDBInsert } from '../types';
import { updateCompanySubscriptionStatus } from './company';

const handleCurrentPeriodExpired = async (companyId: string) => {
    let subscription = null;

    try {
        subscription = await getSubscription(companyId);
    } catch (error) {
        serverLogger(error, (scope) => {
            return scope.setContext('Company ID', { companyId });
        });
    }

    if (!subscription) {
        return { error: usageErrors.noSubscription };
    }

    const { current_period_end, current_period_start } = subscription;

    if (!current_period_end || !current_period_start) {
        return { error: usageErrors.noSubscriptionStartEndDate };
    }

    const subscription_status =
        subscription.status === 'active'
            ? 'active'
            : subscription.status === 'trialing'
            ? 'trial'
            : subscription.status === 'canceled'
            ? 'canceled'
            : null;

    if (!subscription_status) {
        // as per how `updateCompanySubscriptionStatus` is used, our app should only be using the above statuses, so if we get something else, we should log it as suspicious
        serverLogger('Invalid subscription status: ' + subscription_status);
        return { error: usageErrors.invalidStatus };
    }

    const subscription_current_period_start = unixEpochToISOString(current_period_start);
    const subscription_current_period_end = unixEpochToISOString(current_period_end);

    await updateCompanySubscriptionStatus({
        id: companyId,
        subscription_status,
        subscription_current_period_start,
        subscription_current_period_end,
    });

    return { subscription_current_period_start, subscription_current_period_end };
};

// eslint-disable-next-line complexity
const recordUsage = async ({
    type,
    startDate,
    endDate,
    subscriptionLimit,
    company_id,
    user_id,
    creator_id,
    count = 1,
}: {
    type: UsageType;
    startDate: Date;
    endDate: Date;
    subscriptionLimit: string;
    company_id: string;
    user_id: string;
    creator_id?: string;
    count?: number;
}) => {
    if (!subscriptionLimit) {
        return { error: usageErrors.noSubscription };
    }
    const limit = Number(subscriptionLimit);
    const now = new Date();

    let _subscriptionStartDate = startDate.toISOString();

    // if end date is in the past, we need to query stripe for latest subscription info and update the subscription current period end date
    if (endDate < now) {
        const result = await handleCurrentPeriodExpired(company_id);
        if (result.error || !result.subscription_current_period_start || !result.subscription_current_period_end) {
            return { error: result.error };
        }
        _subscriptionStartDate = result.subscription_current_period_start;
    }

    const { thisMonthStartDate, thisMonthEndDate } = { thisMonthStartDate: startDate, thisMonthEndDate: endDate };

    const { data: usagesData, error: usagesError } = await supabase
        .from('usages')
        .select('item_id')
        .eq('company_id', company_id)
        .eq('type', type)
        .gte('created_at', thisMonthStartDate.toISOString())
        .lt('created_at', thisMonthEndDate.toISOString());

    // We only charge once per creator, not report
    if (type === 'profile' && creator_id) {
        const usageRecordExists = usagesData?.find((usage) => usage.item_id === creator_id);
        if (usageRecordExists) {
            return { error: null };
        }
    }

    if (usagesError) serverLogger(usagesError);

    if (usagesError || (usagesData?.length && usagesData.length >= limit)) {
        return { error: usageErrors.limitExceeded };
    }

    const usage: UsagesDBInsert = {
        company_id,
        user_id,
        type,
        item_id: creator_id,
    };
    // Example: Array(3).fill(usage) -> [usage, usage, usage]
    const usageToRecord = Array(count).fill(usage);
    const { error: insertError } = await supabase.from('usages').insert(usageToRecord);
    if (insertError) {
        serverLogger(insertError);
        return { error: usageErrors.errorRecordingUsage };
    }

    return { error: null };
};

export const recordReportUsage = async (company_id: string, user_id: string, creator_id: string) => {
    const { data: company, error: companyError } = await supabase
        .from('companies')
        .select(
            'subscription_status, subscription_current_period_start, subscription_current_period_end, profiles_limit, trial_profiles_limit',
        )
        .eq('id', company_id)
        .single();

    if (companyError) serverLogger(companyError);

    if (!company || companyError) {
        return { error: usageErrors.noCompany };
    }

    const subscriptionLimit =
        company.subscription_status === 'trial' ? company.trial_profiles_limit : company.profiles_limit;
    if (!subscriptionLimit) {
        return { error: usageErrors.noSubscriptionLimit };
    }

    if (!company.subscription_current_period_start || !company.subscription_current_period_end) {
        return { error: usageErrors.noSubscriptionStartEndDate };
    }
    const startDate = new Date(company.subscription_current_period_start);
    const endDate = new Date(company.subscription_current_period_end);

    return recordUsage({
        type: 'profile',
        startDate,
        endDate,
        subscriptionLimit,
        company_id,
        user_id,
        creator_id,
    });
};

// Note: we might want to consider not recording usages for the default loading of the search page
export const recordSearchUsage = async (company_id: string, user_id: string, count = 1) => {
    const { data: company, error: companyError } = await supabase
        .from('companies')
        .select(
            'subscription_status, subscription_current_period_start, subscription_current_period_end, searches_limit, trial_searches_limit',
        )
        .eq('id', company_id)
        .single();

    if (companyError) serverLogger(companyError);

    if (!company || companyError) {
        return { error: usageErrors.noCompany };
    }

    const subscriptionLimit =
        company.subscription_status === 'trial' ? company.trial_searches_limit : company.searches_limit;
    if (!subscriptionLimit) {
        return { error: usageErrors.noSubscriptionLimit };
    }

    if (!company.subscription_current_period_start || !company.subscription_current_period_end) {
        return { error: usageErrors.noSubscriptionStartEndDate };
    }

    const startDate = new Date(company.subscription_current_period_start);
    const endDate = new Date(company.subscription_current_period_end);

    return recordUsage({
        type: 'search',
        startDate,
        endDate,
        subscriptionLimit,
        company_id,
        user_id,
        count,
    });
};

export const getUsagesByCompanyCall =
    (db: RelayDatabase) => async (companyId: string, startDate?: string, endDate?: string) => {
        if (!startDate || !endDate) {
            const { data, error } = await db.from('usages').select('type, created_at').eq('company_id', companyId);
            if (error) {
                throw new Error(error.message);
            }
            return data;
        }

        const { data, error } = await supabase
            .from('usages')
            .select('type, created_at')
            .eq('company_id', companyId)
            .gt('created_at', startDate)
            .lte('created_at', endDate);
        if (error) {
            throw new Error(error.message);
        }
        return data;
    };
