export interface WebhookMessageBounce {
    account: string;
    date: string;
    event: 'messageBounce';
    data: Data;
}

interface Data {
    bounceMessage: string;
    recipient: string;
    action: string;
    response: Response;
    mta: string;
    queueId: string;
    messageId: string;
}

interface Response {
    source: string;
    message: string;
    status: string;
}
