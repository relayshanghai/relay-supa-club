// import {useAppSelector, useAppDispatch} from "store";
import { useSelector, useDispatch } from "react-redux";
import { FiMenu } from "react-icons/fi";
import Dropdown2 from "./dropdown-2";
import UserIcon from "./UserIcon";
import Search from "./search";
import { setConfig } from "@/store/reducers/siteConfigReducer";


const Navbar = () => {
  const { config } = useSelector((state) => state);
  const { collapsed } = config;
  const dispatch = useDispatch();

  return (
    <div className="bg-white text-gray-900 border-gray-100">
      <div className="flex items-center justify-start w-full">
        <button
          onClick={() =>
            dispatch(
              setConfig({
                collapsed: !collapsed,
              })
            )
          }
          className="mx-4">
          <FiMenu size={20} />
        </button>
        <Search />
        <span className="ml-auto"></span>
        <Dropdown2 />
        <UserIcon />
      </div>
    </div>
  );
};

export default Navbar;
