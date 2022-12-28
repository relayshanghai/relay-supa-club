import { useTranslation } from 'react-i18next';

export default function ToggleTabs({
    currentTab,
    setCurrentTab,
    tabs
}: {
    currentTab: string;
    setCurrentTab: (value: string) => void;
    tabs: { label: string; value: string }[];
}) {
    const { t } = useTranslation();

    return (
        <div>
            {/* <div className="text-gray-600 text-sm mb-2">Add creators from:</div> */}
            <div className="flex items-center mb-6">
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        onClick={() => setCurrentTab(tab.value)}
                        className={`font-semibold text-sm mr-4 hover:text-primary-500 hover:bg-primary-500 hover:bg-opacity-20 px-4 py-2 rounded-lg cursor-pointer duration-300 flex-shrink-0 ${
                            currentTab === tab.value
                                ? 'text-primary-500 bg-primary-500 bg-opacity-20'
                                : 'text-gray-400 bg-gray-100'
                        }`}
                    >
                        {t(tab.label)}
                    </div>
                ))}
            </div>
        </div>
    );
}
