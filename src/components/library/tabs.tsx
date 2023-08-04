import { useTranslation } from 'react-i18next';
export interface TabsProps {
    currentTab: string;
    setCurrentTab: (value: string) => void;
    tabs: { label: string; value: string; afterElement?: React.ReactNode }[];
}

export const Tabs = ({ currentTab, setCurrentTab, tabs }: TabsProps) => {
    const { t } = useTranslation();

    return (
        <div>
            <div className="mb-6 flex items-center space-x-4">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentTab(tab.value)}
                        className={`flex space-x-2 border-b-2 px-4 py-2 text-sm font-medium hover:border-b-primary-700 ${
                            currentTab === tab.value ? 'border-b-primary-500' : 'bg-gray-100 text-gray-400'
                        }`}
                    >
                        <p>{t(tab.label)}</p>
                        <div>{tab.afterElement}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};
