import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MessageType } from 'src/components/boostbot/message';
import type { CreatorAccountWithTopics } from 'pages/api/boostbot/get-influencers';
import { Chat } from 'src/components/boostbot/chat';
import InitialLogoScreen from 'src/components/boostbot/initial-logo-screen';
import { columns } from 'src/components/boostbot/table/columns';
import { InfluencersTable } from 'src/components/boostbot/table/influencers-table';
import { Layout } from 'src/components/layout';
import { useBoostbot } from 'src/hooks/use-boostbot';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { useSequence } from 'src/hooks/use-sequence';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import { useSequences } from 'src/hooks/use-sequences';
import {
    // OpenVideoGuideModal,
    OpenBoostbotPage,
    SendInfluencersToOutreach,
    UnlockInfluencers,
} from 'src/utils/analytics/events';
import type { SendInfluencersToOutreachPayload } from 'src/utils/analytics/events/boostbot/send-influencers-to-outreach';
import type { UnlockInfluencersPayload } from 'src/utils/analytics/events/boostbot/unlock-influencer';
import { clientLogger } from 'src/utils/logger-client';
import type { CreatorPlatform, UserProfile } from 'types';
import { getFulfilledData, unixEpochToISOString } from 'src/utils/utils';
import { useUser } from 'src/hooks/use-user';
import { useUsages } from 'src/hooks/use-usages';
import { getCurrentMonthPeriod } from 'src/utils/usagesHelpers';
import { featNewPricing } from 'src/constants/feature-flags';
import { useSubscription } from 'src/hooks/use-subscription';
import { usePersistentState } from 'src/hooks/use-persistent-state';
import { CurrentPageEvent } from 'src/utils/analytics/events/current-pages';
import type { Sequence } from 'src/utils/api/db';
// import { VideoPreviewWithModal } from 'src/components/video-preview-with-modal';

export type Influencer = (UserProfile | CreatorAccountWithTopics) & {
    isLoading?: boolean;
    topics: string[];
};
// UserProfile is the unlocked influencer/generated report type. Used for checking which influencers are already unlocked and which are not.
const isUserProfile = (influencer: Influencer) => 'type' in influencer;

const Boostbot = () => {
    const { t } = useTranslation();
    const { unlockInfluencers } = useBoostbot({});
    const [isInitialLogoScreen, setIsInitialLogoScreen] = usePersistentState('boostbot-initial-logo-screen', true);
    const [influencers, setInfluencers] = usePersistentState<Influencer[]>('boostbot-influencers', []);
    const [currentPageInfluencers, setCurrentPageInfluencers] = useState<Influencer[]>([]);
    const { trackEvent: track } = useRudderstack();
    const { sequences } = useSequences();
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [isUnlockOutreachLoading, setIsUnlockOutreachLoading] = useState(false);
    const { profile } = useUser();
    const defaultSequenceName = `${profile?.first_name}'s BoostBot Sequence`;
    const [sequence, setSequence] = useState<Sequence | undefined>(
        sequences?.find((sequence) => sequence.name === defaultSequenceName),
    );

    useEffect(() => {
        if (sequences && !sequence) {
            setSequence(sequences[0]);
        }
    }, [sequence, sequences]);

    const { createSequenceInfluencer } = useSequenceInfluencers(sequence && [sequence.id]);
    const { sendSequence } = useSequence(sequence?.id);
    const [hasUsedUnlock, setHasUsedUnlock] = usePersistentState('boostbot-has-used-unlock', false);
    const [hasUsedOutreach, setHasUsedOutreach] = usePersistentState('boostbot-has-used-outreach', false);
    const [isSearchDisabled, setIsSearchDisabled] = useState(false);
    const { subscription } = useSubscription();
    const periodStart = unixEpochToISOString(subscription?.current_period_start);
    const periodEnd = unixEpochToISOString(subscription?.current_period_end);
    const [searchId, setSearchId] = useState<string | number | null>(null);

    const { usages, isUsageLoaded, refreshUsages } = useUsages(
        true,
        featNewPricing() && periodStart && periodEnd
            ? { thisMonthStartDate: new Date(periodStart), thisMonthEndDate: new Date(periodEnd) }
            : periodStart
            ? getCurrentMonthPeriod(new Date(periodStart))
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
        if (usages.profile.remaining <= 0) {
            addMessage({
                sender: 'Bot',
                type: 'translation',
                translationKey: 'boostbot.error.outOfProfileCredits',
                translationLink: '/pricing',
            });
        }
        // Omitting 't' from the dependencies array to not resend messages when language is changed.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usages.search.remaining, usages.profile.remaining, isSearchLoading, isUsageLoaded]);

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
            const isUnfinishedLoading = (message: MessageType) =>
                message.type === 'progress' && message.progressData.totalFound === null;
            return onLoadMessages.filter((message) => !isUnfinishedLoading(message));
        },
    );

    const addMessage = (message: MessageType) => setMessages((prevMessages) => [...prevMessages, message]);

    useEffect(() => {
        track(OpenBoostbotPage.eventName);
    }, [track]);

    const setInfluencerLoading = (userId: string, isLoading: boolean) => {
        setInfluencers((prevInfluencers) =>
            prevInfluencers.map((influencer) =>
                influencer.user_id === userId ? { ...influencer, isLoading } : influencer,
            ),
        );
    };

    // freeOfCharge will eventually move to the backend to be safer (not abusable) and faster. https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/828
    const handleUnlockInfluencers = async (influencers: Influencer[], freeOfCharge = false) => {
        const userIds = influencers.map((influencer) => influencer.user_id);
        userIds.forEach((userId) => setInfluencerLoading(userId, true));

        const trackingPayload: UnlockInfluencersPayload = {
            currentPage: CurrentPageEvent.boostbot,
            influencer_ids: [],
            topics: [],
            is_multiple: userIds.length > 1,
            is_success: true,
        };

        try {
            const response = await unlockInfluencers(influencers, freeOfCharge);
            const unlockedInfluencers = response?.map((result) => result.user_profile);

            if (unlockedInfluencers) {
                unlockedInfluencers.forEach((newInfluencerData) => {
                    setInfluencers((prevInfluencers) => {
                        const influencer = prevInfluencers.find((i) => i.user_id === newInfluencerData.user_id);

                        if (influencer) {
                            trackingPayload.influencer_ids.push(influencer.user_id);
                            trackingPayload.topics.push(...influencer.topics);
                        }

                        return prevInfluencers.map((influencer) =>
                            influencer.user_id === newInfluencerData.user_id
                                ? { ...newInfluencerData, topics: influencer.topics }
                                : influencer,
                        );
                    });
                });
            }

            return response;
        } catch (error) {
            clientLogger(error, 'error');
            addMessage({
                sender: 'Bot',
                type: 'translation',
                translationKey: 'boostbot.error.influencerUnlock',
            });

            trackingPayload.is_success = false;
            trackingPayload.extra_info = { error: String(error) };
        } finally {
            track(UnlockInfluencers.eventName, trackingPayload);
            userIds.forEach((userId) => setInfluencerLoading(userId, false));
        }
    };

    const handleUnlockInfluencer = async (influencer: Influencer) => handleUnlockInfluencers([influencer]);

    const removeInfluencer = (userId: string) => {
        setInfluencers((prevInfluencers) => prevInfluencers.filter((influencer) => influencer.user_id !== userId));
    };

    const handlePageToUnlock = async () => {
        const influencersToUnlock = currentPageInfluencers.filter((i) => !isUserProfile(i));
        if (influencersToUnlock.length === 0) {
            addMessage({
                sender: 'Bot',
                type: 'translation',
                translationKey: 'boostbot.chat.noInfluencersToUnlock',
            });
            return;
        }

        setIsUnlockOutreachLoading(true);

        const unlockedInfluencers = await handleUnlockInfluencers(influencersToUnlock);

        setIsUnlockOutreachLoading(false);
        addMessage({
            sender: 'Bot',
            type: 'translation',
            translationKey: `boostbot.chat.${hasUsedUnlock ? 'hasUsedUnlock' : 'unlockDone'}`,
            translationLink: '/pricing',
            translationValues: { count: unlockedInfluencers?.length ?? 0 },
        });
        // Temporarily disabled, will be re-added, more info here: https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/848
        // addMessage({
        //     sender: 'Bot',
        //     type: 'video',
        //     videoUrl: '/assets/videos/delete-guide.mp4',
        //     eventToTrack: OpenVideoGuideModal.eventName,
        // });
        setHasUsedUnlock(true);

        return unlockedInfluencers;
    };

    const handlePageToOutreach = async () => {
        setIsUnlockOutreachLoading(true);

        const trackingPayload: SendInfluencersToOutreachPayload & { $add?: any } = {
            currentPage: CurrentPageEvent.boostbot,
            influencer_ids: [],
            sequence_influencer_ids: [],
            topics: [],
            is_multiple: null,
            is_success: true,
        };

        try {
            const alreadyUnlockedInfluencers = currentPageInfluencers.filter(isUserProfile);
            const influencersToUnlock =
                usages.profile.remaining <= 0 ? alreadyUnlockedInfluencers : currentPageInfluencers;
            const unlockedInfluencers = await handleUnlockInfluencers(influencersToUnlock);

            trackingPayload.is_multiple = unlockedInfluencers ? unlockedInfluencers.length > 1 : null;

            if (!unlockedInfluencers) {
                throw new Error('Error unlocking influencers');
            }
            if (!sequence?.id) {
                throw new Error('Error creating sequence: no sequence id selected');
            }

            const sequenceInfluencerPromises = unlockedInfluencers.map((influencer) => {
                const tags = influencer.user_profile.relevant_tags.slice(0, 3).map((tag) => tag.tag);
                const creatorProfileId = influencer.user_profile.user_id;

                trackingPayload.influencer_ids.push(creatorProfileId);
                trackingPayload.topics.push(...influencer.user_profile.relevant_tags.map((v) => v.tag));

                return createSequenceInfluencer({
                    iqdata_id: creatorProfileId,
                    influencer_social_profile_id: influencer.socialProfile.id,
                    tags,
                    avatar_url: influencer.socialProfile.avatar_url ?? '',
                    name: influencer.socialProfile.name || '',
                    platform: influencer.socialProfile.platform as CreatorPlatform,
                    username: influencer.socialProfile.username,
                    url: influencer.socialProfile.url,
                    sequence_id: sequence?.id,
                });
            });
            const sequenceInfluencersResults = await Promise.allSettled(sequenceInfluencerPromises);
            const sequenceInfluencers = getFulfilledData(sequenceInfluencersResults);

            if (sequenceInfluencers.length === 0) throw new Error('Error creating sequence influencers');

            trackingPayload.sequence_influencer_ids = sequenceInfluencers.map((si) => si.id);
            trackingPayload['$add'] = { total_sequence_influencers: sequenceInfluencers.length };

            addMessage({
                sender: 'Bot',
                type: 'translation',
                translationKey: `boostbot.chat.${hasUsedOutreach ? 'hasUsedOutreach' : 'outreachDone'}`,
                translationLink: '/sequences',
            });
            // Temporarily disabled, will be re-added, more info here: https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/848
            // addMessage({
            //     sender: 'Bot',
            //     type: 'video',
            //     videoUrl: '/assets/videos/sequence-guide.mp4',
            //     eventToTrack: OpenVideoGuideModal.eventName,
            // });

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
            setIsUnlockOutreachLoading(false);
            setHasUsedOutreach(true);
        }
    };

    return (
        <Layout>
            <div className="flex h-full flex-col gap-4 p-3 md:flex-row">
                <div className="w-full flex-shrink-0 md:w-80">
                    <Chat
                        influencers={influencers}
                        setInfluencers={setInfluencers}
                        handlePageToUnlock={handlePageToUnlock}
                        handlePageToOutreach={handlePageToOutreach}
                        setIsInitialLogoScreen={setIsInitialLogoScreen}
                        handleUnlockInfluencers={handleUnlockInfluencers}
                        isUnlockOutreachLoading={isUnlockOutreachLoading}
                        isSearchLoading={isSearchLoading}
                        setIsSearchLoading={setIsSearchLoading}
                        messages={messages}
                        setMessages={setMessages}
                        addMessage={addMessage}
                        shortenedButtons={hasUsedUnlock || hasUsedOutreach}
                        isSearchDisabled={isSearchDisabled}
                        setSearchId={setSearchId}
                        setSequence={setSequence}
                        sequence={sequence}
                        sequences={sequences}
                    />
                </div>

                {isInitialLogoScreen ? (
                    <InitialLogoScreen />
                ) : (
                    <InfluencersTable
                        columns={columns}
                        data={influencers}
                        setCurrentPageInfluencers={setCurrentPageInfluencers}
                        meta={{ handleUnlockInfluencer, removeInfluencer, t, searchId }}
                    />
                )}
            </div>
        </Layout>
    );
};

export default Boostbot;
