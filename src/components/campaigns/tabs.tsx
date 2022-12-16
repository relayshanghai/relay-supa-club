import { CSSProperties } from 'react';

export interface Props {
    currentTab: string;
    changeTab: (tab: string) => void;
}

type TabLabel = {
    label: string;
    value: string;
};

export default function Tabs({ currentTab, changeTab }: Props) {
    const tabs = [
        { label: 'All', value: '' },
        { label: 'In progress', value: 'in progress' },
        { label: 'Not Started', value: 'not started' },
        { label: 'Completed', value: 'completed' }
    ];

    const selectStyle: CSSProperties = {
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        appearance: 'none'
    };

    const selectedTabStyles = (tab: TabLabel) => {
        return currentTab === tab.value ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-400';
    };

    return (
        <div>
            <div className="hidden sm:flex overflow-x-auto">
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        onClick={() => changeTab(tab.value)}
                        className={`font-semibold text-sm mr-4 hover:text-primary-500 hover:bg-primary-500 hover:bg-opacity-20 px-4 py-2 rounded-lg cursor-pointer duration-300 flex-shrink-0 ${selectedTabStyles(
                            tab
                        )}`}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>
            <select
                style={selectStyle}
                onChange={(e) => changeTab(e.target.value)}
                className="text-sm outline-none sm:hidden px-4 py-2 rounded-lg text-center text-primary-500 bg-primary-500 bg-opacity-20"
            >
                {tabs.map((tab, index) => (
                    <option
                        key={index}
                        value={tab.value}
                        className={`font-semibold text-md mr-10 text-gray-400 hover:text-primary-500 cursor-pointer duration-300 flex-shrink-0 ${
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
