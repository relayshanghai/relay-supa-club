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
import Image from 'next/image';
import { supabase } from 'src/utils/supabase-client';

export default function CampaignShow() {
    const router = useRouter();
    const { campaign: currentCampaign } = useCampaigns({ campaignId: router.query.id });
    const [coverImageUrl, setCoverImageUrl] = useState('');

    const [currentTab, setCurrentTab] = useState(0);
    // const [campaignStatus, setCampaignStatus] = useState(false);
    const { t } = useTranslation();
    const tabs = [
        t('campaigns.show.activities.creatorOutreach'),
        t('campaigns.show.activities.campaignInfo')
    ];

    useEffect(() => {
        const getFiles = async () => {
            const getFilePath = (filename: string) => {
                const { publicURL } = supabase.storage
                    .from('images')
                    .getPublicUrl(`campaigns/${currentCampaign?.id}/${filename}`);
                return publicURL;
            };

            const { data } = await supabase.storage
                .from('images')
                .list(`campaigns/${currentCampaign?.id}`, {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'name', order: 'asc' }
                });

            if (data?.[0]?.name) {
                const imageUrl = `${getFilePath(data?.[0]?.name)}`;
                setCoverImageUrl(imageUrl);
            }
        };
        if (currentCampaign) {
            getFiles();
        }
    }, [currentCampaign]);

    return (
        <Layout>
            {/* -- Campaign banner starts here -- */}
            <div className="flex items-center justify-center md:justify-between w-full bg-white rounded-2xl sm:h-40 py-4 sm:py-0 px-4 relative">
                <div>
                    <div className="flex flex-col sm:flex-row items-center sm:items-left">
                        <div className="h-32 w-32 sm:mr-4 flex-shrink-0 mb-4 sm:mb-0">
                            <Image
                                //@ts-ignore
                                src={coverImageUrl || '/image404.png'}
                                alt="campaign photo"
                                width={128}
                                height={128}
                                // layout=""
                                className="object-cover rounded-2xl"
                            />
                        </div>
                        <div className="flex flex-col justify-evenly items-center text-center sm:items-start sm:text-left">
                            <div className="mb-1 flex flex-col items-center sm:flex-row ">
                                <div className="font-semibold text-lg text-tertiary-600 sm:mr-2">
                                    {currentCampaign?.name}
                                </div>
                                <div className="px-2 py-1 bg-primary-100 hover:bg-primary-200 text-primary-500 text-xs rounded-md duration-300 cursor-pointer">
                                    {t(`campaigns.show.status.${currentCampaign?.status}`)}
                                </div>
                            </div>
                            <div className="mb-1">
                                <div className="font-semibold text-sm text-tertiary-600">
                                    {t('campaigns.show.campaignLaunch')}
                                </div>
                                <div className="text-sm text-tertiary-600">
                                    {currentCampaign?.date_start_campaign
                                        ? //@ts-ignore // TODO: is this working?
                                          dateFormat(
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
                                    {currentCampaign?.tag_list?.length &&
                                        currentCampaign?.tag_list?.length > 0 &&
                                        currentCampaign?.tag_list.map((tag: any, index: number) => (
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
                {currentCampaign?.id && (
                    <div className=" absolute top-3 right-6 group w-8 h-8 bg-gray-50 hover:bg-gray-100 duration-300 font-semibold rounded-lg mr-2 cursor-pointer z-10 text-sm text-gray-500 flex items-center justify-center">
                        <Link href={`/campaigns/form/${encodeURIComponent(currentCampaign?.id)}`}>
                            <PencilSquareIcon
                                name="edit"
                                className="w-4 h-4 fill-current text-gray-300 group-hover:text-primary-500 duration-300"
                            />
                        </Link>
                    </div>
                )}
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
                {currentTab === 0 && currentCampaign && (
                    <CreatorsOutreach currentCampaign={currentCampaign} />
                )}
                {currentTab === 1 && <CampaignDetails />}
            </div>
        </Layout>
    );
}
