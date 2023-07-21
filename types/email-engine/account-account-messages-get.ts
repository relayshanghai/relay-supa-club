/** https://email.relay.club/admin/iframe/docs#/Message/getV1AccountAccountMessages */
export interface AccountAccountMessagesGet {
    total: number;
    page: number;
    pages: number;
    messages: MessagesGetMessage[];
}

export interface MessagesGetMessage {
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
