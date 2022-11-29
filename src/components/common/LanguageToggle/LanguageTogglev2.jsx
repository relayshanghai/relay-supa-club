import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { buildHttp } from '@/libs/networking/http';
import Globe from "@/components/icons/Globe";
import { useState, useRef, useEffect } from 'react'

export default function LanguageToggle({ className }) {
  const { i18n } = useTranslation();
  const [value, setValue] = useState(i18n.language);
  const [displayOptions, setDisplayOptions] = useState(false);

  const toggleLanguage = (value) => {
    i18next
      .changeLanguage(value)
      .then((t) => {
        t('key'); // -> same as i18next.t
      });
    buildHttp();
    setDisplayOptions(false);
  };

  const toggleDisplay = (e) => {
    if(e) e.stopPropagation();
    setDisplayOptions((cv) => !cv);
  };

  const options = useRef(null);

  const handleClickOutside = (e) => {
    if (options.current && !options.current.contains(e.target)) {
      setDisplayOptions(false);
    }
  };

  useEffect(() => {
    if(value) toggleLanguage(value);
  }, [value])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [options]);

  return (

    <div className={className}>
      <div className='relative flex flex-col items-center'>
        {/* <div className='text-xs text-gray-300'>{value}</div> */}
        <Globe onClick={toggleDisplay} className="w-5 h-5 text-gray-300 hover:text-primary-500 duration-300"/>
        { displayOptions &&
          <div ref={options} className="absolute top-6 z-50 flex-shrink-0 whitespace-nowrap space-y-1">
            <div onClick={(e) => setValue(e.target.id)} id="zh" className="btn-with-icon-gray py-1 text-tertiary-500 border-primary-300/50 border opacity-90 text-xs">中文</div>
            <div onClick={(e) => setValue(e.target.id)} id="en-US" className="btn-with-icon-gray py-1 text-tertiary-500 border-primary-300/50 border opacity-90 mb-0.5 text-xs" >English</div>

          </div>
        }

      </div>
    </div>
  );
}
