import type { FunnelStatus } from 'src/utils/api/db';
import type { TriggerEvent } from '../../types';

export const GO_TO_INBOX = 'Go To Inbox';

export type GoToInboxPayload = {
    influencer_id: string;
    has_unread_messages: null; // TODO https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/968
    current_status: FunnelStatus;
    is_users_influencer: boolean;
};

export const GoToInbox = (trigger: TriggerEvent, value?: GoToInboxPayload) => trigger(GO_TO_INBOX, { ...value });

GoToInbox.eventName = <typeof GO_TO_INBOX>GO_TO_INBOX;
