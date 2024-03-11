import { type Nullable } from 'types/nullable';
/** https://email.relay.club/admin/iframe/docs#/Message/postV1AccountAccountSearch */
export interface AccountSearchPost {
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
    path?: Nullable<string>;
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
    seq?: Nullable<string>;
    answered?: Nullable<boolean>;
    deleted?: Nullable<boolean>;
    draft?: Nullable<boolean>;
    unseen?: Nullable<boolean>;
    flagged?: Nullable<boolean>;
    seen?: Nullable<boolean>;
    from?: Nullable<string>;
    to?: Nullable<string>;
    cc?: Nullable<string>;
    bcc?: Nullable<string>;
    body?: Nullable<string>;
    subject?: Nullable<string>;
    larger?: Nullable<number>;
    smaller?: Nullable<number>;
    uid?: Nullable<string>;
    modseq?: Nullable<number>;
    /** date string e.g. 2023-07-18 */
    before?: Nullable<string>;
    /** date string e.g. 2023-07-18 */
    since?: Nullable<string>;
    /** date string e.g. 2023-07-18 */
    sentBefore?: Nullable<string>;
    /** date string e.g. 2023-07-18 */
    sentSince?: Nullable<string>;
    emailId?: Nullable<string>;
    /** Gmail specific threadID */
    threadId?: Nullable<string>;
    header?: Nullable<Record<string, string>>;
    /** e.g. 'has:attachment in:unread' */
    gmailRaw?: Nullable<string>;
}

export interface SearchEmailParam {
    search?: Nullable<MailboxSearchOptions>;
    page?: Nullable<number>;
    documentQuery?: {
        query_string?: {
            query?: string
        }
    }
}
