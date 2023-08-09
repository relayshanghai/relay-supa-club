import { SearchComponent } from './search-component';
import { CollabStatus } from './collab-status';
import { OnlyMe } from './onlyme';
import { Table } from './table';
import { useSequences } from 'src/hooks/use-sequences';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import { useState } from 'react';

const Manager = () => {
    const { sequences } = useSequences();
    const { sequenceInfluencers } = useSequenceInfluencers(sequences?.[0]?.id);

    const [influencers, _setInfluencers] = useState(sequenceInfluencers);

    return (
        <div className="m-8 flex flex-col">
            <div className="my-4 text-3xl font-semibold">
                <h1>Influencer Manager</h1>
            </div>
            {/* Filters */}
            <div className="mt-[72px] flex flex-row justify-between">
                <div className="flex flex-row gap-5">
                    <SearchComponent _influencers={influencers} />
                    <CollabStatus _influencers={influencers} />
                </div>
                <OnlyMe />
            </div>
            {/* Table */}
            <Table influencers={influencers} />
        </div>
    );
};

export default Manager;
