/** https://email.relay.club/admin/iframe/docs#/Message/getV1AccountAccountMessages */
export interface AccountAccountMessagesGet {
    total: number;
    page: number;
    pages: number;
    messages: MessagesGetMessage[];
}

export interface MessagesGetMessage {
    path: string;
    id: string;
    uid: number;
    emailId: string;
    threadId: string;
    date: string;
    draft?: boolean;
    flagged?: boolean;
    flags: any[];
    labels: any[];
    unseen: boolean;
    size: number;
    subject: string;
    from: From;
    replyTo: From[];
    sender?: From[];
    to: From[];
    cc?: From[];
    bcc?: From[];
    messageId: string;
    inReplyTo?: string;
    attachments?: any[];
    text: Text;
    messageSpecialUse?: string;
    preview?: string;
}

interface From {
    name: string;
    address: string;
}

interface Text {
    id: string;
    encodedSize: EncodedSize;
}

interface EncodedSize {
    plain?: number;
    html: number;
}
