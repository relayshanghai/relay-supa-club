import { describe, test, expect, vi } from 'vitest';
import type { TemplateVariable } from '../../utils/api/db';

import { fillInTemplateVariables, getRelevantTags, updateSequenceInfluencerIfSocialProfileAvailable } from './helpers';
const emailText =
    'Hey {{ params.influencerAccountName }},\r\n\r\n{{ params.marketingManagerName }} here from {{ params.brandName }}. I watched your "{{ params.recentPostTitle }}" video, and love your content style!! 🤩\r\n\r\nEver thought about introducing your fans to {{ params.productName }}? I\'ve got a feeling it\'s right up their alley. \r\n\r\n{{  params.productDescription }} is available for just ${{ params.productPrice }}! You can check it out here {{ params.productLink }}\r\n\r\nWe’re looking to partner with 8 or so influencers in the {{ params.influencerNiche }} space to get the word out about the {{ params.productName }} over the next couple weeks, and would love for you to be apart of it!\r\n\r\nWe’d send you a free sample to make some content about and share with your audience, fully compensated of course.\r\n\r\nLet me know what you think! \r\n\r\nBest,  \r\n\r\n{{ params.marketingManagerName }}';

const variables: TemplateVariable[] = [
    {
        id: 'a9bd5a54-42bb-486a-956f-1584aeab9138',
        created_at: '2023-08-11T04:22:24.39152+00:00',
        updated_at: '2023-08-11T04:22:24.39152+00:00',
        name: 'Marketing Manager Name',
        value: 'Vivian',
        key: 'marketingManagerName',
        sequence_id: '6de3e960-92b0-41bf-a4fe-e56454f20490',
        required: true,
    },
    {
        id: '4aed8d09-a57f-4118-9aeb-2df3c5d94cbf',
        created_at: '2023-08-11T04:22:24.39152+00:00',
        updated_at: '2023-08-11T04:22:24.39152+00:00',
        name: 'Brand Name',
        value: 'Blue Moonlight Stream Industries',
        key: 'brandName',
        sequence_id: '6de3e960-92b0-41bf-a4fe-e56454f20490',
        required: true,
    },
    {
        id: '43c5df3a-cb39-468d-a2b0-d9e317346edb',
        created_at: '2023-08-11T04:22:24.39152+00:00',
        updated_at: '2023-08-11T04:22:24.39152+00:00',
        name: 'Product Name',
        value: 'Widget X',
        key: 'productName',
        sequence_id: '6de3e960-92b0-41bf-a4fe-e56454f20490',
        required: true,
    },
    {
        id: '8b11bd28-6273-4cc0-85b1-3eda849f18ed',
        created_at: '2023-08-11T04:22:24.39152+00:00',
        updated_at: '2023-08-11T04:22:24.39152+00:00',
        name: 'Product Description',
        value: '',
        key: 'productDescription',
        sequence_id: '6de3e960-92b0-41bf-a4fe-e56454f20490',
        required: true,
    },
    {
        id: '498500aa-1315-4ea2-935d-7a524766c7cf',
        created_at: '2023-08-11T04:22:24.39152+00:00',
        updated_at: '2023-08-11T04:22:24.39152+00:00',
        name: 'Product Link',
        value: 'https://example.com/product',
        key: 'productLink',
        sequence_id: '6de3e960-92b0-41bf-a4fe-e56454f20490',
        required: true,
    },
    {
        id: '0a53e4ec-db26-412f-8e7c-904f8bc80c43',
        created_at: '2023-08-11T04:22:24.39152+00:00',
        updated_at: '2023-08-11T04:22:24.39152+00:00',
        name: 'Influencer Niche',
        value: 'Consumer Electronics',
        key: 'influencerNiche',
        sequence_id: '6de3e960-92b0-41bf-a4fe-e56454f20490',
        required: true,
    },
    {
        id: '0a53e4ec-db26-412f-8e7c-904f8bc80c42',
        created_at: '2023-08-11T04:22:24.39152+00:00',
        updated_at: '2023-08-11T04:22:24.39152+00:00',
        name: 'Product Price',
        value: '495',
        key: 'productPrice',
        sequence_id: '6de3e960-92b0-41bf-a4fe-e56454f20490',
        required: true,
    },
];

test('fills in template variables', () => {
    const expected =
        "Hey <span class='text-purple-500'>**influencerAccountName**</span>,\r\n\r\n<span class='text-purple-500'>Vivian</span> here from <span class='text-purple-500'>Blue Moonlight Stream Industries</span>. I watched your \"<span class='text-purple-500'>**recentPostTitle**</span>\" video, and love your content style!! 🤩\r\n\r\nEver thought about introducing your fans to <span class='text-purple-500'>Widget X</span>? I've got a feeling it's right up their alley. \r\n\r\n<span class='text-purple-500'>**productDescription**</span> is available for just $<span class='text-purple-500'>495</span>! You can check it out here <span class='text-purple-500'>https://example.com/product</span>\r\n\r\nWe’re looking to partner with 8 or so influencers in the <span class='text-purple-500'>Consumer Electronics</span> space to get the word out about the <span class='text-purple-500'>Widget X</span> over the next couple weeks, and would love for you to be apart of it!\r\n\r\nWe’d send you a free sample to make some content about and share with your audience, fully compensated of course.\r\n\r\nLet me know what you think! \r\n\r\nBest,  \r\n\r\n<span class='text-purple-500'>Vivian</span>";
    expect(fillInTemplateVariables(emailText, variables)).to.equal(expected);
});

const replaceNewlinesAndTabs = (text: string) => {
    return text.replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
};

describe('replaceNewlinesAndTabs', () => {
    test('it replaces newlines and tabs with html', () => {
        const example = 'Hey\n\nNice to meet you\n\tFrom relay.club with love';
        const expected = 'Hey<br><br>Nice to meet you<br>&nbsp;&nbsp;&nbsp;&nbsp;From relay.club with love';

        expect(replaceNewlinesAndTabs(example)).to.equal(expected);
    });
});

describe('updateSequenceInfluencerIfSocialProfileAvailable', () => {
    const args: any = {
        sequenceInfluencer: {
            id: 'sequenceInfluencer_id',
            influencer_social_profile_id: '',
            email: '',
        },
        socialProfile: {
            id: 'social_profile_id',
            email: 'social_profile_email',
        },
        company_id: 'company_id',
        report: {
            user_profile: {
                relevant_tags: [
                    {
                        tag: 'tag1',
                    },
                    {
                        tag: 'tag2',
                    },
                    {
                        tag: 'tag3',
                    },
                    {
                        tag: 'tag4',
                    },
                ],
            },
        },
    };
    test('getRelevantTags helper helper', () => {
        expect(getRelevantTags(args.report)).to.deep.equal(['tag1', 'tag2', 'tag3']);
        expect(getRelevantTags(undefined)).to.deep.equal([]);
    });
    test('Updates the sequence_influencer with the email and id from the socialProfile. Pulls the top 3 tags from the report', async () => {
        const updateSequenceInfluencer = vi.fn();

        await updateSequenceInfluencerIfSocialProfileAvailable({ ...args, updateSequenceInfluencer });
        const expectedUpdate = {
            id: 'sequenceInfluencer_id',
            influencer_social_profile_id: 'social_profile_id',
            email: 'social_profile_email',
            company_id: 'company_id',
            social_profile_last_fetched: new Date().toISOString(),
            tags: ['tag1', 'tag2', 'tag3'],
        };
        const call = updateSequenceInfluencer.mock.calls[0][0];
        expect(call.id).to.equal(expectedUpdate.id);
        expect(call.influencer_social_profile_id).to.equal(expectedUpdate.influencer_social_profile_id);
        expect(call.email).to.equal(expectedUpdate.email);
        expect(call.company_id).to.equal(expectedUpdate.company_id);
        // expect(call.social_profile_last_fetched).to.equal(expectedUpdate.social_profile_last_fetched); // timestamp won't match exactly
        expect(call.tags.toString()).to.deep.equal(expectedUpdate.tags.toString());
    });
    test('returns void if missing any required data', async () => {
        const updateSequenceInfluencer = vi.fn();
        const argsNoInfluencer: any = {
            ...args,
            sequenceInfluencer: null,
            updateSequenceInfluencer,
        };
        await updateSequenceInfluencerIfSocialProfileAvailable(argsNoInfluencer);
        expect(updateSequenceInfluencer).toHaveBeenCalledTimes(0);

        const argsNoReport: any = {
            ...args,
            report: null,
            updateSequenceInfluencer,
        };
        await updateSequenceInfluencerIfSocialProfileAvailable(argsNoReport);
        expect(updateSequenceInfluencer).toHaveBeenCalledTimes(0);

        const argsNoCompany: any = {
            ...args,
            company_id: null,
            updateSequenceInfluencer,
        };
        await updateSequenceInfluencerIfSocialProfileAvailable(argsNoCompany);
        expect(updateSequenceInfluencer).toHaveBeenCalledTimes(0);

        const argsNoSocialProfile: any = {
            ...args,
            socialProfile: null,
            updateSequenceInfluencer,
        };

        await updateSequenceInfluencerIfSocialProfileAvailable(argsNoSocialProfile);
        expect(updateSequenceInfluencer).toHaveBeenCalledTimes(0);
    });
    test('it will not call update if there are no changed values. will call even if there is just one update', async () => {
        const updateSequenceInfluencer = vi.fn();
        const argsAllMatch: any = {
            ...args,
            sequenceInfluencer: {
                ...args.sequenceInfluencer,
                influencer_social_profile_id: 'social_profile_id',
                email: 'social_profile_email',
                tags: ['tag1', 'tag2', 'tag3'],
            },
            updateSequenceInfluencer,
        };

        await updateSequenceInfluencerIfSocialProfileAvailable(argsAllMatch);
        expect(updateSequenceInfluencer).toHaveBeenCalledTimes(0);

        const argsTagsChanged: any = {
            ...args,
            sequenceInfluencer: {
                ...args.sequenceInfluencer,
                tags: ['asdf', 'asdf', 'asdf'],
            },
            updateSequenceInfluencer,
        };
        await updateSequenceInfluencerIfSocialProfileAvailable(argsTagsChanged);
        expect(updateSequenceInfluencer).toHaveBeenCalledTimes(1);

        const argsEmailChange: any = {
            ...args,
            sequenceInfluencer: {
                ...args.sequenceInfluencer,
                email: 'new_email',
            },
            updateSequenceInfluencer,
        };
        await updateSequenceInfluencerIfSocialProfileAvailable(argsEmailChange);
        expect(updateSequenceInfluencer).toHaveBeenCalledTimes(2);

        const argsIdChange: any = {
            ...args,
            sequenceInfluencer: {
                ...args.sequenceInfluencer,
                influencer_social_profile_id: 'new id',
            },
            updateSequenceInfluencer,
        };
        await updateSequenceInfluencerIfSocialProfileAvailable(argsIdChange);
        expect(updateSequenceInfluencer).toHaveBeenCalledTimes(3);
    });
});
