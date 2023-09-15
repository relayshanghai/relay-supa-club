import type { TriggerEvent } from '../types';

export const NAVIGATE_TO_PAGE = 'Navigate To Page';

export type NavigateToPagePayload = {
    destination_url: string;
};

export const NavigateToPage = (trigger: TriggerEvent, value?: NavigateToPagePayload) =>
    trigger(NAVIGATE_TO_PAGE, { ...value });

NavigateToPage.eventName = <typeof NAVIGATE_TO_PAGE>NAVIGATE_TO_PAGE;
