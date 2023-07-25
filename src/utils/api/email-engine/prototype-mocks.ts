export interface SequenceInfluencer {
    id: string;
    name: string;
    email: string;
    /** 0 means not sent. 1 means first step sent, awaiting 2. */
    sequenceStep: number;
    /** Will basically follow the campaign influencers status' */
    status: string;
}

// GMAIL specific constants. If we support other providers we will need workarounds for these.
export const GMAIL_INBOX = 'INBOX';
export const GMAIL_SENT = '[Gmail]/Sent Mail';
export const GMAIL_ALL_MAIL = '[Gmail]/All Mail';

export const GMAIL_SENT_SPECIAL_USE_FLAG = '\\Sent';

// export const testAccount = 'gprtldm3xqb0424p'; // brendan.relay@gmail.com on prod
//export const testAccount = 'dtykdqrfxpth5hgy'; // ellie.relay@gmail.com on prod
export const testAccount = 'fyasv5klfoioc1hx'; // relayemailertest@gmail.com
// export const testAccount = 'r3e7hpvesxek82fj'; // localhost docker account
// export const testAccount = 'gzz2n7isa54a36ve'; // localhost account

export const mockInfluencers: SequenceInfluencer[] = [
    {
        id: 'mockInfluencers1',
        name: 'Jacob',
        email: 'jacob@relay.club',
        sequenceStep: 0,
        status: 'To Contact',
    },
    {
        id: 'mockInfluencers2',
        name: 'Brendan',
        email: 'brendan@relay.club',
        sequenceStep: 0,
        status: 'To Contact',
    },
    { id: 'mockInfluencers3', name: 'Tech Account', email: 'tech@relay.club', sequenceStep: 0, status: 'To Contact' },
];

export type SequenceStep = {
    id: string;
    name: string;
    waitTimeHrs: number;
    html: string;
};

export const mockSequenceEmail1: SequenceStep = {
    id: 'mockSequenceEmail1',
    name: 'Brendan',
    waitTimeHrs: 0,
    html: `
    <p>Hi {{name}},</p>
    <p>My name is Brendan and I'm the founder of Relay. I'm reaching out because I saw your instagram and think we could cooperate. Check out our website at <a href="https://relay.club">relay.club</a> and let me know if you're interested.</p>
    <p>Thanks,</p>
    <p>Brendan</p>
`,
};
export const mockSequenceEmail2: SequenceStep = {
    id: 'mockSequenceEmail2',
    name: 'Brendan',
    // waitTimeHrs: 3 * 24,
    waitTimeHrs: 1,
    html: `
    <p>Hi {{name}},</p>
    <p>Just following up on my last email. I'm the founder of Relay. I'm reaching out because I saw your instagram and think we could cooperate. Check out our website at <a href="https://relay.club">relay.club</a> and let me know if you're interested.</p>
    <p>Thanks,</p>
    <p>Brendan</p>
`,
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
