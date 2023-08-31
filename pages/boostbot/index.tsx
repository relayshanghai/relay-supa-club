import type { CreatorAccountWithTopics } from 'pages/api/boostbot/get-influencers';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Chat } from 'src/components/boostbot/chat';
import InitialLogoScreen from 'src/components/boostbot/initial-logo-screen';
import { columns } from 'src/components/boostbot/table/columns';
import { InfluencersTable } from 'src/components/boostbot/table/influencers-table';
import { Layout } from 'src/components/layout';
import { useBoostbot } from 'src/hooks/use-boostbot';
import { useRudderstack } from 'src/hooks/use-rudderstack';
// import { useSequence } from 'src/hooks/use-sequence';
// import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
// import { useSequences } from 'src/hooks/use-sequences';
import { OpenBoostbotPage, UnlockInfluencers } from 'src/utils/analytics/events';
import type { SendInfluencersToOutreachPayload } from 'src/utils/analytics/events/boostbot/send-influencers-to-outreach';
import type { UnlockInfluencersPayload } from 'src/utils/analytics/events/boostbot/unlock-influencer';
import { clientLogger } from 'src/utils/logger-client';
import type { UserProfile } from 'types';
import type { ProgressType } from 'src/components/boostbot/chat';
import { useRouter } from 'next/router';
import { wait } from 'src/utils/utils';

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
    const router = useRouter();
    const { t } = useTranslation();
    const { unlockInfluencers } = useBoostbot({});
    const [isInitialLogoScreen, setIsInitialLogoScreen] = useState(true);
    const [influencers, setInfluencers] = useState<Influencer[]>([]);
    const [currentPageInfluencers, setCurrentPageInfluencers] = useState<Influencer[]>([]);
    const { trackEvent: track } = useRudderstack();
    // const { sequences } = useSequences();
    const [isLoading, setIsLoading] = useState(false);
    // const sequence = sequences?.find((sequence) => sequence.name === 'General collaboration');
    // const { createSequenceInfluencer } = useSequenceInfluencers(sequence && [sequence.id]);
    // const { sendSequence } = useSequence(sequence?.id);
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
            toast.error(t('boostbot.error.influencerUnlock'));

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

        const unlockedInfluencers = await handleUnlockInfluencers(currentPageInfluencers.slice(0, 1));

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
            await wait(1000);
            // const unlockedInfluencers = await handleUnlockInfluencers(currentPageInfluencers);
            // trackingPayload.is_multiple = unlockedInfluencers ? unlockedInfluencers.length > 1 : null;

            // if (!unlockedInfluencers) throw new Error('Error unlocking influencers');

            // const sequenceInfluencerPromises = unlockedInfluencers.map((influencer) => {
            //     const socialProfileId = influencer.socialProfile.id;
            //     const tags = influencer.user_profile.relevant_tags.slice(0, 3).map((tag) => tag.tag);
            //     const creatorProfileId = influencer.user_profile.user_id;
            //     const socialProfileEmail = influencer.socialProfile.email;

            //     trackingPayload.influencer_ids.push(creatorProfileId);
            //     trackingPayload.topics.push(...influencer.user_profile.relevant_tags.map((v) => v.tag));

            //     return createSequenceInfluencer(socialProfileId, tags, creatorProfileId, socialProfileEmail);
            // });
            // const sequenceInfluencers = await Promise.all(sequenceInfluencerPromises);

            // if (sequence?.auto_start) {
            //     const sendSequencePromises = sequenceInfluencers.map((influencer) => sendSequence([influencer]));
            //     await Promise.all(sendSequencePromises);
            // }
        } catch (error) {
            clientLogger(error, 'error');
            // toast.error(t('boostbot.error.influencersToOutreach'));

            trackingPayload.is_success = false;
            trackingPayload.extra_info = { error: String(error) };
        } finally {
            // @ts-ignore bypasses apiObject type requirement of is_multiple.
            // Needs `null` for it to show in mixpanel without explicitly
            // saying that it is multiple or not
            // track(SendInfluencersToOutreach.eventName, trackingPayload);
            setIsLoading(false);
            addMessage({
                sender: 'Bot',
                content: t(`boostbot.chat.${hasUsedOutreach ? 'hasUsedOutreach' : 'outreachDone'}`) || '',
            });
            setHasUsedOutreach(true);
            await wait(1000);
            router.push('/sequences/1e03d18e-a7db-44f7-8748-8b86d35fd9fd');
        }
    };

    return (
        <Layout>
            <div className="flex h-full flex-row gap-4 p-3">
                <div className="w-80 flex-shrink-0">
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
