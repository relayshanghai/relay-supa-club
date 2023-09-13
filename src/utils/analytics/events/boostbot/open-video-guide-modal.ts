import type { TriggerEvent } from '../../types';

export const BOOSTBOT_OPEN_VIDEO_GUIDE_MODAL = 'boostbot-open_video_guide_modal';

export type OpenVideoGuideModalPayload = {
    extra_info?: any;
};

export const OpenVideoGuideModal = (
    trigger: TriggerEvent<OpenVideoGuideModalPayload>,
    payload?: OpenVideoGuideModalPayload,
) => trigger(BOOSTBOT_OPEN_VIDEO_GUIDE_MODAL, payload);

OpenVideoGuideModal.eventName = <typeof BOOSTBOT_OPEN_VIDEO_GUIDE_MODAL>BOOSTBOT_OPEN_VIDEO_GUIDE_MODAL;
