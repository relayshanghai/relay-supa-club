import { useCallback, useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import { Layout } from '../layout';
import { nextFetch } from 'src/utils/fetcher';
import { GMAIL_INBOX, GMAIL_SENT, testAccount } from 'src/utils/api/email-engine/prototype-mocks';
import type { ListEmailsPostRequestBody } from 'pages/api/email-engine/list-emails';
import type { MessagesGetMessage } from 'types/email-engine/account-account-messages-get';
import type { EmailSearchPostRequestBody, EmailSearchPostResponseBody } from 'pages/api/email-engine/search';
import { clientLogger } from 'src/utils/logger-client';
import { Email } from './Email';
import { PreviewCard } from './preview-card';
import { ToolBar } from './tool-bar';

export const InboxPage = () => {
    const [messages, setMessages] = useState<MessagesGetMessage[]>([]);
    const [searchResults, setSearchResults] = useState<MessagesGetMessage[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [getMessagesError, setGetMessagesError] = useState('');

    const [selectedMessages, setSelectedMessages] = useState<EmailSearchPostResponseBody['messages'] | null>(null);
    const [loadingSelectedMessages, setLoadingSelectedMessages] = useState(false);
    const [getSelectedMessagesError, setGetSelectedMessagesError] = useState('');
    const [selectedTab, setSelectedTab] = useState('new');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const getMessages = useCallback(async () => {
        setLoadingMessages(true);
        setGetMessagesError('');
        try {
            const body: ListEmailsPostRequestBody = {
                account: testAccount,
            };
            const { messages } = await nextFetch('email-engine/list-emails', { method: 'POST', body });
            setMessages(messages);
        } catch (error: any) {
            clientLogger(error, 'error');
            setGetMessagesError(error.message);
        } finally {
            setLoadingMessages(false);
        }
    }, []);

    useEffect(() => {
        if (!loadingMessages && messages.length === 0) {
            getMessages();
        }
    }, [getMessages, loadingMessages, messages.length]);

    const filteredMessages = useMemo(() => {
        if (selectedTab === 'new') {
            return messages.filter((message) => message.unseen);
        }
        return messages;
    }, [messages, selectedTab]);

    useEffect(() => {
        if (searchTerm === '') {
            setSearchResults([]);
            return;
        }
        const fuse = new Fuse(filteredMessages, {
            keys: ['from.name', 'from.address', 'to.name', 'to.address', 'date', 'subject'],
        });
        const results = fuse.search(searchTerm);
        setSearchResults(results.map((result) => result.item));
    }, [filteredMessages, searchTerm]);

    const renderMessagesPreview = (messages: MessagesGetMessage[]) => {
        return messages.map((message) => (
            <div key={message.id}>
                <PreviewCard
                    message={message}
                    handleGetThreadEmails={handleGetThreadEmails}
                    loadingSelectedMessages={loadingSelectedMessages}
                />
            </div>
        ));
    };

    const handleGetThreadEmails = async (message: MessagesGetMessage) => {
        setSelectedMessages([]);
        setLoadingSelectedMessages(true);
        setGetSelectedMessagesError('');
        try {
            const body: EmailSearchPostRequestBody = {
                account: testAccount,
                mailboxPath: GMAIL_INBOX,
                search: {
                    threadId: message.threadId,
                },
            };
            const { messages: inboxThreadMessages } = await nextFetch<EmailSearchPostResponseBody>(
                'email-engine/search',
                {
                    method: 'POST',
                    body,
                },
            );
            const { messages: sentMessages } = await nextFetch<EmailSearchPostResponseBody>('email-engine/search', {
                method: 'POST',
                body: {
                    ...body,
                    mailboxPath: GMAIL_SENT,
                    search: {
                        threadId: message.threadId,
                    },
                },
            });
            const threadMessages = inboxThreadMessages.concat(sentMessages);
            threadMessages.sort((a, b) => {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
            setSelectedMessages(threadMessages);
            setLoadingSelectedMessages(false);
        } catch (error: any) {
            clientLogger(error, 'error');
            setGetSelectedMessagesError(error.message);
        }
        setLoadingSelectedMessages(false);
    };

    return (
        <Layout>
            <div className="flex h-full">
                {loadingMessages && <p>Loading...</p>}
                {getMessagesError && <p>Error: {getMessagesError}</p>}
                {messages.length === 0 && !loadingMessages && !getMessagesError && <p>No messages</p>}
                <div className="w-2/5">
                    {messages.length > 0 && (
                        <>
                            <ToolBar
                                selectedTab={selectedTab}
                                setSelectedTab={setSelectedTab}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                            />
                            <ul className="h-full overflow-y-auto">
                                {searchResults.length > 0
                                    ? renderMessagesPreview(searchResults)
                                    : renderMessagesPreview(filteredMessages)}
                            </ul>
                        </>
                    )}
                </div>
                <div className="w-3/5">
                    {getSelectedMessagesError && <p>Error: {getSelectedMessagesError}</p>}
                    {selectedMessages && (
                        <ul>
                            {loadingSelectedMessages && <p>Loading...</p>}
                            {selectedMessages.map((message) => (
                                <li className="m-2 border border-black p-2" key={message.id}>
                                    <Email message={message} />
                                </li>
                            ))}
                        </ul>
                    )}
                    {!selectedMessages && !loadingMessages && (
                        <div className="font-sm flex h-full items-center justify-center overflow-y-auto text-gray-500">
                            No message has been selected yet.
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};
