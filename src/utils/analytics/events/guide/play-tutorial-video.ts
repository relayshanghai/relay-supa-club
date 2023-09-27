import type { EventPayload, TriggerEvent } from '../../types';

export const PLAY_TUTORIAL_VIDEO = 'Play Tutorial Video';

export type PlayTutorialVideoPayload = EventPayload<{
    video: 'Main Demo';
}>;

export const PlayTutorialVideo = (trigger: TriggerEvent, payload?: PlayTutorialVideoPayload) =>
    trigger(PLAY_TUTORIAL_VIDEO, payload);

// @note we cast the eventName to a string literal since we are going to reference it back from TriggerEvent callbacks
PlayTutorialVideo.eventName = <typeof PLAY_TUTORIAL_VIDEO>PLAY_TUTORIAL_VIDEO;
