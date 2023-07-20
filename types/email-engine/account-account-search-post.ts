/** https://email.relay.club/admin/iframe/docs#/Message/postV1AccountAccountSearch */
export interface AccountAccountSearchPost {
    total: number;
    page: number;
    pages: number;
    messages: SearchResponseMessage[];
}

export interface SearchResponseMessage {
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

interface Attachment {
    id: string;
    contentType: string;
    encodedSize: number;
    embedded: boolean;
    inline: boolean;
    contentId: string;
}

interface From {
    name: string;
    address: string;
}

interface ReplyTo {
    address: string;
}

interface Text {
    id: string;
    encodedSize: EncodedSize;
}

interface EncodedSize {
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
    larger?: number;
    smaller?: number;
    uid?: string;
    modseq?: number;
    /** date string e.g. 2023-07-18 */
    before?: string;
    /** date string e.g. 2023-07-18 */
    since?: string;
    /** date string e.g. 2023-07-18 */
    sentBefore?: string;
    /** date string e.g. 2023-07-18 */
    sentSince?: string;
    emailId?: string;
    /** Gmail specific threadID */
    threadId?: string;
    header?: Record<string, string>;
    /** e.g. 'has:attachment in:unread' */
    gmailRaw?: string;
}

export interface AccountAccountSearchPostRequestBody {
    search: MailboxSearchOptions;
}
