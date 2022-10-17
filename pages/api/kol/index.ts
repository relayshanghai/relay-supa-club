import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from 'src/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        return res.status(200).json({});
    }

    return res.status(400).json(null);
}
