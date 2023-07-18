/** https://email.relay.club/admin/iframe/docs#/Message/postV1AccountAccountSearch */
export interface AccountAccountSearchPost {
    total: number;
    page: number;
    pages: number;
    messages: Message[];
}

export interface Message {
    id: string;
    uid: number;
    emailId: string;
    threadId: string;
    date: string;
    draft: boolean;
    unseen: boolean;
    flagged: boolean;
    size: number;
    subject: string;
    from: From;
    replyTo: ReplyTo[];
    to: ReplyTo[];
    cc: From[];
    bcc: From[];
    messageId: string;
    inReplyTo: string;
    flags: string[];
    labels: string[];
    attachments: Attachment[];
    text: Text;
    preview: string;
}

export interface Attachment {
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

export interface ReplyTo {
    address: string;
}

export interface Text {
    id: string;
    encodedSize: EncodedSize;
}

export interface EncodedSize {
    plain: number;
    html: number;
}

export interface MailboxSearchOptions {
    seq?: string;
    answered?: boolean;
    deleted?: boolean;
    draft?: boolean;
    unseen?: boolean;
    flagged?: boolean;
    seen?: boolean;
    from?: string;
    to?: string;
    cc?: string;
    bcc?: string;
    body?: string;
    subject?: string;
    larger?: 1073741824;
    smaller?: 1073741824;
    uid?: string;
    modseq?: 0;
    /** date string e.g. 2023-07-18 */
    before?: string;
    /** date string e.g. 2023-07-18 */
    since?: string;
    /** date string e.g. 2023-07-18 */
    sentBefore?: string;
    /** date string e.g. 2023-07-18 */
    sentSince?: string;
    emailId?: string;
    threadId?: '1771683502402987397';
    header?: Record<string, string>;
    gmailRaw?: 'has:attachment in:unread';
}

export interface AccountAccountSearchPostRequestBody {
    search: MailboxSearchOptions;
}
