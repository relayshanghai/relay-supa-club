import type { Sequence, SequenceInfluencer } from 'src/utils/api/email-engine/prototype-mocks';
import { mockInfluencers, mockSequence, testAccount } from 'src/utils/api/email-engine/prototype-mocks';
import { Layout } from '../layout';
import SequenceTable from './sequence-table';
import { Button } from '../button';
import type { SendEmailPostRequestBody } from 'pages/api/email-engine/send-email';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import { useUser } from 'src/hooks/use-user';
import { useCompany } from 'src/hooks/use-company';

const sendEmail = async (
    account: string,
    toEmail: string,
    template: string,
    sendAt: string,
    params: Record<string, string>,
) => {
    try {
        const body: SendEmailPostRequestBody = {
            account,
            to: [{ address: toEmail }],
            subject: 'testing Email Sequence',
            template,
            render: {
                format: 'html',
                params,
            },
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
/** TODO: move 'send sequence' to the sever, because the emails need to be sent sequentially, not in parallel, so if the user navigates away it could cause some emails to be unsent. */
const sendSequence = async (
    account: string,
    sequence: Sequence,
    influencer: SequenceInfluencer,
    params: Record<string, string>,
) => {
    const results = [];
    for (const step of sequence.steps) {
        const sendAt = new Date();
        //add the step's waitTimeHrs to the sendAt date
        sendAt.setHours(sendAt.getHours() + step.waitTimeHrs);
        const { templateId } = step;
        const res = await sendEmail(account, influencer.email, templateId, sendAt.toISOString(), params);
        results.push({
            ...res,
            ...influencer,
            sendAt,
        });
    }
    return results;
};
export const SequencesPage = () => {
    const { profile } = useUser();
    const { company } = useCompany();
    const sequence = mockSequence;
    const influencers = mockInfluencers;

    const handleStartSequence = async () => {
        const allResults = [];
        for (const influencer of influencers) {
            const params = {
                companyName: company?.name ?? '',
                outreachPersonName: profile?.first_name ?? '',
                channel: influencer.channel,
                platform: influencer.platform,
            };
            const results = await sendSequence(testAccount, sequence, influencer, params);
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
