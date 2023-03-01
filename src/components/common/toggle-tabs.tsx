import { useTranslation } from 'react-i18next';

export default function ToggleTabs({
    currentTab,
    setCurrentTab,
    tabs,
}: {
    currentTab: string;
    setCurrentTab: (value: string) => void;
    tabs: { label: string; value: string }[];
}) {
    const { t } = useTranslation();

    return (
        <div>
            {/* <div className="text-gray-600 text-sm mb-2">Add creators from:</div> */}
            <div className="mb-6 flex items-center">
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        onClick={() => setCurrentTab(tab.value)}
                        className={`mr-4 flex-shrink-0 cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold duration-300 hover:bg-primary-500 hover:bg-opacity-20 hover:text-primary-500 ${
                            currentTab === tab.value
                                ? 'bg-primary-500 bg-opacity-20 text-primary-500'
                                : 'bg-gray-100 text-gray-400'
                        }`}
                    >
                        {t(tab.label)}
                    </div>
                ))}
            </div>
        </div>
    );
}
