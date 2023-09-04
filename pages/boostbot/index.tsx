import type { CreatorAccountWithTopics } from 'pages/api/boostbot/get-influencers';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import type { ProgressType } from 'src/components/boostbot/chat';
import { isFulfilled } from 'src/utils/utils';
import { useUser } from 'src/hooks/use-user';

export type Influencer = (UserProfile | CreatorAccountWithTopics) & {
    isLoading?: boolean;
    topics: string[];
};

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
    const [isLoading, setIsLoading] = useState(false);
    const { profile } = useUser();
    const defaultSequenceName = `${profile?.first_name}'s BoostBot Sequence`;
    const sequence = sequences?.find((sequence) => sequence.name === defaultSequenceName);
    const { createSequenceInfluencer } = useSequenceInfluencers(sequence && [sequence.id]);
    const { sendSequence } = useSequence(sequence?.id);
    const [hasUsedUnlock, setHasUsedUnlock] = useState(false);
    const [hasUsedOutreach, setHasUsedOutreach] = useState(false);
    const [messages, setMessages] = useState<MessageType[]>([
        {
            sender: 'Bot',
            content:
                t('boostbot.chat.introMessage') ??
                'Hi, welcome! Please describe your product so I can find the perfect influencers for you.',
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

    const handleUnlockInfluencers = async (influencers: Influencer[]) => {
        const userIds = influencers.map((influencer) => influencer.user_id);
        userIds.forEach((userId) => setInfluencerLoading(userId, true));

        const trackingPayload: UnlockInfluencersPayload = {
            influencer_ids: [],
            topics: [],
            is_multiple: userIds.length > 1,
            is_success: true,
        };

        try {
            const response = await unlockInfluencers(influencers);
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
        setIsLoading(true);

        const isStillLocked = (influencer: Influencer) => !('type' in influencer);
        const newUnlockedCount = currentPageInfluencers.filter(isStillLocked).length;
        if (newUnlockedCount === 0) {
            setIsLoading(false);
            addMessage({ sender: 'Bot', content: t('boostbot.chat.noInfluencersToUnlock') || '' });
            return;
        }

        const unlockedInfluencers = await handleUnlockInfluencers(currentPageInfluencers);

        setIsLoading(false);
        addMessage({
            sender: 'Bot',
            content: `${t(`boostbot.chat.${hasUsedUnlock ? 'hasUsedUnlock' : 'unlockDone'}`, {
                count: newUnlockedCount,
            })}`,
        });
        setHasUsedUnlock(true);

        return unlockedInfluencers;
    };

    const handlePageToOutreach = async () => {
        setIsLoading(true);

        const trackingPayload: SendInfluencersToOutreachPayload = {
            influencer_ids: [],
            topics: [],
            is_multiple: null,
            is_success: true,
        };

        try {
            const unlockedInfluencers = await handleUnlockInfluencers(currentPageInfluencers);
            trackingPayload.is_multiple = unlockedInfluencers ? unlockedInfluencers.length > 1 : null;

            if (!unlockedInfluencers) throw new Error('Error unlocking influencers');

            const sequenceInfluencerPromises = unlockedInfluencers.map((influencer) => {
                const socialProfileId = influencer.socialProfile.id;
                const tags = influencer.user_profile.relevant_tags.slice(0, 3).map((tag) => tag.tag);
                const creatorProfileId = influencer.user_profile.user_id;
                const socialProfileEmail = influencer.socialProfile.email;

                trackingPayload.influencer_ids.push(creatorProfileId);
                trackingPayload.topics.push(...influencer.user_profile.relevant_tags.map((v) => v.tag));

                return createSequenceInfluencer(socialProfileId, tags, creatorProfileId, socialProfileEmail);
            });
            const sequenceInfluencersResults = await Promise.allSettled(sequenceInfluencerPromises);
            const sequenceInfluencers = sequenceInfluencersResults.filter(isFulfilled).map((result) => result.value);

            if (sequenceInfluencers.length === 0) throw new Error('Error creating sequence influencers');

            addMessage({
                sender: 'Bot',
                content: t(`boostbot.chat.${hasUsedOutreach ? 'hasUsedOutreach' : 'outreachDone'}`) || '',
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
            setIsLoading(false);
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
                        isBoostbotLoading={isLoading}
                        messages={messages}
                        setMessages={setMessages}
                        addMessage={addMessage}
                        shortenedButtons={hasUsedUnlock || hasUsedOutreach}
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
