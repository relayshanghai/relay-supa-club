import type { NextApiHandler } from 'next';
import httpCodes from '../../../src/constants/httpCodes';
import { getUsagesByCompanyCall } from '../../../src/utils/api/db/calls/usages';
import type { UsageType } from '../../../types';
import { db } from 'src/utils/supabase-client';

export type UsagesGetQueries = {
    /** company id */
    id: string;
    /** iso date string */
    startDate?: string;
    endDate?: string;
};

export type UsagesGetResponse = {
    type: UsageType;
    /** didn't use non-null in the DB, but this shouldn't be null */
    created_at: string | null;
}[];

const usages: NextApiHandler = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }
    const { id, startDate, endDate } = req.query as UsagesGetQueries;
    if (!id) {
        return res.status(httpCodes.BAD_REQUEST).json({});
    }
    const usages = await db(getUsagesByCompanyCall)(id, startDate, endDate);
    const result: UsagesGetResponse = usages;

    return res.status(httpCodes.OK).json(result);
};

export default usages;
