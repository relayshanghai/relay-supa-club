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
    const { apiClient, loading } = useApiClient();
    const [_params, _setParams] = useState(paramDefaultValues);
    const [messages, setMessages] = useState<Email[]>([]);
    const [messagesFetched, setMessagesFetched] = useState<Record<number, Email[]>>({});

    const setParams = (newParams: GetThreadEmailsRequest) => {
        _setParams((prev) => ({
            ...prev,
            ...newParams,
        }));
    };
    const { threadId, ...params } = _params;

    const getMessages = async (threadId: string, params: Partial<typeof paramDefaultValues>) => {
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
    };

    useEffect(() => {
        setParams({
            page: paramDefaultValues.page,
            size: paramDefaultValues.size,
        } as GetThreadEmailsRequest);
        setMessages([]);
        setMessagesFetched({});
    }, [threadId]);

    const {
        data,
        error: messagesError,
        isLoading: isMessageLoading,
        mutate,
    } = useSWR([threadId, params], async () => getMessages(threadId, params));

    useEffect(() => {
        if (data && params.page <= data.totalPages) {
            setMessagesFetched((prev) => {
                return {
                    ...prev,
                    [data.page]: data.items,
                };
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        // will check the order of messagesFetched and setMessages
        for (let i = 1; i <= (data?.page as number); i++) {
            if (!messagesFetched[i]) {
                // get message from server
                getMessages(threadId, { ...params, page: i }).then((response) => {
                    setMessagesFetched((prev) => {
                        return {
                            ...prev,
                            [i]: response.items,
                        };
                    });
                });
            }
        }
        setMessages(() => {
            const messages = Object.values(messagesFetched)
                .reduce((acc, val) => {
                    return [...acc, ...val];
                }, [])
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            return messages;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messagesFetched]);

    return {
        loading,
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
