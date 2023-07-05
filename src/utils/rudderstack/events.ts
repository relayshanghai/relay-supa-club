import type { EventParameters, RudderBackend } from './rudderstack';

export type ConversationCreatedEventParams = EventParameters<{
    account_id: string | number;
}>;

export const ConversationCreatedEvent =
    (rudder: RudderBackend) =>
    ({ account_id, ...options }: ConversationCreatedEventParams) => {
        rudder.track({
            ...options,
            event: 'chatwoot:conversation_created',
            properties: {
                ...options.properties,
                account_id,
            },
            anonymousId: account_id + '',
        });
    };

export type WebwidgetTriggeredEventParams = EventParameters<{
    account_id: string | number;
}>;

export const WebwidgetTriggeredEvent =
    (rudder: RudderBackend) =>
    ({ account_id, ...options }: WebwidgetTriggeredEventParams) => {
        rudder.track({
            ...options,
            event: 'chatwoot:webwidget_triggered',
            properties: {
                ...options.properties,
                account_id,
            },
            anonymousId: account_id + '',
        });
    };
