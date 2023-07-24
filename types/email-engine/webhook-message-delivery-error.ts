export interface WebhookMessageDeliveryError {
    serviceUrl: string;
    account: string;
    date: string;
    event: 'messageDeliveryError';
    data: Data;
}

interface Data {
    queueId: string;
    envelope: Envelope;
    messageId: string;
    error: string;
    errorCode: string;
    smtpResponseCode: number;
    job: Job;
}

interface Envelope {
    from: string;
    to: string[];
}

interface Job {
    attemptsMade: number;
    attempts: number;
    nextAttempt: string;
}
