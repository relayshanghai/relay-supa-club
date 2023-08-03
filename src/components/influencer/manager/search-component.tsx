import React, { useState } from 'react';

export const SearchComponent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <div
            className={`flex w-full flex-row items-center rounded-md border border-gray-200 bg-white text-gray-900 ring-1 ring-gray-900 ring-opacity-5 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm`}
        >
            <input
                className="w-full appearance-none rounded border border-transparent bg-white px-3 py-2 font-medium text-gray-900 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                placeholder="Search for influencer"
                data-testid="input-keywords"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
            />
        </div>
    );
};
