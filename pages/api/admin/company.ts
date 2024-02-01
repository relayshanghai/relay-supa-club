import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiHandler } from 'src/utils/api-handler';
import type { CompanyDB } from 'src/utils/api/db';
import { supabase } from 'src/utils/supabase-client';

export type AdminGetCompanyQueries = {
    companyId: string;
};
export type AdminGetCompanyResponse = CompanyDB;

export type AdminPutCompanyBody = {
    id: string;
    profiles_limit?: CompanyDB['profiles_limit'];
    searches_limit?: CompanyDB['searches_limit'];
    trial_searches_limit?: CompanyDB['trial_searches_limit'];
    trial_profiles_limit?: CompanyDB['trial_profiles_limit'];
};

export type AdminPutCompanyResponse = CompanyDB;

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.query as AdminGetCompanyQueries;
    if (!body.companyId) {
        return res.status(400).json({ message: 'companyId is required' });
    }

    const { data: company, error: companyError } = await supabase
        .from('companies')
        .select()
        .limit(1)
        .eq('id', body.companyId)
        .single();
    if (!company || companyError) {
        return res.status(500).json({ message: JSON.stringify(companyError) });
    }
    const returnObject: AdminGetCompanyResponse = company;
    return res.status(200).json(returnObject);
}

async function putHandler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body as AdminPutCompanyBody;
    if (!body.id) {
        return res.status(400).json({ message: 'companyId is required' });
    }
    const { id, ...update } = body;
    const { data: company, error: companyError } = await supabase
        .from('companies')
        .update(update)
        .eq('id', id)
        .select('*')
        .single();

    if (!company || companyError) {
        return res.status(500).json({ message: JSON.stringify(companyError) });
    }

    const returnObject: AdminPutCompanyResponse = company;
    return res.status(200).json(returnObject);
}

export default ApiHandler({
    getHandler,
    putHandler,
});
