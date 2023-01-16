import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { ChangeEvent, MouseEvent, useRef, useState } from 'react';
import Link from 'next/link';
import Trashcan from 'src/components/icons/Trashcan';
import { useCampaigns } from 'src/hooks/use-campaigns';
import { toast } from 'react-hot-toast';
import TableInput from './campaign-table-input';
import { CampaignWithCompanyCreators } from 'src/utils/api/db';
import { CampaignCreatorDB } from 'src/utils/api/db/types';

export default function CreatorsOutreach({
    currentCampaign
}: {
    currentCampaign: CampaignWithCompanyCreators;
}) {
    const { t } = useTranslation();
    const router = useRouter();
    const { pathname, query } = router;
    const [tabStatus, setTabStatus] = useState<string | string[]>(query.curTab || 'to contact');
    // const [currentCreator, setCurrentCreator] = useState<CampaignCreatorDB | null>(null);
    const [toEdit, setToEdit] = useState<{ index: number; key: string } | null>(null);
    const inputRef = useRef(null);

    const { deleteCreatorInCampaign, updateCreatorInCampaign, refreshCampaign } = useCampaigns({
        campaignId: currentCampaign?.id
    });
    const tabs = [
        { label: 'toContact', value: 'to contact' },
        { label: 'contacted', value: 'contacted' },
        { label: 'inProgress', value: 'in progress' },
        { label: 'confirmed', value: 'confirmed' },
        { label: 'rejected', value: 'rejected' },
        { label: 'ignored', value: 'ignored' }
    ];

    const paymentStatus = [
        { id: 1, label: 'unpaid', value: 'unpaid' },
        { id: 2, label: 'partiallypaid', value: 'partial_paid' },
        { id: 3, label: 'fullypaid', value: 'full_paid' }
    ];

    const sampleStatus = [
        { id: 1, label: 'unsent', value: 'unsent' },
        { id: 2, label: 'sent', value: 'sent' },
        { id: 3, label: 'delivered', value: 'delivered' }
    ];

    const columnLabels = [
        'account',
        'contact',
        'creatorStatus',
        // 'addedBy',
        'nextPoint',
        'paymentAmount',
        'paidAmount',
        'paymentStatus',
        'sampleStatus'
    ];

    const handleTabChange = (value: string) => {
        router.push({ pathname, query: { ...query, curTab: value } });
        setTabStatus(value);
    };

    const handleDropdownSelect = async (
        e: ChangeEvent<HTMLSelectElement>,
        creator: CampaignCreatorDB,
        objKey: string
    ) => {
        e.stopPropagation();
        creator = { ...creator, [objKey]: e.target.value };
        await updateCreatorInCampaign(creator);
        refreshCampaign();
        toast.success(t('campaigns.creatorModal.kolUpdated'));
    };

    const setInlineEdit = (
        e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
        index: number,
        key: string
    ) => {
        e.stopPropagation();
        setToEdit({ index, key });
    };

    const openNotes = (
        e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
        creator: CampaignCreatorDB
    ) => {
        //eslint-disable-next-line
        console.log(e, creator);
    };

    const deleteCampaignCreator = async (
        e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
        creator: CampaignCreatorDB
    ) => {
        e.stopPropagation();
        const c = confirm('Are you sure you want to delete?'); //TODO: need to add i18n here
        if (!c) return;
        await deleteCreatorInCampaign(creator);
        refreshCampaign();
        toast.success(t('campaigns.modal.deletedSuccessfully'));
    };

    const updateCampaignCreator = async (creator: CampaignCreatorDB) => {
        await updateCreatorInCampaign(creator);
        setToEdit(null);
        refreshCampaign();
        toast.success(t('campaigns.creatorModal.kolUpdated'));
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
            <div className="flex mb-4">
                <div className="bg-gray-100 rounded-md px-4 py-2 text-xs text-gray-600 mr-4 cursor-pointer hover:bg-primary-500 hover:text-white duration-300 flex-shrink-0">
                    <Link href="/dashboard">
                        <a>{t('campaigns.show.activities.outreach.addNewCreator')}</a>
                    </Link>
                </div>
                {/* TODO: make Tabs component reusable */}
                <div className="hidden sm:flex items-center">
                    {tabs.map((tab, index) => (
                        <div
                            key={index}
                            onClick={() => handleTabChange(tab.value)}
                            className={`font-semibold text-xs mr-4 hover:text-primary-500 hover:bg-primary-500 hover:bg-opacity-20 px-4 py-2 rounded-lg cursor-pointer duration-300 flex-shrink-0 focus:bg-primary-500 focus:text-primary-500 focus:bg-opacity-20 ${
                                tabStatus === tab.value
                                    ? 'text-primary-500 bg-primary-500 bg-opacity-20'
                                    : 'text-gray-400 bg-gray-100 '
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
            {/* Outreach Table  */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 overflow-y-visible">
                    <thead className="bg-white sticky top-0">
                        <tr>
                            {columnLabels.map((label, index) => (
                                <th
                                    key={index}
                                    scope="col"
                                    className={`px-6 py-3 text-left text-xs font-normal text-gray-500 sticky left-0 tracking-wider min-w-fit bg-white ${
                                        index === 0 ? 'sticky left-0 z-10' : ''
                                    }`}
                                >
                                    {t(`campaigns.show.${label}`)}
                                </th>
                            ))}
                            {/*-- placeholder table header space for delete icon --*/}
                            <th className=" px-3 py-3 text-left text-xs font-normal text-gray-500 sticky right-0 bg-white tracking-wider  min-w-[150px] max-w-[150px] z-30">
                                {''}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentCampaign?.campaign_creators.map((creator, index) => {
                            if (creator.status === tabStatus)
                                return (
                                    <tr
                                        key={index}
                                        className="group hover:bg-primary-50 hover:relative text-xs"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap sticky left-0 group-hover:bg-primary-50 w-[200px] bg-white z-30">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
                                                    <img
                                                        className="h-10 w-10 rounded-full"
                                                        src={`https://image-cache.brainchild-tech.cn/?link=${creator.avatar_url}`}
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-xs font-medium text-gray-900 truncate">
                                                        {creator.fullname}
                                                    </div>
                                                    <div className="text-xs text-primary-500 inline-block truncate">
                                                        @{creator.username}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>contacts</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                onChange={(e) =>
                                                    handleDropdownSelect(e, creator, 'status')
                                                }
                                                value={creator.status}
                                                className="-ml-1 text-xs px-4 py-2 rounded-md text-primary-500 font-semibold bg-primary-50 hover:bg-primary-100 border border-gray-200 duration-300 cursor-pointer outline-none mr-2.5 appearance-none text-center"
                                            >
                                                {tabs.map((tab, index) => (
                                                    <option value={tab.value} key={index}>
                                                        {t(
                                                            `campaigns.show.activities.outreach.${tab.label}`
                                                        )}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        {/* TODO: add added by column, need to update database relation  */}
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
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div
                                                className="text-xs text-gray-900 cursor-pointer hover:text-primary-500 duration-300 relative"
                                                onClick={(e) =>
                                                    setInlineEdit(e, index, 'next_step')
                                                }
                                            >
                                                <div
                                                    className={`${
                                                        editingModeTrue(index, 'next_step')
                                                            ? 'hidden'
                                                            : ' '
                                                    }`}
                                                >
                                                    {creator.next_step || (
                                                        <div className="text-primary-500 hover:text-primary-700 cursor-pointer duration-300">
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
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div
                                                className="text-xs text-left pr-2 text-gray-900 cursor-pointer hover:text-primary-500 duration-300 relative"
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
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div
                                                className="text-xs text-left pr-2 text-gray-900 cursor-pointer hover:text-primary-500 duration-300 relative"
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
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) =>
                                                    handleDropdownSelect(
                                                        e,
                                                        creator,
                                                        'payment_status'
                                                    )
                                                }
                                                value={creator.payment_status}
                                                className="-ml-1 text-xs px-4 py-2 rounded-md text-green-500 font-semibold bg-green-50 hover:bg-green-100 border border-gray-200 duration-300 cursor-pointer outline-none mr-2.5 appearance-none text-center"
                                            >
                                                {paymentStatus.map((tab, index) => (
                                                    <option value={tab.value} key={index}>
                                                        {t(`campaigns.creatorModal.${tab.label}`)}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) =>
                                                    handleDropdownSelect(
                                                        e,
                                                        creator,
                                                        'sample_status'
                                                    )
                                                }
                                                value={creator.sample_status}
                                                className="-ml-1 text-xs px-4 py-2 rounded-md text-orange-500 font-semibold bg-orange-50 hover:bg-orange-100 border border-gray-200 duration-300 cursor-pointer outline-none mr-2.5 appearance-none text-center"
                                            >
                                                {sampleStatus.map((tab, index) => (
                                                    <option value={tab.value} key={index}>
                                                        {t(`campaigns.creatorModal.${tab.label}`)}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                        <td className="px-6 py-4 sm:sticky right-0 bg-white whitespace-nowrap z-50 group-hover:bg-primary-50 flex justify-end">
                                            <div
                                                onClick={(e) => openNotes(e, creator)}
                                                className="p-2 rounded-md text-gray-600  bg-gray-50 hover:bg-gray-100 border border-gray-200 duration-300 outline-none appearance-none text-center font-medium mr-2 cursor-pointer"
                                            >
                                                Notes
                                            </div>
                                            <div
                                                onClick={(e) => deleteCampaignCreator(e, creator)}
                                                className="p-2 rounded-md text-gray-600  bg-gray-50 hover:bg-gray-100 border border-gray-200 duration-300 outline-none appearance-none text-center cursor-pointer"
                                            >
                                                <Trashcan className="w-4 h-4 fill-tertiary-600 hover:fill-primary-600" />
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
