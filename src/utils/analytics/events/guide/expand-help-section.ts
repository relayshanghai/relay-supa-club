import type { EventPayload, TriggerEvent } from '../../types';

export const EXPAND_HELP_SECTION = 'Expand Help Section';

export type ExpandHelpSectionPayload = EventPayload<{
    type: string;
    modal_name: string;
    section_name: string;
}>;

export const ExpandHelpSection = (trigger: TriggerEvent, value?: ExpandHelpSectionPayload) =>
    trigger(EXPAND_HELP_SECTION, value);

export type ExpandHelpSection = typeof ExpandHelpSection;

ExpandHelpSection.eventName = <typeof EXPAND_HELP_SECTION>EXPAND_HELP_SECTION;
