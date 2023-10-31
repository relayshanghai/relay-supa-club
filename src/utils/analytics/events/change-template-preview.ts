import type { InfluencerStepType } from 'types';
import type { TriggerEvent } from '../types';

export const CHANGE_TEMPLATE_PREVIEW = 'Change Template Preview';

export type ChangeTemplatePreviewPayload = {
    sequence_id: string;
    sequence_name: string;
    current_template_preview?: InfluencerStepType;
    selected_template_preview?: InfluencerStepType;
};

export const ChangeTemplatePreview = (trigger: TriggerEvent, value?: ChangeTemplatePreviewPayload) =>
    trigger(CHANGE_TEMPLATE_PREVIEW, { ...value });

ChangeTemplatePreview.eventName = <typeof CHANGE_TEMPLATE_PREVIEW>CHANGE_TEMPLATE_PREVIEW;
