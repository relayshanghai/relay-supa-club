import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import type { CreatorPlatform } from 'types';
import { useUser } from './use-user';
import { useCompany } from './use-company';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import type { GetTopicsBody, GetTopicsResponse } from 'pages/api/boostbot/get-topics';
import type { GetRelevantTopicsBody, GetRelevantTopicsResponse } from 'pages/api/boostbot/get-relevant-topics';
import type { GetTopicClustersBody, GetTopicClustersResponse } from 'pages/api/boostbot/get-topic-clusters';
import type { GetInfluencersBody, GetInfluencersResponse } from 'pages/api/boostbot/get-influencers';
import type { SearchInfluencersPayloadRequired } from 'src/utils/api/iqdata/influencers/search-influencers-payload';
import type {
    GetTopicsAndRelevanceBody,
    GetTopicsAndRelevanceResponse,
} from 'pages/api/boostbot/get-topics-and-relevance';
import type { RelevantTopic } from 'src/utils/api/boostbot/get-topic-relevance';
import {
    getMostRecentBoostbotConversationCall,
    createNewBoostbotConversationCall,
    updateBoostbotConversationCall,
} from 'src/utils/api/db/calls/boostbot-conversations';
import { useDB } from 'src/utils/client-db/use-client-db';
import type { MessageType } from 'src/components/boostbot/message';
import type { SearchTableInfluencer as BoostbotInfluencer } from 'types';

type UseBoostbotProps = {
    abortSignal?: AbortController['signal'];
};

// Majority of these requests will eventually move to the backend to be safer (not abusable) and faster. https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/828
export const useBoostbot = ({ abortSignal }: UseBoostbotProps = {}) => {
    const { profile } = useUser();
    const { company } = useCompany();
    const getMostRecentBoostbotConversation = useDB(getMostRecentBoostbotConversationCall);
    const createNewConversation = useDB(createNewBoostbotConversationCall);
    const updateConversation = useDB(updateBoostbotConversationCall);

    // Using 'profile?.id' as a key does 2 things - 1) If the user profile hasn't loaded yet, don't fetch. 2) If a different account logged in, revalidate.
    const {
        data: conversation,
        mutate: refreshConversation,
        isLoading: isConversationLoading,
    } = useSWR(profile?.id ? [profile.id, 'get-boostbot-conversation'] : null, async () => {
        if (!profile?.id) return null;
        return await getMostRecentBoostbotConversation(profile.id);
    });

    const [messages, setMessages] = useState<MessageType[]>((conversation?.chat_messages as MessageType[]) ?? []);
    const [influencers, setInfluencers] = useState<BoostbotInfluencer[]>(
        (conversation?.search_results as unknown as BoostbotInfluencer[]) ?? [],
    );
    // Using 'useState' and 'useEffect' here to prevent the results from flashing off and on the screen when the conversation is being revalidated (becomes null during revalidation).
    useEffect(() => {
        if (!profile?.id) {
            setMessages([]);
            setInfluencers([]);
        } else {
            if (conversation?.chat_messages) {
                setMessages(conversation.chat_messages as MessageType[]);
            }
            if (conversation?.search_results) {
                setInfluencers(conversation.search_results as unknown as BoostbotInfluencer[]);
            }
        }
    }, [conversation, profile?.id, setInfluencers]);

    const performFetch = useCallback(
        async <T, B>(endpoint: string, body: B): Promise<T> => {
            try {
                const response = await nextFetch<T>(`boostbot/${endpoint}`, {
                    signal: abortSignal,
                    method: 'POST',
                    body,
                });

                return response;
            } catch (error) {
                clientLogger(error, 'error');
                throw error;
            }
        },
        [abortSignal],
    );

    const getTopics = useCallback(
        async (productDescription: string) =>
            await performFetch<GetTopicsResponse, GetTopicsBody>('get-topics', {
                productDescription,
            }),
        [performFetch],
    );

    const getRelevantTopics = useCallback(
        async ({ topics, platform }: { topics: string[]; platform: CreatorPlatform }) =>
            await performFetch<GetRelevantTopicsResponse, GetRelevantTopicsBody>('get-relevant-topics', {
                topics,
                platform,
            }),
        [performFetch],
    );

    const getTopicClusters = useCallback(
        async ({ productDescription, topics }: { productDescription: string; topics: string[] }) =>
            await performFetch<GetTopicClustersResponse, GetTopicClustersBody>('get-topic-clusters', {
                productDescription,
                topics,
            }),
        [performFetch],
    );

    const getInfluencers = useCallback(
        async (searchPayloads: SearchInfluencersPayloadRequired[]) => {
            if (!company?.id || !profile?.id) throw new Error('No company or profile found');

            return await performFetch<GetInfluencersResponse, GetInfluencersBody>('get-influencers', {
                searchPayloads,
                user_id: profile.id,
                company_id: company.id,
            });
        },
        [performFetch, company, profile],
    );

    const getTopicsAndRelevance = useCallback(
        async (topics: RelevantTopic[], reference_id: string) => {
            const topicsAndRelevance = await performFetch<GetTopicsAndRelevanceResponse, GetTopicsAndRelevanceBody>(
                'get-topics-and-relevance',
                { topics, reference_id },
            );

            return topicsAndRelevance;
        },
        [performFetch],
    );

    return {
        messages,
        setMessages,
        influencers,
        updateConversation,
        refreshConversation,
        createNewConversation,
        isConversationLoading,
        getTopics,
        getRelevantTopics,
        getTopicClusters,
        getInfluencers,
        getTopicsAndRelevance,
        setInfluencers,
    };
};
