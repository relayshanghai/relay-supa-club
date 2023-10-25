import { supabase } from 'src/utils/supabase-client';
import type { SubscriptionPlans, SubscriptionStatus } from 'types';
import type { CompanyDB, CompanyDBInsert, CompanyDBUpdate, RelayDatabase } from '../types';

export const getCompanyCusId = (companyId: string) =>
    supabase.from('companies').select('cus_id').eq('id', companyId).single();

export const getCompanyById = async (companyId: string) => {
    const { data, error } = await supabase.from('companies').select().eq('id', companyId).single();
    if (error) throw error;
    return data as CompanyDB;
};

export const getCompanyByCusId = (cusId: string) => supabase.from('companies').select().eq('cus_id', cusId).single();

/** updates the company, but does not allow usage limits or company onboarding status to be set */
export const updateCompany = async (update: CompanyDBUpdate) => {
    const {
        profiles_limit: _filter_out,
        searches_limit: _filter_out2,
        subscription_status: _filter_out3,
        subscription_start_date: _filter_out4,
        subscription_current_period_start: _filter_out5,
        subscription_current_period_end: _filter_out6,
        subscription_plan: _filter_out7,
        ...updateData
    } = update;
    const { data, error } = await supabase.from('companies').update(updateData).eq('id', update.id).select().single();

    if (error) throw error;
    return data;
};

type CompanyUsageLimitUpdate = {
    profiles_limit: string;
    searches_limit: string;
    ai_email_generator_limit: string;
    trial_searches_limit?: string;
    trial_profiles_limit?: string;
    trial_ai_email_generator_limit?: string;
    id: string;
};

export const updateCompanyUsageLimits = async ({
    profiles_limit,
    searches_limit,
    ai_email_generator_limit,
    trial_searches_limit,
    trial_profiles_limit,
    trial_ai_email_generator_limit,
    id,
}: CompanyUsageLimitUpdate) => {
    const update: Omit<CompanyUsageLimitUpdate, 'id'> = {
        profiles_limit,
        searches_limit,
        ai_email_generator_limit,
    };
    if (trial_profiles_limit) update.trial_profiles_limit = trial_profiles_limit;
    if (trial_searches_limit) update.trial_searches_limit = trial_searches_limit;
    if (trial_ai_email_generator_limit) update.trial_ai_email_generator_limit = trial_ai_email_generator_limit;

    const { data, error } = await supabase.from('companies').update(update).eq('id', id).select().single();

    if (error) throw error;
    return data;
};

/**
 * Note about the way our app handles subscriptions statuses:
 * We want to store this info in the database instead of having to call stripe every time we need to check the status. That means we need to be super careful about how and when we update this statuses and whether we can trust them. You can track that by looking where this function is called from.
 *
 * For current period, our strategy is to first only set the current period when creating a subscription, then, in the `usages.ts` file, whenever we are checking for usages, if we notice that the current period has ended we call stripe and update.
 *
 * Subscription end date is only ever set by the 'canceled' action, in `subscriptions/cancel`. So we can trust that if we see a subscription end date, it's because the subscription was canceled.
 */
export const updateCompanySubscriptionStatus = async ({
    subscription_status,
    subscription_start_date,
    subscription_end_date,
    subscription_current_period_start,
    subscription_current_period_end,
    id,
    subscription_plan,
}: {
    subscription_status: SubscriptionStatus;
    subscription_start_date?: string;
    subscription_end_date?: string;
    subscription_current_period_start?: string;
    subscription_current_period_end?: string;
    id: string;
    subscription_plan?: SubscriptionPlans;
}) => {
    const update: CompanyDBUpdate = {
        subscription_status,
    };
    if (subscription_start_date) update.subscription_start_date = subscription_start_date;
    if (subscription_end_date) update.subscription_end_date = subscription_end_date;
    if (subscription_current_period_start) update.subscription_current_period_start = subscription_current_period_start;
    if (subscription_current_period_end) update.subscription_current_period_end = subscription_current_period_end;
    if (subscription_plan) update.subscription_plan = subscription_plan;
    const { data, error } = await supabase.from('companies').update(update).eq('id', id).select().single();

    if (error) throw error;
    return data;
};

export const createCompany = (data: CompanyDBInsert) => {
    data.subscription_status = 'awaiting_payment_method';
    return supabase.from('companies').insert(data).select().single();
};

export const getCompanyByName = (name: string) => supabase.from('companies').select().eq('name', name).single();

export const getCompanyName = (id: string) => supabase.from('companies').select('name').eq('id', id).single();

export const getAllCompanyNames = () => supabase.from('companies').select('name');

export const getTeammatesByCompanyId = async (companyId: string) => {
    const { data, error } = await supabase.from('profiles').select().eq('company_id', companyId);
    if (error) throw error;
    return data;
};

export const findCompaniesByNames = (db: RelayDatabase) => async (name: string) => {
    const { data, error } = await db.from('companies').select().ilike('name', name);

    if (error) {
        throw error;
    }

    return data;
};
