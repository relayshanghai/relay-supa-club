import React from 'react';
import { SearchComponent } from './search-component';
import { CollabStatus } from './collab-status';
import { Tags } from './tags';
import { LastUpdated } from './last-updated';
import { Actions } from './actions';

const Manager = () => {
    return (
        <div className="flex flex-col">
            <div>
                <h1>KOL Manager</h1>
            </div>
            <SearchComponent />
            {/* Filters */}
            <div className="flex flex-row justify-between">
                <CollabStatus />
                <Tags />
                <LastUpdated />
                <Actions />
            </div>
            {/* Table */}
        </div>
    );
};

export default Manager;
