import { Layout } from 'src/modules/layout';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Tabs from 'src/components/campaigns/tabs';
import { Spinner } from 'src/components/spinner';
import { Button } from 'src/components/button';
import CampaignCardView from 'src/components/campaigns/campaignCardView';
import { useCampaigns } from 'src/hooks/use-campaigns';

const CampaignsPage = () => {
    const [currentTab, setCurrentTab] = useState('');
    const loading = false;

    const { campaigns } = useCampaigns();

    const renderCampaigns = () => {
        if (!campaigns?.length) {
            return (
                <div className="text-sm text-gray-600 h-full">
                    Oops! No campaigns available.
                    <span className="text-primary-500 hover:text-primary-700 duration-300 cursor-pointer">
                        <Link href="/campaigns/form">Click here to create a campaign</Link>
                    </span>
                </div>
            );
        }
        return <CampaignCardView campaigns={campaigns} />;
    };

    return (
        <Layout>
            <div className="flex flex-col p-6 w-full">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <Tabs currentTab={currentTab} changeTab={setCurrentTab} />
                    <Link href="/campaigns/form">
                        <Button>New Campaign</Button>
                    </Link>
                </div>
                {loading ? <Spinner /> : renderCampaigns()}
            </div>
        </Layout>
    );
};

export default CampaignsPage;
