/** https://email.relay.club/admin/iframe/docs#/Message/getV1AccountAccountMessages */
export interface AccountAccountMessagesGet {
    total: number;
    page: number;
    pages: number;
    messages: EmailMessage[];
}

export interface EmailMessage {
    id: string;
    uid: number;
    emailId: string;
    threadId: string;
    date: string;
    flags: any[];
    labels: any[];
    unseen: boolean;
    size: number;
    subject: string;
    from: From;
    replyTo: From[];
    to: From[];
    messageId: string;
    text: Text;
}

export interface From {
    name: string;
    address: string;
}

export interface Text {
    id: string;
    encodedSize: EncodedSize;
}

export interface EncodedSize {
    plain?: number;
    html: number;
}
