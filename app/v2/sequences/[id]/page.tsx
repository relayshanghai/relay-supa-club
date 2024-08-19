'use client';

import LightningIcon from 'app/components/icons/lightning';
import ToolsIcon from 'app/components/icons/tools';
import { useTranslation } from 'react-i18next';
import { useSequence, useSequenceDetail } from 'src/hooks/v2/use-sequences';
import SummaryCard from '../components/sequence-summary/summary-card';
import {
    EmailOpenOutline,
    MessageDotsCircleOutline,
    MessageXCircleOutline,
    Send,
    TeamOutline,
    Trashcan,
} from 'src/components/icons';
import { calculateSequenceInfo } from 'app/utils/rate-info';
import SequenceTabHeader from './components/sequence-tab-header/sequence-tab-header';
import { useEffect, useState } from 'react';
import SequenceInfluencerTableUnscheduled from './components/sequence-infuencer-table/sequence-influencer-table-unscheduled';
import { useSequenceInfluencer } from 'src/hooks/v2/use-sequence-influencer';
import { type SequenceInfluencerEntity } from 'src/backend/database/sequence/sequence-influencer-entity';
import toast from 'react-hot-toast';
import { CampaignWizardModal } from '../components/modals/campaign-wizard-modal';
import { type SequenceEntity } from 'src/backend/database/sequence/sequence-entity';
import { ConfirmModal } from 'app/components/confirmation/confirm-modal';
import { Banner } from 'app/components/banner';
import { useNewCRMPage } from 'src/hooks/use-new-pages';
import SequenceInfluencerTableScheduled from './components/sequence-infuencer-table/sequence-influencer-table-scheduled';
import SequenceInfluencerTableIgnored from './components/sequence-infuencer-table/sequence-influencer-table-ignored';
import SequenceInfluencerTableReplied from './components/sequence-infuencer-table/sequence-influencer-table-replied';
import ReportModal from './components/report-modal/report-modal';
import type { InfluencerSocialProfileEntity } from 'src/backend/database/influencer/influencer-social-profile-entity';
import { Tooltip } from 'app/components/tooltip';
import { useUserV2 } from 'src/hooks/v2/use-user';
import { ListVariableModal } from '../components/modals/email-template-variable-list-modal';

export interface SequenceDetailPageProps {
    params: {
        id: string;
    };
}

export default function SequenceDetailPage({ params: { id } }: Readonly<SequenceDetailPageProps>) {
    const { profile } = useUserV2();
    const { loading, sequence, info, scheduleEmails } = useSequenceDetail(id);
    const { setEditMode, setSequence } = useSequence();
    const [activeTab, setActiveTab] = useState('unscheduled');
    const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);
    const [showVariableModal, setShowVariableModal] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const { t } = useTranslation();
    const { bouncedRate, openRate, replyRate } = calculateSequenceInfo(info);
    const {
        page,
        size,
        setPage,
        loading: loadingInfluencers,
        data,
        setStatus,
        selectedInfluencers,
        setSelectedInfluencers,
        refreshSequenceInfluencer,
        deleteInfluencers,
    } = useSequenceInfluencer(id);
    const { setDefaultPage } = useNewCRMPage();
    const [selectedSocialProfile, setSelectedSocialProfile] = useState<InfluencerSocialProfileEntity>();
    useEffect(() => {
        if (activeTab === 'unscheduled') {
            setStatus('To Contact');
        } else if (activeTab === 'scheduledAndSent') {
            setStatus('In Sequence');
        } else if (activeTab === 'replied') {
            setStatus('Replied');
        } else if (activeTab === 'ignored') {
            setStatus('Ignored');
        }
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const handleSelectedInfluencers = (influencer: SequenceInfluencerEntity[]) => {
        setSelectedInfluencers(influencer);
    };

    const handleScheduleEmails = () => {
        if (selectedInfluencers.length < 1) {
            toast('Please select influencers to schedule emails');
            return;
        }
        scheduleEmails(selectedInfluencers)
            .then((res) => {
                toast.success(`${res?.data.length} emails scheduled!`);
                refreshSequenceInfluencer();
            })
            .catch(() => {
                toast.error('Failed to schedule emails');
            });
    };

    const handlerEditCampaignModal = () => {
        if (!sequence) return;
        setSequence({ ...sequence, id: sequence.id } as SequenceEntity);
        setEditMode(true);
        setShowCreateCampaignModal(true);
    };

    const handleDeleteInfluencer = () => {
        deleteInfluencers()
            .then(() => {
                toast.success('Success deleting influencers');
                refreshSequenceInfluencer();
            })
            .catch(() => {
                toast.error('Failed to deleting influencers');
            });
    };
    const [openReport, setOpenReport] = useState(false);

    const usingOldTemplate = (sequence?: SequenceEntity) => {
        const oldOutreach = process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID_OUTREACH;
        const oldfirstFollowuUpOutreach = process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID_1ST_FOLLOW_UP;
        const oldsecondFollowUpOutreach = process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID_2ND_FOLLOW_UP;
        const existingTemplates = sequence?.steps.map((d) => d.templateId);

        if (
            existingTemplates?.find((d) => d === oldOutreach) ||
            existingTemplates?.find((d) => d === oldfirstFollowuUpOutreach) ||
            existingTemplates?.find((d) => d === oldsecondFollowUpOutreach)
        ) {
            return true;
        }
        return false;
    };

    const isMissingSequenceSendEmail = !profile?.sequence_send_email || !profile?.email_engine_account_id;
    const isMissingVariables = sequence?.templateVariables?.some((v) => !v.value);
    const missingVariables = sequence?.templateVariables
        ?.filter((variable) => variable.required && !variable.value)
        .map((variable) => ` **${variable.name}** `) ?? ['Error retrieving variables'];
    const sequenceSendTooltipTitle = selectedInfluencers.some((i) => !i.influencerSocialProfile?.id)
        ? t('sequences.invalidSocialProfileTooltip')
        : selectedInfluencers.some((i) => !i.email)
        ? t('sequences.missingEmail')
        : isMissingSequenceSendEmail
        ? t('sequences.outreachPlanUpgradeTooltip')
        : isMissingVariables
        ? t('sequences.missingRequiredTemplateVariables')
        : t('sequences.sequenceSendTooltip');
    const sequenceSendTooltipDescription = selectedInfluencers.some((i) => !i.influencerSocialProfile?.id)
        ? t('sequences.invalidSocialProfileTooltipDescription')
        : selectedInfluencers.some((i) => !i.email)
        ? t('sequences.missingEmailTooltipDescription')
        : isMissingSequenceSendEmail
        ? t('sequences.outreachPlanUpgradeTooltipDescription')
        : isMissingVariables
        ? t('sequences.missingRequiredTemplateVariables_variables', {
              variables: missingVariables,
          })
        : t('sequences.sequenceBatchSendTooltipDescription');
    const sequenceSendTooltipHighlight = selectedInfluencers.some((i) => !i.influencerSocialProfile?.id)
        ? t('sequences.invalidSocialProfileTooltipHighlight')
        : undefined;

    return (
        <>
            {selectedSocialProfile && (
                <ReportModal
                    onClose={() => setOpenReport(false)}
                    influencerSocialProfiles={selectedSocialProfile}
                    open={openReport}
                />
            )}
            <CampaignWizardModal
                showCreateCampaignModal={showCreateCampaignModal}
                setShowCreateCampaignModal={setShowCreateCampaignModal}
            />
            <ListVariableModal modalOpen={showVariableModal} setModalOpen={(open) => setShowVariableModal(open)} />
            <ConfirmModal
                deleteHandler={() => handleDeleteInfluencer()}
                setShow={(show) => setOpenConfirmModal(show)}
                show={openConfirmModal}
            />
            <Banner
                show={true}
                buttonText={t('outreaches.banner.button') ?? ''}
                buttonLink={`/sequences/${id}`}
                title={t('outreaches.banner.title')}
                message={t('outreaches.banner.description')}
                onButtonClicked={() => setDefaultPage(`/sequences`)}
            />
            <div className="inline-flex w-full flex-col items-start justify-start gap-8 px-8 pb-4 pt-8">
                <div className="inline-flex h-[45px] w-full items-start justify-start gap-6">
                    <div className="flex h-[45px] shrink grow basis-0 items-center justify-start gap-6">
                        <div className="flex items-center justify-start gap-1">
                            <div className="font-['Poppins'] text-3xl font-semibold tracking-tight text-gray-600">
                                {sequence?.name}
                            </div>
                        </div>
                        <div className="flex items-start justify-start">
                            {/*
                    to do auto schedule toogle
                    <div className="justify-start items-start flex">
                    <div className="justify-start items-center gap-4 flex">
                    <div className="p-0.5 bg-violet-400 rounded-[999px] justify-start items-start flex">
                        <div className="w-6 h-6 rounded-[999px] shadow" />
                        <div className="w-6 h-6 bg-[#fefefe] rounded-[999px]" />
                    </div>
                    <div className="text-gray-500 text-sm font-semibold font-['Poppins'] leading-normal tracking-tight">Auto-schedule</div>
                    </div>
                </div> */}
                            <div className="relative h-3 w-3" />
                        </div>
                    </div>
                    <div className="flex items-start justify-end gap-6">
                        <button
                            className="flex items-center justify-start gap-2 rounded-md bg-[#eef5ff] px-5 py-2"
                            onClick={() => handlerEditCampaignModal()}
                        >
                            <ToolsIcon fill="none" />
                            <div className="text-center font-['Poppins'] text-sm font-medium leading-normal tracking-tight text-[#2970ff]">
                                {t('campaigns.show.editCampaign')}
                            </div>
                        </button>
                        <button
                            className="flex items-center justify-start gap-2 rounded-md border border-violet-600 bg-[#fefefe] px-5 py-2"
                            onClick={() => setShowVariableModal(true)}
                        >
                            <LightningIcon fill="none" />
                            <div className="text-center font-['Poppins'] text-sm font-medium leading-normal tracking-tight text-violet-600">
                                {t('sequences.updateVariables')}
                            </div>
                        </button>
                    </div>
                </div>
                <div className="inline-flex items-start justify-start gap-6 self-stretch">
                    <SummaryCard
                        icon={<TeamOutline className="text-violet-600" fill="none" />}
                        loading={loading}
                        tracking={info.total.toFixed()}
                        title={t('sequences.totalInfluencers')}
                    />
                    <SummaryCard
                        icon={<EmailOpenOutline className="text-violet-600" fill="none" />}
                        loading={loading}
                        tracking={openRate.toFixed(2) + '%'}
                        title={t('sequences.openRate')}
                    />
                    <SummaryCard
                        icon={<MessageDotsCircleOutline className="text-violet-600" fill="none" />}
                        loading={loading}
                        tracking={replyRate.toFixed(2) + '%'}
                        title={t('sequences.replyRate')}
                    />
                    <SummaryCard
                        icon={<MessageXCircleOutline className="text-violet-600" fill="none" />}
                        loading={loading}
                        tracking={bouncedRate.toFixed(2) + '%'}
                        title={t('sequences.bounceRate')}
                    />
                </div>
                {/* new */}
                <div className="inline-flex w-full items-end justify-between self-stretch">
                    <SequenceTabHeader
                        loading={loadingInfluencers}
                        ignored={info.ignored}
                        replied={info.replied}
                        scheduledAndSent={info.inSequence}
                        unscheduled={info.unscheduled}
                        tabChanged={setActiveTab}
                    />
                    <div className="flex items-start justify-start gap-8">
                        {selectedInfluencers.length > 0 && (
                            <button
                                className="flex items-center justify-center gap-1 rounded-md border border-red-500 bg-[rgb(254,254,254)] p-2.5"
                                onClick={() => setOpenConfirmModal(true)}
                            >
                                <Trashcan className="relatives h-5 w-5" fill="red" />
                            </button>
                        )}

                        <Tooltip
                            content={sequenceSendTooltipTitle}
                            detail={sequenceSendTooltipDescription}
                            highlight={sequenceSendTooltipHighlight}
                            position="bottom-left"
                        >
                            <button
                                className="flex items-center justify-center gap-2 rounded-md bg-[#f43d86] py-2.5 pl-3.5 pr-3 text-[#fefefe] disabled:cursor-not-allowed disabled:bg-[#f43d86] disabled:opacity-50"
                                onClick={() => handleScheduleEmails()}
                                disabled={
                                    isMissingSequenceSendEmail ||
                                    usingOldTemplate(sequence) ||
                                    selectedInfluencers.length === 0
                                }
                            >
                                <Send className="relative h-5 w-5" fill="white" />
                                <div className="text-center font-['Poppins'] text-sm font-medium leading-normal tracking-tight text-[#fefefe]">
                                    Schedule outreach emails
                                </div>
                            </button>
                        </Tooltip>
                    </div>
                </div>
                <div className="flex shrink grow basis-0 flex-col items-start justify-start self-stretch">
                    {activeTab === 'unscheduled' && (
                        <SequenceInfluencerTableUnscheduled
                            sequenceId={id}
                            items={data?.items || []}
                            page={page}
                            size={size}
                            totalPages={data?.totalPages || 1}
                            onPageChange={setPage}
                            setSelectedInfluencers={(d) => handleSelectedInfluencers(d)}
                            selectedInfluencers={selectedInfluencers}
                            handleReportClick={(influencer) => {
                                setSelectedSocialProfile(influencer.influencerSocialProfile);
                                setOpenReport(true);
                            }}
                        />
                    )}
                    {activeTab === 'scheduledAndSent' && (
                        <SequenceInfluencerTableScheduled
                            sequenceId={id}
                            items={data?.items || []}
                            page={page}
                            size={size}
                            totalPages={data?.totalPages || 1}
                            onPageChange={setPage}
                            handleReportClick={(influencer) => {
                                setSelectedSocialProfile(influencer.influencerSocialProfile);
                                setOpenReport(true);
                            }}
                        />
                    )}
                    {activeTab === 'ignored' && (
                        <SequenceInfluencerTableIgnored
                            sequenceId={id}
                            items={data?.items || []}
                            page={page}
                            size={size}
                            totalPages={data?.totalPages || 1}
                            onPageChange={setPage}
                        />
                    )}
                    {activeTab === 'replied' && (
                        <SequenceInfluencerTableReplied
                            sequenceId={id}
                            items={data?.items || []}
                            page={page}
                            size={size}
                            totalPages={data?.totalPages || 1}
                            onPageChange={setPage}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
