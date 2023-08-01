import type { ListEmailsPostRequestBody, ListEmailsPostResponseBody } from 'pages/api/email-engine/list-emails';
import { GMAIL_INBOX, testAccount } from 'src/utils/api/email-engine/prototype-mocks';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import useSWR from 'swr';

export const useMessages = () => {
    const body: ListEmailsPostRequestBody = {
        account: testAccount,
        mailboxPath: GMAIL_INBOX,
    };

    const {
        data: inboxMessages,
        mutate: refreshInboxMessages,
        isLoading,
        error,
    } = useSWR(
        'email-engine/list-emails',
        () =>
            nextFetch<ListEmailsPostResponseBody>('email-engine/list-emails', {
                method: 'POST',
                body,
            }),
        {
            refreshInterval: 30000, // 30 seconds
        },
    );

    if (error) {
        clientLogger(error);
        throw new Error('Failed to load messages');
    }

    return {
        inboxMessages: inboxMessages?.messages,
        inboxPage: inboxMessages?.page,
        error,
        refreshInboxMessages,
        isLoading,
    };
};
