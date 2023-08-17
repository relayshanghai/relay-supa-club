import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import type { UserProfile, CreatorAccount } from 'types';
import { Layout } from 'src/components/layout';
import { Chat } from 'src/components/boostbot/chat';
import { InfluencersTable } from 'src/components/boostbot/influencer-table';
import { dummyData, reportExample } from 'src/components/boostbot/dummy-data';
import { useBoostbot } from 'src/hooks/use-boostbot';
import { clientLogger } from 'src/utils/logger-client';

export type Influencer = UserProfile | CreatorAccount;

const Boostbot = () => {
    const { t } = useTranslation();
    const { unlockInfluencers } = useBoostbot();

    const [loadingInfluencerIds, setLoadingInfluencerIds] = useState<string[]>([]);
    const [influencers, setInfluencers] = useState<Influencer[]>([
        { ...reportExample.user_profile },
        ...dummyData.map((result) => ({
            ...result.account.user_profile,
        })),
    ]);

    const handleUnlockInfluencer = async (userId: string) => {
        setLoadingInfluencerIds((prevState) => [...prevState, userId]);

        try {
            const response = await unlockInfluencers([userId]);
            const influencerData = response?.[0]?.user_profile;

            if (influencerData) {
                setInfluencers((prevInfluencers) =>
                    prevInfluencers.map((influencer) => (influencer.user_id === userId ? influencerData : influencer)),
                );
            }
        } catch (error) {
            clientLogger(error, 'error');
            toast.error(t('boostbot.unlockingInfluencerError'));
        } finally {
            setLoadingInfluencerIds((prevState) => prevState.filter((id) => id !== userId));
        }
    };

    return (
        <Layout>
            <div className="flex h-full flex-row gap-4 p-3">
                <div className="w-80 flex-shrink-0">
                    <Chat setInfluencers={setInfluencers} />
                </div>

                <InfluencersTable
                    influencers={influencers}
                    handleUnlockInfluencer={handleUnlockInfluencer}
                    loadingInfluencerIds={loadingInfluencerIds}
                />
            </div>
        </Layout>
    );
};

export default Boostbot;
