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
import { OpenBoostbotPage, UnlockInfluencers } from 'src/utils/analytics/events';
import type { UnlockInfluencersPayload } from 'src/utils/analytics/events/boostbot/unlock-influencer';
import { clientLogger } from 'src/utils/logger-client';
import type { UserProfile } from 'types';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import { useSequences } from 'src/hooks/use-sequences';
import { useSequence } from 'src/hooks/use-sequence';

export type Influencer = (UserProfile | CreatorAccountWithTopics) & {
    isLoading?: boolean;
    topics: string[];
};

const Boostbot = () => {
    const { t } = useTranslation();
    const { unlockInfluencers } = useBoostbot({ abortSignal: undefined });
    const [isInitialLogoScreen, setIsInitialLogoScreen] = useState(true);
    const { trackEvent: track } = useRudderstack();
    const { sequences } = useSequences();
    const [isLoading, setIsLoading] = useState(false);
    const sequence = sequences?.find((sequence) => sequence.name === 'General collaboration');
    const { createSequenceInfluencer } = useSequenceInfluencers(sequence && [sequence.id]);
    const { sendSequence } = useSequence(sequence?.id);

    useEffect(() => {
        track(OpenBoostbotPage.eventName);
    }, [track]);

    const [influencers, setInfluencers] = useState<Influencer[]>([]);
    const [currentPageInfluencers, setCurrentPageInfluencers] = useState<Influencer[]>([]);

    const setInfluencerLoading = (userId: string, isLoading: boolean) => {
        setInfluencers((prevInfluencers) =>
            prevInfluencers.map((influencer) =>
                influencer.user_id === userId ? { ...influencer, isLoading } : influencer,
            ),
        );
    };

    const handleUnlockInfluencers = async (userIds: string[]) => {
        userIds.forEach((userId) => setInfluencerLoading(userId, true));

        const trackingPayload: UnlockInfluencersPayload = {
            influencer_ids: [],
            topics: [],
            is_multiple: userIds.length > 1,
            is_success: true,
        };

        try {
            const response = await unlockInfluencers(userIds);
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

    const handleUnlockInfluencer = async (userId: string) => handleUnlockInfluencers([userId]);

    const removeInfluencer = (userId: string) => {
        setInfluencers((prevInfluencers) => prevInfluencers.filter((influencer) => influencer.user_id !== userId));
    };

    const handlePageToUnlock = async () => {
        setIsLoading(true);

        const userIdsToUnlock = currentPageInfluencers.map((influencer) => influencer.user_id);
        const unlockedInfluencers = await handleUnlockInfluencers(userIdsToUnlock);

        setIsLoading(false);

        return unlockedInfluencers;
    };

    const handlePageToOutreach = async () => {
        setIsLoading(true);

        try {
            const userIdsToUnlock = currentPageInfluencers.map((influencer) => influencer.user_id);
            const unlockedInfluencers = await handleUnlockInfluencers(userIdsToUnlock);
            if (!unlockedInfluencers) throw new Error('Error unlocking influencers');

            const sequenceInfluencerPromises = unlockedInfluencers.map((influencer) => {
                const socialProfileId = influencer.socialProfile.id;
                const tags = influencer.user_profile.relevant_tags.slice(0, 3).map((tag) => tag.tag);
                const creatorProfileId = influencer.user_profile.user_id;
                const socialProfileEmail = influencer.socialProfile.email;

                return createSequenceInfluencer(socialProfileId, tags, creatorProfileId, socialProfileEmail);
            });
            const sequenceInfluencers = await Promise.all(sequenceInfluencerPromises);

            if (sequence?.auto_start) {
                const sendSequencePromises = sequenceInfluencers.map((influencer) => sendSequence([influencer]));
                await Promise.all(sendSequencePromises);
            }
            toast.success(t('boostbot.success.influencersToOutreach'));

            track('TEST:boostbot-send_influencer_to_outreach');
        } catch (error) {
            clientLogger(error, 'error');
            toast.error(t('boostbot.error.influencersToOutreach'));

            track('TEST:boostbot-send_influencer_to_outreach');
        } finally {
            setIsLoading(false);
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
