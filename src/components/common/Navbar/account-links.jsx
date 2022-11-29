import Link from "next/link";
import { FiUser, FiLogIn } from "react-icons/fi";
// import { useSelector } from "react-redux";
import { useRouter } from 'next/router';
import useAuth from '@/hooks/useAuth';
// import { dateFormatter } from "@/libs/utils/utils";
import { useTranslation } from "react-i18next";

const AccountLinks = () => {
  const router = useRouter();
  const { t } = useTranslation();
  // const { user } = useSelector((state) => state.user);
  const { destroyToken } = useAuth();

  const signOut = () => {
    destroyToken().then(() => {
      router.push('/login');
    })
    .catch(() => {
      router.push('/login');
    })
  };

  // const renderExpirationDate = (date) => {
  //   if(user.company.is_expired) return <div className="text-red-500 text-xs font-light grow text-left p-4">expired</div>;
  //   if(!user.company.expire_at) return <div className="text-gray-600 text-xs font-light grow text-left p-4">No Expiration</div>;
  //   return (
  //     <div className="mb-2 text-xs text-gray-600 grow lg:self-start xl:self-start text-left font-light p-4">
  //         Expires at&nbsp;
  //         <span className='text-primary-500'>{dateFormatter(date, null, { month: "2-digit" })}</span>
  //     </div>
  //   )
  // }

  const items = [
    // {
    //   url: "/",
    //   icon: <FiMail size={18} className="stroke-current" />,
    //   name: "Inbox",
    //   badge: {
    //     number: 2,
    //     color: "bg-red-500 text-white",
    //   },
    // },
    // {
    //   url: "/",
    //   icon: <FiStar size={18} className="stroke-current" />,
    //   iconColor: "default",
    //   name: "Messages",
    //   badge: {
    //     number: 3,
    //     color: "bg-blue-500 text-white",
    //   },
    // },
    {
      url: "/dashboard/profile",
      icon: <FiUser size={18} className="stroke-current" />,
      clickFn: () => console.log('Go To Profile'),
      name: "Profile",
      label: 'navbar.button.profile'
    },
    {
      url: "/login",
      icon: <FiLogIn size={18} className="stroke-current" />,
      clickFn() { 
        signOut();
      },
      name: "Logout",
      label: 'navbar.button.logout'
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* {user && user.company && renderExpirationDate(user.company.expire_at)} */}
      <ul className="list-none">
        {items.map((item, i) => (
          <li key={i}>
            <Link href={item.url}>
              <a onClick={item.clickFn} className="flex flex-row items-center justify-start w-full h-10 px-2 text-gray-600 text-sm bg-white hover:bg-gray-100">
                {item.icon}
                <span className="mx-2 text-gray-600 text-sm">{t(item.label)}</span>
                {item.badge && (
                  <span
                    className={`uppercase font-bold inline-flex text-center p-0 leading-none text-xs h-4 w-4 items-center justify-center rounded-full ${item.badge.color} ml-auto`}>
                    {item.badge.number}
                  </span>
                )}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountLinks;
