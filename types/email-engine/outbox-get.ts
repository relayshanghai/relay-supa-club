export interface OutboxGet {
    total: number;
    page: number;
    pages: number;
    messages: OutboxGetMessage[];
}

export interface OutboxGetMessage {
    queueId: string;
    account: string;
    source: string;
    messageId: string;
    envelope: Envelope;
    subject: string;
    created: string;
    scheduled: string;
    nextAttempt: string;
    attemptsMade: number;
    attempts: number;
    progress: Progress;
}

interface Envelope {
    from: string;
    to: string[];
}

interface Progress {
    status: string;
    response?: string;
    error?: Error;
}

interface Error {
    message: string;
    code: string;
    statusCode: string;
}
