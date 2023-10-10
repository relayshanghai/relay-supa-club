import type { TriggerEvent } from '../types';
import type { CurrentPageEvent } from './current-pages';

export const STOP_BOOSTBOT = 'Stop Boostbot';

export type StopBoostbotPayload = {
    currentPage: CurrentPageEvent;
    search_id: string | number | null;
    // boost_bot_step: number
};

export const StopBoostbot = (trigger: TriggerEvent, value?: StopBoostbotPayload) =>
    trigger(STOP_BOOSTBOT, { ...value });

export type StopBoostbot = typeof StopBoostbot;

StopBoostbot.eventName = <typeof STOP_BOOSTBOT>STOP_BOOSTBOT;
