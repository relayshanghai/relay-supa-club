/* eslint-disable complexity */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAllSequenceInfluencersCountByCompany } from 'src/hooks/use-all-sequence-influencers-by-company-id';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { useSequenceEmails } from 'src/hooks/use-sequence-emails';
import { useSequences } from 'src/hooks/use-sequences';
import { OpenSequencesPage } from 'src/utils/analytics/events';
import { Button } from '../button';
import { Plus, Question } from '../icons';
import { Layout } from '../layout';
import { CreateSequenceModal } from './create-sequence-modal';
import { SequenceStats } from './sequence-stats';
import SequencesTable from './sequences-table';
import { FaqModal } from '../library';
import faq from 'i18n/en/faq';
import { useRouter } from 'next/router';

export const SequencesPage = () => {
    const { t } = useTranslation();
    const { sequences } = useSequences();
    const { allSequenceInfluencersCount } = useAllSequenceInfluencersCountByCompany();
    const { allSequenceEmails } = useSequenceEmails();
    const [showCreateSequenceModal, setShowCreateSequenceModal] = useState<boolean>(false);
    const { push } = useRouter();

    const handleOpenCreateSequenceModal = () => {
        setShowCreateSequenceModal(true);
    };

    const { track } = useRudderstackTrack();

    useEffect(() => {
        const { abort } = track(OpenSequencesPage);
        return abort;
    }, [track]);
    const [showNeedHelp, setShowNeedHelp] = useState<boolean>(false);

    return (
        <Layout>
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
            />
            <CreateSequenceModal
                title={t('sequences.sequenceModal') as string}
                showCreateSequenceModal={showCreateSequenceModal}
                setShowCreateSequenceModal={setShowCreateSequenceModal}
            />
            <div className="flex flex-col space-y-4 p-6">
                <div className="flex w-full justify-between">
                    <div className="md:w-1/2 xl:w-1/3">
                        <h1 className="mr-4 self-center text-2xl font-semibold text-gray-800">
                            {t('sequences.sequences')}
                        </h1>
                        <h2 className="mt-2 text-gray-500">{t('sequences.subtitle')}</h2>
                    </div>
                    <div>
                        <Button variant="ghost" onClick={() => setShowNeedHelp(true)} className="flex items-center">
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
                    replyRate={
                        ((allSequenceEmails &&
                            allSequenceEmails.length > 0 &&
                            allSequenceEmails?.filter((email) => email.email_delivery_status === 'Replied').length) ||
                            0) / (allSequenceEmails?.length || 1)
                    }
                    bounceRate={
                        ((allSequenceEmails &&
                            allSequenceEmails.length > 0 &&
                            allSequenceEmails?.filter((email) => email.email_delivery_status === 'Bounced').length) ||
                            0) / (allSequenceEmails?.length || 1)
                    }
                />
                <div className="flex w-full justify-end">
                    <Button onClick={handleOpenCreateSequenceModal} className="flex items-center">
                        <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
                        <p className="self-center">{t('sequences.newSequence')}</p>
                    </Button>
                </div>
                <SequencesTable sequences={sequences} />
            </div>
        </Layout>
    );
};
