import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import type { CampaignCreatorDB, CampaignDB } from 'src/utils/api/db';
import Fuse from 'fuse.js';
import { MoveInfluencerModal } from '../modal-move-influencer';
import { useCampaignCreators } from 'src/hooks/use-campaign-creators';
import InfluencerRow from './influencer-row';
import { ManageInfluencerModal } from './manage-influencer-modal';
import { AddPostModal } from './add-post-modal';
import { useRudderstack } from 'src/hooks/use-rudderstack';

export interface CreatorsOutreachProps {
    currentCampaign: CampaignDB;
    setShowNotesModal: (value: boolean) => void;
    setCurrentCreator: (value: CampaignCreatorDB) => void;
    campaigns?: CampaignDB[];
    currentCreator?: CampaignCreatorDB | null;
}
export interface TableColumns {
    header: string;
    type: 'account' | 'contact' | 'select' | 'inputText' | 'inputNumber' | 'modal';
    name: string;
}

export default function CampaignInfluencersTable({
    currentCampaign,
    setShowNotesModal,
    setCurrentCreator,
    campaigns,
    currentCreator,
}: CreatorsOutreachProps) {
    const { t } = useTranslation();

    const router = useRouter();
    const { pathname, query } = router;
    const { trackEvent } = useRudderstack();
    const [tabStatus, setTabStatus] = useState<string | string[]>(query.curTab || 'to contact');
    const [toEdit, setToEdit] = useState<{ index: number; key: string } | null>(null);
    const [searchTerm, setSearchTerm] = useState<string | ''>('');
    const [influencersList, setInfluencersList] = useState<CampaignCreatorDB[]>([]);

    const [showMoveInfluencerModal, setShowMoveInfluencerModal] = useState(false);
    const [showManageInfluencerModal, setShowManageInfluencerModal] = useState(false);
    const [showAddPostModal, setShowAddPostModal] = useState(false);

    const { campaignCreators, deleteCreatorInCampaign, updateCreatorInCampaign, refreshCampaignCreators } =
        useCampaignCreators({
            campaign: currentCampaign,
        });

    const tabs = [
        { label: 'toContact', value: 'to contact' },
        { label: 'contacted', value: 'contacted' },
        { label: 'inProgress', value: 'in progress' },
        { label: 'confirmed', value: 'confirmed' },
        { label: 'posted', value: 'posted' },
        { label: 'rejected', value: 'rejected' },
        { label: 'ignored', value: 'ignored' },
    ];

    const tableColumns: TableColumns[] = [
        { header: 'account', type: 'account', name: 'account' },
        { header: 'contact', type: 'contact', name: 'contact' },
        { header: 'creatorStatus', type: 'select', name: 'status' },
        { header: 'nextPoint', type: 'inputText', name: 'next_point' },
        { header: 'influencerFee', type: 'inputNumber', name: 'paid_amount_cents' }, // In the Figma design feedback, Sophia changed Payment Amount to Influencer Fee as the column name.
        { header: 'links', type: 'modal', name: 'contents' },
    ];

    function getVisibleColumns(tabStatus: string | string[]) {
        let filterNames: TableColumns['header'][] = [];
        switch (tabStatus) {
            case 'to contact':
                filterNames = ['account', 'contact', 'creatorStatus'];
                break;
            case 'contacted':
                filterNames = ['account', 'creatorStatus'];
                break;
            case 'in progress':
                filterNames = ['account', 'creatorStatus', 'nextPoint', 'influencerFee'];
                break;
            case 'confirmed':
                filterNames = ['account', 'creatorStatus', 'nextPoint', 'influencerFee'];
                break;
            case 'posted':
                filterNames = ['account', 'creatorStatus', 'nextPoint', 'influencerFee', 'links'];
                break;
            case 'rejected':
                filterNames = ['account', 'creatorStatus'];
                break;
            case 'ignored':
                filterNames = ['account', 'creatorStatus'];
                break;
        }
        return tableColumns.filter((column) => filterNames.includes(column.header));
    }

    const visibleColumns: TableColumns[] = getVisibleColumns(tabStatus);

    useEffect(() => {
        refreshCampaignCreators();
    }, [refreshCampaignCreators]);

    useEffect(() => {
        if (campaignCreators) {
            setInfluencersList(campaignCreators);
        }
    }, [campaignCreators]);

    useEffect(() => {
        if (!campaignCreators) {
            return;
        }
        const fuse = new Fuse(campaignCreators, {
            minMatchCharLength: 1,
            keys: ['fullname'],
        });

        if (searchTerm.length === 0) {
            setInfluencersList(campaignCreators);
            return;
        }

        setInfluencersList(fuse.search(searchTerm).map((result) => result.item));
    }, [searchTerm, campaignCreators]);

    const handleTabChange = (value: string) => {
        router.push({ pathname, query: { ...query, curTab: value } });
        setTabStatus(value);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleDropdownSelect = async (value: string, creator: CampaignCreatorDB, objKey: string) => {
        creator = { ...creator, [objKey]: value };
        await updateCreatorInCampaign(creator);
        refreshCampaignCreators();
        toast.success(t('campaigns.creatorModal.influencerUpdated'));
    };

    const setInlineEdit = (index: number, key: string) => {
        setToEdit({ index, key });
    };

    const openNotes = (creator: CampaignCreatorDB) => {
        setCurrentCreator(creator);
        setShowNotesModal(true);
    };

    const openMoveInfluencerModal = (creator: CampaignCreatorDB) => {
        setCurrentCreator(creator);
        setShowMoveInfluencerModal(true);
    };

    const openManageInfluencerModal = (creator: CampaignCreatorDB) => {
        setCurrentCreator(creator);
        setShowManageInfluencerModal(true);
    };
    const openAddPostModal = (creator: CampaignCreatorDB) => {
        setCurrentCreator(creator);
        setShowAddPostModal(true);
    };

    const deleteCampaignCreator = async (creator: CampaignCreatorDB) => {
        const c = confirm(t('campaigns.modal.deleteConfirmation') as string);
        if (!c) return;
        await deleteCreatorInCampaign({ creatorId: creator.id, campaignId: currentCampaign.id });
        refreshCampaignCreators();
        toast.success(t('campaigns.modal.deletedSuccessfully'));
    };

    const updateCampaignCreator = async (creator: CampaignCreatorDB) => {
        await updateCreatorInCampaign(creator);
        setToEdit(null);
        refreshCampaignCreators();
        toast.success(t('campaigns.creatorModal.influencerUpdated'));
    };

    // get the number of creators in each status
    const creatorsCount = (status: string) => {
        return campaignCreators?.filter((c) => c.status === status).length ?? 0;
    };

    const editingModeTrue = (index: number, key: string) => index === toEdit?.index && key === toEdit?.key;

    return (
        <div>
            {/* Outreach Tabs */}
            <div className="mb-4 flex overflow-x-auto">
                <Link href="/dashboard" legacyBehavior>
                    <div
                        onClick={() => trackEvent('Campaign Management, click on add new influencer')}
                        className="mr-4 flex-shrink-0 cursor-pointer rounded-md bg-gray-100 px-4 py-2 text-xs text-gray-600 duration-300 hover:bg-primary-500 hover:text-white"
                    >
                        <a>{t('campaigns.show.activities.outreach.addNewInfluencer')}</a>
                    </div>
                </Link>
                {/* TODO: make Tabs component reusable */}
                <div className="hidden items-center sm:flex">
                    {tabs.map((tab) => (
                        <div
                            key={tab.label}
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
                            defaultValue={tab.value}
                            className={`mr-4 flex-shrink-0 cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-400 duration-300 hover:bg-primary-500 hover:bg-opacity-20 hover:text-primary-500 ${
                                tabStatus === tab.value && 'bg-primary-500 bg-opacity-20 text-purple-500'
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
            <div className="min-h-screen w-full overflow-auto">
                <table className="w-full table-auto divide-y divide-gray-200 overflow-y-visible bg-white">
                    <thead>
                        <tr>
                            {visibleColumns.map((column, index) => (
                                <th
                                    key={column.header}
                                    className={`  bg-white px-6 py-3 text-left text-xs font-normal tracking-wider text-gray-500 ${
                                        index === 0 ? ' sticky left-0 z-10' : index === -1 ? ' sticky right-0 z-20' : ''
                                    }`}
                                >
                                    {t(`campaigns.show.${column.header}`)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {influencersList.length === 0 && (
                            <tr>
                                <td colSpan={tableColumns.length + 1} className="px-6 py-4">
                                    <div className="flex justify-center">
                                        <p className="text-sm text-gray-500">
                                            {t('campaigns.show.activities.outreach.noInfluencers')}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {influencersList.map((creator, index) =>
                            creator.status === tabStatus ? (
                                <InfluencerRow
                                    key={creator.id}
                                    creator={creator}
                                    index={index}
                                    updateCampaignCreator={updateCampaignCreator}
                                    editingModeTrue={editingModeTrue}
                                    setToEdit={setToEdit}
                                    handleDropdownSelect={handleDropdownSelect}
                                    setInlineEdit={setInlineEdit}
                                    tabs={tabs}
                                    openNotes={openNotes}
                                    deleteCampaignCreator={deleteCampaignCreator}
                                    openMoveInfluencerModal={openMoveInfluencerModal}
                                    openManageInfluencerModal={openManageInfluencerModal}
                                    openAddPostModal={openAddPostModal}
                                    showMoveInfluencerModal={showMoveInfluencerModal}
                                    setShowMoveInfluencerModal={setShowMoveInfluencerModal}
                                    visibleColumns={visibleColumns}
                                    tabStatus={tabStatus}
                                />
                            ) : null,
                        )}
                    </tbody>
                </table>
            </div>
            {currentCampaign && currentCreator && (
                <AddPostModal
                    key={currentCreator.id}
                    creator={currentCreator}
                    visible={showAddPostModal}
                    onClose={() => setShowAddPostModal(false)}
                />
            )}{' '}
            {currentCreator && currentCampaign && (
                <ManageInfluencerModal
                    visible={showManageInfluencerModal}
                    onClose={() => setShowManageInfluencerModal(false)}
                    creator={currentCreator}
                    openMoveInfluencerModal={openMoveInfluencerModal}
                    openNotes={openNotes}
                    updateCampaignCreator={updateCampaignCreator}
                    deleteCampaignCreator={deleteCampaignCreator}
                />
            )}
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
