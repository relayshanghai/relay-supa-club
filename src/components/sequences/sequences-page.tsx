import { Layout } from '../layout';
import SequenceTable from './sequence-table';
import { testAccount } from 'src/utils/api/email-engine/prototype-mocks';
import { Button } from '../button';

import { clientLogger } from 'src/utils/logger-client';
import { SequenceStats } from './sequence-stats';
import { useUser } from 'src/hooks/use-user';
import { useCompany } from 'src/hooks/use-company';
import { useSequences } from 'src/hooks/use-sequences';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import { useSequence } from 'src/hooks/use-sequence';

import { Spinner } from '../icons';
import { useSequenceEmails } from 'src/hooks/use-sequence-emails';

export const SequencesPage = () => {
    const { profile } = useUser();
    const { company } = useCompany();
    const { sequences } = useSequences(); // later we won't use this, the sequence id will be passed down from the index page.
    const { sequence, sendSequence, sequenceSteps } = useSequence(sequences?.[0]?.id);
    const { sequenceInfluencers, updateSequenceInfluencer } = useSequenceInfluencers(sequence?.id);
    const { sequenceEmails: allSequenceEmails, updateSequenceEmail } = useSequenceEmails(sequence?.id);

    const handleStartSequence = async () => {
        // update sequence - autostart - true.
        const allResults = [];
        if (!sequenceInfluencers || !sequenceSteps) {
            return;
        }
        for (const sequenceInfluencer of sequenceInfluencers) {
            const sequenceEmails = allSequenceEmails?.filter(
                (email) => email.sequence_influencer_id === sequenceInfluencer.id,
            );
            if (!sequenceEmails) {
                allResults.push('no email for sequenceInfluencer: ' + sequenceInfluencer.id);
                continue;
            }
            const params = {
                companyName: company?.name ?? '',
                outreachPersonName: profile?.first_name ?? '',
            };
            const results = await sendSequence({
                account: testAccount,
                sequenceInfluencer,
                sequenceEmails,
                params,
                sequenceSteps,
                updateSequenceEmail,
                updateSequenceInfluencer,
            });
            allResults.push(results);
        }
        clientLogger(allResults);
    };
    return (
        <Layout>
            <div className="flex flex-col space-x-4 space-y-4 p-4">
                <SequenceStats />
                <Button onClick={handleStartSequence} className="w-fit self-end">
                    Start
                    {/* If autostart=== true... started */}
                </Button>
                {sequenceInfluencers && sequenceSteps ? (
                    <SequenceTable
                        sequenceInfluencers={sequenceInfluencers}
                        allSequenceEmails={allSequenceEmails}
                        sequenceSteps={sequenceSteps}
                    />
                ) : (
                    <Spinner className="mx-auto mt-10 h-10 w-10 fill-primary-600 text-white" />
                )}
            </div>
        </Layout>
    );
};
