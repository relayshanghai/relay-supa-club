import type { RelayDatabase } from '../types';
import type { MessageType } from 'src/components/boostbot/message';
import type { SearchTableInfluencer as BoostbotInfluencer } from 'types';
import type { Json } from 'types/supabase';

const createBoostbotConversation =
    (supabaseClient: RelayDatabase) => async (chatMessages: MessageType[], profileId: string) => {
        if (!profileId) {
            throw new Error('No profile id found');
        }

        const { data, error } = await supabaseClient
            .from('boostbot_conversations')
            .insert({
                profile_id: profileId,
                chat_messages: chatMessages as Json,
            })
            .select()
            .single();

        if (error) throw error;

        return data;
    };

export const getMostRecentBoostbotConversationCall = (supabaseClient: RelayDatabase) => async (profileId: string) => {
    if (!profileId) {
        throw new Error('No profile id found');
    }

    const { data, error } = await supabaseClient
        .from('boostbot_conversations')
        .select('chat_messages, search_results')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    // If a conversation is not found, create a new one. PGRST116 is the error code for "no rows returned by query". https://postgrest.org/en/stable/references/errors.html
    if (error?.code === 'PGRST116') {
        return await createBoostbotConversation(supabaseClient)(
            [
                { sender: 'Bot', type: 'translation', translationKey: 'boostbot.chat.introMessageFirstTimeA' },
                { sender: 'Bot', type: 'translation', translationKey: 'boostbot.chat.introMessageFirstTimeB' },
                { sender: 'Bot', type: 'translation', translationKey: 'boostbot.chat.introMessageFirstTimeC' },
            ],
            profileId,
        );
    } else if (error) {
        throw error;
    }

    return data;
};

export const createNewBoostbotConversationCall =
    (supabaseClient: RelayDatabase) =>
    async (profileId: string, firstName = '') =>
        await createBoostbotConversation(supabaseClient)(
            [
                {
                    sender: 'Bot',
                    type: 'translation',
                    translationKey: 'boostbot.chat.introMessage',
                    translationValues: { username: firstName || '👋' },
                },
            ],
            profileId,
        );

export const updateBoostbotConversationCall =
    (supabaseClient: RelayDatabase) =>
    async ({
        chatMessages,
        searchResults,
        profileId,
    }: {
        chatMessages?: MessageType[];
        searchResults?: BoostbotInfluencer[];
        profileId: string;
    }) => {
        if (!profileId) {
            throw new Error('No profile id found');
        }

        const { data, error } = await supabaseClient
            .from('boostbot_conversations')
            .update({
                chat_messages: chatMessages as Json,
                search_results: searchResults as unknown as Json,
            })
            // We currently only work with the latest user's conversation. In the future, we might want to support multiple conversations like ChatGPT does. In that case we'll need to query by the conversation id.
            .eq('profile_id', profileId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error) throw error;

        return data;
    };
