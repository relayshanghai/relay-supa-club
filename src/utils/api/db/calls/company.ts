import { supabase } from 'src/utils/supabase-client';
import type { CompanyDB, CompanyDBUpdate, InvitesDB, ProfileDB, UsagesDB } from '../types';

// Custom type for supabase queries where we select more than one row in a single query
export type CompanyWithProfilesInvitesAndUsage = CompanyDB & {
    profiles: Pick<ProfileDB, 'id' | 'first_name' | 'last_name' | 'admin'>[];
    invites: Pick<InvitesDB, 'id' | 'email' | 'used' | 'expire_at'>[];
    usages: Pick<UsagesDB, 'id'>[];
};

export const getCompanyWithProfilesInvitesAndUsage = async (companyId: string) =>
    await supabase
        .from('companies')
        .select(
            // If this query changes, make sure to update the CompanyWithProfilesInvitesAndUsage type
            '*, profiles(id, first_name, last_name, admin), invites(id, email, used, expire_at), usages(id)'
        )
        .eq('id', companyId)
        .eq('invites.used', false)
        .single();

export const updateCompany = async (data: CompanyDBUpdate) =>
    await supabase.from('companies').update(data).eq('id', data.id).single();
