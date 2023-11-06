import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MessageType } from 'src/components/boostbot/message';
import type { BoostbotInfluencer } from 'pages/api/boostbot/get-influencers';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { Chat } from 'src/components/boostbot/chat';
import InitialLogoScreen from 'src/components/boostbot/initial-logo-screen';
import { columns } from 'src/components/boostbot/table/columns';
import { InfluencersTable } from 'src/components/boostbot/table/influencers-table';
import { Layout } from 'src/components/layout';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { useSequence } from 'src/hooks/use-sequence';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import { useSequences } from 'src/hooks/use-sequences';
import { OpenVideoGuideModal, SendInfluencersToOutreach } from 'src/utils/analytics/events';
import type { SendInfluencersToOutreachPayload } from 'src/utils/analytics/events/boostbot/send-influencers-to-outreach';
import { clientLogger } from 'src/utils/logger-client';
import { getFulfilledData, unixEpochToISOString } from 'src/utils/utils';
import { useUser } from 'src/hooks/use-user';
import { useUsages } from 'src/hooks/use-usages';
import { useSubscription } from 'src/hooks/use-subscription';
import { usePersistentState } from 'src/hooks/use-persistent-state';
import { CurrentPageEvent } from 'src/utils/analytics/events/current-pages';
import type { Sequence } from 'src/utils/api/db';
import { Banner } from 'src/components/library/banner';
import { useCompany } from 'src/hooks/use-company';
import { extractPlatformFromURL } from 'src/utils/extract-platform-from-url';
import type { Row } from '@tanstack/react-table';

const Boostbot = () => {
    const { t } = useTranslation();
    const [isInitialLogoScreen, setIsInitialLogoScreen] = usePersistentState('boostbot-initial-logo-screen', true);
    const [influencers, setInfluencers] = usePersistentState<BoostbotInfluencer[]>('boostbot-influencers', []);
    const [selectedInfluencers, setSelectedInfluencers] = usePersistentState<Record<string, boolean>>(
        'boostbot-selected-influencers',
        {},
    );
    const selectedInfluencersData =
        // Check if influencers have loaded from indexedDb, otherwise could return an array of undefineds
        influencers.length > 0 ? Object.keys(selectedInfluencers).map((key) => influencers[Number(key)]) : [];

    const { trackEvent: track } = useRudderstack();
    const { sequences: allSequences } = useSequences();
    const sequences = allSequences?.filter((sequence) => !sequence.deleted);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [isOutreachLoading, setIsOutreachLoading] = useState(false);
    const { profile } = useUser();
    const defaultSequenceName = `${profile?.first_name}'s BoostBot Sequence`;
    const [sequence, setSequence] = useState<Sequence | undefined>(
        sequences?.find((sequence) => sequence.name === defaultSequenceName),
    );
    const [isInfluencerDetailsModalOpen, setIsInfluencerDetailsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<Row<BoostbotInfluencer>>();

    useEffect(() => {
        if (sequences && !sequence) {
            setSequence(sequences[0]);
        }
    }, [sequence, sequences]);

    const { createSequenceInfluencer } = useSequenceInfluencers(sequence && [sequence.id]);
    const { sequenceInfluencers: allSequenceInfluencers, refreshSequenceInfluencers } = useSequenceInfluencers(
        sequences?.map((s) => s.id),
    );
    const { sendSequence } = useSequence(sequence?.id);
    const [isSearchDisabled, setIsSearchDisabled] = useState(false);
    const [areChatActionsDisabled, setAreChatActionsDisabled] = useState(false);
    const { subscription } = useSubscription();
    const { isExpired } = useCompany();

    const periodStart = unixEpochToISOString(subscription?.current_period_start);
    const periodEnd = unixEpochToISOString(subscription?.current_period_end);
    const [searchId, setSearchId] = useState<string | number | null>(null);

    const { usages, isUsageLoaded, refreshUsages } = useUsages(
        true,
        periodStart && periodEnd
            ? { thisMonthStartDate: new Date(periodStart), thisMonthEndDate: new Date(periodEnd) }
            : undefined,
    );

    useEffect(() => {
        refreshUsages();
    }, [influencers, refreshUsages]);

    useEffect(() => {
        if (isSearchLoading || !isUsageLoaded) return;
        if (usages.search.remaining < 5) {
            addMessage({
                sender: 'Bot',
                type: 'translation',
                translationKey: 'boostbot.error.outOfSearchCredits',
                translationLink: '/pricing',
            });
            setIsSearchDisabled(true);
        }
        if (isExpired) {
            addMessage({
                sender: 'Bot',
                type: 'translation',
                translationKey: 'boostbot.error.expiredAccount',
                translationLink: '/pricing',
            });
            setIsSearchDisabled(true);
            setAreChatActionsDisabled(true);
        }
        // Omitting 't' from the dependencies array to not resend messages when language is changed.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usages.search.remaining, usages.profile.remaining, isSearchLoading, isUsageLoaded, subscription]);

    const [messages, setMessages] = usePersistentState<MessageType[]>(
        'boostbot-messages',
        [
            {
                sender: 'Bot',
                type: 'translation',
                translationKey: 'boostbot.chat.introMessage',
            },
        ],
        (onLoadMessages) => {
            const isErrorMessage = (message: MessageType) =>
                message.type === 'translation' && message.translationKey.includes('error');
            const isUnfinishedLoading = (message: MessageType) =>
                message.type === 'progress' && message.progressData.totalFound === null;
            return onLoadMessages.filter((message) => !isErrorMessage(message) && !isUnfinishedLoading(message));
        },
    );

    const addMessage = (message: MessageType) => setMessages((prevMessages) => [...prevMessages, message]);

    const influencersToOutreach = selectedInfluencersData.filter(
        (i) => !allSequenceInfluencers.find((si) => si.iqdata_id === i?.user_id),
    );

    const isOutreachButtonDisabled = influencersToOutreach.length === 0;

    const handleSelectedInfluencersToOutreach = async () => {
        setIsOutreachLoading(true);

        const trackingPayload: SendInfluencersToOutreachPayload & { $add?: any } = {
            currentPage: CurrentPageEvent.boostbot,
            influencer_ids: [],
            sequence_influencer_ids: [],
            topics: [],
            is_multiple: null,
            is_success: true,
            sequence_id: null,
            sequence_influencer_id: null,
            is_sequence_autostart: null,
        };

        try {
            trackingPayload.is_multiple = selectedInfluencersData ? selectedInfluencersData.length > 1 : null;

            if (!selectedInfluencersData) {
                throw new Error('Error adding influencers to sequence: no valid influencers selected');
            }
            if (!sequence?.id) {
                throw new Error('Error creating sequence: no sequence id selected');
            }

            const sequenceInfluencerPromises = selectedInfluencersData.map((influencer) => {
                const creatorProfileId = influencer.user_id;

                if (trackingPayload.influencer_ids !== null) {
                    trackingPayload.influencer_ids.push(creatorProfileId);
                }

                if (trackingPayload.topics !== null) {
                    trackingPayload.topics.push(...influencer.topics.map((v) => v));
                }

                const platform = extractPlatformFromURL(influencer.url);
                if (!platform) {
                    throw new Error('Error creating sequence influencer: no platform detected');
                }
                return createSequenceInfluencer({
                    iqdata_id: creatorProfileId,
                    avatar_url: influencer.picture ?? '',
                    platform,
                    name: influencer.fullname ?? influencer.username ?? influencer.handle ?? '',
                    username: influencer.handle ?? influencer.username ?? '',

                    url: influencer.url,
                    sequence_id: sequence?.id,
                });
            });
            const sequenceInfluencersResults = await Promise.allSettled(sequenceInfluencerPromises);
            const sequenceInfluencers = getFulfilledData(sequenceInfluencersResults) as SequenceInfluencerManagerPage[];

            if (sequenceInfluencers.length === 0) throw new Error('Error creating sequence influencers');

            // An optimistic update to the sequence influencers cache to prevent the user from adding the same influencers to the sequence again
            refreshSequenceInfluencers([...allSequenceInfluencers, ...sequenceInfluencers]);
            trackingPayload.sequence_influencer_ids = sequenceInfluencers.map((si) => si.id);
            trackingPayload['$add'] = { total_sequence_influencers: sequenceInfluencers.length };

            addMessage({
                sender: 'Bot',
                type: 'translation',
                translationKey: 'boostbot.chat.outreachDone',
            });
            addMessage({
                sender: 'Bot',
                type: 'video',
                videoUrl: '/assets/videos/sequence-guide.mp4',
                eventToTrack: OpenVideoGuideModal.eventName,
            });

            if (sequence?.auto_start) {
                const sendSequencePromises = sequenceInfluencers.map((influencer) => sendSequence([influencer]));
                await Promise.all(sendSequencePromises);
            }
        } catch (error) {
            clientLogger(error, 'error');
            addMessage({
                sender: 'Bot',
                type: 'translation',
                translationKey: 'boostbot.error.influencersToOutreach',
            });

            trackingPayload.is_success = false;
            trackingPayload.extra_info = { error: String(error) };
        } finally {
            // @ts-ignore bypasses apiObject type requirement of is_multiple.
            // Needs `null` for it to show in mixpanel without explicitly
            // saying that it is multiple or not
            track(SendInfluencersToOutreach.eventName, trackingPayload);
            setIsOutreachLoading(false);
        }
    };

    const clearChatHistory = () => {
        setMessages([
            {
                sender: 'Bot',
                type: 'translation',
                translationKey: 'boostbot.chat.introMessage',
            },
        ]);
        setIsInitialLogoScreen(true);
        setInfluencers([]);
        setSelectedInfluencers({});
    };

    return (
        <Layout>
            {isExpired && (
                <Banner
                    buttonText={t('banner.button')}
                    title={t('banner.expired.title')}
                    message={t('banner.expired.description')}
                />
            )}
            <div className="flex h-full flex-col gap-4 p-3 md:flex-row">
                <div className="w-full flex-shrink-0 md:w-80">
                    <Chat
                        influencers={influencers}
                        setInfluencers={setInfluencers}
                        handleSelectedInfluencersToOutreach={handleSelectedInfluencersToOutreach}
                        setIsInitialLogoScreen={setIsInitialLogoScreen}
                        isOutreachLoading={isOutreachLoading}
                        isSearchLoading={isSearchLoading}
                        areChatActionsDisabled={areChatActionsDisabled}
                        setIsSearchLoading={setIsSearchLoading}
                        messages={messages}
                        setMessages={setMessages}
                        addMessage={addMessage}
                        isSearchDisabled={isSearchDisabled}
                        isOutreachButtonDisabled={isOutreachButtonDisabled}
                        setSearchId={setSearchId}
                        setSequence={setSequence}
                        sequence={sequence}
                        sequences={sequences}
                        clearChatHistory={clearChatHistory}
                        isInfluencerDetailsModalOpen={isInfluencerDetailsModalOpen}
                        setIsInfluencerDetailsModalOpen={setIsInfluencerDetailsModalOpen}
                        selectedRow={selectedRow}
                    />
                </div>

                {isInitialLogoScreen ? (
                    <InitialLogoScreen />
                ) : (
                    <InfluencersTable
                        columns={columns}
                        data={influencers}
                        selectedInfluencers={selectedInfluencers}
                        setSelectedInfluencers={setSelectedInfluencers}
                        meta={{ t, searchId, setIsInfluencerDetailsModalOpen, setSelectedRow }}
                    />
                )}
            </div>
        </Layout>
    );
};

export default Boostbot;
