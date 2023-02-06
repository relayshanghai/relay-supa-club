import { supabase } from 'src/utils/supabase-client';
import { ProfileDBUpdate, ProfileInsertDB } from '../types';

/** inserts profile but does not allow changing of admin status, automatically updates `updated_at` field */
export const insertProfile = (insert: ProfileInsertDB) => {
    const { admin: _filter_out, ...insertData } = insert;
    insertData.updated_at = new Date().toISOString();
    supabase.from('profiles').insert(insertData).select().single();
};

/** updates profile but does not allow changing of admin status, automatically updates `updated_at` field */
export const updateProfile = (update: ProfileDBUpdate) => {
    const { admin: _filter_out, ...updateData } = update;
    updateData.updated_at = new Date().toISOString();
    return supabase.from('profiles').update(updateData).eq('id', updateData.id).select().single();
};

export const updateUserAdminRole = (userId: string, admin: boolean) =>
    supabase.from('profiles').update({ admin }).eq('id', userId).select().single();
