import {FiMenu} from "react-icons/fi";
// import {setConfig} from "slices/config";
import { setConfig } from "@/store/reducers/siteConfigReducer";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

const Logo = () => {
  const { config } = useSelector((state) => state);
  const { collapsed } = config;
  const dispatch = useDispatch();
  const showLogo = true
  if (showLogo) {
    return (
      <div className="logo truncate">
        <Link href="/dashboard">
          <a className="flex flex-row items-center justify-start space-x-2">
            {/* <FiBox size={28} /> */}
            <img src="/logo.png" className="w-8 h-8 mt-0.5" />
            <span className={`lowercase text-gray-600 ${collapsed && 'hidden md:flex'}`}>relay.club</span>
          </a>
        </Link>
        <button
          onClick={() =>
            dispatch(
              setConfig({
                collapsed: !collapsed,
              })
            )
          }
          className="block ml-auto mr-4 lg:hidden text-gray-900">
          <FiMenu size={20} />
        </button>
      </div>
    );
  }
  return null;
};

export default Logo;
