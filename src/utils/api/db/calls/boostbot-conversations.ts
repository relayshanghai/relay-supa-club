import type { RelayDatabase } from '../types';
import type { MessageType } from 'src/components/boostbot/message';
import type { BoostbotInfluencer } from 'pages/api/boostbot/get-influencers';
import type { Json } from 'types/supabase';

const createBoostbotConversation = (supabaseClient: RelayDatabase) => async (chatMessages: MessageType[]) => {
    const { data: userData } = await supabaseClient.auth.getUser();

    if (!userData.user) {
        throw new Error('No profile id found');
    }

    const { data, error } = await supabaseClient
        .from('boostbot_conversations')
        .insert({
            profile_id: userData.user.id,
            chat_messages: chatMessages as Json,
        })
        .select()
        .single();

    if (error) throw error;

    return data;
};

export const getBoostbotConversationCall = (supabaseClient: RelayDatabase) => async () => {
    const { data, error } = await supabaseClient
        .from('boostbot_conversations')
        .select('chat_messages, search_results')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    // If a conversation is not found, create a new one. PGRST116 is the error code for "no rows returned by query". https://postgrest.org/en/stable/references/errors.html
    if (error?.code === 'PGRST116') {
        return await createBoostbotConversation(supabaseClient)([
            { sender: 'Bot', type: 'translation', translationKey: 'boostbot.chat.introMessageFirstTimeA' },
            { sender: 'Bot', type: 'translation', translationKey: 'boostbot.chat.introMessageFirstTimeB' },
            { sender: 'Bot', type: 'translation', translationKey: 'boostbot.chat.introMessageFirstTimeC' },
        ]);
    } else if (error) {
        throw error;
    }

    return data;
};

export const createNewBoostbotConversationCall = (supabaseClient: RelayDatabase) => async () => {
    const { data: userData } = await supabaseClient.auth.getUser();

    return await createBoostbotConversation(supabaseClient)([
        {
            sender: 'Bot',
            type: 'translation',
            translationKey: 'boostbot.chat.introMessage',
            translationValues: { username: userData.user?.user_metadata.first_name || '👋' },
        },
    ]);
};

export const updateBoostbotConversationCall =
    (supabaseClient: RelayDatabase) =>
    async ({ chatMessages, searchResults }: { chatMessages?: MessageType[]; searchResults?: BoostbotInfluencer[] }) => {
        const { data: userData } = await supabaseClient.auth.getUser();

        if (!userData.user) {
            throw new Error('No profile id found');
        }

        const { data, error } = await supabaseClient
            .from('boostbot_conversations')
            .update({
                chat_messages: chatMessages as Json,
                search_results: searchResults as unknown as Json,
            })
            // We currently only work with the latest user's conversation. In the future, we might want to support multiple conversations like ChatGPT does. In that case we'll need to query by the conversation id.
            .eq('profile_id', userData.user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error) throw error;

        return data;
    };
