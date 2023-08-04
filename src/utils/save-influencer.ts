import type { CreatorReport } from 'types';
import type { RelayDatabase } from './api/db';
import { saveInfluencer as iqdataSaveInfluencer } from './api/iqdata/save-influencer';
import { isCreatorReport } from './api/iqdata/type-guards';

type SaveInfluencerData = CreatorReport;

export const saveInfluencer = (db: RelayDatabase) => async (data: SaveInfluencerData) => {
    if (isCreatorReport(data)) {
        return iqdataSaveInfluencer(db)(data);
    }

    throw new Error('Cannot save influencer data');
};
