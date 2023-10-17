import type { TriggerEvent } from '../types';
import type { CurrentPageEvent } from './current-pages';

export const VISIT_PAGE = 'Visit Page';

export type VisitPagePayload = {
    currentPage: CurrentPageEvent;
};

export const VisitPage = (trigger: TriggerEvent<VisitPagePayload>, payload?: VisitPagePayload) =>
    trigger(VISIT_PAGE, payload);

VisitPage.eventName = <typeof VISIT_PAGE>VISIT_PAGE;
