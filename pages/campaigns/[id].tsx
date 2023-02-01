import { Layout } from 'src/modules/layout';
import { useRouter } from 'next/router';
import { useState, useEffect, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import CreatorsOutreach from '../../src/components/campaigns/CreatorOutreach';
import CampaignDetails from '../../src/components/campaigns/CampaignDetails';
import { useCampaigns } from 'src/hooks/use-campaigns';
import Image from 'next/image';
import { CampaignWithCompanyCreators } from 'src/utils/api/db';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function CampaignShow() {
    const router = useRouter();
    const {
        campaign: currentCampaign,
        updateCampaign,
        refreshCampaign,
    } = useCampaigns({ campaignId: router.query.id as string });
    const supabase = useSupabaseClient();

    const [media, setMedia] = useState<{ url: string; name: string }[]>([]);
    const [currentTab, setCurrentTab] = useState(0);
    const { t, i18n } = useTranslation();

    const tabs = [
        t('campaigns.show.activities.creatorOutreach'),
        t('campaigns.show.activities.campaignInfo'),
    ];

    const campaignStatusTabs = [
        { label: t('campaigns.index.status.inProgress'), value: 'in progress' },
        { label: t('campaigns.index.status.notStarted'), value: 'not started' },
        { label: t('campaigns.index.status.completed'), value: 'completed' },
    ];

    const handleDropdownSelect = async (
        e: ChangeEvent<HTMLSelectElement>,
        campaignWithCompanyCreators: CampaignWithCompanyCreators | null,
    ) => {
        e.stopPropagation();
        if (!campaignWithCompanyCreators) return null;
        const {
            campaign_creators: _filterOut,
            companies: _filterOut2,
            ...campaign
        } = campaignWithCompanyCreators;
        const status = e.target.value;
        await updateCampaign({ ...campaign, status });
        refreshCampaign();
    };

    useEffect(() => {
        const getFiles = async () => {
            const getFilePath = (filename: string) => {
                const {
                    data: { publicUrl },
                } = supabase.storage
                    .from('images')
                    .getPublicUrl(`campaigns/${currentCampaign?.id}/${filename}`);
                return publicUrl;
            };

            const { data } = await supabase.storage
                .from('images')
                .list(`campaigns/${currentCampaign?.id}`, {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'name', order: 'asc' },
                });

            const mediaFormatted = data?.map((file) => ({
                url: `${getFilePath(file.name)}`,
                name: file.name,
            }));

            if (mediaFormatted) {
                setMedia(mediaFormatted);
            }
        };
        if (currentCampaign) {
            getFiles();
        }
    }, [currentCampaign, supabase]);

    // editable table inputs:
    //1. when click on edit icon / input, it should be editable
    //1.1 when click the input, should be able to switch to an editable input field with save and cancel icons
    //1.2 on click save, save the changed value and call updateCreator API
    //1.3 on click cancel, cancel the changed value and revert back to the original value

    return (
        <Layout>
            {/* -- Campaign banner starts here -- */}
            <div className="flex items-center justify-center md:justify-between w-full bg-white rounded-2xl sm:h-40 py-4 sm:py-0 px-4 relative">
                <div>
                    <div className="flex flex-col sm:flex-row items-center sm:items-left">
                        <div className="h-32 w-32 sm:mr-4 flex-shrink-0 mb-4 sm:mb-0">
                            <Image
                                src={media?.[0]?.url || '/assets/imgs/image404.png'}
                                alt="campaign photo"
                                width={128}
                                height={128}
                                className="object-cover rounded-2xl"
                            />
                        </div>
                        <div className="flex flex-col justify-evenly items-center text-center sm:items-start sm:text-left">
                            <div className="mb-1 flex flex-col items-center sm:flex-row ">
                                <div className="font-semibold text-lg text-tertiary-600 sm:mr-2">
                                    {currentCampaign?.name}
                                </div>
                                <select
                                    onChange={(e) => handleDropdownSelect(e, currentCampaign)}
                                    value={currentCampaign?.status as string}
                                    className="px-2 py-1 bg-primary-100 hover:bg-primary-200 text-primary-500 text-xs rounded-md duration-300 cursor-pointer"
                                >
                                    {campaignStatusTabs.map((tab, index) => (
                                        <option value={tab.value} key={index}>
                                            {tab.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-1">
                                <div className="font-semibold text-sm text-tertiary-600">
                                    {t('campaigns.show.campaignLaunch')}
                                </div>
                                <div className="text-sm text-tertiary-600">
                                    {currentCampaign?.date_start_campaign &&
                                    currentCampaign?.date_end_campaign
                                        ? `${new Date(
                                              currentCampaign.date_start_campaign,
                                          ).toLocaleDateString(i18n.language, {
                                              year: 'numeric',
                                              month: 'short',
                                              day: 'numeric',
                                          })} - ${new Date(
                                              currentCampaign.date_end_campaign,
                                          ).toLocaleDateString(i18n.language, {
                                              year: 'numeric',
                                              month: 'short',
                                              day: 'numeric',
                                          })}`
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
                {currentTab === 1 && currentCampaign && (
                    <CampaignDetails currentCampaign={currentCampaign} media={media} />
                )}
            </div>
        </Layout>
    );
}
