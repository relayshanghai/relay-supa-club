/** https://emailengine.app/webhooks#messageNew */
export interface WebhookMessageNew {
    serviceUrl: string;
    account: string;
    date: string;
    path: string;
    specialUse: string;
    event: 'messageNew';
    data: Data;
    _route: Route;
}

interface Route {
    id: string;
}

export interface Data {
    id: string;
    uid: number;
    path: string;
    emailId: string;
    threadId: string;
    date: string;
    flags: any[];
    labels: string[];
    unseen: boolean;
    size: number;
    subject: string;
    from: From;
    replyTo: From[];
    sender: From;
    to: From[];
    messageId: string;
    text: Text;
    category: string;
    seemsLikeNew: boolean;
    messageSpecialUse: string;
    specialUse: string;
    summary: Summary;
    draft?: boolean;
    cc?: From[];
}

interface From {
    name: string;
    address: string;
}

interface Summary {
    id: string;
    tokens: number;
    summary: string;
    sentiment: string;
}

interface Text {
    id: string;
    encodedSize: EncodedSize;
    plain: string;
    html: string;
    hasMore: boolean;
}

interface EncodedSize {
    plain: number;
    html: number;
}
