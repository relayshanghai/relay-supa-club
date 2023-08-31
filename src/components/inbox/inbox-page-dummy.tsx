import Fuse from 'fuse.js';
import type { EmailSearchPostResponseBody } from 'pages/api/email-engine/search';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useUser } from 'src/hooks/use-user';
import { getSequenceInfluencer as baseGetSequenceInfluencer } from 'src/utils/api/db/calls/get-sequence-influencers';
import { getSequenceInfluencerByEmailAndCompanyCall } from 'src/utils/api/db/calls/sequence-influencers';
import { GMAIL_SEEN_SPECIAL_USE_FLAG } from 'src/utils/api/email-engine/prototype-mocks';
import { useDB } from 'src/utils/client-db/use-client-db';
import { clientLogger } from 'src/utils/logger-client';
import type { MessagesGetMessage } from 'types/email-engine/account-account-messages-get';
import { Spinner } from '../icons';
import { Layout } from '../layout';
import { CorrespondenceSection } from './correspondence-section';
import { PreviewSection } from './preview-section';
import { ToolBar } from './tool-bar';
import { dummyData, dummyMessages } from './dummy_data';
import { ProfileScreen, type ProfileValue } from '../influencer-profile/screens/profile-screen';
import { ProfileScreenProvider } from '../influencer-profile/screens/profile-screen-context';
import {
    mapProfileToNotes,
    mapProfileToShippingDetails,
} from 'src/components/influencer-profile/screens/profile-overlay-screen';
import { NotesListOverlayScreen } from '../influencer-profile/screens/notes-list-overlay';
import { useUiState } from '../influencer-profile/screens/profile-screen-context';
import { useSequenceInfluencerNotes } from 'src/hooks/use-sequence-influencer-notes';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';

export const InboxPage = () => {
    const inboxMessages = dummyData.messages;
    const [messages, setMessages] = useState<MessagesGetMessage[]>([]);
    const [searchResults, setSearchResults] = useState<MessagesGetMessage[]>([]);
    const [selectedMessages, setSelectedMessages] = useState<EmailSearchPostResponseBody['messages'] | null>(null);
    const [loadingSelectedMessages, setLoadingSelectedMessages] = useState(false);
    const [getSelectedMessagesError, setGetSelectedMessagesError] = useState('');
    const [selectedTab, setSelectedTab] = useState('inbox');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [uiState, setUiState] = useUiState();
    const [sequenceInfluencer, setSequenceInfluencer] = useState<SequenceInfluencerManagerPage | null>(null);
    const { refreshSequenceInfluencers } = useSequenceInfluencers();

    const mapProfileToFormData = useCallback((p: SequenceInfluencerManagerPage | null) => {
        if (!p) return null;
        return {
            notes: mapProfileToNotes(p),
            shippingDetails: mapProfileToShippingDetails(p),
        };
    }, []);

    const [initialValue, setLocalProfile] = useState<ProfileValue | null>(() =>
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

    const handleGetThreadEmails = useCallback(
        async (message: MessagesGetMessage) => {
            setSelectedMessages([]);
            setLoadingSelectedMessages(true);
            setGetSelectedMessagesError('');
            try {
                if (!profile?.email_engine_account_id) {
                    throw new Error('No email account');
                }
                const inboxThreadMessages = await dummyMessages.messages.filter(
                    (msg) => msg.threadId === message.threadId,
                );
                const sentThreadMessages = await dummyMessages.messages.filter(
                    (msg) => msg.threadId === message.threadId,
                );
                const threadMessages = inboxThreadMessages.concat(sentThreadMessages);
                threadMessages.sort((a, b) => {
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                });
                setSelectedMessages(threadMessages);
                setLoadingSelectedMessages(false);
            } catch (error: any) {
                clientLogger(error, 'error');
                if (error) {
                    setGetSelectedMessagesError(error.message);
                    toast(getSelectedMessagesError);
                }
            }
            setLoadingSelectedMessages(false);
        },
        [getSelectedMessagesError, profile?.email_engine_account_id],
    );

    const getSequenceInfluencerByEmailAndCompany = useDB(getSequenceInfluencerByEmailAndCompanyCall);
    const getSequenceInfluencer = useDB(baseGetSequenceInfluencer);
    const { getNotes, saveSequenceInfluencer } = useSequenceInfluencerNotes();

    const handleSelectPreviewCard = useCallback(
        async (message: MessagesGetMessage) => {
            if (!profile) return;
            try {
                const influencer = await getSequenceInfluencerByEmailAndCompany(
                    message.from.address,
                    profile.company_id,
                );
                const influencerFull = await getSequenceInfluencer(influencer.id);
                setSequenceInfluencer(influencerFull);
                // @note avoid try..catch hell. influencer should have been a monad
            } catch (error) {}
        },
        [profile, getSequenceInfluencer, getSequenceInfluencerByEmailAndCompany],
    );

    const handleUpdate = useCallback(
        (data: Partial<ProfileValue>) => {
            if (sequenceInfluencer === null) return;

            saveSequenceInfluencer.call(sequenceInfluencer.id, data).then((profile) => {
                // @note updates local state without additional query
                //       this will cause issue showing previous state though
                setLocalProfile(mapProfileToFormData(profile));
                saveSequenceInfluencer.refresh();

                refreshSequenceInfluencers();
            });
        },
        [saveSequenceInfluencer, sequenceInfluencer, refreshSequenceInfluencers, mapProfileToFormData, setLocalProfile],
    );

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
    }, [messages, handleGetThreadEmails, handleSelectPreviewCard, selectedMessages]);

    const handleNoteListOpen = useCallback(() => {
        if (!sequenceInfluencer) return;
        getNotes.call(sequenceInfluencer.id);
    }, [getNotes, sequenceInfluencer]);

    const handleNoteListClose = useCallback(() => {
        setUiState((s) => {
            return { ...s, isNotesListOverlayOpen: false };
        });
        getNotes.refresh();
    }, [getNotes, setUiState]);

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
                                    onInfluencerClick={() => {
                                        ///
                                    }}
                                />
                            )}
                        </div>
                        {sequenceInfluencer && initialValue && (
                            <div className="w-1/4 overflow-scroll">
                                <ProfileScreenProvider initialValue={initialValue}>
                                    <ProfileScreen
                                        profile={sequenceInfluencer}
                                        onCancel={() => {
                                            //
                                        }}
                                        onUpdate={handleUpdate}
                                    />
                                </ProfileScreenProvider>
                                <NotesListOverlayScreen
                                    notes={getNotes.data}
                                    isLoading={getNotes.isLoading}
                                    isOpen={uiState.isNotesListOverlayOpen}
                                    onClose={handleNoteListClose}
                                    onOpen={handleNoteListOpen}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
};
