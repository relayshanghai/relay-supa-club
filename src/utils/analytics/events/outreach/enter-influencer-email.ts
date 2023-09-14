import type { TriggerEvent } from '../../types';
import type { CurrentPageEvent } from '../current-pages';

export const ENTER_INFLUENCER_EMAIL = 'Enter Influencer Email';

export type EnterInfluencerEmailPayload = {
    currentPage: CurrentPageEvent;
    sequence_id: string;
    influencer_id: string;
    existing_email: string;
    sequence_name: string;
    email: string;
    unique_email: boolean;
};

export const EnterInfluencerEmail = (trigger: TriggerEvent, value?: EnterInfluencerEmailPayload) =>
    trigger(ENTER_INFLUENCER_EMAIL, { ...value });

export type EnterInfluencerEmail = typeof EnterInfluencerEmail;

EnterInfluencerEmail.eventName = <typeof ENTER_INFLUENCER_EMAIL>ENTER_INFLUENCER_EMAIL;
