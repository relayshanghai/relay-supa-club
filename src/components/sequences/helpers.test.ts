import { test, expect } from 'vitest';
import type { TemplateVariable } from '../../utils/api/db';

import { fillInTemplateVariables } from './helpers';
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
        id: '74dcd760-bee0-449c-a696-8f0112263619',
        created_at: '2023-08-11T04:22:24.39152+00:00',
        updated_at: '2023-08-11T04:22:24.39152+00:00',
        name: 'Product Features',
        value: 'The Product Features',
        key: 'productFeatures',
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

test('replaceNewlinesAndTabs', () => {
    const example = 'Hey\n\nNice to meet you\n\tFrom relay.club with love';
    const expected = 'Hey<br><br>Nice to meet you<br>&nbsp;&nbsp;&nbsp;&nbsp;From relay.club with love';

    expect(replaceNewlinesAndTabs(example)).to.equal(expected);
});
