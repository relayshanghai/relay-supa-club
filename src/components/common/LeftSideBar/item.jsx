import {useState} from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import {FiChevronRight} from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { trackEvent } from '../../../libs/segment/Events';

const Item = ({url, icon, title, badge, items, eventName}) => {
  const [hidden, setHidden] = useState(true);
  const { t } = useTranslation();
  const router = useRouter();
  const { pathname } = router;
  let active = pathname === url ? true : false;

  if (pathname === "/" && url === "/dashboard") {
    active = true;
  }
  if (pathname === "/" && url !== "/dashboard") {
    active = false;
  }
  if (items.length === 0) {
    return (
      <Link href={url}>
        <a onClick={() => trackEvent(`${eventName} Opened`, {})} className={`left-sidebar-item ${active ? "active" : ""}`}>
          {icon}
          <span className="title">{t(`navbar.button.${title}`)}</span>
          {badge && (
            <span className={`badge badge-circle badge-sm ${badge.color}`}>
              {badge.text}
            </span>
          )}
        </a>
      </Link>
    );
  }
  return (
    <button
      onClick={() => {
        setHidden(!hidden)
        trackEvent(`${eventName} Opened`, {})
      }}
      className={`left-sidebar-item ${active ? "active" : ""} ${
        hidden ? "hidden-sibling" : "open-sibling"
      }`}>
      {icon}
      <span className="title">{t(`navbar.button.${title}`)}</span>
      {badge && (
        <span className={`badge badge-circle badge-sm ${badge.color}`}>
          {badge.text}
        </span>
      )}
      <FiChevronRight className="ml-auto arrow" />
    </button>
  );
};

export default Item;
