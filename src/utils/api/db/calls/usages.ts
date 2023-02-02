import { SECONDS_IN_MILLISECONDS } from 'src/constants/conversions';
import { serverLogger } from 'src/utils/logger';
import { supabase } from 'src/utils/supabase-client';
import { UsageType } from 'types';
import { getSubscription } from '../../stripe/helpers';
import { UsagesDBInsert } from '../types';
import { updateCompanySubscriptionStatus } from './company';

export const usageError = {
    noCompany: 'No company found',
    limitExceeded: 'Usage limit exceeded',
    noSubscriptionLimit: 'No subscription limit found',
    noSubscription: 'No subscription found',
    errorRecordingUsage: 'Error recording usage',
    noSubscriptionStartEndDate: 'No subscription start or end date found',
    subscriptionExpired: 'Subscription expired',
    invalidStatus: 'Invalid subscription status',
};

const handleCurrentPeriodExpired = async (company_id: string) => {
    const subscription = await getSubscription(company_id);
    if (!subscription) {
        return { error: usageError.noSubscription };
    }
    const { current_period_end, current_period_start } = subscription;
    if (!current_period_end || !current_period_start) {
        return { error: usageError.noSubscriptionStartEndDate };
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
        // as per how `updateCompanySubscriptionStatus` is used, our app should only be using the above statuses, so if we get something else, we should log it
        serverLogger('Invalid subscription status', 'error');
        return { error: usageError.invalidStatus };
    }
    const subscription_current_period_start = new Date(
        current_period_start * SECONDS_IN_MILLISECONDS,
    ).toISOString();

    const subscription_current_period_end = new Date(current_period_end * 1000).toISOString();

    await updateCompanySubscriptionStatus({
        id: company_id,
        subscription_status,
        subscription_current_period_start,
        subscription_current_period_end,
    });
    return { subscription_current_period_start, subscription_current_period_end };
};

const recordUsage = async ({
    type,
    startDate,
    endDate,
    subscriptionLimit,
    company_id,
    user_id,
    creator_id,
}: {
    type: UsageType;
    startDate: Date;
    endDate: Date;
    subscriptionLimit: string;
    company_id: string;
    user_id: string;
    creator_id?: string;
}) => {
    if (!subscriptionLimit) {
        return { error: usageError.noSubscription };
    }
    const limit = Number(subscriptionLimit);

    const now = new Date();

    let startDateToUse = startDate.toISOString();
    let endDateToUse = endDate.toISOString();

    // if end date is in the past, we need to query stripe for latest subscription info and update the subscription current period end date
    if (endDate < now) {
        const result = await handleCurrentPeriodExpired(company_id);
        if (
            result.error ||
            !result.subscription_current_period_start ||
            !result.subscription_current_period_end
        ) {
            return { error: result.error };
        }
        startDateToUse = result.subscription_current_period_start;
        endDateToUse = result.subscription_current_period_end;
    }

    const { data: usagesData, error: usagesError } = await supabase
        .from('usages')
        .select('item_id')
        .eq('company_id', company_id)
        .eq('type', type)
        .gte('created_at', startDateToUse)
        .lt('created_at', endDateToUse);

    // We only charge once per creator, not report
    if (type === 'profile' && creator_id) {
        const usageRecordExists = usagesData?.find((usage) => usage.item_id === creator_id);
        if (usageRecordExists) {
            return { error: null };
        }
    }

    if (usagesError || (usagesData?.length && usagesData.length >= limit)) {
        return { error: usageError.limitExceeded };
    }

    const usage: UsagesDBInsert = {
        company_id,
        user_id,
        type,
        item_id: creator_id,
    };
    const { error: insertError } = await supabase.from('usages').insert([usage]);
    if (insertError) {
        return { error: usageError.errorRecordingUsage };
    }

    return { error: null };
};

export const recordReportUsage = async (
    company_id: string,
    user_id: string,
    creator_id: string,
) => {
    const { data: company, error: companyError } = await supabase
        .from('companies')
        .select(
            'subscription_status, subscription_current_period_start, subscription_current_period_end, profiles_limit, trial_profiles_limit',
        )
        .eq('id', company_id)
        .single();
    if (!company || companyError) {
        return { error: usageError.noCompany };
    }

    const subscriptionLimit =
        company.subscription_status === 'trial'
            ? company.trial_profiles_limit
            : company.profiles_limit;
    if (!subscriptionLimit) {
        return { error: usageError.noSubscriptionLimit };
    }

    if (!company.subscription_current_period_start || !company.subscription_current_period_end) {
        return { error: usageError.noSubscriptionStartEndDate };
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
export const recordSearchUsage = async (company_id: string, user_id: string) => {
    const { data: company, error: companyError } = await supabase
        .from('companies')
        .select(
            'subscription_status, subscription_current_period_start, subscription_current_period_end, searches_limit, trial_searches_limit',
        )
        .eq('id', company_id)
        .single();
    if (!company || companyError) {
        return { error: usageError.noCompany };
    }

    const subscriptionLimit =
        company.subscription_status === 'trial'
            ? company.trial_searches_limit
            : company.searches_limit;
    if (!subscriptionLimit) {
        return { error: usageError.noSubscriptionLimit };
    }

    if (!company.subscription_current_period_start || !company.subscription_current_period_end) {
        return { error: usageError.noSubscriptionStartEndDate };
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
    });
};
