import React from 'react';
import { useEffect, useState } from 'react';
import Icon from '@/res/images/Icon';
const classNames = require('classnames');

export default function ConfirmDialog({ closeModal, children }) {
  const [showOverlay, setShowOverlay] = useState(false);

  const overlayBg = classNames(
    'bg-tertiary-600 transition-opacity duration-200 ease-in w-screen h-screen z-50 fixed top-0 left-0 bottom-0',
    { 'opacity-20': showOverlay, 'opacity-0': !showOverlay }
  );

  const modal = classNames(
    'flex flex-col bg-secondary-100 transition-opacity duration-500 ease-in rounded-lg fixed w-full max-w-xs sm:max-w-md top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 p-6',
    // { 'opacity-100': showOverlay, 'opacity-0': !showOverlay }
  );
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => document.body.style.overflow = 'unset';
  }, []);

  useEffect(() => {
    setShowOverlay(!showOverlay)
  },[])
  return (
    <div className="">
      <div onClick={closeModal} className={overlayBg} />
      <div className={modal}>
        <div className="font-semibold text-tertiary-600 text-2xl mb-4">Delete this creator</div>
        { children }
        <div className="text-sm text-tertiary-600 mb-4">Are you sure you want to delete this creator?</div>
        <div className="flex justify-center">
          <div className="bg-tertiary-100 text-sm text-tertiary-600 hover:bg-tertiary-200 duration-300 cursor-pointer px-4 py-2 rounded-lg mr-2">Cancel</div>
          <div className="bg-primary-500 text-sm text-white hover:bg-primary-700 duration-300 cursor-pointer px-4 py-2 rounded-lg">Confirm</div>
        </div>
        <div onClick={closeModal} className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-lg cursor-pointer">
          <Icon name="cross-dark" className="fill-current text-tertiary-600 w-3.5 h-3.5 hover:text-primary-600 duration-300" />
        </div>
      </div>
    </div>
  )
}
