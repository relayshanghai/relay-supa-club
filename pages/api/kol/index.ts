import { NextApiRequest, NextApiResponse } from 'next';
import { fetchCreatorsFiltered } from 'src/utils/api/iqdata';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const {
            // company_id, user_id,
            ...searchParams
        } = JSON.parse(req.body);

        // We're not checking for search usages for now, but we might want to in the future
        // const { data: company, error: companyError } = await supabase
        //     .from<CompanyDB>('companies')
        //     .select('usage_limit')
        //     .eq('id', company_id)
        //     .single();
        // if (!company || companyError) {
        //     return res.status(400).json({ error: 'Company not found' });
        // }
        // const limit = Number(company.usage_limit);
        // const { data: usagesData, error: usagesError } = await supabase
        //     .from<UsagesDB>('usages')
        //     .select('id')
        //     .eq('company_id', company_id)
        //     .eq('type', 'search');
        // if (usagesError || (usagesData?.length && usagesData.length >= limit)) {
        //     return res.status(400).json({ error: 'Usage limit exceeded' });
        // }

        const results = await fetchCreatorsFiltered(searchParams);

        // const usage = {
        //     company_id,
        //     user_id,
        //     type: 'search'
        // };
        // const { error } = await supabase.from<UsagesDB>('usages').insert([usage]);
        // if (error) return res.status(400).json(error);

        return res.status(200).json(results);
    }

    return res.status(400).json(null);
}
