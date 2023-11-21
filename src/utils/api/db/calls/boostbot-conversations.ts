import type { RelayDatabase } from '../types';

export const getBoostbotConversationsCall = (supabaseClient: RelayDatabase) => async () => {
    const { data, error } = await supabaseClient.from('boostbot_conversations').select('*');

    if (error) throw error;
    return data;
};
