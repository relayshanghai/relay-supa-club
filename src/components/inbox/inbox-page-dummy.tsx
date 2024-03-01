import Fuse from 'fuse.js';
import type { EmailSearchPostResponseBody } from 'pages/api/email-engine/search';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from 'src/hooks/use-user';
import { GMAIL_SEEN_SPECIAL_USE_FLAG } from 'src/utils/api/email-engine/prototype-mocks';
import type { MessagesGetMessage } from 'types/email-engine/account-account-messages-get';
import { Spinner } from '../icons';
import { Layout } from '../layout';
import { CorrespondenceSection } from './correspondence-section-dummy';
import { PreviewSection } from './preview-section';
import { ToolBar } from './tool-bar';
import { dummyData, dummyMessages } from './dummy_data';
import { type ProfileValue } from '../influencer-profile/screens/profile-screen';
import { useUiState } from '../influencer-profile/screens/profile-screen-context';
import { inManagerDummyInfluencers } from '../sequences/in-manager-dummy-sequence-influencers';
import { Banner } from '../library/banner';
import { mapProfileToNotes, mapProfileToShippingDetails } from './helpers';

export const InboxPageDummy = () => {
    const inboxMessages = dummyData.messages;
    const [messages, setMessages] = useState<MessagesGetMessage[]>([]);
    const [searchResults, setSearchResults] = useState<MessagesGetMessage[]>([]);
    const [selectedMessages, setSelectedMessages] = useState<EmailSearchPostResponseBody['messages'] | null>(null);
    const [loadingSelectedMessages, setLoadingSelectedMessages] = useState(false);
    const [_getSelectedMessagesError, setGetSelectedMessagesError] = useState('');
    const [selectedTab, setSelectedTab] = useState('inbox');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [_uiState, setUiState] = useUiState();
    const [sequenceInfluencer, setSequenceInfluencer] = useState<SequenceInfluencerManagerPage | undefined | null>(
        null,
    );

    const mapProfileToFormData = useCallback((p?: SequenceInfluencerManagerPage | null) => {
        if (!p) return null;
        return {
            notes: mapProfileToNotes(p),
            shippingDetails: mapProfileToShippingDetails(p),
        };
    }, []);

    const [_initialValue, setLocalProfile] = useState<ProfileValue | null>(() =>
        mapProfileToFormData(sequenceInfluencer),
    );
    useEffect(() => {
        setLocalProfile(mapProfileToFormData(sequenceInfluencer));
    }, [sequenceInfluencer, mapProfileToFormData]);
    const isLoading = false;
    const refreshInboxMessages = useCallback(() => {
        // @todo refresh inbox messages
    }, []);
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
        const inboxThreadMessages = await dummyMessages.messages.filter((msg) => msg.threadId === message.threadId);
        const sentThreadMessages = await dummyMessages.messages.filter((msg) => msg.threadId === message.threadId);
        const threadMessages = inboxThreadMessages.concat(sentThreadMessages);
        threadMessages.sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        setSelectedMessages(threadMessages);
        setLoadingSelectedMessages(false);
    };

    const handleSelectedTabChange = (tab: { value: string; name: string }) => {
        setSelectedTab(tab.value);
    };

    const handleSelectPreviewCard = useCallback(
        async (message: MessagesGetMessage) => {
            if (!profile) return;
            try {
                const influencer = inManagerDummyInfluencers.find((dummy) => {
                    return dummy.email === message.from.address;
                });
                setSequenceInfluencer(influencer);
                // @note avoid try..catch hell. influencer should have been a monad
            } catch (error) {}
        },
        [profile],
    );

    const _handleUpdate = () => {
        return;
    };

    useEffect(() => {
        if (!selectedMessages) {
            return;
        }
        const unSeenMessages = selectedMessages.filter((message) => {
            return !message.flags.includes(GMAIL_SEEN_SPECIAL_USE_FLAG);
        });
        unSeenMessages.forEach(async (_message) => {
            if (!profile?.email_engine_account_id) {
                return;
            }
            // await updateMessageAsSeen(message.id, profile.email_engine_account_id);
            refreshInboxMessages();
        });
    }, [refreshInboxMessages, selectedMessages, profile?.email_engine_account_id]);

    //Show the first message in the list when the page loads by default
    useEffect(() => {
        if (!selectedMessages && messages.length > 0) {
            handleGetThreadEmails(messages[0]);
            handleSelectPreviewCard(messages[0]);
        }
    }, [messages, handleSelectPreviewCard, selectedMessages]);

    const _handleNoteListOpen = () => {
        return;
    };

    const _handleNoteListClose = () => {
        setUiState((s) => {
            return { ...s, isNotesListOverlayOpen: false };
        });
    };

    return (
        <Layout>
            <Banner
                buttonText={t('banner.button')}
                title={t('banner.outreach.title')}
                message={t('banner.outreach.descriptionInbox')}
            />
            <div className="grid h-full grid-cols-12">
                {isLoading ? (
                    <div className="flex w-full items-center justify-center">
                        <Spinner className="h-6 w-6 fill-primary-600 text-primary-200" />
                    </div>
                ) : (
                    <>
                        {messages.length === 0 && !isLoading && <p>{t('inbox.noMessagesInMailbox')}</p>}
                        <div className="col-span-3 h-full w-full overflow-auto">
                            {messages.length > 0 && (
                                <>
                                    <ToolBar
                                        selectedTab={selectedTab}
                                        setSelectedTab={handleSelectedTabChange}
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
                        <div className="col-span-5 h-full w-full overflow-auto">
                            {selectedMessages && (
                                <CorrespondenceSection
                                    // TODO: add selectedSequenceInfluencers
                                    selectedMessages={selectedMessages}
                                    loadingSelectedMessages={loadingSelectedMessages}
                                />
                            )}
                        </div>
                        {/* {sequenceInfluencer && initialValue && (
                            <div className="col-span-4 w-full flex-grow-0 overflow-x-clip overflow-y-scroll">
                                <ProfileScreenProvider initialValue={initialValue}>
                                    <ProfileScreen
                                        profile={sequenceInfluencer}
                                        className="bg-white"
                                        onCancel={() => {
                                            //
                                        }}
                                        onUpdate={handleUpdate}
                                    />
                                </ProfileScreenProvider>
                                <NotesListOverlayScreen
                                    notes={[dummyNote]}
                                    isLoading={false}
                                    isOpen={uiState.isNotesListOverlayOpen}
                                    onClose={handleNoteListClose}
                                    onOpen={handleNoteListOpen}
                                />
                            </div>
                        )} */}
                    </>
                )}
            </div>
        </Layout>
    );
};
