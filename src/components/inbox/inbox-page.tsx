import Fuse from 'fuse.js';
import type { EmailSearchPostResponseBody } from 'pages/api/email-engine/search';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { default as toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useMessages } from 'src/hooks/use-message';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { useUser } from 'src/hooks/use-user';
import { OpenEmailThread, OpenInboxPage, OpenInfluencerProfile } from 'src/utils/analytics/events';
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
import { mapProfileToNotes, mapProfileToShippingDetails } from '../influencer-profile/screens/profile-overlay-screen';
import { ProfileScreenProvider, useUiState } from '../influencer-profile/screens/profile-screen-context';
import { Layout } from '../layout';
import { CorrespondenceSection } from './correspondence-section';
import { PreviewSection } from './preview-section';
import { ToolBar } from './tool-bar';
import { NotesListOverlayScreen } from '../influencer-profile/screens/notes-list-overlay';
import { ProfileScreen, type ProfileValue } from '../influencer-profile/screens/profile-screen';
import { useSequenceInfluencerNotes } from 'src/hooks/use-sequence-influencer-notes';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';

const mapProfileToFormData = (p?: SequenceInfluencerManagerPage | null) => {
    if (!p) return null;
    return {
        notes: mapProfileToNotes(p),
        shippingDetails: mapProfileToShippingDetails(p),
    };
};

export const InboxPage = () => {
    const [messages, setMessages] = useState<MessagesGetMessage[]>([]);
    const [searchResults, setSearchResults] = useState<MessagesGetMessage[]>([]);
    const [selectedMessages, setSelectedMessages] = useState<EmailSearchPostResponseBody['messages'] | null>(null);
    const [loadingSelectedMessages, setLoadingSelectedMessages] = useState(false);
    const [getSelectedMessagesError, setGetSelectedMessagesError] = useState('');
    const [selectedTab, setSelectedTab] = useState('inbox');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sequenceInfluencer, setSequenceInfluencer] = useState<SequenceInfluencerManagerPage | null>(null);
    const [initialValue, setLocalProfile] = useState<ProfileValue | null>(() =>
        mapProfileToFormData(sequenceInfluencer),
    );
    const { refreshSequenceInfluencers } = useSequenceInfluencers();
    const { getNotes, saveSequenceInfluencer } = useSequenceInfluencerNotes();
    const { inboxMessages, isLoading, refreshInboxMessages } = useMessages();
    const { t } = useTranslation();

    const { track } = useRudderstackTrack();

    useEffect(() => {
        const { abort } = track(OpenInboxPage);
        return abort;
    }, [track]);

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
        if (!sequenceInfluencer) return;
        if (!sequenceInfluencer.influencer_social_profile_id) {
            throw Error('No social profile id');
        }
        setLocalProfile(mapProfileToFormData(sequenceInfluencer));
        track(OpenInfluencerProfile, {
            influencer_id: sequenceInfluencer.influencer_social_profile_id,
            search_id: searchTerm,
            current_status: sequenceInfluencer?.funnel_status,
            currently_filtered: false,
            currently_searched: searchTerm !== '',
            view_mine_enabled: false,
            is_users_influencer: false,
        });
    }, [sequenceInfluencer, searchTerm, track]);

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
                const inboxThreadMessages = await getInboxThreadMessages(message, profile.email_engine_account_id);
                const sentThreadMessages = await getSentThreadMessages(message, profile.email_engine_account_id);
                const threadMessages = inboxThreadMessages.concat(sentThreadMessages);

                if (threadMessages.length === 0) {
                    setLoadingSelectedMessages(false);
                    throw new Error('No thread messages found');
                }

                threadMessages.sort((a, b) => {
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                });
                setSelectedMessages(threadMessages);
                track(OpenEmailThread, {
                    sequence_email_address: profile?.sequence_send_email ?? '',
                    email_thread_id: threadMessages[0].threadId,
                    selected_email_id: threadMessages[0].emailId,
                    sender: threadMessages[0].from,
                    recipient: threadMessages[0].to,
                    open_when_clicked: true,
                });
                setLoadingSelectedMessages(false);
            } catch (error: any) {
                clientLogger(error, 'error');
                setGetSelectedMessagesError(error.message);
                toast(getSelectedMessagesError);
            }
            setLoadingSelectedMessages(false);
        },
        [getSelectedMessagesError, profile?.email_engine_account_id, profile?.sequence_send_email, track],
    );

    const getSequenceInfluencerByEmailAndCompany = useDB(getSequenceInfluencerByEmailAndCompanyCall);
    const getSequenceInfluencer = useDB(baseGetSequenceInfluencer);
    const [uiState, setUiState] = useUiState();

    const handleUpdate = useCallback(
        (data: Partial<ProfileValue>) => {
            if (!sequenceInfluencer) return;

            saveSequenceInfluencer.call(sequenceInfluencer.id, data).then((profile) => {
                // @note updates local state without additional query
                //       this will cause issue showing previous state though
                setLocalProfile(mapProfileToFormData(profile));
                saveSequenceInfluencer.refresh();

                refreshSequenceInfluencers();
            });
        },
        [saveSequenceInfluencer, sequenceInfluencer, refreshSequenceInfluencers, setLocalProfile],
    );

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
            handleSelectPreviewCard(messages[0]);
        }
    }, [messages, handleGetThreadEmails, handleSelectPreviewCard, selectedMessages]);

    return (
        <Layout>
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
                        <div
                            className={`${
                                sequenceInfluencer && initialValue ? 'col-span-5' : 'col-span-9'
                            } h-full w-full overflow-auto`}
                        >
                            {selectedMessages && (
                                <CorrespondenceSection
                                    // TODO: add selectedSequenceInfluencers
                                    selectedMessages={selectedMessages}
                                    loadingSelectedMessages={loadingSelectedMessages}
                                />
                            )}
                        </div>
                        {sequenceInfluencer && initialValue && (
                            <div className="col-span-4 w-full flex-grow-0 overflow-x-clip overflow-y-scroll bg-white">
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
