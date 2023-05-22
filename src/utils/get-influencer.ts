import type { CreatorReport } from 'types';
import { getInfluencer as iqdataGetInfluencer } from './api/iqdata/get-influencer';
import { isCreatorReport } from './api/iqdata/type-guards';

type GetInfluencerData = CreatorReport;

export const getInfluencer = async (data: GetInfluencerData) => {
    if (isCreatorReport(data)) {
        return iqdataGetInfluencer(data);
    }

    throw new Error('Cannot get influencer data');
};
