'use client';

import LightningIcon from 'app/components/icons/lightning';
import ToolsIcon from 'app/components/icons/tools';
import { useTranslation } from 'react-i18next';
import { useSequenceDetail } from 'src/hooks/v2/use-sequences';
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

export interface SequenceDetailPageProps {
    params: {
        id: string;
    };
}

export default function SequenceDetailPage({ params: { id } }: Readonly<SequenceDetailPageProps>) {
    const { loading, sequence, info, scheduleEmails } = useSequenceDetail(id);
    const [activeTab, setActiveTab] = useState('unscheduled');
    const { t } = useTranslation();
    const { bouncedRate, openRate, replyRate } = calculateSequenceInfo(info);
    const { page, setPage, size, data, setStatus, selectedInfluencers, setSelectedInfluencers } =
        useSequenceInfluencer(id);
    useEffect(() => {
        if (activeTab === 'unscheduled') {
            setStatus('Unscheduled');
        } else if (activeTab === 'scheduledAndSent') {
            setStatus('Scheduled');
        } else if (activeTab === 'replied') {
            setStatus('Replied');
        } else if (activeTab === 'ignored') {
            setStatus('ignored');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const handleSelectedInfluencers = (influencer: SequenceInfluencerEntity[]) => {
        setSelectedInfluencers(influencer);
    };

    const handleScheduleEmails = () => {
        scheduleEmails(selectedInfluencers)
            .then((res) => {
                toast(`${res?.data.length} emails scheduled!`);
            })
            .catch(() => {
                toast('Failed to schedule emails');
            });
    };

    return (
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
                    <button className="flex items-center justify-start gap-2 rounded-md bg-[#eef5ff] px-5 py-2">
                        <ToolsIcon fill="none" />
                        <div className="text-center font-['Poppins'] text-sm font-medium leading-normal tracking-tight text-[#2970ff]">
                            {t('campaigns.show.editCampaign')}
                        </div>
                    </button>
                    <button className="flex items-center justify-start gap-2 rounded-md border border-violet-600 bg-[#fefefe] px-5 py-2">
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
            <div className="h-[92px] w-full flex-col items-start justify-start gap-3">
                <div className="inline-flex w-[734.50px] items-start justify-start gap-2.5">
                    <div className="inline-flex flex-col items-start justify-start gap-2">
                        <div className="inline-flex h-10 w-60 items-center justify-start rounded-md border border-gray-300 bg-[#fefefe] shadow">
                            <div className="flex h-9 shrink grow basis-0 items-center justify-start gap-2 px-3 py-2">
                                <div className="relative h-4 w-4" />
                                <div className="shrink grow basis-0 font-['Poppins'] text-sm font-medium leading-tight tracking-tight text-gray-400">
                                    Search by name
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start justify-end gap-6">
                        <div className="flex flex-col items-start justify-start gap-2">
                            <div className="inline-flex h-10 items-center justify-start rounded-md border border-gray-200 bg-[#fefefe] shadow">
                                <div className="flex items-center justify-start gap-2 px-3 py-2">
                                    <div className="relative h-4 w-4" />
                                    <div className="font-['Poppins'] text-sm font-medium leading-tight tracking-tight text-gray-400">
                                        Filter by email availability
                                    </div>
                                    <div className="relative h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="inline-flex w-full items-end justify-between self-stretch">
                    <SequenceTabHeader
                        ignored={info.ignored}
                        replied={info.replied}
                        scheduledAndSent={info.sent}
                        unscheduled={info.unscheduled}
                        tabChanged={setActiveTab}
                    />
                    <div className="flex items-start justify-start gap-8">
                        <button className="flex items-center justify-center gap-1 rounded-md border border-red-500 bg-[rgb(254,254,254)] p-2.5">
                            <Trashcan className="relatives h-5 w-5" fill="red" />
                        </button>
                        <button
                            className="flex items-center justify-center gap-2 rounded-md bg-[#f43d86] py-2.5 pl-3.5 pr-3 text-[#fefefe] disabled:cursor-not-allowed disabled:bg-[#f43d86] disabled:opacity-50"
                            onClick={() => handleScheduleEmails()}
                            disabled={selectedInfluencers.length === 0}
                        >
                            <Send className="relative h-5 w-5" fill="white" />
                            <div className="text-center font-['Poppins'] text-sm font-medium leading-normal tracking-tight text-[#fefefe]">
                                Schedule outreach emails
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            {activeTab === 'unscheduled' && (
                <div className="flex shrink grow basis-0 flex-col items-start justify-start self-stretch">
                    <SequenceInfluencerTableUnscheduled
                        sequenceId={id}
                        items={data?.items || []}
                        page={page}
                        size={size}
                        totalPages={data?.totalPages || 1}
                        onPageChange={setPage}
                        setSelectedInfluencers={(d) => handleSelectedInfluencers(d)}
                        selectedInfluencers={selectedInfluencers}
                    />
                </div>
            )}
        </div>
    );
}
