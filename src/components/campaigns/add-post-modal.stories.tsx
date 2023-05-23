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
    paid_amount_cents: 0,
    paid_amount_currency: '',
    payment_details: null,
    payment_status: '',
    publication_date: null,
    rate_cents: 0,
    rate_currency: '',
    reject_message: null,
    sample_status: '',
    tracking_details: null,
    updated_at: null,
    relay_creator_id: 0,
};

const Component = () => {
    const [visible, setVisible] = useState(true);
    return (
        <div>
            <Button onClick={() => setVisible(true)}>Show Modal</Button>
            <AddPostModal creator={blankCreatorArgs} visible={visible} onClose={() => setVisible(false)} />
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
