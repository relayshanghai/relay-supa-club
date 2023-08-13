import { useState } from 'react';
import type { UserProfile, CreatorAccount } from 'types';
import { Layout } from 'src/components/layout';
import { Chat } from 'src/components/boostbot/chat';
import { InfluencersTable } from 'src/components/boostbot/influencer-table';
import { dummyData, reportExample } from 'src/components/boostbot/dummy-data';

export type Influencer = UserProfile | CreatorAccount;

const Boostbot = () => {
    // TODO: Fix all eslint warnings
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [influencers, setInfluencers] = useState<Influencer[]>([
        reportExample.user_profile,
        ...dummyData.map((result) => result.account.user_profile),
    ]);

    return (
        <Layout>
            <div className="flex h-full flex-row gap-4 p-3">
                <div className="w-80 flex-shrink-0">
                    <Chat setInfluencers={setInfluencers} />
                </div>

                <InfluencersTable influencers={influencers} />
            </div>
        </Layout>
    );
};

export default Boostbot;
