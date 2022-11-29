import Icon from '@/res/images/Icon';
import { useTranslation } from 'react-i18next';

export default function ShowLoader() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center w-full my-6">
      <div className="text-sm text-tertiary-500 mr-6">{t('website.loading')}</div>
      <Icon name="loader" className="w-4 h-4 fill-current text-primary-500" />
    </div>
  );
}
