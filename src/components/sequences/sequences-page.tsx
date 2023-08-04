import { Layout } from '../layout';
import SequenceTable from './sequence-table';
import { testAccount } from 'src/utils/api/email-engine/prototype-mocks';

import { clientLogger } from 'src/utils/logger-client';
import { SequenceStats } from './sequence-stats';
import { useUser } from 'src/hooks/use-user';
import { useCompany } from 'src/hooks/use-company';
import { useSequences } from 'src/hooks/use-sequences';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import { useSequence } from 'src/hooks/use-sequence';

import { Brackets, Spinner } from '../icons';
import { useSequenceEmails } from 'src/hooks/use-sequence-emails';
import { Switch } from '../library';
import { Button } from '../button';
import { useState } from 'react';
import { TemplateVariablesModal } from './template-variables-modal';

export const SequencesPage = () => {
    const { profile } = useUser();
    const { company } = useCompany();
    const { sequences } = useSequences(); // later we won't use this, the sequence id will be passed down from the index page.
    const { sequence, sendSequence, sequenceSteps, updateSequence } = useSequence(sequences?.[0]?.id);
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

    const handleAutostartToggle = async (checked: boolean) => {
        if (!sequence) {
            return;
        }
        await updateSequence({ id: sequence.id, auto_start: checked });
        if (checked) {
            // TODO: This is not the final logic
            await handleStartSequence();
        }
    };

    const [showUpdateTemplateVariables, setShowUpdateTemplateVariables] = useState(false);
    const handleOpenUpdateTemplateVariables = () => {
        setShowUpdateTemplateVariables(true);
    };

    return (
        <Layout>
            <TemplateVariablesModal
                visible={showUpdateTemplateVariables}
                onClose={() => setShowUpdateTemplateVariables(false)}
            />
            <div className="flex flex-col space-y-4 p-4">
                <div className="flex w-full">
                    <h1 className="mr-4 self-center text-2xl font-semibold text-gray-800">{sequence?.name}</h1>
                    <Switch
                        checked={sequence?.auto_start ?? false}
                        afterLabel="Auto-start"
                        onChange={(e) => {
                            handleAutostartToggle(e.target.checked);
                        }}
                    />
                    <Button onClick={handleOpenUpdateTemplateVariables} variant="secondary" className="ml-auto flex">
                        <Brackets className="mr-2" />
                        <p className="self-center">Update template variables</p>
                    </Button>
                </div>
                <SequenceStats />

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
