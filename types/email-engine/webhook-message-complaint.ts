export interface WebhookMessageComplaint {
    serviceUrl: string;
    account: string;
    date: string;
    event: 'messageComplaint';
    data: Data;
}

interface Data {
    complaintMessage: string;
    arf: Arf;
    headers: Headers;
}

interface Arf {
    source: string;
    feedbackType: string;
    abuseType: string;
    originalRcptTo: string[];
    sourceIp: string;
    arrivalDate: string;
}

interface Headers {
    messageId: string;
    from: string;
    to: string[];
    subject: string;
    date: string;
}
