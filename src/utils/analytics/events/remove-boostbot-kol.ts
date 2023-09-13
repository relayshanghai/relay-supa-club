import type { TriggerEvent } from '../types';
import type { CurrentPageEvent } from './current-pages';

export const REMOVE_BOOSTBOT_KOL = 'Remove KOL';

export type RemoveBoostbotKolPayload = {
    currentPage: CurrentPageEvent;
};

export const RemoveBoostbotKol = (trigger: TriggerEvent, value?: RemoveBoostbotKolPayload) =>
    trigger(REMOVE_BOOSTBOT_KOL, { ...value });

export type RemoveBoostbotKol = typeof RemoveBoostbotKol;

RemoveBoostbotKol.eventName = <typeof REMOVE_BOOSTBOT_KOL>REMOVE_BOOSTBOT_KOL;
