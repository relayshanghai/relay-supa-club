import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { buildHttp } from '@/libs/networking/http';

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const toggleLanguage = (e) => {
    i18next
      .changeLanguage(e.target.value)
      .then((t) => {
        t('key'); // -> same as i18next.t
      });
    buildHttp();
  };

  return (
    <div className="text-sm font-normal text-gray-600">
      <select
        defaultValue={i18n.language}
        onChange={toggleLanguage}
        className="outline-none bg-transparent"
        name="langToggle"
        id="langToggle"
      >
        <option value="zh">中文</option>
        <option value="en-US">English</option>
      </select>
    </div>
  );
}
