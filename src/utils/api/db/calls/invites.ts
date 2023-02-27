import { supabase } from 'src/utils/supabase-client';

export const getInvitesByCompany = async (companyId: string) => {
    const { data, error } = await supabase.from('invites').select().eq('company_id', companyId);
    if (error) throw error;
    return data;
};

export const getInviteById = async (inviteId: string) => {
    const { data, error } = await supabase
        .from('invites')
        .select()
        .eq('id', inviteId)
        .limit(1)
        .single();
    if (error) throw error;
    return data;
};

export const markInviteUsed = async (inviteId: string) => {
    const { error: updateError } = await supabase
        .from('invites')
        .update({
            used: true,
        })
        .eq('id', inviteId)
        .single();

    if (updateError) {
        throw new Error(updateError.message);
    }
};

export const getExistingInvite = async (email: string, companyId: string) => {
    const { data: existingInvite } = await supabase
        .from('invites')
        .select('expire_at, used')
        .eq('email', email)
        .eq('company_id', companyId)
        .limit(1)
        .single();

    return existingInvite;
};

export const getInviteValidityData = async (inviteId: string) =>
    await supabase
        .from('invites')
        .select('used, expire_at, email')
        .eq('id', inviteId)
        .limit(1)
        .single();

export const insertInvite = async ({
    email,
    company_id,
    company_owner,
}: {
    email: string;
    company_id: string;
    company_owner?: boolean;
}) => {
    const { data: insertData, error: insertError } = await supabase
        .from('invites')
        .insert({
            email,
            company_id,
            company_owner: company_owner ?? false,
        })
        .select()
        .single();

    if (insertError) {
        throw new Error(insertError.message);
    }
    return insertData;
};
