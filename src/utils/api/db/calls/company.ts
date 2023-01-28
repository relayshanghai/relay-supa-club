import { supabase } from 'src/utils/supabase-client';
import type {
    CompanyDB,
    CompanyDBInsert,
    CompanyDBUpdate,
    InvitesDB,
    ProfileDB,
    UsagesDB,
} from '../types';

// Custom type for supabase queries where we select more than one row in a single query
export type CompanyWithProfilesInvitesAndUsage = CompanyDB & {
    profiles: Pick<ProfileDB, 'id' | 'first_name' | 'last_name' | 'admin'>[];
    invites: Pick<InvitesDB, 'id' | 'email' | 'used' | 'expire_at'>[];
    usages: Pick<UsagesDB, 'id' | 'type'>[];
};

export const getCompanyCusId = async (companyId: string) =>
    await supabase.from('companies').select('cus_id').eq('id', companyId).single();

export const getCompanyWithProfilesInvitesAndUsage = async (companyId: string) =>
    await supabase
        .from('companies')
        .select(
            // If this query changes, make sure to update the CompanyWithProfilesInvitesAndUsage type
            '*, profiles(id, first_name, last_name, admin), invites(id, email, used, expire_at), usages(id, type)',
        )
        .eq('id', companyId)
        .eq('invites.used', false)
        .single();

export const updateCompany = async (data: CompanyDBUpdate) =>
    await supabase.from('companies').update(data).eq('id', data.id).select().single();

export const createCompany = async (data: CompanyDBInsert) =>
    await supabase.from('companies').insert(data).select().single();
