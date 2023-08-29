import type { EventPayload, TriggerEvent } from '../../types';

export const BOOSTBOT_OPEN_BOOSTBOT_PAGE = 'TEST:boostbot-open_boostbot_page';

export type OpenBoostbotPagePayload = EventPayload;

export const OpenBoostbotPage = (trigger: TriggerEvent<OpenBoostbotPagePayload>, payload?: OpenBoostbotPagePayload) =>
    trigger(BOOSTBOT_OPEN_BOOSTBOT_PAGE, payload);

OpenBoostbotPage.eventName = <typeof BOOSTBOT_OPEN_BOOSTBOT_PAGE>BOOSTBOT_OPEN_BOOSTBOT_PAGE;
