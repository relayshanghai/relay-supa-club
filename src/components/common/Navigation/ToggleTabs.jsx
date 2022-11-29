import { useTranslation } from 'react-i18next';
const classNames = require('classnames');

export default function ToggleTabs({ currentTab, setCurrentTab, tabs }) {
  const { t } = useTranslation();

  const selectedTab = (value) => classNames(
    'font-semibold text-sm mr-4 hover:text-primary-500 hover:bg-primary-500 hover:bg-opacity-20 px-4 py-2 rounded-lg cursor-pointer duration-300 flex-shrink-0',
    { 'text-primary-500 bg-primary-500 bg-opacity-20': currentTab === value, 'text-gray-400 bg-gray-100': currentTab !== value }
  );

  return (
    <div>
      {/* <div className="text-gray-600 text-sm mb-2">Add creators from:</div> */}
      <div className="flex items-center mb-6">
        { tabs.map((tab, index) => (
          <div key={index} onClick={() => setCurrentTab(tab.value)} className={selectedTab(tab.value)}>
              {t(tab.label)}
          </div>
        ))}
      </div>
    </div>
  )
}
