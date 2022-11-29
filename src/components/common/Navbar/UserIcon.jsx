import AccountLinks from "./account-links";
import clsx from "clsx";
import {Menu, Transition} from "@headlessui/react";
import {Fragment} from "react";
// import {useAppSelector, useAppDispatch} from "store";
import { useSelector } from "react-redux";
import { useEffect } from 'react';
import { setUser } from '@/libs/chatwoot/Events';

const UserIcon = () => {
  const { user } = useSelector((state) => state.user);

  const getInitials = () => {
    const { first_name, last_name } = user;
    if (first_name && last_name) {
      return `${first_name[0]}${last_name[0]}`;
    }
    return 'RC';
  };

  const handleUser = () => {
    if (window?.$chatwoot) {
      setUser({
        id: user.id,
        email: user?.email,
        avatar_url: user?.avatar,
        name: user?.first_name
      })
    }
  };

  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      window?.analytics?.identify(user.id, {
        company: user?.company ? user?.company?.name : 'No company',
        name:  user.nickname || user.first_name || 'No name'
      });
      handleUser();
    }
  },[user])

  return (
    <Menu as="div" className="relative inline-block text-left mt-1 mr-4">
      <div>
        <Menu.Button className="focus:outline-none">
          <div className="relative w-8 h-8 rounded-full bg-gray-200 text-white text-sm column-center hover:bg-primary-500 duration-300">
            {user ? getInitials() : 'RC'}
            {/* <span className="absolute inline-flex items-center justify-center w-4 h-4 p-0 font-bold leading-none text-center text-white bg-red-500 rounded-full top-[-6px] right-[-6px] text-xs ring-2 ring-white">
              2
            </span> */}
          </div>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <Menu.Items
          className={clsx(
            "absolute w-[192px] bg-white shadow-lg divide-y divide-gray-100 rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none",
            "right-0 origin-top-right z-50 mt-2"
          )}>
          <AccountLinks />
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
export default UserIcon;
