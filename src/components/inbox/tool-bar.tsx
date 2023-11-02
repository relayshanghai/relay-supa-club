import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { debounce } from 'src/utils/debounce';
import { useTranslation } from 'react-i18next';

export const ToolBar = ({
    selectedTab,
    setSelectedTab,
    setSearchTerm,
}: {
    selectedTab: string;
    setSelectedTab: (tab: { value: string; name: string }) => void;
    searchTerm: string;
    setSearchTerm: Dispatch<SetStateAction<string>>;
}) => {
    const { t } = useTranslation();

    const handleTabChange = (tab: { value: string; name: string }) => {
        if (tab.value === selectedTab) return;

        setSelectedTab(tab);
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
        <div className="flex flex-col items-start space-y-3 border-b-2 border-r-2 border-tertiary-200 py-6 text-sm">
            <div className="flex w-full justify-start font-semibold text-gray-600">
                {tabs.map((tab) => (
                    <div
                        key={tab.value}
                        onClick={() => {
                            handleTabChange(tab);
                        }}
                        className={`flex flex-1 cursor-pointer items-center justify-center border-b-4 pb-3 text-gray-400 hover:text-primary-500 ${
                            selectedTab === tab.value && 'border-b-4 border-primary-500 text-primary-500 '
                        }`}
                    >
                        <div>{tab.name}</div>
                    </div>
                ))}
            </div>
            <div className="w-full space-y-2 px-4 pt-3 text-gray-400">
                <div>{t('inbox.searchMessages')}</div>
                <input
                    className="0 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 placeholder-gray-500 ring-1 ring-gray-900 ring-opacity-5 focus:outline-none"
                    placeholder={t('inbox.searchPlaceholder') as string}
                    id="influencer-search"
                    onChange={(e) => {
                        handleInputChange(e);
                    }}
                />
            </div>
        </div>
    );
};
