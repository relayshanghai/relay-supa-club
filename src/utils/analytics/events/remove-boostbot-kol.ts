import type { TriggerEvent } from '../types';
import type { CurrentPageEvent } from './current-pages';

// Event names:
// - Remove KOL
export const REMOVE_BOOSTBOT_KOL = 'Remove BoostBot Search Result';

export type RemoveBoostbotKolPayload = {
    currentPage: CurrentPageEvent;
    kol_id: string;
    platform: string;
    search_id: string | number | null;
    // batch_id: string | number | null
    // search_results_page: number // 9999 for report
    // search_results_index: number // 9999 for report
};

export const RemoveBoostbotKol = (trigger: TriggerEvent, value?: RemoveBoostbotKolPayload) =>
    trigger(REMOVE_BOOSTBOT_KOL, { ...value });

export type RemoveBoostbotKol = typeof RemoveBoostbotKol;

RemoveBoostbotKol.eventName = <typeof REMOVE_BOOSTBOT_KOL>REMOVE_BOOSTBOT_KOL;
