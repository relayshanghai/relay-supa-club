import { type GetThreadEmailsRequest } from 'pages/api/v2/threads/[id]/emails/request';
import { useState } from 'react';
import type { Email } from 'src/backend/database/thread/email-entity';
import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';
import useSWR from 'swr';
import { type Paginated } from 'types/pagination';

export const useMessages = (threadId: string) => {
    const { apiClient } = useApiClient();
    const [params, setParams] = useState({
        page: 1,
        size: 10,
    });

    const {
        data,
        error: messagesError,
        isLoading: isMessageLoading,
        mutate,
    } = useSWR<Paginated<Email>, any>(
        [threadId, params],
        async ({
            threadId,
            params = {
                page: 1,
                size: 10,
            },
        }: {
            threadId: string;
            params: GetThreadEmailsRequest;
        }) => {
            const [err, response] = await awaitToError(
                apiClient.get<Paginated<Email>>(`/v2/threads/${threadId}/emails`, { params }),
            );
            if (err || !threadId) {
                return {
                    items: [],
                    page: 1,
                    size: 10,
                    totalPages: 1,
                    totalSize: 0,
                } as Paginated<Email>;
            }
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
                if (
                    cached &&
                    fresh &&
                    fresh.items.length === cached.items.length &&
                    fresh.items.length > 0 &&
                    cached.items.length > 0
                ) {
                    return cached.items[0].id === fresh.items[0].id;
                }
                return (fresh?.items.length ?? 0) < (cached?.items.length ?? 0);
            },
        },
    );
    return {
        messages: data,
        messagesError,
        isMessageLoading,
        mutate,
        setParams,
    };
};
