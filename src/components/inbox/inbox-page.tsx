import Fuse from 'fuse.js';
import type { EmailSearchPostResponseBody } from 'pages/api/email-engine/search';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { default as toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useMessages } from 'src/hooks/use-message';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { useUser } from 'src/hooks/use-user';
import { ChangeInboxFolder, OpenEmailThread, OpenInfluencerProfile, SearchInbox } from 'src/utils/analytics/events';
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
import { ProfileScreenProvider, useUiState } from '../influencer-profile/screens/profile-screen-context';
import { Layout } from '../layout';
import { CorrespondenceSection } from './correspondence-section';
import { PreviewSection } from './preview-section';
import { ToolBar } from './tool-bar';
import { NotesListOverlayScreen } from '../influencer-profile/screens/notes-list-overlay';
import { ProfileScreen, type ProfileValue } from '../influencer-profile/screens/profile-screen';
import { useSequenceInfluencerNotes } from 'src/hooks/use-sequence-influencer-notes';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import { findOtherPeopleInThread, mapProfileToFormData } from './helpers';
import inboxTranslation from 'i18n/en/inbox';

export const InboxPage = () => {
    const [messages, setMessages] = useState<MessagesGetMessage[]>([]);
    const [searchResults, setSearchResults] = useState<MessagesGetMessage[]>([]);
    const [selectedMessages, setSelectedMessages] = useState<EmailSearchPostResponseBody['messages'] | null>(null);
    const [loadingSelectedMessages, setLoadingSelectedMessages] = useState(false);
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

    const filteredMessages = useMemo(() => {
        if (selectedTab === 'new') {
            return messages.filter((message) => message.unseen);
        }
        return messages;
    }, [messages, selectedTab]);
    const { profile } = useUser();

    const getSequenceInfluencerByEmailAndCompany = useDB(getSequenceInfluencerByEmailAndCompanyCall);

    const handleGetThreadEmails = useCallback(
        async (message: MessagesGetMessage) => {
            setSequenceInfluencer(null);
            setSelectedMessages([]);
            setLoadingSelectedMessages(true);
            try {
                if (!profile?.email_engine_account_id) {
                    throw new Error('No email account');
                }
                const inboxThreadMessages = await getInboxThreadMessages(message, profile.email_engine_account_id);
                const sentThreadMessages = await getSentThreadMessages(message, profile.email_engine_account_id);
                const threadMessages = inboxThreadMessages.concat(sentThreadMessages);

                if (threadMessages.length === 0) {
                    setLoadingSelectedMessages(false);
                    return;
                }

                threadMessages.sort((a, b) => {
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                });
                setSelectedMessages(threadMessages);
                setLoadingSelectedMessages(false);

                const potentialInfluencerEmails = findOtherPeopleInThread(
                    threadMessages,
                    profile.email_engine_account_id,
                );

                const findInfluencer = async (emails: string[]) => {
                    let influencer: SequenceInfluencerManagerPage | null = null;
                    for (const email of emails) {
                        try {
                            const foundInfluencer = await getSequenceInfluencerByEmailAndCompany(
                                email,
                                profile.company_id,
                            );
                            if (foundInfluencer) {
                                influencer = foundInfluencer;
                                break;
                            }
                        } catch (error) {
                            // ignore
                        }
                    }
                    return influencer;
                };

                if (potentialInfluencerEmails.length > 0) {
                    const influencer = await findInfluencer(potentialInfluencerEmails);
                    setSequenceInfluencer(influencer);
                }
                track(OpenEmailThread, {
                    sequence_email_address: profile?.sequence_send_email ?? '',
                    email_thread_id: threadMessages[0].threadId,
                    selected_email_id: threadMessages[0].emailId,
                    sender: threadMessages[0].from,
                    recipient: threadMessages[0].to,
                    open_when_clicked: true,
                });
            } catch (error: any) {
                clientLogger(error, 'error');
                toast(error.message);
            }
            setLoadingSelectedMessages(false);
        },
        [
            getSequenceInfluencerByEmailAndCompany,
            profile?.company_id,
            profile?.email_engine_account_id,
            profile?.sequence_send_email,
            track,
        ],
    );

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

    const handleSelectedTabChange = useCallback(
        (tab: { value: string; name: string }) => {
            if (!profile || !profile.sequence_send_email) return;
            track(ChangeInboxFolder, {
                sequence_email_address: profile.sequence_send_email,
                current_email_folder: selectedTab === 'new' ? inboxTranslation.unread : inboxTranslation.inbox,
                selected_email_folder: selectedTab === 'new' ? inboxTranslation.inbox : inboxTranslation.unread,
                total_unread_emails: messages.filter((message) => message.unseen).length,
            });
            setSelectedTab(tab.value);
        },
        [profile, selectedTab, messages, track],
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
        if (!inboxMessages) {
            return;
        }
        setMessages(inboxMessages);
    }, [inboxMessages]);

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
    }, [searchTerm, sequenceInfluencer, track]);

    useEffect(() => {
        if (!profile || !profile.sequence_send_email) {
            return;
        }
        if (searchTerm === '') {
            setSearchResults([]);
            return;
        }
        const fuse = new Fuse(filteredMessages, {
            keys: ['from.name', 'from.address', 'to.name', 'to.address', 'date', 'subject'],
        });
        const results = fuse.search(searchTerm);
        setSearchResults(results.map((result) => result.item));
        track(SearchInbox, {
            sequence_email_address: profile.sequence_send_email,
            search_query: searchTerm,
            total_results: results.length,
        });
    }, [filteredMessages, profile, searchTerm, track]);

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

    // Show the first message in the list when the page loads by default and messages are ready. only do once
    useEffect(() => {
        if (isLoading || !messages || messages.length === 0 || selectedMessages) {
            // selectedMessages is null initially, and set to an empty array once handleGetThreadEmails is called. so this should ensure it only runs once
            return;
        }
        handleGetThreadEmails(messages[0]);
    }, [handleGetThreadEmails, isLoading, messages, selectedMessages]);

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
                        <div className="col-span-3 flex h-full w-full flex-1 flex-col overflow-auto">
                            {messages.length > 0 && (
                                <>
                                    <ToolBar
                                        selectedTab={selectedTab}
                                        setSelectedTab={handleSelectedTabChange}
                                        searchTerm={searchTerm}
                                        setSearchTerm={setSearchTerm}
                                    />

                                    <PreviewSection
                                        messages={searchResults.length > 0 ? searchResults : filteredMessages}
                                        selectedMessages={selectedMessages}
                                        handleGetThreadEmails={handleGetThreadEmails}
                                        loadingSelectedMessages={loadingSelectedMessages}
                                    />
                                </>
                            )}
                        </div>
                        <div
                            className={`${
                                sequenceInfluencer && initialValue ? 'col-span-5' : 'col-span-9'
                            } h-full w-full flex-1 overflow-auto`}
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
                            <div className="col-span-4 h-full w-full flex-grow-0 overflow-x-clip overflow-y-scroll bg-white">
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
                                    influencerSocialProfileId={sequenceInfluencer?.id}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
};
