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
import dateFormat from 'src/utils/dateFormat';
import { Trashcan } from '../icons';
import { Button } from '../button';
import { useRudderstack } from 'src/hooks/use-rudderstack';

const paymentStatus = [
    { id: 1, label: 'unpaid', value: 'unpaid' },
    { id: 2, label: 'partiallypaid', value: 'partial_paid' },
    { id: 3, label: 'fullypaid', value: 'full_paid' },
];

const sampleStatus = [
    { id: 1, label: 'unsent', value: 'unsent' },
    { id: 2, label: 'sent', value: 'sent' },
    { id: 3, label: 'delivered', value: 'delivered' },
];

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
}

const InfluencerRow = ({
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
}: InfluencerRowProps) => {
    const handle = creator.username || creator.fullname || '';
    const [showContactInfo, setShowContactInfo] = useState(false);
    const { trackEvent } = useRudderstack();

    return (
        <tr key={index} className="group text-xs hover:relative hover:bg-primary-50">
            {/* -- Account Column -- */}
            <td className="sticky left-0 z-30 w-[200px] whitespace-nowrap bg-white px-6 py-4 group-hover:bg-primary-50">
                <div className="flex items-center">
                    <div className="relative h-10 w-10 flex-shrink-0 rounded-full bg-gray-300">
                        <img className="h-10 w-10 rounded-full" src={imgProxy(creator.avatar_url)} alt="" />
                        <div className="absolute right-0 bottom-0 ">
                            <SocialMediaIcon
                                platform={creator.platform as SocialMediaPlatform}
                                width={16}
                                height={16}
                                className="opacity-80"
                            />
                        </div>
                    </div>
                    <Link href={`/influencer/${creator.platform}/${creator.creator_id}`} target="_blank">
                        <div
                            className="ml-4"
                            onClick={() =>
                                trackEvent('Opened a report from Campaign Page', {
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
            </td>
            {/* -- Contact Column -- */}
            <td className="min-w-[150px] whitespace-nowrap px-6 py-4">
                {showContactInfo ? (
                    <CreatorContacts {...creator} />
                ) : (
                    <Button variant="secondary" onClick={() => setShowContactInfo(true)}>
                        {t('campaigns.show.viewContactInfo')}
                    </Button>
                )}
            </td>
            <td className="whitespace-nowrap px-6 py-4">
                <select
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
            </td>
            {/* TODO: add added by column, Ticket V2-55 */}
            {/* <td
                                            id="creator-added-by"
                                            className="px-6 py-4 whitespace-nowrap"
                                        >
                                            {creator.added_by_id ? (
                                                <div className="flex">
                                                    <div className="group flex text-xs items-center">
                                                        <div className="rounded-full text-xs w-6 h-6 bg-tertiary-300 text-white text-center p-1 mr-2">
                                                            XX
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-xs text-gray-600"> - </div>
                                            )}
                                        </td> */}
            {/* -- Action Point Column -- */}
            <td className="min-w-[150px] max-w-[200px] whitespace-normal px-6 py-4">
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
            </td>
            {/* -- Publication Date Column -- */}
            <td className="min-w-[0px] max-w-[200px] whitespace-nowrap px-6 py-4">
                <button
                    className="relative cursor-pointer text-xs text-gray-900 duration-300 hover:text-primary-500"
                    onClick={(e) => setInlineEdit(e, index, 'publication_date')}
                >
                    <div className={`${editingModeTrue(index, 'publication_date') ? 'hidden' : ''}`}>
                        {dateFormat(creator?.publication_date, 'mediumDate', true, true) || (
                            <div className="cursor-pointer text-primary-500 duration-300 hover:text-primary-700">
                                {t('campaigns.show.selectDate')}
                            </div>
                        )}
                    </div>

                    {editingModeTrue(index, 'publication_date') && (
                        <TableInput
                            value={dateFormat(creator.publication_date, 'isoDate', true, true) || ''}
                            type="date"
                            creator={creator}
                            objKey="publication_date"
                            ref={inputRef}
                            updateCampaignCreator={updateCampaignCreator}
                            closeModal={() => setToEdit(null)}
                        />
                    )}
                </button>
            </td>

            <td className="whitespace-nowrap px-6 py-4">
                <button
                    className="relative cursor-pointer pr-2 text-left text-xs text-gray-900 duration-300 hover:text-primary-500"
                    onClick={(e) => setInlineEdit(e, index, 'rate_cents')}
                >
                    {creator.rate_cents?.toLocaleString() || '-'} {creator.rate_currency}
                    {editingModeTrue(index, 'rate_cents') && (
                        <TableInput
                            value={creator.rate_cents?.toLocaleString()}
                            type="number"
                            creator={creator}
                            objKey="rate_cents"
                            ref={inputRef}
                            updateCampaignCreator={updateCampaignCreator}
                            closeModal={() => setToEdit(null)}
                        />
                    )}
                </button>
            </td>
            <td className="whitespace-nowrap px-6 py-4">
                <button
                    className="relative cursor-pointer pr-2 text-left text-xs text-gray-900 duration-300 hover:text-primary-500"
                    onClick={(e) => setInlineEdit(e, index, 'paid_amount_cents')}
                >
                    {creator.paid_amount_cents?.toLocaleString() || '-'} {creator.paid_amount_currency}
                    {editingModeTrue(index, 'paid_amount_cents') && (
                        <TableInput
                            value={creator.paid_amount_cents?.toLocaleString()}
                            type="number"
                            creator={creator}
                            objKey="paid_amount_cents"
                            ref={inputRef}
                            updateCampaignCreator={updateCampaignCreator}
                            closeModal={() => setToEdit(null)}
                        />
                    )}
                </button>
            </td>
            {/* -- Payment Info Column -- */}
            <td className="min-w-[150px] max-w-[200px] whitespace-normal px-6 py-4">
                <button
                    className="relative cursor-pointer text-xs text-gray-900 duration-300 hover:text-primary-500"
                    onClick={(e) => setInlineEdit(e, index, 'payment_details')}
                >
                    <div className={`${editingModeTrue(index, 'payment_details') ? 'hidden' : ' '}`}>
                        {creator.payment_details || (
                            <div className="cursor-pointer text-primary-500 duration-300 hover:text-primary-700">
                                {t('campaigns.show.addPaymentInfo')}
                            </div>
                        )}
                    </div>
                    {editingModeTrue(index, 'payment_details') && (
                        <TableInput
                            value={creator.payment_details || ''}
                            type="text"
                            creator={creator}
                            objKey="payment_details"
                            ref={inputRef}
                            updateCampaignCreator={updateCampaignCreator}
                            closeModal={() => setToEdit(null)}
                        />
                    )}
                </button>
            </td>
            <td className="whitespace-nowrap px-6 py-4">
                <select
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleDropdownSelect(e, creator, 'payment_status')}
                    value={creator.payment_status}
                    className="-ml-1 mr-2.5 cursor-pointer appearance-none rounded-md border border-gray-200 bg-green-50 px-4 py-2 text-center text-xs font-semibold text-green-500 outline-none duration-300 hover:bg-green-100"
                >
                    {paymentStatus.map((tab, index) => (
                        <option value={tab.value} key={index}>
                            {t(`campaigns.creatorModal.${tab.label}`)}
                        </option>
                    ))}
                </select>
            </td>
            {/* -- Influencer Address Column -- */}
            <td className="py-4whitespace-normal min-w-[150px] max-w-[200px] px-6">
                <button
                    className="relative cursor-pointer text-xs text-gray-900 duration-300 hover:text-primary-500"
                    onClick={(e) => setInlineEdit(e, index, 'address')}
                >
                    <div className={`${editingModeTrue(index, 'address') ? 'hidden' : ' '}`}>
                        {creator.address || (
                            <div className="cursor-pointer text-primary-500 duration-300 hover:text-primary-700">
                                {t('campaigns.show.addAddress')}
                            </div>
                        )}
                    </div>
                    {editingModeTrue(index, 'address') && (
                        <TableInput
                            value={creator.address || ''}
                            type="text"
                            creator={creator}
                            objKey="address"
                            ref={inputRef}
                            updateCampaignCreator={updateCampaignCreator}
                            closeModal={() => setToEdit(null)}
                        />
                    )}
                </button>
            </td>
            {/* -- Sample Status Column -- */}
            <td className="whitespace-nowrap px-6 py-4">
                <select
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleDropdownSelect(e, creator, 'sample_status')}
                    value={creator.sample_status}
                    className="-ml-1 mr-2.5 cursor-pointer appearance-none rounded-md border border-gray-200 bg-orange-50 px-4 py-2 text-center text-xs font-semibold text-orange-500 outline-none duration-300 hover:bg-orange-100"
                >
                    {sampleStatus.map((tab, index) => (
                        <option value={tab.value} key={index}>
                            {t(`campaigns.creatorModal.${tab.label}`)}
                        </option>
                    ))}
                </select>
            </td>

            <td className="right-0 z-50 whitespace-nowrap bg-white px-6 py-4 group-hover:bg-primary-50 sm:sticky ">
                <div className="flex justify-end">
                    <button
                        onClick={(e) => {
                            openMoveInfluencerModal(e, creator);
                        }}
                        className="mr-2 cursor-pointer appearance-none  rounded-md border border-gray-200 bg-gray-50 p-2 text-center font-medium text-gray-600 outline-none duration-300 hover:bg-gray-100"
                    >
                        {/* TODO: notes ticket V2-139 */}
                        {t('campaigns.show.moveInfluencer')}
                    </button>
                    <button
                        onClick={(e) => openNotes(e, creator)}
                        className="mr-2 cursor-pointer appearance-none  rounded-md border border-gray-200 bg-gray-50 p-2 text-center font-medium text-gray-600 outline-none duration-300 hover:bg-gray-100"
                    >
                        {/* TODO: notes ticket V2-139 */}
                        {t('campaigns.show.notes')}
                    </button>
                    <button
                        onClick={(e) => deleteCampaignCreator(e, creator)}
                        className="cursor-pointer appearance-none rounded-md  border border-gray-200 bg-gray-50 p-2 text-center text-gray-600 outline-none duration-300 hover:bg-gray-100"
                    >
                        <Trashcan className="h-4 w-4 fill-tertiary-600 hover:fill-primary-600" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default InfluencerRow;
