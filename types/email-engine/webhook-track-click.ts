export interface WebhookTrackClick {
    account: string;
    date: string;
    event: 'trackClick';
    data: Data;
}

interface Data {
    messageId: string;
    url: string;
    remoteAddress: string;
    userAgent: string;
}
