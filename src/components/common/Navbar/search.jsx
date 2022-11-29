/* eslint-disable no-unused-vars */
import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import {FiSearch} from "react-icons/fi";
import useCampaigns from "@/hooks/useCampaigns";
import { trackEvent } from "@/libs/segment/Events";
import { toast } from "react-toastify";
import { handleError } from '@/libs/utils/utils';
import useOnChange from "@/hooks/useOnChange";
import Dropdown from "../Modals/Dropdown";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useTranslation } from "react-i18next";
import Icon from "@/res/images/Icon";
import CancelFilled from "@/components/icons/CancelFilled";

const _ = require('lodash');

const Search = () => {
  const [query, setQuery] = useState('');
  const [dropdown, setDropdown] = useState(false);
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(false)
  const { searchCampaigns } = useCampaigns();
  const dropDownRef = useRef();
  const { t } = useTranslation()
  useOnClickOutside(dropDownRef, () => setDropdown(false))
  const resultsRef = useRef();
  useOnClickOutside(resultsRef, () => setDropdown(false))


  const handleTagSearch = async (q) => {
    if (!q.trim()) return setState([])
    trackEvent('Campaign Searched', { q });
    setLoading(true);
    try {
      const response = await searchCampaigns(q);
      setState(response.data.campaigns);
      setLoading(false);
    } catch (error) {
      toast(handleError(error))
      setLoading(false);
    }
  };

  const handleResultClick = (e) => {
    // e.preventDefault();
    trackEvent('Searched Campaign Clicked', { });
    resetSearch();
  };

  const resetSearch = (e) => {
    setState([]);
    setQuery('');
  };

  const renderSearchResults = (campaigns) => (
    <div ref={dropDownRef} className="max-h-96 overflow-y-auto">
      { campaigns.map((campaign) => (
        <Link key={campaign.id} href={`/dashboard/campaigns/${campaign.slug}`}>
          <a onClick={(e) => handleResultClick(e)} className="py-2 px-1 hover:bg-primary-100 rounded-sm flex items-center">
            <img src={campaign?.media[0]?.url || '/image404.png'} alt="" className="w-10 h-10 rounded-sm object-cover flex-shrink-0 mr-2" />
            <div>
              <div className="text-sm font-semibold text-gray-600 duration-300 rounded-md cursor-pointer">{campaign.name}</div>
              <div className="text-xs text-gray-400">{campaign.company.name}</div>
              <div className="flex items-center flex-wrap">
                { campaign.status_counts && Object.entries(campaign.status_counts).map((status, index) => (
                  <div key={index} href={`/dashboard/campaigns/${campaign.slug}?curTab=${status[0]}`}>
                    <a className="flex items-center text-xs px-1 py-0.5 bg-primary-100 text-gray-600 duration-300 bg-opacity-60 border border-gray-100 rounded-md mr-2 mb-2">
                      <div className="mr-1">{t(`campaigns.show.activities.outreach.status.${status[0]}`)}</div>
                      <div>{status[1]}</div>
                    </a>
                  </div>
                )) }
              </div>
            </div>
          </a>
        </Link>
      ))}
    </div>
  )


  const debouncedSearch = useMemo(
    () => {
      return _.debounce(handleTagSearch, 300)
      }, []);

  useOnChange(() => {
    debouncedSearch(query)
  }, [query]);


  return (
    <div className="w-full max-w-xs mr-2">
      <div className="relative">
        <input
          type="text"
          name="search"
          value={query}
          placeholder={t('campaigns.index.searchPlaceholder')}
          onClick={() => setDropdown(true)}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          className="w-full h-10 pl-10 pr-5 text-sm rounded-md appearance-none focus:outline-none bg-gray-100 border border-gray-100 "
        />
        <div className="absolute top-0 left-0 mt-3 ml-4">
          <FiSearch className="w-4 h-4 stroke-current" />
        </div>
        { dropdown && !!state.length && <Dropdown>{renderSearchResults(state)}</Dropdown> }
        { loading && <Icon name="loader-ter" className="w-8 h-8 absolute right-3 top-1/2 -translate-y-1/2 z-50" /> }
        { !!query.length && !loading && <CancelFilled onClick={() => resetSearch()} className="w-5 h-5 fill-current text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer hover:text-primary-500 duration-300"  />}
      </div>
    </div>
  );
};

export default Search;
