import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiHandler } from 'src/utils/api-handler';

import { fetchIqDataGeosWithContext as fetchIqDataGeos } from 'src/utils/api/iqdata';
import { IQDATA_LIST_GEOLOCATIONS, rudderstack } from 'src/utils/rudderstack';

const chinaTextAddition = (id: number) => {
    const chinaCityId = {
        1867188: '中国澳门',
        913110: '中国香港',
    };
    const found = chinaCityId[id as keyof typeof chinaCityId];
    return found ? '| ' + found : '';
};

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
    const { term } = req.body;

    await rudderstack.identify({ req, res });

    rudderstack.track({
        event: IQDATA_LIST_GEOLOCATIONS,
        onTrack: () => {
            return {
                term,
            };
        },
    });

    const results = await fetchIqDataGeos({ req, res })(term);

    // filter china city for macau and hong kong
    const filteredResults = results
        ?.map((result: { title: string; name: string; id: number }) => {
            const locationsToReplace = ['macau', 'hongkong', 'hong kong'];
            const regex = new RegExp(`\\b(?:${locationsToReplace.join('|')})\\b`, 'i');
            if (regex.test(result.title) || regex.test(result.name)) {
                return {
                    ...result,
                    title: `${result.title} ${chinaTextAddition(result.id)}`,
                    type: ['country'],
                };
            }
            return result;
        })
        .filter((result: { type: string[] }) => {
            if (result.type.includes('country')) {
                return true;
            }
            return false;
        });

    return res.status(200).json(filteredResults);
}

export default ApiHandler({
    postHandler,
});
