export interface WebhookMessageDeleted {
    account: string;
    date: string;
    path: string;
    specialUse: string;
    event: 'messageDeleted';
    data: Data;
}

interface Data {
    id: string;
    uid: number;
}
