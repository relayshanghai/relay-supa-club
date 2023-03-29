import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useCampaigns } from 'src/hooks/use-campaigns';
import type { CampaignCreatorDB, CampaignWithCompanyCreators } from 'src/utils/api/db';
import Fuse from 'fuse.js';
import InfluencerRow from './influencer-row';
import { MoveInfluencerModal } from '../modal-move-influencer';
import type { CampaignsIndexGetResult } from 'pages/api/campaigns';

interface CreatorsOutreachProps {
    currentCampaign: CampaignWithCompanyCreators;
    setShowNotesModal: (value: boolean) => void;
    setCurrentCreator: (value: CampaignCreatorDB) => void;
    showMoveInfluencerModal: boolean;
    setShowMoveInfluencerModal: React.Dispatch<React.SetStateAction<boolean>>;
    campaigns?: CampaignsIndexGetResult;
    currentCreator?: CampaignCreatorDB | null;
}

export default function CampaignInfluencersTable({
    currentCampaign,
    setShowNotesModal,
    setCurrentCreator,
    setShowMoveInfluencerModal,
    showMoveInfluencerModal,
    campaigns,
    currentCreator,
}: CreatorsOutreachProps) {
    const { t } = useTranslation();
    const inputRef = useRef(null);

    const router = useRouter();
    const { pathname, query } = router;

    const [tabStatus, setTabStatus] = useState<string | string[]>(query.curTab || 'to contact');
    const [toEdit, setToEdit] = useState<{ index: number; key: string } | null>(null);
    const [searchTerm, setSearchTerm] = useState<string | ''>('');
    const [influencersList, setInfluencersList] = useState<CampaignCreatorDB[]>([]);

    const { deleteCreatorInCampaign, updateCreatorInCampaign, refreshCampaign } = useCampaigns({
        campaignId: currentCampaign?.id,
    });

    const columnLabels = [
        'account',
        'contact',
        'creatorStatus',
        // 'addedBy',
        'nextPoint',
        'publicationDate',
        'paymentAmount',
        'paidAmount',
        'paymentInformation',
        'paymentStatus',
        'influencerAddress',
        'sampleStatus',
    ];

    useEffect(() => {
        if (currentCampaign) {
            setInfluencersList(currentCampaign.campaign_creators);
        }
    }, [currentCampaign]);

    useEffect(() => {
        const fuse = new Fuse(currentCampaign?.campaign_creators, {
            minMatchCharLength: 1,
            keys: ['fullname'],
        });

        if (searchTerm.length === 0) {
            setInfluencersList(currentCampaign?.campaign_creators);
            return;
        }

        setInfluencersList(fuse.search(searchTerm).map((result) => result.item));
    }, [searchTerm, currentCampaign]);

    const handleTabChange = (value: string) => {
        router.push({ pathname, query: { ...query, curTab: value } });
        setTabStatus(value);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleDropdownSelect = async (
        e: ChangeEvent<HTMLSelectElement>,
        creator: CampaignCreatorDB,
        objKey: string,
    ) => {
        e.stopPropagation();
        creator = { ...creator, [objKey]: e.target.value };
        await updateCreatorInCampaign(creator);
        refreshCampaign();
        toast.success(t('campaigns.creatorModal.influencerUpdated'));
    };

    const setInlineEdit = (
        e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
        index: number,
        key: string,
    ) => {
        e.stopPropagation();
        setToEdit({ index, key });
    };

    const openNotes = (
        e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
        creator: CampaignCreatorDB,
    ) => {
        e.stopPropagation();
        setCurrentCreator(creator);
        setShowNotesModal(true);
    };

    const openMoveInfluencerModal = (
        e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
        creator: CampaignCreatorDB,
    ) => {
        e.stopPropagation();
        setCurrentCreator(creator);
        setShowMoveInfluencerModal(true);
    };

    const deleteCampaignCreator = async (
        e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
        creator: CampaignCreatorDB,
    ) => {
        e.stopPropagation();
        const c = confirm(t('campaigns.modal.deleteConfirmation') as string);
        if (!c) return;
        await deleteCreatorInCampaign(creator);
        refreshCampaign();
        toast.success(t('campaigns.modal.deletedSuccessfully'));
    };

    const updateCampaignCreator = async (creator: CampaignCreatorDB) => {
        await updateCreatorInCampaign(creator);
        setToEdit(null);
        refreshCampaign();
        toast.success(t('campaigns.creatorModal.influencerUpdated'));
    };

    // get the number of creators in each status
    const creatorsCount = (status: string) => {
        return currentCampaign?.campaign_creators.filter((c) => c.status === status).length;
    };

    const editingModeTrue = (index: number, key: string) =>
        index === toEdit?.index && key === toEdit?.key;

    const tabs = [
        { label: 'toContact', value: 'to contact' },
        { label: 'contacted', value: 'contacted' },
        { label: 'inProgress', value: 'in progress' },
        { label: 'confirmed', value: 'confirmed' },
        { label: 'rejected', value: 'rejected' },
        { label: 'ignored', value: 'ignored' },
    ];

    return (
        <div>
            {/* Outreach Tabs */}
            <div className="mb-4 flex overflow-x-auto">
                <Link href="/dashboard" legacyBehavior>
                    <div className="mr-4 flex-shrink-0 cursor-pointer rounded-md bg-gray-100 px-4 py-2 text-xs text-gray-600 duration-300 hover:bg-primary-500 hover:text-white">
                        <a>{t('campaigns.show.activities.outreach.addNewInfluencer')}</a>
                    </div>
                </Link>
                {/* TODO: make Tabs component reusable */}
                <div className="hidden items-center sm:flex">
                    {tabs.map((tab, index) => (
                        <div
                            key={index}
                            onClick={() => handleTabChange(tab.value)}
                            className={`mr-4 flex-shrink-0 cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold duration-300 hover:bg-primary-500 hover:bg-opacity-20 hover:text-primary-500 focus:bg-primary-500 focus:bg-opacity-20 focus:text-primary-500 ${
                                tabStatus === tab.value
                                    ? 'bg-primary-500 bg-opacity-20 text-primary-500'
                                    : 'bg-gray-100 text-gray-400 '
                            }`}
                        >
                            {t(`campaigns.show.activities.outreach.${tab.label}`)}{' '}
                            <span> {creatorsCount(tab.value) > 0 && creatorsCount(tab.value)}</span>
                        </div>
                    ))}
                </div>

                {/* On Mobile Show Select instead */}
                <select
                    className="appearance-none rounded-lg bg-primary-500 bg-opacity-20 px-4 py-2 text-center text-xs font-semibold text-primary-500 outline-none sm:hidden"
                    onChange={(e) => handleTabChange(e.target.value)}
                >
                    {tabs.map((tab, index) => (
                        <option
                            key={index}
                            value={tab.value}
                            selected={tabStatus === tab.value}
                            className={`mr-4 flex-shrink-0 cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-400 duration-300 hover:bg-primary-500 hover:bg-opacity-20 hover:text-primary-500 ${
                                tabStatus === tab.value &&
                                'bg-primary-500 bg-opacity-20 text-purple-500'
                            }`}
                        >
                            {t(`campaigns.show.activities.outreach.${tab.label}`)}{' '}
                            {creatorsCount(tab.value) > 0 && creatorsCount(tab.value)}
                        </option>
                    ))}
                </select>
            </div>
            <div className="py-5">
                <input
                    className="block w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-600 placeholder-gray-400 ring-1 ring-gray-900 ring-opacity-5 placeholder:text-sm focus:outline-none"
                    placeholder={t('creators.show.searchInfluencerPlaceholder') as string}
                    id="influencer-search"
                    value={searchTerm}
                    onChange={(e) => {
                        handleInputChange(e);
                    }}
                />
            </div>
            {/* -- Outreach Table -- */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 overflow-y-visible">
                    <thead className="sticky top-0 bg-white">
                        <tr>
                            {columnLabels.map((label, index) => (
                                <th
                                    key={index}
                                    scope="col"
                                    className={`sticky left-0 min-w-fit bg-white px-6 py-3 text-left text-xs font-normal tracking-wider text-gray-500 ${
                                        index === 0 ? 'sticky left-0 z-10' : ''
                                    }`}
                                >
                                    {t(`campaigns.show.${label}`)}
                                </th>
                            ))}
                            {/*-- placeholder table header space for notes and delete section --*/}
                            <th className=" sticky right-0 z-30 min-w-[280px] max-w-[280px] bg-white px-3 py-3 text-left text-xs  font-normal tracking-wider text-gray-500">
                                {''}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {influencersList.length === 0 && (
                            <tr>
                                <td colSpan={columnLabels.length + 1} className="px-6 py-4">
                                    <div className="flex justify-center">
                                        <p className="text-sm text-gray-500">
                                            {t('campaigns.show.activities.outreach.noInfluencers')}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {influencersList.map((creator, index) => {
                            if (creator.status === tabStatus)
                                return (
                                    <InfluencerRow
                                        key={index}
                                        creator={creator}
                                        index={index}
                                        updateCampaignCreator={updateCampaignCreator}
                                        editingModeTrue={editingModeTrue}
                                        setToEdit={setToEdit}
                                        handleDropdownSelect={handleDropdownSelect}
                                        inputRef={inputRef}
                                        setInlineEdit={setInlineEdit}
                                        tabs={tabs}
                                        openNotes={openNotes}
                                        deleteCampaignCreator={deleteCampaignCreator}
                                        openMoveInfluencerModal={openMoveInfluencerModal}
                                        showMoveInfluencerModal={showMoveInfluencerModal}
                                        setShowMoveInfluencerModal={setShowMoveInfluencerModal}
                                    />
                                );
                        })}
                    </tbody>
                </table>
            </div>

            {campaigns && currentCampaign && currentCreator && (
                <MoveInfluencerModal
                    platform={currentCreator.platform}
                    selectedCreator={currentCreator}
                    currentCampaign={currentCampaign}
                    show={showMoveInfluencerModal}
                    setShow={setShowMoveInfluencerModal}
                    campaigns={campaigns}
                />
            )}
        </div>
    );
}
