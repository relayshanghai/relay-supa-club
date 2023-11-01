import type { CreatorPlatform } from 'types';
import type { TriggerEvent } from '../types';

export const CAMPAIGN_INFLUENCER_ROW_OPEN_SOCIAL_LINK = 'Campaign Influencer Row, open social link';

export type CampaignInfluencerRowOpenSocialLinkPayload = {
    platform: CreatorPlatform;
    user_id: string;
};

export const CampaignInfluencerRowOpenSocialLink = (
    trigger: TriggerEvent,
    value?: CampaignInfluencerRowOpenSocialLinkPayload,
) => trigger(CAMPAIGN_INFLUENCER_ROW_OPEN_SOCIAL_LINK, { ...value });

CampaignInfluencerRowOpenSocialLink.eventName = <typeof CAMPAIGN_INFLUENCER_ROW_OPEN_SOCIAL_LINK>(
    CAMPAIGN_INFLUENCER_ROW_OPEN_SOCIAL_LINK
);
