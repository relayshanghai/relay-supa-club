import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { CampaignWithCompanyCreators } from 'types';
import Link from 'next/link';

export default function CreatorsOutreach({
    currentCampaign
}: {
    currentCampaign: CampaignWithCompanyCreators;
}) {
    const { t } = useTranslation();
    const router = useRouter();
    const { pathname, query } = router;
    const [status, setStatus] = useState('to contact');

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
        setStatus(value);
    };

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
                                status === tab.value
                                    ? 'text-primary-500 bg-primary-500 bg-opacity-20'
                                    : 'text-gray-400 bg-gray-100 '
                            }`}
                        >
                            {t(`campaigns.show.activities.outreach.${tab.label}`)}
                        </div>
                    ))}
                </div>
            </div>
            {/* Outreach Table  */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 overflow-y-visible">
                    <thead className="bg-white sticky top-0">
                        <tr className="border-b border-gray-200">
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
                        </tr>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentCampaign?.campaign_creators.map((creator, index) => (
                                <tr
                                    key={index}
                                    className="group hover:bg-primary-50 hover:relative"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap sticky left-0 group-hover:bg-primary-50 w-[200px] z-10">
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
                                </tr>
                            ))}
                        </tbody>
                    </thead>
                </table>
            </div>
        </div>
    );
}
