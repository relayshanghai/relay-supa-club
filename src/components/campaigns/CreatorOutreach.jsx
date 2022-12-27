import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function CreatorsOutreach() {
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

    const handleTabChange = (value) => {
        console.log(router);
        router.push({ pathname, query: { ...query, curTab: value } });
        setStatus(value);
    };

    return (
        <div>
            {/* Outreach Tabs */}
            <div className="flex mb-4">
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
                            {t(`campaigns.show.activities.outreach.${tab.label}`)} {tabs[tab.value]}
                        </div>
                    ))}
                </div>
            </div>
            {/* Outreach Table  */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 overflow-y-visible">
                    <thead className="bg-white sticky top-0">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-normal text-gray-500 sticky left-0 tracking-wider min-w-[200px] max-w-[200px] bg-white"
                            >
                                {t('campaigns.show.account')}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-normal text-gray-500 tracking-wider min-w-[180px]"
                            >
                                {t('campaigns.show.creatorStatus')}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-normal text-gray-500 tracking-wider min-w-[180px]"
                            >
                                {t('campaigns.show.addedBy')}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-normal text-gray-500 tracking-wider min-w-[180px]"
                            >
                                {t('campaigns.show.nextPoint')}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-normal text-gray-500 tracking-wider min-w-[180px]"
                            >
                                {t('campaigns.show.paymentAmount')}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-normal text-gray-500 tracking-wider min-w-[180px]"
                            >
                                {t('campaigns.show.paidAmount')}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-normal text-gray-500 tracking-wider min-w-[180px]"
                            >
                                {t('campaigns.show.paymentStatus')}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-normal text-gray-500 tracking-wider min-w-[180px]"
                            >
                                {t('campaigns.show.sampleStatus')}
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3 text-left text-xs font-normal text-gray-500 bg-white tracking-wider sm:sticky right-0"
                            ></th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    );
}
