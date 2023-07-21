export interface WebhookMessageFailed {
    account: string;
    date: string;
    event: 'messageFailed';
    data: Data;
}

interface Data {
    messageId: string;
    queueId: string;
    error: string;
}
