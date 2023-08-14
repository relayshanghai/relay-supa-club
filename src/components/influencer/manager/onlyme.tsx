import { useTranslation } from 'react-i18next';
import { Switch } from 'src/components/library';

export const OnlyMe = ({ state, onSwitch }: { state: boolean; onSwitch: (state: boolean) => void }) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-row items-center gap-2 text-gray-500">
            <p>{t('manager.onlyMine')}</p>
            <Switch checked={state} onChange={(e) => onSwitch(e.target.checked)} />
        </div>
    );
};
