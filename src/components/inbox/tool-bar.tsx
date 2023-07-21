import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { debounce } from 'src/utils/debounce';

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
            name: 'NEW',
        },
        {
            value: 'inbox',
            name: 'INBOX',
        },
    ];

    return (
        <div className=" space-y-4 border-b-2 border-r-2 border-tertiary-200 p-3">
            <div className="flex justify-around text-sm font-semibold text-gray-600">
                {tabs.map((tab) => (
                    <div
                        key={tab.value}
                        onClick={() => handleTabChange(tab)}
                        className={`cursor-pointer hover:text-primary-500 ${
                            selectedTab === tab.value &&
                            'text-primary-500 underline decoration-current decoration-2 underline-offset-2'
                        }`}
                    >
                        {tab.name}
                    </div>
                ))}
            </div>
            <div className="px-3">
                <input
                    className="block w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-600 placeholder-gray-400 ring-1 ring-gray-900 ring-opacity-5 placeholder:text-xs focus:outline-none"
                    placeholder="Search for name, email or content"
                    id="influencer-search"
                    onChange={(e) => {
                        handleInputChange(e);
                    }}
                />
            </div>
        </div>
    );
};
