import {Fragment} from "react";
import { useSelector } from "react-redux";
import Title from "./title";
import Item from "./item";
import Logo from "./logo";
import { tabs } from './tabs'

const LeftSidebar = () => {
  const { user } = useSelector((state) => state);
  
  return (
    <div className="text-gray-900 bg-white border-r border-gray-100 left-sidebar left-sidebar-1">
      <Logo />
      {tabs(user?.user).map((menu, i) => (
        menu.permissions.includes(user?.user?.is_admin ? 'admin' : 'user') && <Fragment key={i}>
          <Title>{menu.title}</Title>
          <ul>
            {menu.items.map((l0, a) => (
              <li key={a} className="l0">
                <Item {...l0} />
                <ul>
                  {l0.items.map((l1, b) => (
                    <li key={b} className="l1">
                      <Item {...l1} />
                      <ul>
                        {l1.items.map((l2, c) => (
                          <li key={c} className="l2">
                            <Item {...l2} />
                            <ul>
                              {l2.items.map((l3, d) => (
                                <li key={d} className="l3">
                                  <Item {...l3} />
                                  <ul>
                                    {l3.items.map((l4, e) => (
                                      <li key={e} className="l4">
                                        <Item {...l4} />
                                      </li>
                                    ))}
                                  </ul>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </div>
  );
};

export default LeftSidebar;
