import { useTranslation } from 'react-i18next';
export interface TabsProps<T> {
    currentTab: T;
    setCurrentTab: (value: T) => void;
    tabs: { label: string; value: T; afterElement?: React.ReactNode }[];
}

export function Tabs<T = string>({ currentTab, setCurrentTab, tabs }: TabsProps<T>) {
    const { t } = useTranslation();

    return (
        <div>
            <div className="absolute -bottom-0.5 flex flex-row" id="tabs-buttons">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentTab(tab.value)}
                        className={`flex space-x-2 border-b-2 px-4 pb-3 pt-2 text-sm font-medium  ${
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
}
