import { supabase } from 'src/utils/supabase-client';
import { SubscriptionStatus } from 'types';
import type {
    CompanyDB,
    CompanyDBInsert,
    CompanyDBUpdate,
    InvitesDB,
    ProfileDB,
    UsagesDB,
} from '../types';

export interface CompanyDBWithSubscription extends CompanyDB {
    subscription_status: SubscriptionStatus;
}

// Custom type for supabase queries where we select more than one row in a single query
export type CompanyWithProfilesInvitesAndUsage = CompanyDBWithSubscription & {
    profiles: Pick<ProfileDB, 'id' | 'first_name' | 'last_name' | 'admin'>[];
    invites: Pick<InvitesDB, 'id' | 'email' | 'used' | 'expire_at'>[];
    usages: Pick<UsagesDB, 'id' | 'type'>[];
};

export const getCompanyCusId = async (companyId: string) =>
    await supabase.from('companies').select('cus_id').eq('id', companyId).single();

export const getCompanyWithProfilesInvitesAndUsage = async (companyId: string) => {
    const { data, error } = await supabase
        .from('companies')
        .select(
            // If this query changes, make sure to update the CompanyWithProfilesInvitesAndUsage type
            '*, profiles(id, first_name, last_name, admin), invites(id, email, used, expire_at), usages(id, type)',
        )
        .eq('id', companyId)
        .eq('invites.used', false)
        .single();

    if (error) throw error;
    return data as CompanyWithProfilesInvitesAndUsage;
};

/** updates the company, but does not allow usage limits or company onboarding status to be set */
export const updateCompany = async (update: CompanyDBUpdate) => {
    const {
        profiles_limit: _filter_out,
        searches_limit: _filter_out2,
        subscription_status: _filter_out3,
        subscription_start_date: _filter_out4,
        ...updateData
    } = update;
    const { data, error } = await supabase
        .from('companies')
        .update(updateData)
        .eq('id', update.id)
        .select()
        .single();

    if (error) throw error;
    return data as CompanyDBWithSubscription;
};

type CompanyUsageLimitUpdate = {
    profiles_limit: string;
    searches_limit: string;
    trial_searches_limit?: string;
    trial_profiles_limit?: string;
    id: string;
};

export const updateCompanyUsageLimits = async ({
    profiles_limit,
    searches_limit,
    trial_searches_limit,
    trial_profiles_limit,
    id,
}: CompanyUsageLimitUpdate) => {
    const update: Omit<CompanyUsageLimitUpdate, 'id'> = {
        profiles_limit,
        searches_limit,
    };
    if (trial_profiles_limit) update.trial_profiles_limit = trial_profiles_limit;
    if (trial_searches_limit) update.trial_searches_limit = trial_searches_limit;
    const { data, error } = await supabase
        .from('companies')
        .update(update)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateCompanySubscriptionStatus = async ({
    subscription_status,
    subscription_start_date,
    subscription_end_date,
    id,
}: {
    subscription_status: SubscriptionStatus;
    subscription_start_date?: string;
    subscription_end_date?: string;
    id: string;
}) => {
    const update: CompanyDBUpdate = {
        subscription_status,
    };
    if (subscription_start_date) update.subscription_start_date = subscription_start_date;
    if (subscription_end_date) update.subscription_end_date = subscription_end_date;
    const { data, error } = await supabase
        .from('companies')
        .update(update)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const createCompany = async (data: CompanyDBInsert) => {
    data.subscription_status = 'awaiting_payment_method';
    return await supabase.from('companies').insert(data).select().single();
};
