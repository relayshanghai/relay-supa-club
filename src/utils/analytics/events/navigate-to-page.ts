import type { TriggerEvent } from '../types';
import { CurrentPageEvent } from './current-pages';

export const NAVIGATE_TO_PAGE = 'Navigate To Page';

export type NavigateToPagePayload = {
    currentPage: CurrentPageEvent;
    destination_url: string;
};

export const NavigateToPage = (trigger: TriggerEvent, value?: NavigateToPagePayload) =>
    trigger(NAVIGATE_TO_PAGE, { ...value });

NavigateToPage.eventName = <typeof NAVIGATE_TO_PAGE>NAVIGATE_TO_PAGE;
