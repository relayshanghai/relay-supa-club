/** There are a lot more options available https://email.relay.club/admin/iframe/docs#/Submit/postV1AccountAccountSubmit  */
export interface SendEmailRequestBody {
    to: {
        address: string;
    }[];
    subject: string;
    /** need either text or html */
    text?: string;
    /** need either text or html */
    html?: string;
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
