import React from 'react';
import { useTranslation } from 'react-i18next';
import ChannelCard from './ChannelCard';

export default function ChannelCardGrid() {
  const { t } = useTranslation();

  const cards = [1, 2, 3, 4];
  return (
    <div className="mb-6">
      <div className="text-gray-600 text-xl font-semibold">{t('creators.index.searchResults')}</div>
      <div className="flex overflow-x-auto pl-4 -ml-4">
        {cards.map((card, index) => (
          <div key={index}>
            <ChannelCard />
          </div>
        ))}
      </div>
    </div>
  );
}
