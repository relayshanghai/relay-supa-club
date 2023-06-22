import type { ComponentType, MouseEvent } from 'react';
import { useCallback } from 'react';
import type { apiObject } from 'rudder-sdk-js';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import type { DOMAttributes } from 'react';

export type rudderstack = ReturnType<typeof useRudderstack>;

export type RudderEvent<P extends apiObject = any> = (rudder: rudderstack) => (properties: P) => void;

type Track = <P = any>(payload?: P) => Promise<void | undefined>;

export type WithTrackingProps = {
    event?: RudderEvent;
    eventpayload?: apiObject | (() => any);
};

export type WithClickTrackingProps = {
    track?: Track;
    onClick?: DOMAttributes<Element>['onClick'];
};

export const WithTracking = <P = any,>(Component: ComponentType<P & { track?: Track }>) => {
    const WrappedComponent = (props: WithTrackingProps & P & DOMAttributes<Element>) => {
        const { event, eventpayload, ...others } = props;

        const rudder = useRudderstack();

        const handler = useCallback(
            async (payload?: any) => {
                if (eventpayload && typeof eventpayload === 'function') {
                    const result = await Promise.resolve(eventpayload());
                    payload = { ...payload, ...result };
                }

                if (eventpayload && typeof eventpayload !== 'function') {
                    payload = { ...eventpayload, ...payload };
                }

                return event && event(rudder)(payload);
            },
            [rudder, event, eventpayload],
        );

        return <Component {...(others as P)} track={handler} />;
    };

    WrappedComponent.displayName = `WithTracking(${Component.displayName || Component.name}`;

    return WrappedComponent;
};

export const WithClickTracking = <P = any,>(Component: ComponentType<P>) => {
    const WrappedComponent = (props: WithClickTrackingProps & P & DOMAttributes<Element>) => {
        const { onClick, track, ...others } = props;

        const handler = useCallback(
            (event: MouseEvent) => {
                track && track();
                onClick && onClick(event);
            },
            [onClick, track],
        );

        return <Component {...(others as P)} onClick={handler} />;
    };

    WrappedComponent.displayName = `WithClickTracking(${Component.displayName || Component.name}`;

    return WithTracking(WrappedComponent);
};
