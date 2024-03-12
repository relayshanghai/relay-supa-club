import type { Email } from 'src/backend/database/thread/email-entity';
import { useApiClient } from 'src/utils/api-client/request';
import useSWR from 'swr';

export const useMessages = (threadId: string) => {
    const { apiClient } = useApiClient();

    const {
        data,
        error: messagesError,
        isLoading: isMessageLoading,
        mutate,
    } = useSWR<Email[], any>(
        threadId,
        async (threadId) => {
            const response = await apiClient.get<Email[]>(`/v2/threads/${threadId}/emails`);
            return response.data;
        },
        {
            revalidateOnFocus: true,
            refreshInterval: 15000,
            compare: (cached, fresh) => {
                if (fresh === undefined && cached === undefined) {
                    return true;
                }
                if (!fresh && cached) {
                    return false;
                }
                if (cached && fresh && fresh.length === cached.length && fresh.length > 0 && cached.length > 0) {
                    return cached[0].id === fresh[0].id;
                }
                return (fresh?.length ?? 0) < (cached?.length ?? 0);
            },
        },
    );
    return {
        messages: data,
        messagesError,
        isMessageLoading,
        mutate,
    };
};
