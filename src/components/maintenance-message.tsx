import { useTranslation } from 'react-i18next';

export const MaintenanceMessage = () => {
    const { t } = useTranslation();
    return (
        <div className="flex h-full flex-col items-center justify-center">
            <h1 className="mb-2 text-2xl">{t('website.databaseUnavailable')} </h1>
            {t('website.databaseUnavailable2')}
        </div>
    );
};
