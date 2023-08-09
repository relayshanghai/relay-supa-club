import React, { useState } from 'react';
import { Search } from 'src/components/icons';
import type { SequenceInfluencer } from 'src/utils/api/db';

export const SearchComponent = ({ _influencers }: { _influencers?: SequenceInfluencer[] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <div
            className={`relative flex flex-row items-center rounded-md border border-gray-200 bg-white text-gray-900 ring-1 ring-gray-900 ring-opacity-5 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm`}
        >
            <Search className="absolute left-2 top-2 h-6 w-6 fill-gray-500" />
            <input
                className="ml-6 appearance-none rounded border border-transparent bg-white px-3 py-2 font-medium text-gray-900 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                placeholder="Search for influencer"
                data-testid="input-keywords"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
            />
        </div>
    );
};
