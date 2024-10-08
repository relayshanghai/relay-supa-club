// Button.stories.ts|tsx
import type { Meta } from '@storybook/react';
import type { ManageInfluencerModalProps } from './manage-influencer-modal';
import { ManageInfluencerModal } from './manage-influencer-modal';
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
    payment_currency: 'USD',
    payment_rate: 100.3,
    payment_details: 'Paypal',
    paid_amount: 200.5,
    publication_date: '2021-01-01',
    next_step: 'Send email',
    address: '123 Main St',
    sample_status: 'Sent',
};

const props: ManageInfluencerModalProps = {
    creator,
    visible: true,
    onClose: () => undefined,
    openMoveInfluencerModal: () => undefined,
    openNotes: () => undefined,
    deleteCampaignCreator: async () => undefined,
    updateCampaignCreator: async () => undefined,
};

const Component = () => {
    const [visible, setVisible] = useState(true);
    return (
        <div>
            <Button onClick={() => setVisible(true)}>Show Modal</Button>
            <ManageInfluencerModal {...props} visible={visible} onClose={() => setVisible(false)} />
        </div>
    );
};

const meta: Meta<typeof ManageInfluencerModal> = {
    title: 'Campaigns/Manage Influencer Modal',
    tags: ['autodocs'],
    component: Component,
};

export default meta;

export const Default = () => <Component />;
