import type { ListEmailsPostRequestBody, ListEmailsPostResponseBody } from 'pages/api/email-engine/list-emails';
import { GMAIL_INBOX } from 'src/utils/api/email-engine/prototype-mocks';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import useSWR from 'swr';
import { useUser } from './use-user';

export const useMessages = () => {
    const { profile } = useUser();

    const {
        data: inboxMessages,
        mutate: refreshInboxMessages,
        isLoading,
        error,
    } = useSWR(
        profile?.email_engine_account_id ? [profile?.email_engine_account_id, 'email-engine/list-emails'] : null,
        async ([account, path]) => {
            const body: ListEmailsPostRequestBody = {
                account,
                mailboxPath: GMAIL_INBOX,
            };
            return await nextFetch<ListEmailsPostResponseBody>(path, {
                method: 'POST',
                body,
            });
        },
        {
            refreshInterval: 30000, // 30 seconds
        },
    );

    if (error) {
        clientLogger(error);
    }

    return {
        inboxMessages: inboxMessages?.messages,
        inboxPage: inboxMessages?.page,
        error,
        refreshInboxMessages,
        isLoading,
    };
};
