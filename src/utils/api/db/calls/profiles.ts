import { supabase } from 'src/utils/supabase-client';
import { ProfileDBUpdate, ProfileInsertDB } from '../types';

/** automatically updates `updated_at` field */
export const upsertProfile = async (profile: ProfileInsertDB) =>
    await supabase
        .from('profiles')
        .upsert({
            updated_at: new Date().toString(),
            ...profile
        })
        .select()
        .single();

export const updateProfile = async (data: ProfileDBUpdate) =>
    await supabase.from('profiles').update(data).eq('id', data.id).select().single();
