import type { TriggerEvent } from '../types';
import { CurrentPageEvent } from './current-pages';

export const CHANGE_PAGE = 'Change Page';

export type ChangePagePayload = {
    currentPage: CurrentPageEvent;
    fromPage: number;
    toPage: number | null;
};

export const ChangePage = (trigger: TriggerEvent, value?: ChangePagePayload) =>
    trigger(CHANGE_PAGE, { ...value });

export type ChangePage = typeof ChangePage;

ChangePage.eventName = <typeof CHANGE_PAGE>CHANGE_PAGE;
