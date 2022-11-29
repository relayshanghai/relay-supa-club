import React from 'react';
import { useEffect, useState } from 'react';
import Icon from '@/res/images/Icon';
const classNames = require('classnames');

export default function DialogModal({ title, closeModal, children }) {
  const [showOverlay, setShowOverlay] = useState(false);

  const overlayBg = classNames(
    'bg-tertiary-600 transition-opacity duration-200 ease-in w-screen h-screen z-50 fixed top-0 left-0 bottom-0',
    { 'opacity-20': showOverlay, 'opacity-0': !showOverlay }
  );

  const modal = classNames(
    'flex flex-col bg-gray-50 transition-opacity duration-500 ease-in rounded-lg fixed w-11/12 h-[80vh] sm:w-3/4 z-50 p-6',
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
    <div className="flex items-center justify-center fixed inset-0 w-screen h-screen z-50">
      <div onClick={closeModal} className={overlayBg} />
      <div className={modal}>
        <div className="font-semibold text-tertiary-600 text-2xl mb-4">{title}</div>
        { children }
        <div onClick={closeModal} className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-lg cursor-pointer">
          <Icon name="cross-dark" className="fill-current text-tertiary-600 w-3.5 h-3.5 hover:text-primary-600 duration-300" />
        </div>
      </div>
    </div>
  )
}
