import { useCallback } from 'react';
import type { TrackedEvent } from '../../utils/analytics/types';
import { useAnalytics } from '../analytics/analytics-provider';

export const useTrackEvent = () => {
    const { track: _track } = useAnalytics();

    type TrackEventParams<T extends TrackedEvent> = {
        event: T;
        payload: Parameters<T>[1];
        controller?: AbortController;
    };

    const track = useCallback(
        <T extends TrackedEvent>({ event, payload, controller }: TrackEventParams<T>) => {
            return _track(event, payload, { __abort: controller });
        },
        [_track],
    );

    return {
        track,
    };
};

export type track = ReturnType<typeof useTrackEvent>['track'];
