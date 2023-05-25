import { t } from 'i18next';
import Link from 'next/link';
import { useState } from 'react';
import type { ChangeEvent, MouseEvent, Dispatch, RefObject, SetStateAction } from 'react';
import type { CampaignCreatorDB } from 'src/utils/api/db';
import { imgProxy } from 'src/utils/fetcher';
import type { SocialMediaPlatform } from 'types';
import { SocialMediaIcon } from '../common/social-media-icon';
import { CreatorContacts } from './creator-contacts';
import TableInput from './campaign-table-input';
import { ArrowRightOnRectangle, SquarePlus, Trashcan } from '../icons';
import { Button } from '../button';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import type { TableColumns } from './campaign-influencers-table-v2';

export interface InfluencerRowProps {
    index: number;
    creator: CampaignCreatorDB;
    tabs: {
        label: string;
        value: string;
    }[];
    handleDropdownSelect: (
        e: ChangeEvent<HTMLSelectElement>,
        creator: CampaignCreatorDB,
        objKey: string,
    ) => Promise<void>;
    setInlineEdit: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, index: number, key: string) => void;
    editingModeTrue: (index: number, key: string) => boolean;
    inputRef: RefObject<HTMLInputElement>;
    updateCampaignCreator: (creator: CampaignCreatorDB) => void;
    setToEdit: Dispatch<SetStateAction<null | { index: number; key: string }>>;
    deleteCampaignCreator: (
        e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
        creator: CampaignCreatorDB,
    ) => Promise<void>;
    openNotes: any;
    openMoveInfluencerModal: (
        e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
        creator: CampaignCreatorDB,
    ) => void;
    showMoveInfluencerModal: boolean;
    setShowMoveInfluencerModal: Dispatch<SetStateAction<boolean>>;
    getVisibleColumns: (tabStatus: string | string[]) => TableColumns[];
    tabStatus: string | string[];
}

const InfluencerRowV2 = ({
    index,
    creator,
    tabs,
    handleDropdownSelect,
    setInlineEdit,
    editingModeTrue,
    inputRef,
    updateCampaignCreator,
    setToEdit,
    deleteCampaignCreator,
    openNotes,
    openMoveInfluencerModal,
    getVisibleColumns,
    tabStatus,
}: InfluencerRowProps) => {
    const handle = creator.username || creator.fullname || '';
    const [showContactInfo, setShowContactInfo] = useState(false);
    const { trackEvent } = useRudderstack();

    return (
        <tr key={creator.id} className="group text-xs hover:relative hover:bg-primary-50">
            {getVisibleColumns(tabStatus).map((column) => (
                <td
                    key={column.header}
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

                            <Link href={creator.link_url || ''} target="_blank">
                                <div
                                    className="ml-4"
                                    onClick={() =>
                                        trackEvent('Campaign Influencer Row, open social link', {
                                            platform: creator.platform,
                                            user_id: creator.creator_id,
                                        })
                                    }
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
                            onChange={(e) => handleDropdownSelect(e, creator, 'status')}
                            value={creator.status || ''}
                            className="-ml-1 mr-2.5 cursor-pointer appearance-none rounded-md border border-gray-200 bg-primary-50 px-4 py-2 text-center text-xs font-semibold text-primary-500 outline-none duration-300 hover:bg-primary-100"
                        >
                            {tabs.map((tab, index) => (
                                <option value={tab.value} key={index}>
                                    {t(`campaigns.show.activities.outreach.${tab.label}`)}
                                </option>
                            ))}
                        </select>
                    )}

                    {column.type === 'inputText' && (
                        <button
                            className="relative cursor-pointer text-xs text-gray-900 duration-300 hover:text-primary-500"
                            onClick={(e) => setInlineEdit(e, index, 'next_step')}
                        >
                            <div className={`${editingModeTrue(index, 'next_step') ? 'hidden' : ''}`}>
                                {creator.next_step || (
                                    <div className="cursor-pointer text-primary-500 duration-300 hover:text-primary-700">
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
                            className="relative cursor-pointer pr-2 text-left text-xs text-gray-900 duration-300 hover:text-primary-500"
                            onClick={(e) => setInlineEdit(e, index, column.name)}
                        >
                            {/* TODO: replace rate_cents with {column.name} after the sales column is added to CampaignCreators DB */}
                            {creator.rate_cents?.toLocaleString() || '-'} {creator.rate_currency}
                            {editingModeTrue(index, column.name) && (
                                <TableInput
                                    value={creator.rate_cents.toLocaleString()}
                                    type="number"
                                    creator={creator}
                                    objKey={column.name}
                                    ref={inputRef}
                                    updateCampaignCreator={updateCampaignCreator}
                                    closeModal={() => setToEdit(null)}
                                />
                            )}
                        </button>
                    )}
                    {/* TODO: add the posts modal after this PR is merged https://github.com/relayshanghai/relay-supa-club/pull/307  */}
                    {column.type === 'modal' && <Button variant="secondary">{t('campaigns.show.content')}</Button>}
                </td>
            ))}
            {/* -- Actions Column -- */}
            <td className="right-0 z-50 bg-white px-6 py-4 group-hover:bg-primary-50 sm:sticky">
                <div className="flex justify-end">
                    <button
                        onClick={(e) => {
                            openMoveInfluencerModal(e, creator);
                        }}
                        className="group/move mr-2 h-8 w-8 cursor-pointer appearance-none  rounded-md border border-gray-200 bg-gray-50 p-2 text-center font-medium text-gray-600 outline-none duration-300 hover:bg-gray-100"
                    >
                        <ArrowRightOnRectangle className="h-4 w-4 stroke-tertiary-600 group-hover/move:stroke-primary-600" />
                    </button>
                    <button
                        onClick={(e) => openNotes(e, creator)}
                        className="mr-2 cursor-pointer appearance-none  rounded-md border border-gray-200 bg-gray-50 p-2 text-center font-medium text-gray-600 outline-none duration-300 hover:bg-gray-100 hover:text-primary-500"
                    >
                        {/* TODO: notes ticket V2-139 */}
                        {t('campaigns.show.notes')}
                    </button>
                    <button className="group/manage mr-2 h-8 w-8 cursor-pointer appearance-none  rounded-md border border-gray-200 bg-gray-50 p-2 text-center font-medium text-gray-600 outline-none duration-300 hover:bg-gray-100">
                        <SquarePlus className="h-4 w-4 stroke-tertiary-600 group-hover/manage:stroke-primary-600" />
                    </button>
                    <button
                        data-testid="delete-creator"
                        onClick={(e) => deleteCampaignCreator(e, creator)}
                        className="group/delete h-8 w-8 cursor-pointer appearance-none rounded-md border border-gray-200 bg-gray-50 p-2 text-center text-gray-600 duration-300 hover:bg-gray-100"
                    >
                        <Trashcan className="h-4 w-4 fill-tertiary-600 group-hover/delete:fill-primary-600" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default InfluencerRowV2;
