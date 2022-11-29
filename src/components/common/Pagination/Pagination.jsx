/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
/* eslint-disable max-len */
/* eslint-disable no-plusplus */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Pagination({
  postsPerPage,
  totalPosts,
  paginate,
  currentPage,
  meta,
}) {
  const { t } = useTranslation();

  const renderBackButton = (
    meta?.prev_page ? (
      <a
        onClick={() => {
          paginate(currentPage - 1);
        }}
        href="#"
        className="relative inline-flex items-center px-2 py-2 rounded-l-md bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
      >
        <span>{t('website.previous')}</span>
      </a>
    ) : (
      <div
        className="relative inline-flex items-center px-2 py-2 rounded-l-md bg-white text-sm font-medium text-gray-300"
      >
        <span>{t('website.previous')}</span>
      </div>
    )
  );

  const renderNextButton = (
    meta?.next_page ? (
      <a
        onClick={() => {
          paginate(currentPage + 1);
        }}
        href="#"
        className="relative inline-flex items-center px-2 py-2 rounded-r-md bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
      >
        <span>{t('website.next')}</span>
      </a>
    ) : (
      <div
        className="relative inline-flex items-center px-2 py-2 rounded-r-md bg-white text-sm font-medium text-gray-300"
      >
        <span>{t('website.next')}</span>
      </div>
    )
  );

  return (
    <div className="py-2">
      <div>
        <p className="text-sm text-gray-700 mb-2">
          Showing
          <span className="font-medium">
            {' '}
            {currentPage * postsPerPage - 9}
            {' '}
          </span>
          to
          <span className="font-medium">
            {' '}
            {currentPage * postsPerPage}
            {' '}
          </span>
          of
          <span className="font-medium">
            {' '}
            {totalPosts}
            {' '}
          </span>
          results
        </p>
      </div>
      <nav
        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
        aria-label="Pagination"
      >
        {renderBackButton}
        {renderNextButton}
      </nav>
    </div>
  );
}
