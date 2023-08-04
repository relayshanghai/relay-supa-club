import type events from 'src/utils/analytics/events';
import { useCallback } from 'react';
import { useAnalytics } from '../analytics/analytics-provider';

export const useTrackEvent = () => {
    const { track: _track } = useAnalytics();

    type TrackEventParams<T extends (...args: any[]) => any = any> = {
        event: (typeof events)[keyof typeof events];
        payload: Parameters<T>[1];
        controller?: AbortController;
    };

    const track = useCallback(
        <T extends (...args: any[]) => any = any>({ event, payload, controller }: TrackEventParams<T>) => {
            return _track<TrackEventParams<typeof event>['event']>(event, payload, { __abort: controller });
        },
        [_track],
    );

    return {
        track,
    };
};

export type track = ReturnType<typeof useTrackEvent>['track'];
