/* eslint-disable complexity */
import { useTranslation } from 'react-i18next';
import { useSequences } from 'src/hooks/use-sequences';
import { useState } from 'react';
import { Layout } from '../layout';
import { Plus } from '../icons';
import { Button } from '../button';
import { SequenceStats } from './sequence-stats';
import { CreateSequenceModal } from './create-sequence-modal';
import SequencesTable from './sequences-table';
import type { SequenceEmail } from 'src/utils/api/db';

export const SequencesPage = () => {
    const { t } = useTranslation();
    const { sequences, allSequenceInfluencersByCompanyId } = useSequences();
    const [showCreateSequenceModal, setShowCreateSequenceModal] = useState<boolean>(false);
    const [allEmails, setAllEmails] = useState<SequenceEmail[] | []>([]);

    const { profile } = useUser();
    const { company } = useCompany();
    const { sequences } = useSequences(); // later we won't use this, the sequence id will be passed down from the index page.
    const { sequence, sendSequence, sequenceSteps, updateSequence } = useSequence(sequences?.[0]?.id);
    const { sequenceInfluencers, updateSequenceInfluencer } = useSequenceInfluencers(sequence && [sequence.id]);
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
    const handleOpenCreateSequenceModal = () => {
        setShowCreateSequenceModal(true);
    };

    return (
        <Layout>
            <CreateSequenceModal
                title={t('sequences.sequenceModal') as string}
                showCreateSequenceModal={showCreateSequenceModal}
                setShowCreateSequenceModal={setShowCreateSequenceModal}
            />
            <div className="flex flex-col space-y-4 p-4">
                <div className="flex w-full">
                    <h1 className="mr-4 self-center text-2xl font-semibold text-gray-800">
                        {t('sequences.sequences')}
                    </h1>

                    <Button onClick={handleOpenCreateSequenceModal} className="ml-auto flex">
                        <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
                        <p className="self-center">{t('sequences.newSequence')}</p>
                    </Button>
                </div>
                <SequenceStats
                    totalInfluencers={allSequenceInfluencersByCompanyId?.length || 0}
                    openRate={
                        (allEmails?.filter(
                            (email) =>
                                email.email_tracking_status === 'Link Clicked' ||
                                email.email_tracking_status === 'Opened',
                        ).length || 0) / (allEmails?.length || 0)
                    }
                    replyRate={
                        (allEmails?.filter((email) => email.email_delivery_status === 'Replied').length || 0) /
                        (allEmails?.length || 0)
                    }
                    bounceRate={
                        (allEmails?.filter((email) => email.email_delivery_status === 'Bounced').length || 0) /
                        (allEmails?.length || 0)
                    }
                />

                <SequencesTable sequences={sequences} setAllEmails={setAllEmails} />
            </div>
        </Layout>
    );
};
