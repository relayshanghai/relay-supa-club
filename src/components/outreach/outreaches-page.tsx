/* eslint-disable complexity */
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAllSequenceInfluencersCountByCompany } from 'src/hooks/use-all-sequence-influencers-by-company-id';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { useSequenceEmails } from 'src/hooks/use-sequence-emails';
import { useSequences } from 'src/hooks/use-sequences';
import { toast } from 'react-hot-toast';
import { clientLogger } from 'src/utils/logger-client';
import { ClickNeedHelp } from 'src/utils/analytics/events';
import { Button } from '../button';
import { DeleteOutline } from '../icons';
import { Layout } from '../layout';
import { CreateCampaignModal } from './create-campaign-modal';
import { SequenceStats } from './sequence-stats';
import SequencesTable from './outreaches-table';
import { useSequence } from 'src/hooks/use-sequence';
import { DeleteSequenceModal } from '../modal-delete-sequence';
import { DeleteSequence } from 'src/utils/analytics/events/outreach/sequence-delete';
import { Banner } from '../library/banner';
import { useUser } from 'src/hooks/use-user';
import { calculateReplyRate } from './helpers';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';

export const OutreachesPage = () => {
    const { t } = useTranslation();
    const { sequences, refreshSequences } = useSequences({ filterDeleted: true });
    const { deleteSequence } = useSequence();
    const { allSequenceInfluencersCount } = useAllSequenceInfluencersCountByCompany();
    const { sequenceInfluencers } = useSequenceInfluencers(sequences?.map((sequence) => sequence.id) || []);
    const { profile } = useUser();
    const { allSequenceEmails } = useSequenceEmails();
    const { track } = useRudderstackTrack();

    const [showCreateCampaignModal, setShowCreateCampaignModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selection, setSelection] = useState<string[]>([]);
    const [, setShowNeedHelp] = useState<boolean>(false);

    const handleOpenCreateSequenceModal = () => {
        setShowCreateCampaignModal(true);
    };

    const handleDeleteSequence = async () => {
        try {
            setSelection([]);
            await deleteSequence(selection);
            toast.success(t('outreaches.deleteSuccess'));
            track(DeleteSequence, { sequence_id: selection[0], total_influencers: allSequenceInfluencersCount });
        } catch (error) {
            toast.error(t('outreaches.deleteFail'));
            clientLogger(error, 'error');
        }
        refreshSequences(sequences?.filter((sequence) => !selection.includes(sequence.id)));
    };

    const replyRate = useMemo(
        () => calculateReplyRate(sequenceInfluencers, allSequenceEmails),
        [sequenceInfluencers, allSequenceEmails],
    );

    return (
        <Layout>
            {!profile?.email_engine_account_id && (
                <Banner
                    buttonText={t('banner.button') ?? ''}
                    title={t('banner.outreach.title')}
                    message={t('banner.outreach.descriptionSequences')}
                />
            )}
            <DeleteSequenceModal
                show={showDeleteModal}
                setShow={setShowDeleteModal}
                handleDelete={handleDeleteSequence}
            />
            <CreateCampaignModal
                title={t('outreaches.sequenceModal') as string}
                showCreateCampaignModal={showCreateCampaignModal}
                setShowCreateCampaignModal={setShowCreateCampaignModal}
            />
            <div className=" mx-6 flex flex-col space-y-4 py-6">
                <div className="flex w-full justify-between">
                    <div className="mb-6 md:w-1/2">
                        <h1
                            className="mr-4 self-center text-3xl font-semibold text-gray-800"
                            data-testid="outreach-text"
                        >
                            {t('outreaches.outreaches')}
                        </h1>
                    </div>
                    <div>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowNeedHelp(true);
                                track(ClickNeedHelp);
                            }}
                            className="flex items-center"
                            data-testid="template-library-button"
                        >
                            {t('outreaches.templateLibrary')}
                        </Button>
                    </div>
                </div>
                <SequenceStats
                    totalInfluencers={allSequenceInfluencersCount}
                    openRate={
                        ((allSequenceEmails &&
                            allSequenceEmails?.length > 0 &&
                            allSequenceEmails?.filter(
                                (email) =>
                                    email.email_tracking_status === 'Link Clicked' ||
                                    email.email_tracking_status === 'Opened',
                            ).length) ||
                            0) / (allSequenceEmails?.length || 1)
                    }
                    replyRate={replyRate}
                    bounceRate={
                        ((allSequenceEmails &&
                            allSequenceEmails.length > 0 &&
                            allSequenceEmails?.filter((email) => email.email_delivery_status === 'Bounced').length) ||
                            0) / (allSequenceEmails?.length || 1)
                    }
                />
                <div className="flex w-full justify-end gap-4">
                    <button
                        data-testid="delete-sequences-button"
                        className={`h-fit ${
                            selection.length === 0 && 'hidden'
                        } w-fit cursor-pointer rounded-md border border-red-100 p-[10px]`}
                        onClick={() => {
                            if (selection.length === 0) return;
                            setShowDeleteModal(true);
                        }}
                    >
                        <DeleteOutline className="h-4 w-4 stroke-red-500" />
                    </button>
                    <Button
                        onClick={handleOpenCreateSequenceModal}
                        variant="ghost"
                        className="flex items-center !bg-blue-50"
                        data-testid="create-campaign-button"
                    >
                        <p className="self-center text-blue-600">{t('outreaches.createNewCampaign')}</p>
                    </Button>
                </div>

                <SequencesTable sequences={sequences} selection={selection} setSelection={setSelection} />
            </div>
        </Layout>
    );
};
