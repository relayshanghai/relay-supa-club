import type { TriggerEvent } from '../types';
import type { CurrentPageEvent } from './current-pages';

export const CLICK_NEED_HELP = 'Click Need Help';

export type ClickNeedHelpPayload = {
    currentPage: CurrentPageEvent;
};

export const ClickNeedHelp = (trigger: TriggerEvent, value?: ClickNeedHelpPayload) =>
    trigger(CLICK_NEED_HELP, { ...value });

ClickNeedHelp.eventName = <typeof CLICK_NEED_HELP>CLICK_NEED_HELP;
