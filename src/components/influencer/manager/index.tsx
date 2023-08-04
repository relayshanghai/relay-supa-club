import React from 'react';
import { SearchComponent } from './search-component';
import { CollabStatus } from './collab-status';
import { OnlyMe } from './onlyme';

const Manager = () => {
    return (
        <div className="m-4 flex flex-col">
            <div className="my-4 text-3xl font-semibold">
                <h1>Influencer Manager</h1>
            </div>
            {/* Filters */}
            <div className="flex flex-row justify-between">
                <div className="flex flex-row justify-between">
                    <SearchComponent />
                    <CollabStatus />
                </div>
                <OnlyMe />
            </div>
            {/* Table */}
        </div>
    );
};

export default Manager;
