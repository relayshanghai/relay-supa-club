import Fuse from 'fuse.js';
import type { EmailSearchPostResponseBody } from 'pages/api/email-engine/search';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useMessages } from 'src/hooks/use-message';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { useUser } from 'src/hooks/use-user';
import {
    getInboxThreadMessages,
    getSentThreadMessages,
    updateMessageAsSeen,
} from 'src/utils/api/email-engine/handle-messages';
import { GMAIL_SEEN_SPECIAL_USE_FLAG } from 'src/utils/api/email-engine/prototype-mocks';
import { clientLogger } from 'src/utils/logger-client';
import type { MessagesGetMessage } from 'types/email-engine/account-account-messages-get';
import { Spinner } from '../icons';
import { Layout } from '../layout';
import { CorrespondenceSection } from './correspondence-section';
import { PreviewSection } from './preview-section';
import { ToolBar } from './tool-bar';

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

    const { track } = useRudderstackTrack()

    useEffect(() => {
        const { abort } = track("TEST:Outreach Open Inbox Page")
        return abort;
    }, [track])

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
    const { profile } = useUser();

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
            if (!profile?.email_engine_account_id) {
                throw new Error('No email account');
            }
            const inboxThreadMessages = await getInboxThreadMessages(message, profile.email_engine_account_id);
            const sentThreadMessages = await getSentThreadMessages(message, profile.email_engine_account_id);
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
            if (!profile?.email_engine_account_id) {
                return;
            }
            await updateMessageAsSeen(message.id, profile.email_engine_account_id);
            refreshInboxMessages();
        });
    }, [refreshInboxMessages, selectedMessages, profile?.email_engine_account_id]);

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
