import { useEffect, useRef } from "react";

export default function Dropdown({ children }) {
  const container = useRef(null);

  const handleClickOutside = (event) => {
    if (container.current && !container.current.contains(event.target)) {
      console.log('Outside of component')
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div ref={container} className="absolute top-full right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
      <div className="p-1">
        { children }
      </div>
    </div>
  )
}
