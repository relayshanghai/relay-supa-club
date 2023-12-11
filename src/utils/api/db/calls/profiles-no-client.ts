// 'no-client' means that the functions are not wrapping the client in a higher order function, so that the client needs to be imported here, meaning these calls can only be used by the backend.
import { supabase } from 'src/utils/supabase-client'; // TODO: refactor calls so that we do not need to import supabase here. https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/721
import type { AccountRole } from 'types';
import type { ProfileDBUpdate, ProfileDBInsert, RelayDatabase } from '../types';

/** inserts profile but does not allow changing of role status, automatically updates `updated_at` field */
export const insertProfile = (insert: ProfileDBInsert) => {
    const { user_role: _filter_out, ...insertData } = insert;
    insertData.updated_at = new Date().toISOString();
    return supabase.from('profiles').insert(insertData).select().single();
};

/** updates profile but does not allow changing of role status, automatically updates `updated_at` field */
export const updateProfile = (update: ProfileDBUpdate) => {
    const { user_role: _filter_out, ...updateData } = update;
    updateData.updated_at = new Date().toISOString();
    return supabase.from('profiles').update(updateData).eq('id', updateData.id).select().single();
};

export const updateUserRole = (userId: string, user_role: AccountRole) =>
    supabase.from('profiles').update({ user_role }).eq('id', userId).select().single();

export const addCompanyToUserAndMakeAdmin = (db: RelayDatabase) => async (userId: string, companyId: string) => {
    const { data, error } = await db
        .from('profiles')
        .update({ user_role: 'company_owner', company_id: companyId })
        .eq('id', userId)
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const getUserRole = (userId: string) => supabase.from('profiles').select('user_role').eq('id', userId).single();

export const getProfileByEmail = (email: string) => supabase.from('profiles').select().eq('email', email).single();

export const getProfileBySequenceSendEmail = (email: string) =>
    supabase.from('profiles').select().limit(1).eq('sequence_send_email', email).single();

export const getProfileById = (id: string) => supabase.from('profiles').select().eq('id', id).single();
