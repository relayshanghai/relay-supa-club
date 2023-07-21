export interface WebhookTrackOpen {
    account: string;
    date: string;
    event: 'trackOpen';
    data: Data;
}

interface Data {
    messageId: string;
    remoteAddress: string;
    userAgent: string;
}
