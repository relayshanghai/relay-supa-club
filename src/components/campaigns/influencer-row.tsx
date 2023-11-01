/* eslint-disable complexity */
import { t } from 'i18next';
import Link from 'next/link';
import { useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { CampaignCreatorDB } from 'src/utils/api/db';
import { imgProxy } from 'src/utils/fetcher';
import type { SocialMediaPlatform } from 'types';
import { SocialMediaIcon } from '../common/social-media-icon';
import { CreatorContacts } from './creator-contacts';
import TableInput from './campaign-table-input';
import { ArrowRightOnRectangle, SquarePlus, Trashcan } from '../icons';
import { Button } from '../button';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import type { TableColumns } from './campaign-influencers-table';
import { Tooltip } from '../library';
import { CampaignInfluencerRowOpenSocialLink } from 'src/utils/analytics/events';

export interface InfluencerRowProps {
    index: number;
    creator: CampaignCreatorDB;
    tabs: {
        label: string;
        value: string;
    }[];
    handleDropdownSelect: (value: string, creator: CampaignCreatorDB, objKey: string) => Promise<void>;
    setInlineEdit: (index: number, key: string) => void;
    editingModeTrue: (index: number, key: string) => boolean;
    updateCampaignCreator: (creator: CampaignCreatorDB) => void;
    setToEdit: Dispatch<SetStateAction<null | { index: number; key: string }>>;
    deleteCampaignCreator: (creator: CampaignCreatorDB) => Promise<void>;
    openNotes: (creator: CampaignCreatorDB) => void;
    openMoveInfluencerModal: (creator: CampaignCreatorDB) => void;
    showMoveInfluencerModal: boolean;
    openManageInfluencerModal: (creator: CampaignCreatorDB) => void;
    openAddPostModal: (creator: CampaignCreatorDB) => void;
    setShowMoveInfluencerModal: Dispatch<SetStateAction<boolean>>;
    visibleColumns: TableColumns[];
    tabStatus: string | string[];
}

const InfluencerRow = ({
    index,
    creator,
    tabs,
    handleDropdownSelect,
    setInlineEdit,
    editingModeTrue,
    updateCampaignCreator,
    setToEdit,
    deleteCampaignCreator,
    openNotes,
    openMoveInfluencerModal,
    openManageInfluencerModal,
    openAddPostModal,
    tabStatus,
    visibleColumns,
}: InfluencerRowProps) => {
    const handle = creator.username || creator.fullname || '';
    const [showContactInfo, setShowContactInfo] = useState(false);
    const { track } = useRudderstackTrack();
    const inputRef = useRef(null);

    return (
        <tr key={creator.id} className="group text-xs hover:relative hover:bg-primary-50">
            {visibleColumns.map((column) => (
                <td
                    key={column.header + creator.id}
                    className="w-[200px] whitespace-nowrap bg-white px-6 py-4 group-hover:bg-primary-50"
                >
                    {column.type === 'account' && (
                        <div className="flex items-center">
                            <div className="relative h-10 w-10 flex-shrink-0 rounded-full bg-gray-300">
                                <img className="h-10 w-10 rounded-full" src={imgProxy(creator.avatar_url)} alt="" />
                                <div className="absolute bottom-0 right-0 ">
                                    <SocialMediaIcon
                                        platform={creator.platform as SocialMediaPlatform}
                                        width={16}
                                        height={16}
                                        className="opacity-80"
                                    />
                                </div>
                            </div>

                            <Link href={creator.link_url || ''} target="_blank" rel="noopener noreferrer">
                                <div
                                    className="ml-4"
                                    onClick={() => {
                                        // @note previously trackEvent(CAMPAIGN_INFLUENCER_ROW('open social link'), {
                                        //     platform: creator.platform,
                                        //     user_id: creator.creator_id,
                                        // });
                                        track(CampaignInfluencerRowOpenSocialLink, {
                                            platform: creator.platform,
                                            user_id: creator.creator_id,
                                        });
                                    }}
                                >
                                    <div className="truncate text-xs font-medium text-gray-900">{creator.fullname}</div>
                                    <div className="inline-block truncate text-xs text-primary-500">@{handle}</div>
                                </div>
                            </Link>
                        </div>
                    )}
                    {column.type === 'contact' &&
                        (showContactInfo ? (
                            <CreatorContacts {...creator} />
                        ) : (
                            <Button variant="secondary" onClick={() => setShowContactInfo(true)}>
                                {t('campaigns.show.viewContactInfo')}
                            </Button>
                        ))}
                    {column.type === 'select' && (
                        <select
                            data-testid="status-dropdown"
                            onChange={(e) => handleDropdownSelect(e.target.value, creator, 'status')}
                            value={creator.status || ''}
                            className="-ml-1 mr-2.5 cursor-pointer appearance-none rounded-md border border-gray-200 bg-primary-50  text-center text-xs font-semibold text-primary-500 outline-none hover:bg-primary-100"
                        >
                            {tabs.map((tab) => (
                                <option value={tab.value} key={tab.label}>
                                    {t(`campaigns.show.activities.outreach.${tab.label}`)}
                                </option>
                            ))}
                        </select>
                    )}

                    {column.type === 'inputText' && (
                        <button
                            className="relative cursor-pointer text-xs text-gray-900 hover:text-primary-500"
                            onClick={() => setInlineEdit(index, 'next_step')}
                        >
                            <div className={`${editingModeTrue(index, 'next_step') ? 'hidden' : ''}`}>
                                {creator.next_step || (
                                    <div className="cursor-pointer text-primary-500 hover:text-primary-700">
                                        {t('campaigns.show.addActionPoint')}
                                    </div>
                                )}
                            </div>

                            {editingModeTrue(index, 'next_step') && (
                                <TableInput
                                    value={creator.next_step || ''}
                                    type="text"
                                    creator={creator}
                                    objKey="next_step"
                                    ref={inputRef}
                                    updateCampaignCreator={updateCampaignCreator}
                                    closeModal={() => setToEdit(null)}
                                />
                            )}
                        </button>
                    )}

                    {column.type === 'inputNumber' && (
                        <button
                            className="relative cursor-pointer pr-2 text-left text-xs text-gray-900  hover:text-primary-500"
                            onClick={() => setInlineEdit(index, 'paid_amount')}
                        >
                            {creator.paid_amount?.toLocaleString() || '-'} {creator.payment_currency}
                            {editingModeTrue(index, 'paid_amount') && (
                                <TableInput
                                    value={creator.paid_amount.toLocaleString()}
                                    type="number"
                                    creator={creator}
                                    objKey="paid_amount"
                                    ref={inputRef}
                                    updateCampaignCreator={updateCampaignCreator}
                                    closeModal={() => setToEdit(null)}
                                />
                            )}
                        </button>
                    )}
                    {column.type === 'modal' && (
                        <Button onClick={() => openAddPostModal(creator)} variant="secondary">
                            {t('campaigns.show.content')}
                        </Button>
                    )}
                </td>
            ))}
            {/* -- Actions Column -- */}
            <td className="right-0 bg-white px-6 py-4 group-hover:bg-primary-50 sm:sticky">
                <div className="flex justify-end">
                    <Tooltip
                        content={t('campaigns.show.moveInfluencer')}
                        detail={t('campaigns.show.moveInfluencerDescr')}
                        position="left"
                    >
                        <button
                            onClick={() => {
                                openMoveInfluencerModal(creator);
                            }}
                            data-testid="move-influencer-button"
                            className={`group/move mr-2 h-8 w-8 cursor-pointer  rounded-md border border-gray-200 bg-gray-50 p-2 text-center font-medium text-gray-600 hover:bg-gray-100 ${
                                tabStatus === 'to contact' || tabStatus === 'contacted' ? '' : 'hidden'
                            }  `}
                        >
                            <ArrowRightOnRectangle className="h-4 w-4 stroke-tertiary-600 group-hover/move:stroke-primary-600" />
                        </button>
                    </Tooltip>
                    <button
                        data-testid="open-notes-button"
                        onClick={() => openNotes(creator)}
                        className={`mr-2 cursor-pointer whitespace-nowrap rounded-md border border-gray-200 bg-gray-50 p-2 text-center font-medium text-gray-600  hover:bg-gray-100 hover:text-primary-500 ${
                            tabStatus === 'in progress' || tabStatus === 'confirmed' ? '' : 'hidden'
                        }`}
                    >
                        {t('campaigns.show.notes')}
                    </button>
                    <Tooltip
                        content={t('campaigns.show.manageInfluencer')}
                        detail={t('campaigns.show.manageInfluencerDescr')}
                        position="left"
                    >
                        <button
                            data-testid="manage-button"
                            onClick={() => openManageInfluencerModal(creator)}
                            className="group/manage mr-2 h-8 w-8 cursor-pointer  rounded-md border border-gray-200 bg-gray-50 p-2 text-center font-medium text-gray-600 hover:bg-gray-100"
                        >
                            <SquarePlus className="h-4 w-4 stroke-tertiary-600 group-hover/manage:stroke-primary-600" />
                        </button>
                    </Tooltip>
                    <button
                        data-testid="delete-creator"
                        onClick={() => deleteCampaignCreator(creator)}
                        className="group/delete h-8 w-8 cursor-pointer rounded-md border border-gray-200 bg-gray-50 p-2 text-center text-gray-600 hover:bg-gray-100"
                    >
                        <Trashcan className="h-4 w-4 fill-tertiary-600 group-hover/delete:fill-primary-600" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default InfluencerRow;
