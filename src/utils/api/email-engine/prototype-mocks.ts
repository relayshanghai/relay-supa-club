export interface SequenceInfluencer {
    id: string;
    name: string;
    email: string;
    /** 0 means not sent. 1 means first step sent, awaiting 2. */
    sequenceStep: number;
    /** Will basically follow the campaign influencers status' */
    status: string;
    platform: string;
    channel: string;
}

// GMAIL specific constants. If we support other providers we will need workarounds for these.
export const GMAIL_INBOX = 'INBOX';
export const GMAIL_SENT = '[Gmail]/Sent Mail';
export const GMAIL_ALL_MAIL = '[Gmail]/All Mail';

export const GMAIL_SENT_SPECIAL_USE_FLAG = '\\Sent';

export const testAccount = 'fyasv5klfoioc1hx'; // relayemailertest@gmail.com on prod
// export const testAccount = 'r3e7hpvesxek82fj'; // localhost docker account
// export const testAccount = 'gzz2n7isa54a36ve'; // localhost account

export const mockInfluencers: SequenceInfluencer[] = [
    {
        id: 'mockInfluencers1',
        name: 'Jacob',
        email: 'jacob@relay.club',
        sequenceStep: 0,
        status: 'To Contact',
        platform: 'instagram',
        channel: '@jacob',
    },
    {
        id: 'mockInfluencers2',
        name: 'Brendan',
        email: 'brendan@relay.club',
        sequenceStep: 0,
        status: 'To Contact',
        platform: 'tiktok',
        channel: '@brendan',
    },
    {
        id: 'mockInfluencers3',
        name: 'Tech Account',
        email: 'tech@relay.club',
        sequenceStep: 0,
        status: 'To Contact',
        platform: 'youtube',
        channel: '@tech',
    },
];

export type SequenceStep = {
    id: string;
    name: string;
    waitTimeHrs: number;
    templateId: string;
};

export const mockSequenceEmail1: SequenceStep = {
    id: 'mockSequenceEmail1',
    name: 'Sequence Step 1',
    waitTimeHrs: 0,
    templateId: 'AAABiYr-poEAAAAC',
};
export const mockSequenceEmail2: SequenceStep = {
    id: 'mockSequenceEmail2',
    name: 'Sequence Step 2',
    // waitTimeHrs: 3 * 24, // 3 days
    waitTimeHrs: 1,
    templateId: 'AAABiYsMUIAAAAAD',
};

export interface Sequence {
    id: string;
    name: string;
    /** sequence step IDs */
    steps: SequenceStep[];
}

export const mockSequence = {
    id: 'mockSequence1',
    name: 'Influencer Outreach',
    steps: [mockSequenceEmail1, mockSequenceEmail2],
};
