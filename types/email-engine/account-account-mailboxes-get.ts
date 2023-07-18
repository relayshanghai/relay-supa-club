/** https://email.relay.club/admin/iframe/docs#/Mailbox/getV1AccountAccountMailboxes */
export interface AccountAccountMailboxesGetResponse {
    mailboxes: Mailbox[];
}

export interface Mailbox {
    path: string;
    delimiter: string;
    listed: boolean;
    name: string;
    subscribed: boolean;
    specialUse?: string;
    specialUseSource?: string;
    noInferiors: boolean;
    messages: number;
    uidNext: number;
    parentPath?: string;
}
