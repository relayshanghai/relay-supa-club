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

export type Influencer = (UserProfile | CreatorAccountWithTopics) & {
    isLoading?: boolean;
    topics: string[];
};

const Boostbot = () => {
    const { t } = useTranslation();
    const { unlockInfluencers } = useBoostbot({ abortSignal: undefined });
    const [isInitialLogoScreen, setIsInitialLogoScreen] = useState(true);
    const { trackEvent: track } = useRudderstack();

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

        try {
            const response = await unlockInfluencers(userIds);
            const unlockedInfluencers = response?.map((result) => result.user_profile);

            if (unlockedInfluencers) {
                const payload: UnlockInfluencersPayload = {
                    influencer_ids: [],
                    topics: [],
                    is_all: true,
                    is_success: true,
                };

                unlockedInfluencers.forEach((newInfluencerData) => {
                    setInfluencers((prevInfluencers) => {
                        const influencer = prevInfluencers.find((i) => i.user_id === newInfluencerData.user_id);

                        if (influencer) {
                            payload.influencer_ids.push(influencer.user_id);
                            payload.topics.push(...influencer.topics);
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

            const payload: UnlockInfluencersPayload = {
                influencer_ids: userIds,
                topics: [],
                is_all: true,
                is_success: false,
                extra_info: { error: String(error) },
            };
            track(UnlockInfluencers.eventName, payload);
        } finally {
            userIds.forEach((userId) => setInfluencerLoading(userId, false));
        }
    };

    const handleUnlockInfluencer = async (userId: string) => handleUnlockInfluencers([userId]);

    const removeInfluencer = (userId: string) => {
        setInfluencers((prevInfluencers) => prevInfluencers.filter((influencer) => influencer.user_id !== userId));
    };

    const handlePageToUnlock = async () => {
        const userIdsToUnlock = currentPageInfluencers.map((influencer) => influencer.user_id);
        return await handleUnlockInfluencers(userIdsToUnlock);
    };

    const handlePageToOutreach = async () => {
        try {
            // const userIdsToSend = currentPageInfluencers.map((influencer) => influencer.user_id);

            // TODO: Add send to outreach functionality
            // console.log('userIds to send :>> ', userIdsToSend);

            track('TEST:boostbot-send_influencer_to_outreach');
        } catch (error) {
            clientLogger(error, 'error');
            toast.error(t('boostbot.error.influencerToOutreach'));

            track('TEST:boostbot-send_influencer_to_outreach');
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
