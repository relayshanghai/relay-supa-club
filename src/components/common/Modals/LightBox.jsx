import { useEffect, useState } from 'react';
import Icon from '@/res/images/Icon';
const classNames = require('classnames');

export default function LightBox({ closeModal, image }) {
  const [loaded, setLoaded] = useState(false)

  
  const openFile = () => {
    window.open(image, '_blank');
  };
  
  
  
  const handleCloseModal = (e) => {
    e.stopPropagation();
    setLoaded(false)
    setTimeout(() => closeModal(), 500)
  };

  useEffect(() => {
    setLoaded(true)
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
      setLoaded(false)
    };
  }, []);
  
  const overlayBg = classNames(
    'bg-tertiary-600 transition-opacity duration-200 ease-in w-screen h-screen z-50 fixed top-0 left-0 bottom-0',
    { 'opacity-20': loaded, 'opacity-0': !loaded }
  );

  const modal = classNames(
    'flex items-center justify-center z-50',
    { 'opacity-100': loaded, 'opacity-0': !loaded }
  );
  return (
    <div className="fixed top-0 right-0 left-0 bottom-0 flex items-center justify-center z-50">
      <div onClick={handleCloseModal} className={overlayBg} />
      <div className={modal}>
        <img onClick={openFile} className="max-h-[80vh] max-w-[80vw] object-fit cursor-pointer" src={image} alt="something" />
        <div onClick={handleCloseModal} className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg cursor-pointer ">
          <Icon name="cross-dark" className="fill-current text-tertiary-600 w-3.5 h-3.5 hover:text-primary-600 duration-300" />
        </div>
      </div>
    </div>
  )
}
