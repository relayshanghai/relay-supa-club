import { useCallback, useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import { Layout } from '../layout';
import { nextFetch } from 'src/utils/fetcher';
import { GMAIL_INBOX, GMAIL_SENT, testAccount } from 'src/utils/api/email-engine/prototype-mocks';
import type { ListEmailsPostRequestBody } from 'pages/api/email-engine/list-emails';
import type { MessagesGetMessage } from 'types/email-engine/account-account-messages-get';
import type { EmailSearchPostRequestBody, EmailSearchPostResponseBody } from 'pages/api/email-engine/search';
import { clientLogger } from 'src/utils/logger-client';
import { ToolBar } from './tool-bar';
import { PreviewSection } from './preview-section';
import toast from 'react-hot-toast';
import { Spinner } from '../icons';
import { CorrespondenceSection } from './correspondence-section';

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
            throw error.message;
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
            // console.log({ inboxThreadMessages }, { sentMessages });
            const threadMessages = inboxThreadMessages.concat(sentMessages);
            threadMessages.sort((a, b) => {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
            setSelectedMessages(threadMessages);
            setLoadingSelectedMessages(false);
        } catch (error: any) {
            clientLogger(error, 'error');
            setGetSelectedMessagesError(error.message);
            toast(getSelectedMessagesError);
        }
        setLoadingSelectedMessages(false);
    };

    return (
        <Layout>
            <div className="flex h-full">
                {loadingMessages ? (
                    <div className="flex w-full items-center justify-center">
                        <Spinner className="h-6 w-6 fill-primary-600 text-primary-200" />
                    </div>
                ) : (
                    <>
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
                                    {searchResults.length > 0 ? (
                                        <PreviewSection
                                            messages={searchResults}
                                            handleGetThreadEmails={handleGetThreadEmails}
                                            loadingSelectedMessages={loadingSelectedMessages}
                                        />
                                    ) : (
                                        <PreviewSection
                                            messages={filteredMessages}
                                            handleGetThreadEmails={handleGetThreadEmails}
                                            loadingSelectedMessages={loadingSelectedMessages}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                        <div className="w-3/5 overflow-y-auto">
                            {selectedMessages ? (
                                <CorrespondenceSection
                                    selectedMessages={selectedMessages}
                                    loadingSelectedMessages={loadingSelectedMessages}
                                />
                            ) : (
                                <div className="font-sm flex h-full items-center justify-center text-gray-500">
                                    No message has been selected yet.
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};
