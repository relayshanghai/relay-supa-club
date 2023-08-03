import type { CampaignDB, CampaignCreatorDB, CampaignDBInsert, CampaignDBUpdate, RelayDatabase } from '../api/db';

export type { CampaignDB };

export type CampaignWithCreators = CampaignDB & {
    campaign_creators: CampaignCreatorDB[];
};

export const getCampaignsCall =
    (supabaseClient: RelayDatabase) =>
    async (companyId?: string | null): Promise<CampaignDB[]> => {
        if (!companyId) {
            return [];
        }

        const { data, error } = await supabaseClient.from('campaigns').select('*').eq('company_id', companyId);

        if (error) throw error;
        return data;
    };

export const createCampaignCall =
    (supabaseClient: RelayDatabase) =>
    async (input: Omit<CampaignDBInsert, 'company_id'>, companyId?: string | null): Promise<CampaignDB> => {
        if (!companyId) {
            throw new Error('No company ID found');
        }

        const { data: campaign, error } = await supabaseClient
            .from('campaigns')
            .insert({
                company_id: companyId,
                ...input,
                status: 'not started',
                description: input.description || '', // is not-null in db
                slug: input.name.toLowerCase().replace(/ /g, '-'),
                updated_at: new Date().toISOString(),
            })
            .eq('company_id', companyId)
            .select()
            .single();

        if (error) throw error;
        return campaign;
    };

export const updateCampaignCall =
    (supabaseClient: RelayDatabase) =>
    async (input: CampaignDBUpdate): Promise<CampaignDB> => {
        const { id: _filter_out, ...rest } = input;
        if (!input.company_id) {
            throw new Error('No company ID found');
        }
        const { data: campaign, error } = await supabaseClient
            .from('campaigns')
            .update({
                ...rest,
                updated_at: new Date().toISOString(),
            })
            .eq('id', input.id)
            .select()
            .single();

        if (error) throw error;
        return campaign;
    };
