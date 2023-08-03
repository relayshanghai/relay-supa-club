import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { debounce } from 'src/utils/debounce';
import { Slash } from '../icons';
import { useTranslation } from 'react-i18next';

export const ToolBar = ({
    selectedTab,
    setSelectedTab,
    setSearchTerm,
}: {
    selectedTab: string;
    setSelectedTab: Dispatch<SetStateAction<string>>;
    searchTerm: string;
    setSearchTerm: Dispatch<SetStateAction<string>>;
}) => {
    const { t } = useTranslation();

    const handleTabChange = (tab: { value: string; name: string }) => {
        if (tab.value === selectedTab) return;
        setSelectedTab(tab.value);
    };

    const handleInputChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, 1000);

    const tabs = [
        {
            value: 'new',
            name: t('inbox.unread'),
        },
        {
            value: 'inbox',
            name: t('inbox.inbox'),
        },
    ];

    return (
        <div className="flex flex-col items-start space-y-3 border-b-2 border-r-2 border-tertiary-200 px-4 py-6 text-sm">
            <div className="flex justify-start font-semibold text-gray-600">
                {tabs.map((tab, index) => (
                    <div
                        key={tab.value}
                        onClick={() => handleTabChange(tab)}
                        className={` flex cursor-pointer items-center justify-center hover:text-primary-500 ${
                            selectedTab === tab.value && 'text-gray-800'
                        }`}
                    >
                        <div>{tab.name}</div>
                        {index !== tabs.length - 1 && <Slash className="mx-2 h-4 w-4 font-bold" />}
                    </div>
                ))}
            </div>
            <input
                className="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-600 placeholder-gray-500 ring-1 ring-gray-900 ring-opacity-5 focus:outline-none"
                placeholder={t('inbox.searchPlaceholder') as string}
                id="influencer-search"
                onChange={(e) => {
                    handleInputChange(e);
                }}
            />
        </div>
    );
};
