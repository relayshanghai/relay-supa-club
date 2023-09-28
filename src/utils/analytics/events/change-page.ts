import type { TriggerEvent } from '../types';

export const CHANGE_PAGE = 'Change Page';

export type ChangePagePayload = {
    from_page: number;
    to_page: number | null;
    search_id: string | number | null;
    // current_page_unlocks: boolean,
    // current_page_add: boolean,
};

export const ChangePage = (trigger: TriggerEvent, value?: ChangePagePayload) => trigger(CHANGE_PAGE, { ...value });

export type ChangePage = typeof ChangePage;

ChangePage.eventName = <typeof CHANGE_PAGE>CHANGE_PAGE;
