// import Dashboard from '@/components/hocs/Dashboard';
import { Layout } from 'src/modules/layout';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import dateFormat from 'src/utils//dateFormat';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import CreatorsOutreach from '../../src/components/campaigns/CreatorOutreach';
import CampaignDetails from '../../src/components/campaigns/CampaignDetails';
import { useCampaigns } from 'src/hooks/use-campaigns';

export default function CampaignShow() {
    const router = useRouter();
    const { slug } = router.query;
    const { campaigns } = useCampaigns();
    const [currentCampaign, setCurrentCampaign] = useState(null);
    const [currentTab, setCurrentTab] = useState(0);
    // const [campaignStatus, setCampaignStatus] = useState(false);
    const { t } = useTranslation();
    const tabs = [
        t('campaigns.show.activities.creatorOutreach'),
        t('campaigns.show.activities.campaignInfo')
    ];
    const getCampaign = () => {
        const campaign = campaigns?.find((c) => c.slug === slug);
        setCurrentCampaign(campaign);
    };

    useEffect(() => {
        if (slug) {
            getCampaign();
        }
    }, [slug]);

    return (
        <Layout>
            {/* -- Campaign banner starts here -- */}
            <div className="flex items-center justify-center sm:justify-start w-full bg-white rounded-2xl sm:h-40 py-4 sm:py-0 px-4 relative">
                <div>
                    <div className="flex flex-col sm:flex-row items-center sm:items-left">
                        <div className="h-32 w-32 sm:mr-4 flex-shrink-0 mb-4 sm:mb-0">
                            <img
                                src={currentCampaign?.media?.url || '/image404.png'}
                                alt="campaign photo"
                                className="w-full h-full object-cover rounded-2xl"
                            />
                        </div>
                        <div className="flex flex-col justify-evenly items-center text-center sm:items-start sm:text-left">
                            <div className="mb-1 flex flex-col items-center sm:flex-row ">
                                <div className="font-semibold text-lg text-tertiary-600 sm:mr-2">
                                    {currentCampaign?.name}
                                </div>
                                <div className="px-2 py-1 bg-primary-100 hover:bg-primary-200 text-primary-500 text-xs rounded-md duration-300 cursor-pointer">
                                    {currentCampaign?.status}
                                </div>
                            </div>
                            <div className="mb-1">
                                <div className="font-semibold text-sm text-tertiary-600">
                                    {t('campaigns.show.campaignLaunch')}
                                </div>
                                <div className="text-sm text-tertiary-600">
                                    {currentCampaign?.date_start_campaign
                                        ? dateFormat(
                                              currentCampaign?.date_start_campaign,
                                              'mediumDate'
                                          )
                                        : '-'}
                                </div>
                            </div>
                            <div>
                                <div className="font-semibold text-sm text-tertiary-600 mb-1">
                                    {t('campaigns.show.tags')}
                                </div>
                                <div className="flex h-7">
                                    {currentCampaign?.tag_list.length > 0 &&
                                        currentCampaign?.tag_list.map((tag, index) => (
                                            <div
                                                key={index}
                                                className="bg-tertiary-50 rounded-md px-2 py-1 text-xs text-tertiary-600 mr-1 mb-1"
                                            >
                                                {tag}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Link
                    href={`/campaigns/form?campaign=${currentCampaign?.slug}`}
                    className="group absolute top-3 right-3 flex items-center justify-center w-8 h-8 bg-gray-50 hover:bg-gray-100 duration-300 text-sm text-gray-500 font-semibold rounded-lg mr-2 cursor-pointer z-10"
                >
                    <PencilSquareIcon
                        name="edit"
                        className="w-4 h-4 fill-current text-gray-300 group-hover:text-primary-500 duration-300"
                    />
                </Link>
            </div>
            {/* -- Campaign outreach details starts --*/}
            <div className="sm:h-40 py-0 md:py-6 px-4">
                <div className="flex mb-4 overflow-x-auto">
                    {tabs.map((tab, index) => (
                        <div
                            key={index}
                            onClick={() => setCurrentTab(index)}
                            className={`font-semibold text-md mr-6 hover:text-primary-500 cursor-pointer duration-300 flex-shrink-0,
    ${currentTab === index ? 'text-primary-500' : 'text-gray-400'}`}
                        >
                            {tab}
                        </div>
                    ))}
                </div>
                {currentTab === 0 && <CreatorsOutreach />}
                {currentTab === 1 && <CampaignDetails />}
            </div>
        </Layout>
    );
}
