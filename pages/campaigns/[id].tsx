import { useRouter } from 'next/router';
import type { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArchiveBoxIcon, ArchiveBoxXMarkIcon, PencilSquareIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Image from 'next/legacy/image';
import { Layout } from 'src/components/layout';
import CampaignInfluencersTable from '../../src/components/campaigns/campaign-influencers-table';
import CampaignDetails from '../../src/components/campaigns/CampaignDetails';
import { useCampaigns } from 'src/hooks/use-campaigns';
import { Modal } from 'src/components/modal';
import CommentInput from 'src/components/campaigns/comment-input';
import CommentCards from 'src/components/campaigns/comment-cards';
import type { CampaignCreatorDB } from 'src/utils/api/db';
import { imgProxy } from 'src/utils/fetcher';
import { Spinner } from 'src/components/icons';
import { toast } from 'react-hot-toast';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { CAMPAIGN_BANNER } from 'src/utils/rudderstack/event-names';

export default function CampaignShow() {
    const router = useRouter();
    const { campaign: currentCampaign, updateCampaign } = useCampaigns({
        campaignId: router.query.id as string,
    });
    const supabase = useSupabaseClient();
    const { trackEvent } = useRudderstack();
    const { campaigns, refreshCampaigns } = useCampaigns({});

    const [media, setMedia] = useState<{ url: string; name: string }[]>([]);
    const [currentTab, setCurrentTab] = useState(0);
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [currentCreator, setCurrentCreator] = useState<CampaignCreatorDB | null>(null);
    const { t, i18n } = useTranslation();
    const [loading] = useState(false);

    const tabs = [t('campaigns.show.activities.influencerOutreach'), t('campaigns.show.activities.campaignInfo')];

    const campaignStatusTabs = [
        { label: t('campaigns.index.status.inProgress'), value: 'in progress' },
        { label: t('campaigns.index.status.notStarted'), value: 'not started' },
        { label: t('campaigns.index.status.completed'), value: 'completed' },
    ];

    const handleDropdownSelect = async (e: ChangeEvent<HTMLSelectElement>) => {
        e.stopPropagation();
        if (!currentCampaign) return null;

        const status = e.target.value;
        await updateCampaign({ ...currentCampaign, status });
        refreshCampaigns();
        trackEvent(CAMPAIGN_BANNER('change status'));
    };

    const archiveCampaignHandler = async () => {
        if (!currentCampaign) return;
        await updateCampaign({ ...currentCampaign, archived: true });
        router.push('/campaigns');
        toast.success(t('campaigns.show.archived'));
        refreshCampaigns();
        trackEvent(CAMPAIGN_BANNER('archive campaign'));
    };

    const unarchiveCampaignHandler = async () => {
        if (!currentCampaign) return;
        await updateCampaign({ ...currentCampaign, archived: false });
        router.push('/campaigns');
        toast.success(t('campaigns.show.unarchived'));
        refreshCampaigns();
        trackEvent(CAMPAIGN_BANNER('unarchive campaign'));
    };

    useEffect(() => {
        const getFiles = async () => {
            const getFilePath = (filename: string) => {
                const {
                    data: { publicUrl },
                } = supabase.storage.from('images').getPublicUrl(`campaigns/${currentCampaign?.id}/${filename}`);
                return publicUrl;
            };

            const { data } = await supabase.storage.from('images').list(`campaigns/${currentCampaign?.id}`, {
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

    return (
        <Layout>
            {/* -- Campaign banner starts here -- */}
            <div className="relative flex w-full items-center justify-center rounded-2xl bg-white px-4 py-4 sm:h-40 sm:py-0 md:justify-between">
                <div>
                    <div className="sm:items-left flex flex-col items-center sm:flex-row">
                        <div className="mb-4 h-32 w-32 flex-shrink-0 sm:mb-0 sm:mr-4">
                            <Image
                                src={media?.[0]?.url || '/assets/imgs/image404.png'}
                                alt="campaign photo"
                                width={128}
                                height={128}
                                className="rounded-2xl object-cover"
                            />
                        </div>
                        <div className="flex flex-col items-center justify-evenly text-center sm:items-start sm:text-left">
                            <div className="mb-1 flex flex-col items-center sm:flex-row ">
                                <div className="text-lg font-semibold text-tertiary-600 sm:mr-2">
                                    {currentCampaign?.name}
                                </div>
                                <select
                                    onChange={handleDropdownSelect}
                                    value={currentCampaign?.status as string}
                                    className="cursor-pointer rounded-md bg-primary-100 px-2 py-1 text-xs text-primary-500 duration-300 hover:bg-primary-200"
                                >
                                    {campaignStatusTabs.map((tab, index) => (
                                        <option value={tab.value} key={index}>
                                            {tab.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-1">
                                <div className="text-sm font-semibold text-tertiary-600">
                                    {t('campaigns.show.campaignLaunch')}
                                </div>
                                <div className="text-sm text-tertiary-600">
                                    {currentCampaign?.date_start_campaign && currentCampaign?.date_end_campaign
                                        ? `${new Date(currentCampaign.date_start_campaign).toLocaleDateString(
                                              i18n.language,
                                              {
                                                  year: 'numeric',
                                                  month: 'short',
                                                  day: 'numeric',
                                              },
                                          )} - ${new Date(currentCampaign.date_end_campaign).toLocaleDateString(
                                              i18n.language,
                                              {
                                                  year: 'numeric',
                                                  month: 'short',
                                                  day: 'numeric',
                                              },
                                          )}`
                                        : '-'}
                                </div>
                            </div>
                            <div>
                                <div className="mb-1 text-sm font-semibold text-tertiary-600">
                                    {t('campaigns.show.tags')}
                                </div>
                                <div className="flex h-7">
                                    {currentCampaign?.tag_list?.length &&
                                        currentCampaign?.tag_list?.length > 0 &&
                                        currentCampaign?.tag_list.map((tag, index) => (
                                            <div
                                                key={index}
                                                className="mb-1 mr-1 rounded-md bg-tertiary-50 px-2 py-1 text-xs text-tertiary-600"
                                            >
                                                {tag}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {currentCampaign?.id && !currentCampaign.archived && (
                    <div
                        className=" group absolute right-24 top-3 z-10 mr-2 flex h-8 cursor-pointer items-center justify-center rounded-lg bg-gray-50 text-sm font-semibold duration-300 hover:bg-gray-200"
                        onClick={archiveCampaignHandler}
                    >
                        {loading ? (
                            <Spinner className="h-4 w-4 fill-red-600 text-red-200" />
                        ) : (
                            <span className="flex flex-row items-center gap-1 px-2 text-gray-400 duration-300 group-hover:text-primary-500">
                                {t('campaigns.index.archive')}
                                <ArchiveBoxIcon
                                    name="delete"
                                    className="h-4 w-4 fill-current text-gray-400 duration-300 group-hover:text-primary-500"
                                />
                            </span>
                        )}
                    </div>
                )}
                {currentCampaign?.id && currentCampaign.archived && (
                    <div
                        className=" group absolute right-24 top-3 z-10 mr-2 flex h-8 cursor-pointer items-center justify-center rounded-lg bg-gray-50 text-sm font-semibold duration-300 hover:bg-gray-200"
                        onClick={unarchiveCampaignHandler}
                    >
                        {loading ? (
                            <Spinner className="h-4 w-4 fill-red-600 text-red-200" />
                        ) : (
                            <span className="flex flex-row items-center gap-1 px-2 text-gray-400 duration-300 group-hover:text-primary-500">
                                {t('campaigns.index.unarchive')}
                                <ArchiveBoxXMarkIcon name="delete" className="h-4 w-4 fill-current" />
                            </span>
                        )}
                    </div>
                )}
                {currentCampaign?.id && (
                    <div className=" group absolute right-6 top-3 z-10 mr-2 flex h-8 cursor-pointer items-center justify-center rounded-lg bg-gray-50 text-sm font-semibold duration-300 hover:bg-gray-200">
                        <Link href={`/campaigns/form/${encodeURIComponent(currentCampaign?.id)}`} legacyBehavior>
                            <span
                                className="flex flex-row items-center gap-1 px-2 text-gray-400 duration-300 group-hover:text-primary-500"
                                onClick={() => trackEvent(CAMPAIGN_BANNER('edit campaign'))}
                            >
                                {t('campaigns.index.edit')}
                                <PencilSquareIcon name="edit" className="h-4 w-4 fill-current" />
                            </span>
                        </Link>
                    </div>
                )}
            </div>
            {/* -- Campaign outreach details starts --*/}
            <div className="px-4 py-0 sm:h-40 md:py-6">
                <div className="mb-4 flex overflow-x-auto">
                    {tabs.map((tab, index) => (
                        <div
                            key={index}
                            onClick={() => setCurrentTab(index)}
                            className={`text-md flex-shrink-0, mr-6 cursor-pointer font-semibold duration-300 hover:text-primary-500
    ${currentTab === index ? 'text-primary-500' : 'text-gray-400'}`}
                        >
                            {tab}
                        </div>
                    ))}
                </div>
                {currentTab === 0 && currentCampaign && (
                    <CampaignInfluencersTable
                        currentCampaign={currentCampaign}
                        setShowNotesModal={setShowNotesModal}
                        setCurrentCreator={setCurrentCreator}
                        campaigns={campaigns}
                        currentCreator={currentCreator}
                    />
                )}
                {currentTab === 1 && currentCampaign && (
                    <CampaignDetails currentCampaign={currentCampaign} media={media} />
                )}
            </div>
            {currentCreator && (
                <Modal
                    title={
                        <div className="-mt-4 flex items-center justify-between">
                            <h3>{t('campaigns.modal.comments')}</h3>

                            <Link
                                href={`/influencer/${currentCreator.platform}/${currentCreator.creator_id}`}
                                target="_blank"
                            >
                                <div className="sticky top-0 z-30 flex items-center rounded-md bg-gray-100 p-3">
                                    <img
                                        className="mr-4 h-8 w-8 rounded-full"
                                        src={imgProxy(currentCreator.avatar_url)}
                                        alt=""
                                    />
                                    <h3 className="text-sm font-medium">{currentCreator?.fullname}</h3>
                                </div>
                            </Link>
                        </div>
                    }
                    visible={!!showNotesModal}
                    onClose={() => {
                        setShowNotesModal(false);
                    }}
                >
                    <div>
                        <CommentCards currentCreator={currentCreator} />
                        <CommentInput currentCreator={currentCreator} />
                    </div>
                </Modal>
            )}
        </Layout>
    );
}
