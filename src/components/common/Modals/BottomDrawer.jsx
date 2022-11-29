/* eslint-disable no-return-assign */
import { useEffect, useState } from 'react';
const classNames = require('classnames');

export default function BottomDrawer({ closeModal, children }) {
  const [loaded, setLoaded] = useState(false)

  const overlayBg = classNames(
    'bg-tertiary-600 transition-opacity duration-200 ease-in w-screen h-screen z-50 fixed top-0 left-0 bottom-0',
    { 'opacity-20': loaded, 'opacity-0': !loaded }
  );

  const modal = classNames(
    'fixed bottom-0 left-0 right-0 bg-white overflow-y-auto w-screen z-50 p-5',
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
      <div>
        <div className={modal}>
          { children }
        </div>
      </div>
    </div>
  );
}