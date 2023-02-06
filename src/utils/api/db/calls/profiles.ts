import { supabase } from 'src/utils/supabase-client';
import { AccountRole } from 'types';
import { ProfileDBUpdate, ProfileInsertDB } from '../types';

/** inserts profile but does not allow changing of role status, automatically updates `updated_at` field */
export const insertProfile = (insert: ProfileInsertDB) => {
    const { role: _filter_out, ...insertData } = insert;
    insertData.updated_at = new Date().toISOString();
    supabase.from('profiles').insert(insertData).select().single();
};

/** updates profile but does not allow changing of role status, automatically updates `updated_at` field */
export const updateProfile = (update: ProfileDBUpdate) => {
    const { role: _filter_out, ...updateData } = update;
    updateData.updated_at = new Date().toISOString();
    return supabase.from('profiles').update(updateData).eq('id', updateData.id).select().single();
};

export const updateUserRole = (userId: string, role: AccountRole) =>
    supabase.from('profiles').update({ role }).eq('id', userId).select().single();
