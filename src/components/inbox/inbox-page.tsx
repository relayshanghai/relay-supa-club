import Fuse from 'fuse.js';
import type { EmailSearchPostResponseBody } from 'pages/api/email-engine/search';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { default as toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useMessages } from 'src/hooks/use-message';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { useUser } from 'src/hooks/use-user';
import { OpenInboxPage } from 'src/utils/analytics/events';
import { getSequenceInfluencer as baseGetSequenceInfluencer } from 'src/utils/api/db/calls/get-sequence-influencers';
import { getSequenceInfluencerByEmailAndCompanyCall } from 'src/utils/api/db/calls/sequence-influencers';
import {
    getInboxThreadMessages,
    getSentThreadMessages,
    updateMessageAsSeen,
} from 'src/utils/api/email-engine/handle-messages';
import { GMAIL_SEEN_SPECIAL_USE_FLAG } from 'src/utils/api/email-engine/prototype-mocks';
import { useDB } from 'src/utils/client-db/use-client-db';
import { clientLogger } from 'src/utils/logger-client';
import type { MessagesGetMessage } from 'types/email-engine/account-account-messages-get';
import { Spinner } from '../icons';
import { ProfileOverlayScreen } from '../influencer-profile/screens/profile-overlay-screen';
import { useUiState } from '../influencer-profile/screens/profile-screen-context';
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
    const [sequenceInfluencer, setSequenceInfluencer] = useState<SequenceInfluencerManagerPage | null>(null)

    const { inboxMessages, isLoading, refreshInboxMessages } = useMessages();
    const { t } = useTranslation();

    const { track } = useRudderstackTrack()

    useEffect(() => {
        const { abort } = track(OpenInboxPage)
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

    const handleGetThreadEmails = useCallback(async (message: MessagesGetMessage) => {
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
    }, [getSelectedMessagesError, profile?.email_engine_account_id]);

    const getSequenceInfluencerByEmailAndCompany = useDB(getSequenceInfluencerByEmailAndCompanyCall)
    const getSequenceInfluencer = useDB(baseGetSequenceInfluencer)
    const [uiState, setUiState] = useUiState();

    const handleInfluencerClick = useCallback(() => {
        if (!sequenceInfluencer) return;
        setUiState((s) => {
            return { ...s, isProfileOverlayOpen: true };
        });
    }, [setUiState, sequenceInfluencer])

    const handleSelectPreviewCard = useCallback(async (message: MessagesGetMessage) => {
        if (!profile) return;
        try {
            const influencer = await getSequenceInfluencerByEmailAndCompany(message.from.address, profile.company_id)
            const influencerFull = await getSequenceInfluencer(influencer.id)
            setSequenceInfluencer(influencerFull)
        // @note avoid try..catch hell. influencer should have been a monad
        } catch (error) {}
    }, [profile, getSequenceInfluencer, getSequenceInfluencerByEmailAndCompany])

    const handleProfileOverlayClose = useCallback(() => {
        setUiState((s) => {
            return { ...s, isProfileOverlayOpen: false };
        });
    }, [setUiState]);

    const handleProfileUpdate = useCallback(() => {
        // @todo profile updated!
        // console.log("Update profile")
    }, []);

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
            handleSelectPreviewCard(messages[0])
        }
    }, [messages, handleGetThreadEmails, handleSelectPreviewCard, selectedMessages]);

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
                                            onSelect={handleSelectPreviewCard}
                                        />
                                    ) : (
                                        <PreviewSection
                                            messages={filteredMessages}
                                            selectedMessages={selectedMessages}
                                            handleGetThreadEmails={handleGetThreadEmails}
                                            loadingSelectedMessages={loadingSelectedMessages}
                                            onSelect={handleSelectPreviewCard}
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
                                    onInfluencerClick={handleInfluencerClick}
                                />
                            )}
                        </div>
                        <ProfileOverlayScreen
                            profile={sequenceInfluencer}
                            isOpen={uiState.isProfileOverlayOpen}
                            onClose={handleProfileOverlayClose}
                            onUpdate={handleProfileUpdate}
                        />
                    </>
                )}
            </div>
        </Layout>
    );
};
