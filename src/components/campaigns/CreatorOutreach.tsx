import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { ChangeEvent, MouseEvent, useState } from 'react';
import { CampaignCreatorDB, CampaignWithCompanyCreators } from 'types';
import Link from 'next/link';
import Trashcan from 'src/components/icons/Trashcan';
import { useCampaigns } from 'src/hooks/use-campaigns';
import { toast } from 'react-hot-toast';
import TableInput from './campaign-table-input';

export default function CreatorsOutreach({
    currentCampaign
}: {
    currentCampaign: CampaignWithCompanyCreators;
}) {
    const { t } = useTranslation();
    const router = useRouter();
    const { pathname, query } = router;
    const [tabStatus, setTabStatus] = useState<string | string[]>(query.curTab || 'to contact');
    const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState('');
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

    const columnLabels = [
        'account',
        'creatorStatus',
        'addedBy',
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
        creator: CampaignCreatorDB
    ) => {
        e.stopPropagation();
        const status = e.target.value;
        await updateCreatorInCampaign({ ...creator, status });
        refreshCampaign();
        toast.success(t('campaigns.creatorModal.kolUpdated'));
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

    // const updateCampaignCreator = async (
    //     inputValue: string | number,
    //     creator: CampaignCreatorDB
    // ) => {
    //     // const {next_step, payment_amount, paid_amount} = inputValue;
    //     await updateCreatorInCampaign(creator);
    //     refreshCampaign();
    //     toast.success(t('campaigns.modal.deletedSuccessfully'));
    // };

    // get the number of creators in each status
    const creatorsCount = (status: string) => {
        return currentCampaign?.campaign_creators.filter((c) => c.status === status).length;
    };

    // const handleTableInputClick = (
    //     e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
    //     // creator: CampaignCreatorDB
    // ) => {
    //     e.stopPropagation();
    //     setIsEditingMode(true);
    // };

    const closeModal = () => {
        setIsEditingMode(false);
    };

    // console.log({ inputValue });

    return (
        <div>
            {/* Outreach Tabs */}
            <div className="flex mb-4">
                <div className="bg-gray-100 rounded-md px-4 py-2 text-sm text-gray-600 mr-4 cursor-pointer hover:bg-primary-500 hover:text-white duration-300 flex-shrink-0">
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
                            className={`font-semibold text-sm mr-4 hover:text-primary-500 hover:bg-primary-500 hover:bg-opacity-20 px-4 py-2 rounded-lg cursor-pointer duration-300 flex-shrink-0 focus:bg-primary-500 focus:text-primary-500 focus:bg-opacity-20 ${
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
                                    className={`px-6 py-3 text-left text-xs font-normal text-gray-500 sticky left-0 tracking-wider min-w-[200px] max-w-[200px] bg-white ${
                                        index === 0 ? 'sticky left-0 z-10' : ''
                                    }`}
                                >
                                    {t(`campaigns.show.${label}`)}
                                </th>
                            ))}
                            {/*-- placeholder table header space for delete icon --*/}
                            <th className=" px-3 py-3 text-left text-xs font-normal text-gray-500 sticky bg-white tracking-wider  min-w-[200px] max-w-[200px]">
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
                                        className="group hover:bg-primary-50 hover:relative text-sm"
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
                                                    <div className="text-sm font-medium text-gray-900 truncate">
                                                        {creator.fullname}
                                                    </div>
                                                    <div className="text-xs text-primary-500 inline-block truncate">
                                                        @{creator.username}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                onChange={(e) => handleDropdownSelect(e, creator)}
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
                                        <td
                                            id="creator-added-by"
                                            className="px-6 py-4 whitespace-nowrap"
                                        >
                                            {/* TODO: add added by user name  */}
                                            {creator.added_by_id ? (
                                                <div className="flex">
                                                    <div className="group flex text-xs items-center">
                                                        <div className="rounded-full text-xs w-6 h-6 bg-tertiary-300 text-white text-center p-1 mr-2">
                                                            XX
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-gray-600"> - </div>
                                            )}
                                        </td>
                                        <td
                                            id="creator-added-on"
                                            className="px-6 py-4 whitespace-nowrap"
                                            // onClick={(e) => handleTableInputClick(e, creator)}
                                        >
                                            <div className="relative">
                                                {!isEditingMode ? (
                                                    creator['next-step'] || (
                                                        <div className="text-primary-500 hover:text-primary-700 cursor-pointer duration-300">
                                                            {' '}
                                                            {t(
                                                                'campaigns.show.addActionPoint'
                                                            )}{' '}
                                                        </div>
                                                    )
                                                ) : (
                                                    <TableInput
                                                        type="text"
                                                        closeModal={() => closeModal()}
                                                        value={creator['next-step']}
                                                        inputValue={inputValue}
                                                        setInputValue={setInputValue}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">-</td>
                                        <td className="px-6 py-4 whitespace-nowrap">-</td>
                                        <td className="px-6 py-4 whitespace-nowrap">-</td>
                                        <td className="px-6 py-4 whitespace-nowrap">-</td>

                                        <td className="px-6 py-4 sm:sticky right-0 bg-white whitespace-nowrap z-50 group-hover:bg-primary-50 flex justify-end">
                                            <div
                                                onClick={(e) => deleteCampaignCreator(e, creator)}
                                                className="p-2 rounded-md text-gray-600  bg-gray-50 hover:bg-gray-100 border border-gray-200 duration-300 outline-none appearance-none text-center"
                                            >
                                                <Trashcan className="w-4 h-4 cursor-pointer fill-tertiary-600 hover:fill-primary-600" />
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
