import type { CampaignCreatorDB, CampaignCreatorDBUpdate, RelayDatabase } from '../types';

export const getCampaignCreator =
    (db: RelayDatabase) =>
    async (id: string): Promise<CampaignCreatorDB | null> => {
        const response = await db.from('campaign_creators').select().eq('id', id).maybeSingle();

        if (response.error) {
            throw response.error;
        }

        return response.data;
    };

export const updateCampaignCreator =
    (db: RelayDatabase) =>
    async (id: string, data: CampaignCreatorDBUpdate): Promise<CampaignCreatorDB> => {
        const response = await db.from('campaign_creators').update(data).eq('id', id).select().single();

        if (response.error) {
            throw response.error;
        }

        return response.data;
    };
