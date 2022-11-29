import { useTranslation } from "react-i18next";
import Icon from '@/res/images/Icon';
import { useState } from 'react';

export default function ReloadButton({ handleReload }) {
  const { t } = useTranslation();
  const [active, setActive] = useState(false);

  return(
    <div className="flex btn btn-primary w-fit group opacity-30 hover:bg-primary-500 hover:opacity-100 mb-4" onClick={() => { handleReload(); setActive(true)}} >
      <Icon name='refresh' className={`${active && 'animate-spin'} w-4 h-4 mr-2`} />
      <div> {t('website.reload')}</div>
    </div>
  )
}
