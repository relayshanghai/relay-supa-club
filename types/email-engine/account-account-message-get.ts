export interface AccountAccountMessageGet {
    id: string;
    uid: number;
    emailId: string;
    threadId: string;
    date: Date;
    draft: boolean;
    unseen: boolean;
    flagged: boolean;
    size: number;
    subject: string;
    from: From;
    sender: From;
    to: ReplyTo[];
    cc: From[];
    bcc: From[];
    replyTo: ReplyTo[];
    messageId: string;
    inReplyTo: string;
    flags: string[];
    labels: string[];
    attachments: Attachment[];
    headers: Headers;
    text: Text;
    bounces: Bounce[];
    isAutoReply: boolean;
    specialUse: string;
    messageSpecialUse: string;
}

export interface Attachment {
    filename: string;
    id: string;
    contentType: string;
    encodedSize: number;
    embedded: boolean;
    inline: boolean;
    contentId: string;
}

export interface From {
    name: string;
    address: string;
}

export interface Bounce {
    message: string;
    recipient: string;
    action: string;
    response: Response;
    date: Date;
}

export interface Response {
    message: string;
    status: string;
}

export interface Headers {
    from: string[];
    subject: string[];
}

export interface ReplyTo {
    name?: string;
    address: string;
}

export interface Text {
    id: string;
    encodedSize: EncodedSize;
    plain: string;
    html: string;
    hasMore: boolean;
}

export interface EncodedSize {
    plain: number;
    html: number;
}
