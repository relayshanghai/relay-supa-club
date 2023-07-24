export interface WebhookMessageSent {
    account: string;
    date: string;
    event: 'messageSent';
    data: Data;
}

interface Data {
    messageId: string;
    response: string;
    envelope: Envelope;
}

interface Envelope {
    from: string;
    to: string[];
}
