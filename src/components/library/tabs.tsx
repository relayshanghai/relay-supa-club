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
            <div className="mb-6 flex ">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentTab(tab.value)}
                        className={`flex space-x-2 border-b-2 px-4 py-2 text-sm font-medium  ${
                            currentTab === tab.value
                                ? 'border-b-primary-600 text-primary-600'
                                : 'border-b-gray-200 text-gray-500 hover:border-b-primary-400 hover:text-primary-400'
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
