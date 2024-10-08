import { ArchiveBoxIcon } from '@heroicons/react/20/solid';
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

export type TabLabel = {
    label: string;
    value: '' | 'in progress' | 'not started' | 'completed' | 'archived';
};
export interface Props {
    currentTab: string;
    changeTab: (tab: TabLabel['value']) => void;
}

export default function Tabs({ currentTab, changeTab }: Props) {
    const { t } = useTranslation();
    const tabs: TabLabel[] = [
        { label: t('campaigns.index.status.all'), value: '' },
        { label: t('campaigns.index.status.inProgress'), value: 'in progress' },
        { label: t('campaigns.index.status.notStarted'), value: 'not started' },
        { label: t('campaigns.index.status.completed'), value: 'completed' },
        { label: t('campaigns.index.status.archived'), value: 'archived' },
    ];

    const selectStyle: CSSProperties = {
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        appearance: 'none',
    };

    const selectedTabStyles = (tab: TabLabel) => {
        return currentTab === tab.value ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-400';
    };

    return (
        <div>
            <div className="hidden overflow-x-auto sm:flex">
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        onClick={() => changeTab(tab.value)}
                        className={`mr-4 flex flex-shrink-0 cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold duration-300 hover:bg-primary-500 hover:bg-opacity-20 hover:text-primary-500 ${selectedTabStyles(
                            tab,
                        )}`}
                    >
                        {tab.value === 'archived' && <ArchiveBoxIcon name="archive" className="h-4 w-4 fill-current" />}

                        {tab.label}
                    </div>
                ))}
            </div>
            {/* -- Mobile view -- */}
            <select
                style={selectStyle}
                onChange={(e) => changeTab(e.target.value as TabLabel['value'])}
                className="rounded-lg bg-primary-500 bg-opacity-20 px-4 py-2 text-center text-sm text-primary-500 outline-none sm:hidden"
            >
                {tabs.map((tab, index) => (
                    <option
                        key={index}
                        value={tab.value}
                        className={`text-md mr-10 flex-shrink-0 cursor-pointer font-semibold text-gray-400 duration-300 hover:text-primary-500 ${
                            currentTab === tab.value && 'text-primary-500'
                        }`}
                    >
                        {tab.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
