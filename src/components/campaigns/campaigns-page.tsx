import { Layout } from 'src/components/layout';
import { useState } from 'react';
import Link from 'next/link';
import Tabs from 'src/components/campaigns/tabs';
import { Spinner } from 'src/components/icons';
import { Button } from 'src/components/button';
import { useCampaigns } from 'src/hooks/use-campaigns';
import CampaignCardView from 'src/components/campaigns/CampaignCardView';
import { t } from 'i18next';
import { useRouter } from 'next/router';

const CampaignsPage = ({ companyId }: { companyId?: string }) => {
    const { isReady } = useRouter();
    const [currentTab, setCurrentTab] = useState('');

    const { campaigns, isLoading } = useCampaigns({ companyId });

    const renderCampaigns = () => {
        if (!campaigns?.length) {
            return (
                <div className="text-sm text-gray-600 h-full">
                    {t('campaigns.index.noCampaignsAvailable')}
                    <span className="text-primary-500 hover:text-primary-700 duration-300 cursor-pointer">
                        <Link href="/campaigns/form">{t('campaigns.index.clickCreate')}</Link>
                    </span>
                </div>
            );
        }
        return <CampaignCardView campaigns={campaigns} currentTab={currentTab} />;
    };

    return (
        <Layout>
            <div className="flex flex-col p-6 w-full">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <Tabs currentTab={currentTab} changeTab={setCurrentTab} />
                    <Link href="/campaigns/form">
                        <Button>{t('campaigns.index.createCampaign')}</Button>
                    </Link>
                </div>
                {isLoading || !isReady ? (
                    <Spinner className="mx-auto mt-10 w-10 h-10 fill-primary-600 text-white" />
                ) : (
                    renderCampaigns()
                )}
            </div>
        </Layout>
    );
};

export default CampaignsPage;
