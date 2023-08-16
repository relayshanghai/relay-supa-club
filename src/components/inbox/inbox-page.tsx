import { useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import { Layout } from '../layout';
import type { MessagesGetMessage } from 'types/email-engine/account-account-messages-get';
import type { EmailSearchPostResponseBody } from 'pages/api/email-engine/search';
import { clientLogger } from 'src/utils/logger-client';
import { ToolBar } from './tool-bar';
import { PreviewSection } from './preview-section';
import toast from 'react-hot-toast';
import { Spinner } from '../icons';
import { CorrespondenceSection } from './correspondence-section';
import {
    getInboxThreadMessages,
    getSentThreadMessages,
    updateMessageAsSeen,
} from 'src/utils/api/email-engine/handle-messages';
import { useMessages } from 'src/hooks/use-message';
import { GMAIL_SEEN_SPECIAL_USE_FLAG } from 'src/utils/api/email-engine/prototype-mocks';
import { useTranslation } from 'react-i18next';

export const InboxPage = () => {
    const [messages, setMessages] = useState<MessagesGetMessage[]>([]);
    const [searchResults, setSearchResults] = useState<MessagesGetMessage[]>([]);
    const [selectedMessages, setSelectedMessages] = useState<EmailSearchPostResponseBody['messages'] | null>(null);
    const [loadingSelectedMessages, setLoadingSelectedMessages] = useState(false);
    const [getSelectedMessagesError, setGetSelectedMessagesError] = useState('');
    const [selectedTab, setSelectedTab] = useState('inbox');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const { inboxMessages, isLoading, refreshInboxMessages } = useMessages();
    const { t } = useTranslation();

    useEffect(() => {
        if (!inboxMessages) {
            return;
        }
        setMessages(inboxMessages);
    }, [inboxMessages]);

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
            const inboxThreadMessages = await getInboxThreadMessages(message);
            const sentThreadMessages = await getSentThreadMessages(message);
            const threadMessages = inboxThreadMessages.concat(sentThreadMessages);
            threadMessages.sort((a, b) => {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
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

    useEffect(() => {
        if (!selectedMessages) {
            return;
        }
        const unSeenMessages = selectedMessages.filter((message) => {
            return !message.flags.includes(GMAIL_SEEN_SPECIAL_USE_FLAG);
        });
        unSeenMessages.forEach(async (message) => {
            await updateMessageAsSeen(message.id);
            refreshInboxMessages();
        });
    }, [refreshInboxMessages, selectedMessages]);

    //Show the first message in the list when the page loads by default
    useEffect(() => {
        if (!selectedMessages && messages.length > 0) {
            handleGetThreadEmails(messages[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages]);

    return (
        <Layout>
            <div className="flex h-full">
                {isLoading ? (
                    <div className="flex w-full items-center justify-center">
                        <Spinner className="h-6 w-6 fill-primary-600 text-primary-200" />
                    </div>
                ) : (
                    <>
                        {messages.length === 0 && !isLoading && <p>{t('inbox.noMessagesInMailbox')}</p>}
                        <div className="h-full w-[320px] overflow-auto">
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
                                            selectedMessages={selectedMessages}
                                            handleGetThreadEmails={handleGetThreadEmails}
                                            loadingSelectedMessages={loadingSelectedMessages}
                                        />
                                    ) : (
                                        <PreviewSection
                                            messages={filteredMessages}
                                            selectedMessages={selectedMessages}
                                            handleGetThreadEmails={handleGetThreadEmails}
                                            loadingSelectedMessages={loadingSelectedMessages}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                        <div className="h-full flex-grow overflow-auto">
                            {selectedMessages && (
                                <CorrespondenceSection
                                    // TODO: add selectedSequenceInfluencers
                                    selectedMessages={selectedMessages}
                                    loadingSelectedMessages={loadingSelectedMessages}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};
