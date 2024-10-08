// Button.stories.ts|tsx
import type { Meta } from '@storybook/react';
import { AddPostModal } from './add-post-modal';
import type { CampaignCreatorDB } from 'src/utils/api/db';
import { useState } from 'react';
import { Button } from '../button';

const blankCreatorArgs: CampaignCreatorDB = {
    platform: 'youtube',
    status: 'to contact',
    username: null,
    added_by_id: '',
    address: null,
    avatar_url: '',
    brief_opened_by_creator: false,
    campaign_id: null,
    created_at: null,
    creator_id: '',
    creator_model: null,
    creator_token: null,
    email_sent: false,
    fullname: null,
    id: '',
    interested: false,
    link_url: null,
    need_support: false,
    next_step: null,
    paid_amount: 0,
    payment_currency: '',
    payment_details: null,
    payment_status: '',
    publication_date: null,
    payment_rate: 0,
    rate_currency: '',
    reject_message: null,
    sample_status: '',
    tracking_details: null,
    updated_at: null,
    relay_creator_id: 0,
    influencer_social_profiles_id: '',
};

const creator: CampaignCreatorDB = {
    ...blankCreatorArgs,
    fullname: 'T-Series',
    username: 'tseries',
};

const Component = () => {
    const [visible, setVisible] = useState(true);
    return (
        <div>
            <Button onClick={() => setVisible(true)}>Show Modal</Button>
            <AddPostModal creator={creator} visible={visible} onClose={() => setVisible(false)} />
        </div>
    );
};

const meta: Meta<typeof AddPostModal> = {
    title: 'Campaigns/Add Post Modal',
    tags: ['autodocs'],
    component: Component,
};

export default meta;

export const Default = () => <Component />;
