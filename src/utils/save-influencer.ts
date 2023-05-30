import type { CreatorReport, DatabaseWithCustomTypes } from 'types';
import { saveInfluencer as iqdataSaveInfluencer } from './api/iqdata/save-influencer';
import { isCreatorReport } from './api/iqdata/type-guards';
import type { SupabaseClient } from '@supabase/supabase-js';

type SaveInfluencerData = CreatorReport;

export const saveInfluencer = (db: SupabaseClient<DatabaseWithCustomTypes>) => async (data: SaveInfluencerData) => {
    if (isCreatorReport(data)) {
        return iqdataSaveInfluencer(db)(data);
    }

    throw new Error('Cannot save influencer data');
};
