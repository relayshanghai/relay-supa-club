import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import type { ProgressType } from 'src/components/boostbot/chat';
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
import { OpenBoostbotPage, SendInfluencersToOutreach, UnlockInfluencers } from 'src/utils/analytics/events';
import type { SendInfluencersToOutreachPayload } from 'src/utils/analytics/events/boostbot/send-influencers-to-outreach';
import type { UnlockInfluencersPayload } from 'src/utils/analytics/events/boostbot/unlock-influencer';
import { clientLogger } from 'src/utils/logger-client';
import type { UserProfile } from 'types';
import { getFulfilledData, unixEpochToISOString } from 'src/utils/utils';
import { useUser } from 'src/hooks/use-user';
import { useUsages } from 'src/hooks/use-usages';
import { getCurrentMonthPeriod } from 'src/utils/usagesHelpers';
import { featNewPricing } from 'src/constants/feature-flags';
import { useSubscription } from 'src/hooks/use-subscription';
import { CurrentPageEvent } from 'src/utils/analytics/events/current-pages';

export type Influencer = (UserProfile | CreatorAccountWithTopics) & {
    isLoading?: boolean;
    topics: string[];
};
// UserProfile is the unlocked influencer/generated report type. Used for checking which influencers are already unlocked and which are not.
const isUserProfile = (influencer: Influencer) => 'type' in influencer;

export type MessageType = {
    sender: 'User' | 'Bot' | 'Progress';
    content?: string | JSX.Element;
    progress?: ProgressType;
};

const Boostbot = () => {
    const { t } = useTranslation();
    const { unlockInfluencers } = useBoostbot({});
    const [isInitialLogoScreen, setIsInitialLogoScreen] = useState(true);
    const [influencers, setInfluencers] = useState<Influencer[]>([]);
    const [currentPageInfluencers, setCurrentPageInfluencers] = useState<Influencer[]>([]);
    const { trackEvent: track } = useRudderstack();
    const { sequences } = useSequences();
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [isUnlockOutreachLoading, setIsUnlockOutreachLoading] = useState(false);
    const { profile } = useUser();
    const defaultSequenceName = `${profile?.first_name}'s BoostBot Sequence`;
    const sequence = sequences?.find((sequence) => sequence.name === defaultSequenceName);
    const { createSequenceInfluencer } = useSequenceInfluencers(sequence && [sequence.id]);
    const { sendSequence } = useSequence(sequence?.id);
    const [hasUsedUnlock, setHasUsedUnlock] = useState(false);
    const [hasUsedOutreach, setHasUsedOutreach] = useState(false);
    const [isSearchDisabled, setIsSearchDisabled] = useState(false);

    const { subscription } = useSubscription();
    const periodStart = unixEpochToISOString(subscription?.current_period_start);
    const periodEnd = unixEpochToISOString(subscription?.current_period_end);

    const { usages, refreshUsages } = useUsages(
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
        if (isSearchLoading) return;
        if (usages.search.remaining < 5) {
            addMessage({
                sender: 'Bot',
                content: (
                    <Trans
                        i18nKey="boostbot.error.outOfSearchCredits"
                        components={{
                            pricingLink: <Link target="_blank" className="font-medium underline" href="/pricing" />,
                        }}
                    />
                ),
            });
            setIsSearchDisabled(true);
        }
        if (usages.profile.remaining <= 0) {
            addMessage({
                sender: 'Bot',
                content: (
                    <Trans
                        i18nKey="boostbot.error.outOfProfileCredits"
                        components={{
                            pricingLink: <Link target="_blank" className="font-medium underline" href="/pricing" />,
                        }}
                    />
                ),
            });
        }
        // Omitting 't' from the dependencies array to not resend messages when language is changed.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usages.search.remaining, usages.profile.remaining, isSearchLoading]);

    const [messages, setMessages] = useState<MessageType[]>([
        {
            sender: 'Bot',
            content: t('boostbot.chat.introMessage') || '',
        },
    ]);

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
                content: t('boostbot.error.influencerUnlock') || '',
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
            addMessage({ sender: 'Bot', content: t('boostbot.chat.noInfluencersToUnlock') || '' });
            return;
        }

        setIsUnlockOutreachLoading(true);

        const unlockedInfluencers = await handleUnlockInfluencers(influencersToUnlock);

        setIsUnlockOutreachLoading(false);
        addMessage({
            sender: 'Bot',
            content: (
                <Trans
                    i18nKey={`boostbot.chat.${hasUsedUnlock ? 'hasUsedUnlock' : 'unlockDone'}`}
                    components={{
                        pricingLink: <Link target="_blank" className="font-medium underline" href="/pricing" />,
                    }}
                    values={{ count: unlockedInfluencers?.length }}
                />
            ),
        });
        setHasUsedUnlock(true);

        return unlockedInfluencers;
    };

    const handlePageToOutreach = async () => {
        setIsUnlockOutreachLoading(true);

        const trackingPayload: SendInfluencersToOutreachPayload = {
            influencer_ids: [],
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

            if (!unlockedInfluencers) throw new Error('Error unlocking influencers');

            const sequenceInfluencerPromises = unlockedInfluencers.map((influencer) => {
                const socialProfileId = influencer.socialProfile.id;
                const tags = influencer.user_profile.relevant_tags.slice(0, 3).map((tag) => tag.tag);
                const creatorProfileId = influencer.user_profile.user_id;
                const socialProfileEmail = influencer.socialProfile.email;

                trackingPayload.influencer_ids.push(creatorProfileId);
                trackingPayload.topics.push(...influencer.user_profile.relevant_tags.map((v) => v.tag));

                return createSequenceInfluencer(influencer.socialProfile, tags, creatorProfileId);
            });
            const sequenceInfluencersResults = await Promise.allSettled(sequenceInfluencerPromises);
            const sequenceInfluencers = getFulfilledData(sequenceInfluencersResults);

            if (sequenceInfluencers.length === 0) throw new Error('Error creating sequence influencers');

            addMessage({
                sender: 'Bot',
                content: (
                    <Trans
                        i18nKey={`boostbot.chat.${hasUsedOutreach ? 'hasUsedOutreach' : 'outreachDone'}`}
                        components={{
                            sequencesLink: <Link target="_blank" className="font-medium underline" href="/sequences" />,
                        }}
                    />
                ),
            });

            if (sequence?.auto_start) {
                const sendSequencePromises = sequenceInfluencers.map((influencer) => sendSequence([influencer]));
                await Promise.all(sendSequencePromises);
            }
        } catch (error) {
            clientLogger(error, 'error');
            addMessage({
                sender: 'Bot',
                content: t('boostbot.error.influencersToOutreach') || '',
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
                    />
                </div>

                {isInitialLogoScreen ? (
                    <InitialLogoScreen />
                ) : (
                    <InfluencersTable
                        columns={columns}
                        data={influencers}
                        setCurrentPageInfluencers={setCurrentPageInfluencers}
                        meta={{ handleUnlockInfluencer, removeInfluencer, t }}
                    />
                )}
            </div>
        </Layout>
    );
};

export default Boostbot;
