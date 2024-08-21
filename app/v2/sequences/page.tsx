'use client';
import { useTranslation } from 'react-i18next';
import { useSequence, useSequences } from 'src/hooks/v2/use-sequences';
import { useEffect, useState } from 'react';
import SequenceTable from './components/sequence-table/sequence-table';
import { Button } from 'app/components/buttons';
import { CreateVariableModal } from './components/modals/email-template-variable-modal';
import { EmailTemplateModal } from './components/modals/email-template-modal';
import { CampaignWizardModal } from './components/modals/campaign-wizard-modal';
import { calculateSequenceInfo } from 'app/utils/rate-info';
import SummaryCard from './components/sequence-summary/summary-card';
import { Banner } from 'app/components/banner';
import { useNewCRMPage } from 'src/hooks/use-new-pages';
import { useDriverV2 } from 'src/hooks/use-driver-v2';
import {
    campaignWizardStep1,
    campaignWizardStep2,
    campaignWizardStep3,
    crmGuide,
    templateLibraryModal,
    templateLibraryWizardStep1,
    templateLibraryWizardStep2,
    templateVariableModal,
} from 'src/guides/crm-v2.guide';
import { useOutreachTemplateVariable } from 'src/hooks/use-outreach-template-variable';

export default function SequencePageV2() {
    const { t } = useTranslation();
    const { getAllSequences, loading, info, sequences, page, size, totalPages, setPage } = useSequences();
    const { setIsEdit, setTemplateVariable } = useOutreachTemplateVariable();
    const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);
    const [showVariableModal, setShowVariableModal] = useState(false);
    const [showTemplateLibraryModal, setShowTemplateLibraryModal] = useState(false);
    const total = info.total;
    const { bouncedRate, openRate, replyRate } = calculateSequenceInfo(info);
    const { setDefaultPage } = useNewCRMPage();
    const { setEditMode } = useSequence();

    useEffect(() => {
        if (sequences.length === 0) {
            getAllSequences();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { setGuides, startTour, guidesReady } = useDriverV2();

    useEffect(() => {
        setGuides({
            crmV2: crmGuide,
            templateVariableModal: templateVariableModal,
            templateLibraryModal: templateLibraryModal,
            templateLibraryWizardStep1: templateLibraryWizardStep1,
            templateLibraryWizardStep2: templateLibraryWizardStep2,
            campaignWizardStep1: campaignWizardStep1,
            campaignWizardStep2: campaignWizardStep2,
            campaignWizardStep3: campaignWizardStep3,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (guidesReady) {
            startTour('crmV2', false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guidesReady]);

    return (
        <>
            <CampaignWizardModal
                showCreateCampaignModal={showCreateCampaignModal}
                setShowCreateCampaignModal={setShowCreateCampaignModal}
            />
            <CreateVariableModal modalOpen={showVariableModal} setModalOpen={(open) => setShowVariableModal(open)} />
            <EmailTemplateModal
                modalOpen={showTemplateLibraryModal}
                setModalOpen={(open) => setShowTemplateLibraryModal(open)}
            />
            <Banner
                show={true}
                buttonText={t('outreaches.banner.button') ?? ''}
                buttonLink="/sequences"
                title={t('outreaches.banner.title')}
                message={t('outreaches.banner.description')}
                onButtonClicked={() => setDefaultPage(`/sequences`)}
            />
            <div
                className="inline-flex w-full flex-col items-start justify-start gap-8 px-8 pb-4 pt-8"
                id="v2-crm-page"
            >
                <div className="flex shrink grow basis-0 flex-col items-start justify-start gap-8 self-stretch">
                    <div className="flex flex-col items-start justify-start gap-8 self-stretch">
                        <div className="flex flex-col items-start justify-start gap-3 self-stretch">
                            <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                                <div className="inline-flex items-center justify-between self-stretch">
                                    <div className="flex items-start justify-start">
                                        <div className="flex items-center justify-start gap-1">
                                            <div className="font-['Poppins'] text-3xl font-semibold tracking-tight text-gray-600">
                                                {t('campaigns.index.title')}
                                            </div>
                                        </div>
                                        <div className="relative h-3 w-3" />
                                    </div>

                                    <div className="flex h-[42px] flex-row gap-2">
                                        <Button
                                            variant="secondary"
                                            onClick={() => setShowTemplateLibraryModal(true)}
                                            className="flex items-center"
                                            data-testid="template-library-button"
                                            id="template-library-button"
                                        >
                                            {t('outreaches.templateLibrary')}
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                setShowVariableModal(true);
                                                setIsEdit(false);
                                                setTemplateVariable(null);
                                            }}
                                            className="flex items-center"
                                            data-testid="template-variable-button"
                                            id="template-variable-button"
                                        >
                                            {t('outreaches.addTemplateVariables')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="inline-flex items-start justify-start gap-6 self-stretch">
                            <SummaryCard
                                loading={loading}
                                tracking={total.toFixed()}
                                title={t('sequences.totalInfluencers')}
                            />
                            <SummaryCard
                                loading={loading}
                                tracking={openRate.toFixed(2) + '%'}
                                title={t('sequences.openRate')}
                            />
                            <SummaryCard
                                loading={loading}
                                tracking={replyRate.toFixed(2) + '%'}
                                title={t('sequences.replyRate')}
                            />
                            <SummaryCard
                                loading={loading}
                                tracking={bouncedRate.toFixed(2) + '%'}
                                title={t('sequences.bounceRate')}
                            />
                        </div>
                    </div>
                    <div className="flex w-full items-start justify-end gap-4">
                        <Button
                            onClick={() => {
                                setEditMode(false);
                                setShowCreateCampaignModal(true);
                            }}
                            variant="ghost"
                            className="flex items-center !bg-blue-50"
                            data-testid="create-campaign-button"
                            id="create-campaign-button"
                        >
                            <p className="self-center text-blue-600">{t('outreaches.createNewCampaign')}</p>
                        </Button>
                    </div>
                    <div className="flex shrink grow basis-0 flex-col items-start justify-start self-stretch">
                        <SequenceTable
                            loading={loading}
                            items={sequences}
                            page={page}
                            size={size}
                            totalPages={totalPages}
                            onPageChange={(page) => setPage(page)}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
