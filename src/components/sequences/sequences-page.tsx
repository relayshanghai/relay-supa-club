/* eslint-disable complexity */
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAllSequenceInfluencersCountByCompany } from 'src/hooks/use-all-sequence-influencers-by-company-id';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { useSequenceEmails } from 'src/hooks/use-sequence-emails';
import { useSequences } from 'src/hooks/use-sequences';
import { toast } from 'react-hot-toast';
import { clientLogger } from 'src/utils/logger-client';
import { ClickNeedHelp } from 'src/utils/analytics/events';
import { Button } from '../button';
import { DeleteOutline, Plus, Question } from '../icons';
import { Layout } from '../layout';
import { CreateSequenceModal } from './create-sequence-modal';
import { SequenceStats } from './sequence-stats';
import SequencesTable from './sequences-table';
import { FaqModal } from '../library';
import faq from 'i18n/en/faq';
import { useRouter } from 'next/router';
import { useSequence } from 'src/hooks/use-sequence';
import { DeleteSequenceModal } from '../modal-delete-sequence';
import { DeleteSequence } from 'src/utils/analytics/events/outreach/sequence-delete';
import { Banner } from '../library/banner';
import { useUser } from 'src/hooks/use-user';
import { calculateReplyRate } from './helpers';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import { crmGuide } from 'src/guides/crm.guide';
import { useDriverV2 } from 'src/hooks/use-driver-v2';
import { Banner as BannerV2 } from 'app/components/banner';
import { useNewCRMPage } from 'src/hooks/use-new-pages';

export const SequencesPage = () => {
    const { t } = useTranslation();
    const { sequences, refreshSequences } = useSequences({ filterDeleted: true });
    const { deleteSequence } = useSequence();
    const { allSequenceInfluencersCount } = useAllSequenceInfluencersCountByCompany();
    const { sequenceInfluencers } = useSequenceInfluencers(sequences?.map((sequence) => sequence.id) || []);

    const { allSequenceEmails } = useSequenceEmails();
    const [showCreateSequenceModal, setShowCreateSequenceModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selection, setSelection] = useState<string[]>([]);
    const { profile } = useUser();
    const { setDefaultPage } = useNewCRMPage();

    const { push } = useRouter();

    const handleOpenCreateSequenceModal = () => {
        setShowCreateSequenceModal(true);
    };

    const { track } = useRudderstackTrack();

    const handleDeleteSequence = async () => {
        try {
            setSelection([]);
            await deleteSequence(selection);
            toast.success(t('sequences.deleteSuccess'));
            track(DeleteSequence, { sequence_id: selection[0], total_influencers: allSequenceInfluencersCount });
        } catch (error) {
            toast.error(t('sequences.deleteFail'));
            clientLogger(error, 'error');
        }
        refreshSequences(sequences?.filter((sequence) => !selection.includes(sequence.id)));
    };

    const [showNeedHelp, setShowNeedHelp] = useState<boolean>(false);

    const replyRate = useMemo(
        () => calculateReplyRate(sequenceInfluencers, allSequenceEmails),
        [sequenceInfluencers, allSequenceEmails],
    );

    const { setGuides, startTour, guidesReady } = useDriverV2();

    useEffect(() => {
        setGuides({
            crm: crmGuide,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (guidesReady) {
            startTour('crm');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guidesReady]);

    return (
        <Layout>
            {!profile?.email_engine_account_id && (
                <Banner
                    buttonText={t('banner.button') ?? ''}
                    title={t('banner.outreach.title')}
                    message={t('banner.outreach.descriptionSequences')}
                />
            )}
            <BannerV2
                show={true}
                buttonText={t('outreaches.oldBanner.button') ?? ''}
                buttonLink="/v2/sequences"
                title={t('outreaches.oldBanner.title')}
                message={t('outreaches.oldBanner.description')}
                onButtonClicked={() => setDefaultPage(`/v2/sequences`)}
            />
            <DeleteSequenceModal
                show={showDeleteModal}
                setShow={setShowDeleteModal}
                handleDelete={handleDeleteSequence}
            />
            <FaqModal
                title={t('faq.sequencesTitle')}
                visible={showNeedHelp}
                onClose={() => setShowNeedHelp(false)}
                content={faq.sequences.map((_, i) => ({
                    title: t(`faq.sequences.${i}.title`),
                    detail: t(`faq.sequences.${i}.detail`),
                }))}
                getMoreInfoButtonText={t('faq.sequencesGetMoreInfo') || ''}
                getMoreInfoButtonAction={() => push('/guide')}
                source="Sequences"
            />
            <CreateSequenceModal
                title={t('sequences.sequenceModal') as string}
                showCreateSequenceModal={showCreateSequenceModal}
                setShowCreateSequenceModal={setShowCreateSequenceModal}
            />
            <div className=" mx-6 flex flex-col space-y-4 py-6">
                <div className="flex w-full justify-between">
                    <div className="md:w-1/2">
                        <h1 className="mr-4 self-center text-3xl font-semibold text-gray-800">
                            {t('sequences.sequences')}
                        </h1>
                        <h2 className="mt-2 text-gray-500">{t('sequences.subtitle')}</h2>
                    </div>
                    <div>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setShowNeedHelp(true);
                                track(ClickNeedHelp);
                            }}
                            className="flex items-center"
                        >
                            {t('website.needHelp')}
                            <Question className="ml-2 h-6 w-6" />
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
                        className="flex items-center"
                        id="crm-new-sequence-button"
                    >
                        <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
                        <p className="self-center">{t('sequences.newSequence')}</p>
                    </Button>
                </div>

                <SequencesTable sequences={sequences} selection={selection} setSelection={setSelection} />
            </div>
        </Layout>
    );
};
