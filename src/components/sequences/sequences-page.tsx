/* eslint-disable complexity */
import { useTranslation } from 'react-i18next';
import { useSequences } from 'src/hooks/use-sequences';
import { useState } from 'react';
import { Layout } from '../layout';
import { Plus } from '../icons';
import { Button } from '../button';
// import { SequenceStats } from './sequence-stats';
// import { useSequenceEmails } from 'src/hooks/use-sequence-emails';
import { CreateSequenceModal } from './create-sequence-modal';
import SequencesTable from './sequences-table';

export const SequencesPage = () => {
    const { t } = useTranslation();
    const { sequences } = useSequences();
    // const { allSequenceInfluencersByCompanyId } = useSequences();
    // const { sequenceEmails: allSequenceEmails } = useSequenceEmails(sequence?.id);
    const [showCreateSequenceModal, setShowCreateSequenceModal] = useState<boolean>(false);

    const handleOpenCreateSequenceModal = () => {
        setShowCreateSequenceModal(true);
    };

    // TODO: get all sequenceEmails from all sequences.

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
                {/* TODO: update the sequenceStats component with real data */}
                {/* <SequenceStats
                    totalInfluencers={allSequenceInfluencersByCompanyId?.length || 0}
                    openRate={
                        (allSequenceEmails?.filter(
                            (email) =>
                                email.email_tracking_status === 'Link Clicked' ||
                                email.email_tracking_status === 'Opened',
                        ).length || 1) / (allSequenceEmails?.length || 1)
                    }
                    replyRate={
                        (allSequenceEmails?.filter((email) => email.email_delivery_status === 'Replied').length || 1) /
                        (allSequenceEmails?.length || 1)
                    }
                    bounceRate={
                        (allSequenceEmails?.filter((email) => email.email_delivery_status === 'Bounced').length || 1) /
                        (allSequenceEmails?.length || 1)
                    }
                /> */}

                <SequencesTable sequences={sequences} />
            </div>
        </Layout>
    );
};
