/* eslint-disable no-return-assign */
import { useEffect, useState } from 'react';
import Icon from '@/res/images/Icon';
const classNames = require('classnames');

export default function XSlideInModal({ closeModal, children }) {
  const [loaded, setLoaded] = useState(false)

  const overlayBg = classNames(
    'bg-tertiary-600 transition-opacity duration-200 ease-in w-screen h-screen z-50 fixed top-0 left-0 bottom-0',
    { 'opacity-20': loaded, 'opacity-0': !loaded }
  );

  const modal = classNames(
    'fixed right-0 top-0 bg-gray-50 h-screen transition-all ease-in-out duration-500 overflow-y-scroll w-screen sm:w-[60vw] md:w-[60vw] lg:w-[35vw] z-50',
    { 'transform-none': loaded, 'translate-x-full': !loaded }
  );

  useEffect(() => {
    setLoaded(true)
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
      // setLoaded(false)
    };
  }, []);

  const handleCloseModal = (e) => {
    e.stopPropagation();
    setLoaded(false)
    setTimeout(() => closeModal(), 500)
  };

  return (
    <div>
      <div onClick={handleCloseModal} className={overlayBg} />
      <div className={modal}>
        { children }
        <div onClick={handleCloseModal} className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg cursor-pointer">
          <Icon name="cross-dark" className="fill-current text-tertiary-600 w-3.5 h-3.5 hover:text-primary-600 duration-300" />
        </div>
      </div>
    </div>
  );
}
