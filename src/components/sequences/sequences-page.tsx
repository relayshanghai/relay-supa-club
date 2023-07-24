import type { Sequence, SequenceInfluencer } from 'src/utils/api/email-engine/prototype-mocks';
import { mockInfluencers, mockSequence, testAccount } from 'src/utils/api/email-engine/prototype-mocks';
import { Layout } from '../layout';
import SequenceTable from './sequence-table';
import { Button } from '../button';
import type { SendEmailPostRequestBody } from 'pages/api/email-engine/send-email';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';

const sendEmail = async (account: string, toEmail: string, html: string, sendAt: string) => {
    try {
        const body: SendEmailPostRequestBody = {
            account,
            to: [{ address: toEmail }],
            subject: 'testing Email Sequence',
            html,
            trackingEnabled: true,
            sendAt,
        };
        return await nextFetch('email-engine/send-email', {
            method: 'POST',
            body,
        });
    } catch (error: any) {
        clientLogger(error, 'error');
        return error.message;
    }
};

const sendSequence = async (account: string, sequence: Sequence, influencer: SequenceInfluencer) => {
    const results = [];
    for (const step of sequence.steps) {
        const sendAt = new Date();
        //add the step's waitTimeHrs to the sendAt date
        sendAt.setHours(sendAt.getHours() + step.waitTimeHrs);
        const { html } = step;
        const res = await sendEmail(account, influencer.email, html, sendAt.toISOString());
        results.push({
            ...res,
            ...influencer,
            sendAt,
        });
    }
    return results;
};
export const SequencesPage = () => {
    const sequence = mockSequence;
    const influencers = mockInfluencers;

    const handleStartSequence = async () => {
        const allResults = [];
        for (const influencer of influencers) {
            const results = await sendSequence(testAccount, sequence, influencer);
            allResults.push(results);
        }
        clientLogger(allResults);
    };

    return (
        <Layout>
            <div className="space-x-4 space-y-4 p-4">
                <h1 className="text-lg font-bold">{sequence.name}</h1>
                <Button onClick={handleStartSequence}>Start</Button>
                <SequenceTable influencers={influencers} />
            </div>
        </Layout>
    );
};
