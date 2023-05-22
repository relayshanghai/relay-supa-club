import type { CreatorReport } from 'types';
import { saveInfluencer as iqdataSaveInfluencer } from './api/iqdata/save-influencer';
import { isCreatorReport } from './api/iqdata/type-guards';

type SaveInfluencerData = CreatorReport;

export const saveInfluencer = async (data: SaveInfluencerData) => {
    if (isCreatorReport(data)) {
        return iqdataSaveInfluencer(data);
    }

    throw new Error('Cannot save influencer data');
};
