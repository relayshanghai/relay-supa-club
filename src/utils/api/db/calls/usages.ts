import { supabase } from 'src/utils/supabase-client';
import { UsageType } from 'types';
import { UsagesDBInsert } from '../types';
import { addMonths } from 'date-fns';

export enum UsageError {
    noCompany = 'No company found',
    limitExceeded = 'Usage limit exceeded',
    noSubscriptionLimit = 'No subscription limit found',
    noSubscription = 'No subscription found',
    errorRecordingUsage = 'Error recording usage',
    noSubscriptionStartDate = 'No subscription start date found',
}

const recordUsage = async ({
    type,
    startDate,
    subscriptionLimit,
    company_id,
    user_id,
    creator_id,
}: {
    type: UsageType;
    startDate: Date;
    subscriptionLimit: string;
    company_id: string;
    user_id: string;
    creator_id?: string;
}) => {
    if (!subscriptionLimit) return { error: UsageError.noSubscription };
    const limit = Number(subscriptionLimit);

    // get current month start date by using the day of the month of the start date applied to this month. end date is a month later
    // This is a lot simpler and more efficient than calling the Stripe API to get the subscription period, and it will be the same
    const currentMonthStartDate = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        startDate.getDate(),
    );

    const currentMonthEndDate = addMonths(currentMonthStartDate, 1);

    const { data: usagesData, error: usagesError } = await supabase
        .from('usages')
        .select('item_id')
        .eq('company_id', company_id)
        .eq('type', type)
        .gte('created_at', currentMonthStartDate.toISOString())
        .lte('created_at', currentMonthEndDate.toISOString());

    // We only charge once per creator, not report
    if (type === 'profile' && creator_id) {
        const usageRecordExists = usagesData?.find((usage) => usage.item_id === creator_id);
        if (usageRecordExists) return { error: null };
    }

    if (usagesError || (usagesData?.length && usagesData.length >= limit)) {
        return { error: UsageError.limitExceeded };
    }

    const usage: UsagesDBInsert = {
        company_id,
        user_id,
        type,
        item_id: creator_id,
    };
    const { error: insertError } = await supabase.from('usages').insert([usage]);
    if (insertError) return { error: UsageError.errorRecordingUsage };

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
            'subscription_status, subscription_start_date, profiles_limit, trial_profiles_limit',
        )
        .eq('id', company_id)
        .single();
    if (!company || companyError) return { error: UsageError.noCompany };

    const subscriptionLimit =
        company.subscription_status === 'trial'
            ? company.trial_profiles_limit
            : company.profiles_limit;
    if (!subscriptionLimit) return { error: UsageError.noSubscriptionLimit };

    if (!company.subscription_start_date) return { error: UsageError.noSubscriptionStartDate };
    const startDate = new Date(company.subscription_start_date);

    return recordUsage({
        type: 'profile',
        startDate,
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
            'subscription_status, subscription_start_date, searches_limit, trial_searches_limit',
        )
        .eq('id', company_id)
        .single();
    if (!company || companyError) return { error: UsageError.noCompany };

    const subscriptionLimit =
        company.subscription_status === 'trial'
            ? company.trial_searches_limit
            : company.searches_limit;
    if (!subscriptionLimit) return { error: UsageError.noSubscriptionLimit };

    if (!company.subscription_start_date) return { error: UsageError.noSubscriptionStartDate };
    const startDate = new Date(company.subscription_start_date);
    // get current month start date by using the day of the month of the start date applied to this month. end date is a month later

    return recordUsage({
        type: 'search',
        startDate,
        subscriptionLimit,
        company_id,
        user_id,
    });
};
