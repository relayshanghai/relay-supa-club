// TODO: Fix all eslint warnings
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import httpCodes from 'src/constants/httpCodes';
import { RelayError, ApiHandler } from 'src/utils/api-handler';
import { serverLogger } from 'src/utils/logger-server';
import { searchInfluencers } from 'src/utils/api/iqdata/influencers/search-influencers';
import type { CreatorSearchAccountObject } from 'types';

const BoostbotSearchBody = z.object({
    message: z.string(),
});

export type BoostbotSearchBody = z.input<typeof BoostbotSearchBody>;
export type BoostbotSearchResponse = {
    message: string;
    influencers: CreatorSearchAccountObject[];
    total: number;
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        console.log('req.body :>> ', req.body);

        const systemPrompt = `You are an influencer marketing expert. You help clients find relevant trending tags for their product. Based on a product description, return 5 biggest relevant instagram tags to reach the widest audience.

  Example: The most advanced home use LED facial mask based on light therapy with 11 different treatments for different skin conditions.
  Tags: #skincare, #beauty, #facial, #facialtreatment, #facialmask

  Only respond with a comma separated list of tags.`;

        const productDescription = req.body.message;

        // const response = await axios({
        //   method: 'post',
        //   url: 'https://api.openai.com/v1/chat/completions',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: `Bearer ${process.env.OPEN_API_AUTH_TOKEN}`,
        //   },
        //   data: {
        //     model: 'gpt-3.5-turbo',
        //     messages: [
        //       { role: 'system', content: systemPrompt },
        //       { role: 'user', content: productDescription },
        //     ],
        //     stream: false,
        //   },
        // })

        // const completion = response.data.choices[0].message.content

        // console.log('completion :>> ', completion)
        // const validGptTags = completion
        //   .replaceAll('#', '')
        //   .split(',')
        //   .map((tag: string) => tag.trim())
        //   .filter((tag: string) => tagObject[tag])
        // console.log('validGptTags :>> ', validGptTags)
        // const validTagString = validGptTags
        //   .map((tag: string) => `#${tag}`)
        //   .join(', ')
        // console.log('validTagString :>> ', validTagString)

        // #skincare, #beauty, #facial, #facialtreatment, #facialmask

        const influencersResponse = await searchInfluencers({
            query: { auto_unhide: 0, platform: 'instagram' },
            body: {
                paging: { limit: 1 },
                filter: {
                    lang: { code: 'en' },
                    relevance: { value: '#skincare' },
                    actions: [{ filter: 'relevance', action: 'must' }],
                    engagement_rate: { value: 0.01, operator: 'gt' },
                    followers: { left_number: 50000, right_number: 200000 },
                    last_posted: 30,
                    geo: [{ id: 148838 }],
                    audience_geo: [{ id: 148838, weight: 0.2 }],
                    with_contact: [{ type: 'email', action: 'should' }],
                },
                sort: { field: 'relevance', direction: 'desc' },
                audience_source: 'any',
            },
        });

        if (influencersResponse === undefined) {
            throw new RelayError('Cannot search influencers from Boostbot');
        }

        console.log('influencersResponse :>> ', influencersResponse);

        const response = {
            message: '#skincare',
            influencers: influencersResponse.accounts,
            total: influencersResponse.total,
        };

        return res.status(httpCodes.OK).json(response);
    } catch (error) {
        serverLogger(error, 'error');
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: 'error searching influencers' });
    }
};

export default ApiHandler({ postHandler });
