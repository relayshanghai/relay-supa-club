import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { debounce } from 'src/utils/debounce';
import { Slash } from '../icons';

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
            name: 'New',
        },
        {
            value: 'inbox',
            name: 'Inbox',
        },
    ];

    return (
        <div className=" space-y-4 border-b-2 border-r-2 border-tertiary-200 p-3">
            <div className="flex justify-center text-sm font-semibold text-gray-600">
                {tabs.map((tab, index) => (
                    <div
                        key={tab.value}
                        onClick={() => handleTabChange(tab)}
                        className={` flex cursor-pointer items-center justify-center hover:text-primary-500 ${
                            selectedTab === tab.value &&
                            'text-primary-500 underline decoration-current decoration-2 underline-offset-2'
                        }`}
                    >
                        <div>{tab.name}</div>
                        {index !== tabs.length - 1 && <Slash className="mx-2 h-4 w-4 font-bold" />}
                    </div>
                ))}
            </div>
            <div className="px-3">
                <input
                    className="block w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-600 placeholder-gray-400 ring-1 ring-gray-900 ring-opacity-5 placeholder:text-xs focus:outline-none"
                    placeholder="Search"
                    id="influencer-search"
                    onChange={(e) => {
                        handleInputChange(e);
                    }}
                />
            </div>
        </div>
    );
};
