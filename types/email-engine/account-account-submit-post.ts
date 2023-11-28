/** There are a lot more options available https://email.relay.club/admin/iframe/docs#/Submit/postV1AccountAccountSubmit  */
export interface SendEmailRequestBody {
    reference?: Reference;
    envelope?: Envelope;
    raw?: string;
    from?: From;
    replyTo?: From[];
    to: To[];
    cc?: From[];
    bcc?: From[];
    subject?: string;
    /** Need either text or html */
    text?: string;
    /** Need either text or html */
    html?: string;
    previewText?: string;
    template?: string;
    render?: Render;
    mailMerge?: MailMerge[];
    attachments?: Attachment[];
    messageId?: string;
    headers?: Headers;
    trackingEnabled?: boolean;
    copy?: null;
    sentMailPath?: string;
    locale?: string;
    tz?: string;
    sendAt?: string;
    deliveryAttempts?: number;
    gateway?: string;
    listId?: string;
    dsn?: DSN;
    baseUrl?: string;
    dryRun?: boolean;
}

export interface Attachment {
    filename: string;
    content: string;
    contentType: string;
    contentDisposition: string;
    cid: string;
    encoding: string;
    reference: string;
}

interface From {
    name: string;
    address: string;
}

interface DSN {
    id: string;
    return: string;
    notify: string[];
    recipient: string;
}

interface Envelope {
    from: string;
    to: string[];
}

type Headers = Record<string, string>;

interface MailMerge {
    to: From;
    messageId: string;
    params: Headers;
    sendAt: string;
}

interface Reference {
    message: string;
    action: string;
    inline?: boolean;
    forwardAttachments?: boolean;
    ignoreMissing?: boolean;
    documentStore: boolean;
}

interface Render {
    format: string;
    params: Record<string, string>;
}

interface To {
    address: string;
}

/** https://email.relay.club/admin/iframe/docs#/Submit/postV1AccountAccountSubmit */
export interface SendEmailResponseBody {
    response: string;
    messageId: string;
    queueId: string;
    sendAt: string;
    reference: {
        message: string;
        documentStore: boolean;
        success: boolean;
        error: string;
    };
    preview: string;
    mailMerge: {
        success: boolean;
        to: {
            name: string;
            address: string;
        };
        messageId: string;
        queueId: string;
        reference: {
            message: string;
            success: boolean;
        };
        sendAt: string;
    }[];
}
