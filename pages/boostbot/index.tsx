// TODO: Fix eslint warnings after testing is done
/* eslint-disable no-console */
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import type { UserProfile } from 'types';
import type { CreatorAccountWithTopics } from 'pages/api/boostbot/get-influencers';
import { Layout } from 'src/components/layout';
import { Chat } from 'src/components/boostbot/chat';
import { dummyData, reportExample } from 'src/components/boostbot/dummy-data';
import { useBoostbot } from 'src/hooks/use-boostbot';
import { clientLogger } from 'src/utils/logger-client';
import { columns } from 'src/components/boostbot/table/columns';
import { InfluencersTable } from 'src/components/boostbot/table/influencers-table';
import InitialLogoScreen from 'src/components/boostbot/initial-logo-screen';

export type Influencer = (UserProfile | CreatorAccountWithTopics) & {
    isLoading?: boolean;
    topics: string[];
};

const Boostbot = () => {
    const { t } = useTranslation();
    const { unlockInfluencers } = useBoostbot();
    const [isInitialLogoScreen, setIsInitialLogoScreen] = useState(true);

    const [influencers, setInfluencers] = useState<Influencer[]>([
        { ...reportExample.user_profile },
        ...dummyData.map((result) => ({
            ...result.account.user_profile,
        })),
        ...dummyData.map((result, index) => ({
            ...result.account.user_profile,
            user_id: result.account.user_profile.user_id + index + 'a',
        })),
        ...dummyData.map((result, index) => ({
            ...result.account.user_profile,
            user_id: result.account.user_profile.user_id + index + 'b',
        })),
        ...dummyData.map((result, index) => ({
            ...result.account.user_profile,
            user_id: result.account.user_profile.user_id + index + 'c',
        })),
    ]);
    const [currentPageInfluencers, setCurrentPageInfluencers] = useState<Influencer[]>([]);

    const setInfluencerLoading = (userId: string, isLoading: boolean) => {
        setInfluencers((prevInfluencers) =>
            prevInfluencers.map((influencer) =>
                influencer.user_id === userId ? { ...influencer, isLoading } : influencer,
            ),
        );
    };

    const handleUnlockInfluencer = async (userId: string) => {
        setInfluencerLoading(userId, true);

        try {
            const response = await unlockInfluencers([userId]);
            const newInfluencerData = response?.[0]?.user_profile;

            if (newInfluencerData) {
                setInfluencers((prevInfluencers) =>
                    prevInfluencers.map((influencer) =>
                        influencer.user_id === userId
                            ? { ...newInfluencerData, topics: influencer.topics }
                            : influencer,
                    ),
                );
            }
        } catch (error) {
            clientLogger(error, 'error');
            toast.error(t('boostbot.error.influencerUnlock'));
        } finally {
            setInfluencerLoading(userId, false);
        }
    };

    const removeInfluencer = (userId: string) => {
        setInfluencers((prevInfluencers) => prevInfluencers.filter((influencer) => influencer.user_id !== userId));
    };

    const handlePageToUnlock = async () => {
        const userIdsToUnlock = currentPageInfluencers.map((influencer) => influencer.user_id);

        userIdsToUnlock.forEach((userId) => setInfluencerLoading(userId, true));

        try {
            const response = await unlockInfluencers(userIdsToUnlock);
            const unlockedInfluencers = response?.map((result) => result.user_profile);

            if (unlockedInfluencers) {
                unlockedInfluencers.forEach((newInfluencerData) => {
                    setInfluencers((prevInfluencers) =>
                        prevInfluencers.map((influencer) =>
                            influencer.user_id === newInfluencerData.user_id
                                ? { ...newInfluencerData, topics: influencer.topics }
                                : influencer,
                        ),
                    );
                });
            }
        } catch (error) {
            clientLogger(error, 'error');
            toast.error(t('boostbot.error.influencerUnlock'));
        } finally {
            userIdsToUnlock.forEach((userId) => setInfluencerLoading(userId, false));
        }
    };

    const handlePageToOutreach = async () => {
        try {
            const userIdsToSend = currentPageInfluencers.map((influencer) => influencer.user_id);

            // TODO: Add send to outreach functionality
            console.log('userIds to send :>> ', userIdsToSend);
        } catch (error) {
            clientLogger(error, 'error');
            toast.error(t('boostbot.error.influencerToOutreach'));
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
