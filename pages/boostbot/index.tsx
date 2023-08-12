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
            <div className="m-8 h-4/6 w-96">
                <Chat setInfluencers={setInfluencers} />
            </div>

            <div className="p-3 pb-12">
                <InfluencersTable influencers={influencers} />
            </div>
        </Layout>
    );
};

export default Boostbot;
