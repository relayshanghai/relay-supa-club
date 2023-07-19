export interface SequenceInfluencer {
    id: string;
    name: string;
    email: string;
    /** 0 means not sent. 1 means first step sent, awaiting 2. */
    sequenceStep: number;
    /** Will basically follow the campaign influencers status' */
    status: string;
}

export const GMAIL_INBOX = 'INBOX';

export const testAccount = 'gprtldm3xqb0424p'; // brendan.relay@gmail.com

export const mockInfluencers: SequenceInfluencer[] = [
    {
        id: '1',
        name: 'Jacob',
        email: 'jacob@relay.club',
        sequenceStep: 0,
        status: 'To Contact',
    },
    {
        id: '2',
        name: 'Brendan',
        email: 'brendan@relay.club',
        sequenceStep: 0,
        status: 'To Contact',
    },
    { id: '3', name: 'Tech Account', email: 'tech@relay.club', sequenceStep: 0, status: 'To Contact' },
];
