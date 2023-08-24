// TODO: Fix eslint warnings after testing is done
/* eslint-disable no-console */
import { useEffect, useState } from 'react';
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
import type { WindowChatwoot } from 'src/utils/chatwoot/types';

export type Influencer = (UserProfile | CreatorAccountWithTopics) & {
    isLoading?: boolean;
    topics: string[];
};

const Boostbot = () => {
    const { t } = useTranslation();
    const { unlockInfluencers } = useBoostbot();

    useEffect(() => {
        const chatwoot = (window as WindowChatwoot).$chatwoot;
        if (chatwoot) {
            try {
                chatwoot.toggleBubbleVisibility('hide');

                return () => {
                    chatwoot.toggleBubbleVisibility('show');
                };
            } catch {}
        }
    }, []);

    const [influencers, setInfluencers] = useState<Influencer[]>([
        { ...reportExample.user_profile },
        ...dummyData.map((result) => ({
            ...result.account.user_profile,
        })),
    ]);
    const [selectedInfluencers, setSelectedInfluencers] = useState({});

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
            toast.error(t('boostbot.unlockingInfluencerError'));
        } finally {
            setInfluencerLoading(userId, false);
        }
    };

    const removeInfluencer = (userId: string) => {
        setInfluencers((prevInfluencers) => prevInfluencers.filter((influencer) => influencer.user_id !== userId));
    };

    const sendToOutreach = async () => {
        try {
            // From array of influencers, create a new array of influencers with only the selected influencers
            const userIdsToSend = Object.keys(selectedInfluencers).map(
                (influencerIndex) => influencers[Number(influencerIndex)].user_id,
            );

            // TODO: Add send to outreach functionality
            console.log('userIds to send :>> ', userIdsToSend);
        } catch (error) {
            clientLogger(error, 'error');
            toast.error(t('boostbot.sendToOutreachError'));
        }
    };

    return (
        <Layout>
            <div className="flex h-full flex-row gap-4 p-3">
                <div className="w-80 flex-shrink-0">
                    <Chat setInfluencers={setInfluencers} sendToOutreach={sendToOutreach} />
                </div>

                <InfluencersTable
                    columns={columns}
                    data={influencers}
                    selectedInfluencers={selectedInfluencers}
                    setSelectedInfluencers={setSelectedInfluencers}
                    meta={{ handleUnlockInfluencer, removeInfluencer, translation: t }}
                />
            </div>
        </Layout>
    );
};

export default Boostbot;
