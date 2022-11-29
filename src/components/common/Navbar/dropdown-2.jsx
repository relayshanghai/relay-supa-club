import {Menu} from "@headlessui/react";
import LanguageToggle from "../LanguageToggle/LanguageTogglev2";

const Dropdown = () => {
  return (
    <Menu as="div" className="relative text-left flex items-center justify-center w-8 h-16 mx-4">
      <div className="cursor-pointer">
        <LanguageToggle />
      </div>
    </Menu>
  );
};
export default Dropdown;
