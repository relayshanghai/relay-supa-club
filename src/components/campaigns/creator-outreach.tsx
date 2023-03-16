import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import type { ChangeEvent, MouseEvent} from 'react';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Trashcan } from 'src/components/icons';
import { useCampaigns } from 'src/hooks/use-campaigns';
import TableInput from './campaign-table-input';
import { SocialMediaIcon } from '../common/social-media-icon';
import { CreatorContacts } from './creator-contacts';
import dateFormat from 'src/utils/dateFormat';
import type { CampaignCreatorDB, CampaignWithCompanyCreators } from 'src/utils/api/db';
import type { SocialMediaPlatform } from 'types';
import { imgProxy } from 'src/utils/fetcher';

export default function CreatorsOutreach({
    currentCampaign,
    setShowNotesModal,
    setCurrentCreator,
}: {
    currentCampaign: CampaignWithCompanyCreators;
    setShowNotesModal: (value: boolean) => void;
    setCurrentCreator: (value: CampaignCreatorDB) => void;
}) {
    const { t } = useTranslation();
    const router = useRouter();
    const { pathname, query } = router;
    const [tabStatus, setTabStatus] = useState<string | string[]>(query.curTab || 'to contact');
    const [toEdit, setToEdit] = useState<{ index: number; key: string } | null>(null);
    const inputRef = useRef(null);

    const { deleteCreatorInCampaign, updateCreatorInCampaign, refreshCampaign } = useCampaigns({
        campaignId: currentCampaign?.id,
    });

    const tabs = [
        { label: 'toContact', value: 'to contact' },
        { label: 'contacted', value: 'contacted' },
        { label: 'inProgress', value: 'in progress' },
        { label: 'confirmed', value: 'confirmed' },
        { label: 'rejected', value: 'rejected' },
        { label: 'ignored', value: 'ignored' },
    ];

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

    const handleTabChange = (value: string) => {
        router.push({ pathname, query: { ...query, curTab: value } });
        setTabStatus(value);
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

    return (
        <div>
            {/* Outreach Tabs */}
            <div className="mb-4 flex">
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
                            {t(`campaigns.show.activities.outreach.${tab.label}`)}
                            <span>
                                &nbsp;{creatorsCount(tab.value) > 0 && creatorsCount(tab.value)}
                            </span>
                        </div>
                    ))}
                </div>
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
                            <th className=" sticky right-0 z-30 min-w-[150px] max-w-[150px] bg-white px-3 py-3 text-left text-xs  font-normal tracking-wider text-gray-500">
                                {''}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {currentCampaign?.campaign_creators.map((creator, index) => {
                            if (creator.status === tabStatus)
                                return (
                                    <tr
                                        key={index}
                                        className="group text-xs hover:relative hover:bg-primary-50"
                                    >
                                        {/* -- Account Column -- */}
                                        <td className="sticky left-0 z-30 w-[200px] whitespace-nowrap bg-white px-6 py-4 group-hover:bg-primary-50">
                                            <div className="flex items-center">
                                                <div className="relative h-10 w-10 flex-shrink-0 rounded-full bg-gray-300">
                                                    <img
                                                        className="h-10 w-10 rounded-full"
                                                        src={imgProxy(creator.avatar_url)}
                                                        alt=""
                                                    />
                                                    <div className="absolute right-0 bottom-0 ">
                                                        <SocialMediaIcon
                                                            platform={
                                                                creator.platform as SocialMediaPlatform
                                                            }
                                                            width={16}
                                                            height={16}
                                                            className="opacity-80"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="truncate text-xs font-medium text-gray-900">

                                                        <Link
                                                            href={`/influencer/${creator.platform}/${creator.creator_id}`}
                                                            target="_blank"
                                                        >
                                                            {creator.fullname}
                                                        </Link>

                                                    </div>
                                                    <div className="inline-block truncate text-xs text-primary-500">
                                                        @{creator.username}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        {/* -- Contact Column -- */}
                                        <td className="min-w-[150px] whitespace-nowrap px-6 py-4">
                                            <CreatorContacts {...creator} />
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <select
                                                onChange={(e) =>
                                                    handleDropdownSelect(e, creator, 'status')
                                                }
                                                value={creator.status}
                                                className="-ml-1 mr-2.5 cursor-pointer appearance-none rounded-md border border-gray-200 bg-primary-50 px-4 py-2 text-center text-xs font-semibold text-primary-500 outline-none duration-300 hover:bg-primary-100"
                                            >
                                                {tabs.map((tab, index) => (
                                                    <option value={tab.value} key={index}>
                                                        {t(
                                                            `campaigns.show.activities.outreach.${tab.label}`,
                                                        )}
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
                                            <div
                                                className="relative cursor-pointer text-xs text-gray-900 duration-300 hover:text-primary-500"
                                                onClick={(e) =>
                                                    setInlineEdit(e, index, 'next_step')
                                                }
                                            >
                                                <div
                                                    className={`${
                                                        editingModeTrue(index, 'next_step')
                                                            ? 'hidden'
                                                            : ''
                                                    }`}
                                                >
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
                                                        updateCampaignCreator={
                                                            updateCampaignCreator
                                                        }
                                                        closeModal={() => setToEdit(null)}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        {/* -- Publication Date Column -- */}
                                        <td className="min-w-[0px] max-w-[200px] whitespace-nowrap px-6 py-4">
                                            <div
                                                className="relative cursor-pointer text-xs text-gray-900 duration-300 hover:text-primary-500"
                                                onClick={(e) =>
                                                    setInlineEdit(e, index, 'publication_date')
                                                }
                                            >
                                                <div
                                                    className={`${
                                                        editingModeTrue(index, 'publication_date')
                                                            ? 'hidden'
                                                            : ''
                                                    }`}
                                                >
                                                    {dateFormat(
                                                        creator?.publication_date,
                                                        'mediumDate',
                                                        true,
                                                        true,
                                                    ) || (
                                                        <div className="cursor-pointer text-primary-500 duration-300 hover:text-primary-700">
                                                            {t('campaigns.show.selectDate')}
                                                        </div>
                                                    )}
                                                </div>

                                                {editingModeTrue(index, 'publication_date') && (
                                                    <TableInput
                                                        value={
                                                            dateFormat(
                                                                creator.publication_date,
                                                                'isoDate',
                                                                true,
                                                                true,
                                                            ) || ''
                                                        }
                                                        type="date"
                                                        creator={creator}
                                                        objKey="publication_date"
                                                        ref={inputRef}
                                                        updateCampaignCreator={
                                                            updateCampaignCreator
                                                        }
                                                        closeModal={() => setToEdit(null)}
                                                    />
                                                )}
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div
                                                className="relative cursor-pointer pr-2 text-left text-xs text-gray-900 duration-300 hover:text-primary-500"
                                                onClick={(e) =>
                                                    setInlineEdit(e, index, 'rate_cents')
                                                }
                                            >
                                                {creator.rate_cents?.toLocaleString() || '-'}{' '}
                                                {creator.rate_currency}
                                                {editingModeTrue(index, 'rate_cents') && (
                                                    <TableInput
                                                        value={creator.rate_cents?.toLocaleString()}
                                                        type="number"
                                                        creator={creator}
                                                        objKey="rate_cents"
                                                        ref={inputRef}
                                                        updateCampaignCreator={
                                                            updateCampaignCreator
                                                        }
                                                        closeModal={() => setToEdit(null)}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div
                                                className="relative cursor-pointer pr-2 text-left text-xs text-gray-900 duration-300 hover:text-primary-500"
                                                onClick={(e) =>
                                                    setInlineEdit(e, index, 'paid_amount_cents')
                                                }
                                            >
                                                {creator.paid_amount_cents?.toLocaleString() || '-'}{' '}
                                                {creator.paid_amount_currency}
                                                {editingModeTrue(index, 'paid_amount_cents') && (
                                                    <TableInput
                                                        value={creator.paid_amount_cents?.toLocaleString()}
                                                        type="number"
                                                        creator={creator}
                                                        objKey="paid_amount_cents"
                                                        ref={inputRef}
                                                        updateCampaignCreator={
                                                            updateCampaignCreator
                                                        }
                                                        closeModal={() => setToEdit(null)}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        {/* -- Payment Info Column -- */}
                                        <td className="min-w-[150px] max-w-[200px] whitespace-normal px-6 py-4">
                                            <div
                                                className="relative cursor-pointer text-xs text-gray-900 duration-300 hover:text-primary-500"
                                                onClick={(e) =>
                                                    setInlineEdit(e, index, 'payment_details')
                                                }
                                            >
                                                <div
                                                    className={`${
                                                        editingModeTrue(index, 'payment_details')
                                                            ? 'hidden'
                                                            : ' '
                                                    }`}
                                                >
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
                                                        updateCampaignCreator={
                                                            updateCampaignCreator
                                                        }
                                                        closeModal={() => setToEdit(null)}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <select
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) =>
                                                    handleDropdownSelect(
                                                        e,
                                                        creator,
                                                        'payment_status',
                                                    )
                                                }
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
                                            <div
                                                className="relative cursor-pointer text-xs text-gray-900 duration-300 hover:text-primary-500"
                                                onClick={(e) => setInlineEdit(e, index, 'address')}
                                            >
                                                <div
                                                    className={`${
                                                        editingModeTrue(index, 'address')
                                                            ? 'hidden'
                                                            : ' '
                                                    }`}
                                                >
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
                                                        updateCampaignCreator={
                                                            updateCampaignCreator
                                                        }
                                                        closeModal={() => setToEdit(null)}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        {/* -- Sample Status Column -- */}
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <select
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) =>
                                                    handleDropdownSelect(
                                                        e,
                                                        creator,
                                                        'sample_status',
                                                    )
                                                }
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
                                                <div
                                                    onClick={(e) => openNotes(e, creator)}
                                                    className="mr-2 cursor-pointer appearance-none  rounded-md border border-gray-200 bg-gray-50 p-2 text-center font-medium text-gray-600 outline-none duration-300 hover:bg-gray-100"
                                                >
                                                    {/* TODO: notes ticket V2-139 */}
                                                    {t('campaigns.show.notes')}
                                                </div>
                                                <div
                                                    onClick={(e) =>
                                                        deleteCampaignCreator(e, creator)
                                                    }
                                                    className="cursor-pointer appearance-none rounded-md  border border-gray-200 bg-gray-50 p-2 text-center text-gray-600 outline-none duration-300 hover:bg-gray-100"
                                                >
                                                    <Trashcan className="h-4 w-4 fill-tertiary-600 hover:fill-primary-600" />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
