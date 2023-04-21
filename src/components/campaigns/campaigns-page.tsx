import { Layout } from 'src/components/layout';
import { useState } from 'react';
import Link from 'next/link';
import Tabs from 'src/components/campaigns/tabs';
import { Spinner } from 'src/components/icons';
import { Button } from 'src/components/button';
import { useCampaigns } from 'src/hooks/use-campaigns';
import CampaignCardView from 'src/components/campaigns/CampaignCardView';
import { useTranslation } from 'react-i18next';

const CampaignsPage = ({ companyId }: { companyId?: string }) => {
    const { t } = useTranslation();
    const [currentTab, setCurrentTab] = useState('');

    const { campaigns, isLoading, archivedCampaigns } = useCampaigns({ companyId });

    const renderCampaigns = () => {
        if (
            (!campaigns?.length && currentTab !== 'archived') ||
            (!archivedCampaigns?.length && currentTab === 'archived')
        ) {
            return (
                <div className="h-full text-sm text-gray-600">
                    {t('campaigns.index.noCampaignsAvailable') + ' '}
                    <span className="cursor-pointer text-primary-500 duration-300 hover:text-primary-700">
                        <Link href="/campaigns/form" legacyBehavior>
                            {t('campaigns.index.clickCreate')}
                        </Link>
                    </span>
                </div>
            );
        }

        return (
            <CampaignCardView
                campaigns={currentTab === 'archived' ? archivedCampaigns : campaigns}
                currentTab={currentTab}
            />
        );
    };

    return (
        <Layout>
            <div className="flex w-full flex-col p-6">
                <div className="mb-4 flex items-center justify-between gap-4 sm:mb-6">
                    <Tabs currentTab={currentTab} changeTab={setCurrentTab} />
                    <Link href="/campaigns/form">
                        <Button>{t('campaigns.index.createCampaign')}</Button>
                    </Link>
                </div>
                {isLoading ? (
                    <Spinner className="mx-auto mt-10 h-10 w-10 fill-primary-600 text-white" />
                ) : (
                    renderCampaigns()
                )}
            </div>
        </Layout>
    );
};

export default CampaignsPage;
