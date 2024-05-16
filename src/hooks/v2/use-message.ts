import { type GetThreadEmailsRequest } from 'pages/api/v2/threads/[id]/emails/request';
import { useEffect, useState } from 'react';
import type { Email } from 'src/backend/database/thread/email-entity';
import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';
import useSWR from 'swr';
import { type Paginated } from 'types/pagination';

export const paramDefaultValues = {
    threadId: '',
    page: 1,
    size: 10,
};

export const useMessages = () => {
    const { apiClient } = useApiClient();
    const [_params, _setParams] = useState(paramDefaultValues);
    const [messages, setMessages] = useState<Email[]>([]);

    const setParams = (newParams: GetThreadEmailsRequest) => {
        _setParams((prev) => ({
            ...prev,
            ...newParams,
        }));
    };
    const { threadId, ...params } = _params;

    useEffect(() => {
        setParams({
            page: paramDefaultValues.page,
            size: paramDefaultValues.size,
        } as GetThreadEmailsRequest);
        setMessages([]);
    }, [threadId]);

    const {
        data,
        error: messagesError,
        isLoading: isMessageLoading,
        mutate,
    } = useSWR([threadId, params], async () => {
        if (!threadId) {
            return {
                items: [],
                page: 1,
                size: 10,
                totalPages: 1,
                totalSize: 1,
            } as Paginated<Email>;
        }
        const [err, response] = await awaitToError(
            apiClient.get<Paginated<Email>>(`/v2/threads/${threadId}/emails`, { params }),
        );
        if (err) {
            return {
                items: [],
                page: 1,
                size: 10,
                totalPages: 1,
                totalSize: 1,
            } as Paginated<Email>;
        }
        return response.data;
    });

    useEffect(() => {
        if (data && params.page <= data.totalPages) {
            setMessages((prev) => {
                if (data.page === 1) {
                    return data.items;
                }
                const uniqueItems = data.items.filter((item) => {
                    return !prev.some((prevItem) => prevItem.uid === item.uid);
                });
                return [...prev, ...uniqueItems];
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return {
        messages,
        messagesError,
        isMessageLoading,
        mutate,
        params,
        setParams,
        metadata: {
            page: data?.page,
            size: data?.size,
            totalPages: data?.totalPages,
            totalSize: data?.totalSize,
        },
    };
};
