import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

export interface Props {
    currentTab: string;
    changeTab: (tab: string) => void;
}

type TabLabel = {
    label: string;
    value: string;
};

export default function Tabs({ currentTab, changeTab }: Props) {
    const { t } = useTranslation();
    const tabs = [
        { label: t('campaigns.index.status.all'), value: '' },
        { label: t('campaigns.index.status.inProgress'), value: 'in progress' },
        { label: t('campaigns.index.status.notStarted'), value: 'not started' },
        { label: t('campaigns.index.status.completed'), value: 'completed' },
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
                        className={`mr-4 flex-shrink-0 cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold duration-300 hover:bg-primary-500 hover:bg-opacity-20 hover:text-primary-500 ${selectedTabStyles(
                            tab,
                        )}`}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>
            {/* -- Mobile view -- */}
            <select
                style={selectStyle}
                onChange={(e) => changeTab(e.target.value)}
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
