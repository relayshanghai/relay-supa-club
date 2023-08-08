import { SearchComponent } from './search-component';
import { CollabStatus } from './collab-status';
import { OnlyMe } from './onlyme';
import { Table } from './table';

const Manager = () => {
    return (
        <div className="m-8 flex flex-col">
            <div className="my-4 text-3xl font-semibold">
                <h1>Influencer Manager</h1>
            </div>
            {/* Filters */}
            <div className="mt-[72px] flex flex-row justify-between">
                <div className="flex flex-row gap-5">
                    <SearchComponent />
                    <CollabStatus />
                </div>
                <OnlyMe />
            </div>
            {/* Table */}
            <Table />
        </div>
    );
};

export default Manager;
