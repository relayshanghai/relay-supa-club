import { Layout } from '../layout';
import SequenceTable from './sequence-table';
import { testAccount } from 'src/utils/api/email-engine/prototype-mocks';
import { Button } from '../button';

import { clientLogger } from 'src/utils/logger-client';
import { SequenceStats } from './sequence-stats';
import { useUser } from 'src/hooks/use-user';
import { useCompany } from 'src/hooks/use-company';
import { useSequences } from 'src/hooks/use-sequences';
import { useSequenceInfluencers } from 'src/hooks/use-sequence_influencers';
import { useSequence } from 'src/hooks/use-sequence';

export const SequencesPage = () => {
    const { profile } = useUser();
    const { company } = useCompany();
    const { sequences } = useSequences();
    const { sequence, sendSequence } = useSequence(sequences?.[0]?.id);
    const { sequenceInfluencers } = useSequenceInfluencers(sequence?.id);

    const handleStartSequence = async () => {
        // update sequence - autostart - true.
        const allResults = [];
        if (!sequenceInfluencers) {
            return;
        }
        for (const influencer of sequenceInfluencers) {
            const params = {
                companyName: company?.name ?? '',
                outreachPersonName: profile?.first_name ?? '',
            };
            const results = await sendSequence(testAccount, influencer, params);
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
                {sequenceInfluencers && <SequenceTable sequenceInfluencers={sequenceInfluencers} />}
            </div>
        </Layout>
    );
};
