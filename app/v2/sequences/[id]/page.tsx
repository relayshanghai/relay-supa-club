'use client'

import LightningIcon from "app/components/icons/lightning"
import ToolsIcon from "app/components/icons/tools"
import { useTranslation } from "react-i18next"
import { useSequenceDetail } from "src/hooks/v2/use-sequences"
import SummaryCard from "../components/sequence-summary/summary-card"
import { EmailOpenOutline, MessageDotsCircleOutline, MessageXCircleOutline, Send, TeamOutline, Trashcan } from "src/components/icons"
import { calculateSequenceInfo } from "app/utils/rate-info"
import SequenceTabHeader from "./components/sequence-tab-header/sequence-tab-header"
import { useEffect, useState } from "react"
import SequenceInfluencerTableUnscheduled from "./components/sequence-infuencer-table/sequence-influencer-table-unscheduled"
import { useSequenceInfluencer } from "src/hooks/v2/use-sequence-influencer"

export interface SequenceDetailPageProps {
    params: {
        id: string
    }
}

export default function SequenceDetailPage( { params: { id } }: Readonly<SequenceDetailPageProps>) {
    const {
        loading,
        sequence,
        info
    } = useSequenceDetail(id)
    const [activeTab, setActiveTab] = useState('unscheduled')
    const { t } = useTranslation()
    const {
        bouncedRate,
        openRate,
        replyRate
    } = calculateSequenceInfo(info)
    const {
        page,
        setPage,
        size,
        data,
        setStatus,
    } = useSequenceInfluencer(id)
    useEffect(() => {
        if(activeTab === 'unscheduled') {
            setStatus('Unscheduled')
        } else if(activeTab === 'scheduledAndSent') {
            setStatus('Scheduled')
        } else if(activeTab === 'replied') {
            setStatus('Replied')
        } else if(activeTab === 'ignored') {
            setStatus('ignored')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab])
    return <div className="px-8 pt-8 pb-4 flex-col justify-start items-start gap-8 inline-flex w-full">
        <div className="h-[45px] justify-start items-start gap-6 inline-flex w-full">
            <div className="grow shrink basis-0 h-[45px] justify-start items-center gap-6 flex">
                <div className="justify-start items-center gap-1 flex">
                <div className="text-gray-600 text-3xl font-semibold font-['Poppins'] tracking-tight">{sequence?.name}</div>
                </div>
                <div className="justify-start items-start flex">
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
                <div className="w-3 h-3 relative" />
                </div>
            </div>
            <div className="justify-end items-start gap-6 flex">
                <button className="px-5 py-2 bg-[#eef5ff] rounded-md justify-start items-center gap-2 flex">
                    <ToolsIcon fill="none"/>
                    <button className="text-center text-[#2970ff] text-sm font-medium font-['Poppins'] leading-normal tracking-tight">{t('campaigns.show.editCampaign')}</button>
                </button>
                <button className="px-5 py-2 bg-[#fefefe] rounded-md border border-violet-600 justify-start items-center gap-2 flex">
                    <LightningIcon fill="none" />
                    <div className="text-center text-violet-600 text-sm font-medium font-['Poppins'] leading-normal tracking-tight">{t('sequences.updateVariables')}</div>
                </button>
            </div>
        </div>
        <div className="self-stretch justify-start items-start gap-6 inline-flex">
            <SummaryCard icon={<TeamOutline className="text-violet-600" fill="none"/>} loading={loading} tracking={info.total.toFixed() } title={t('sequences.totalInfluencers')} />
            <SummaryCard icon={<EmailOpenOutline  className="text-violet-600" fill="none" />} loading={loading} tracking={openRate.toFixed(2) + '%'} title={t('sequences.openRate')} />
            <SummaryCard icon={<MessageDotsCircleOutline  className="text-violet-600" fill="none" />} loading={loading} tracking={replyRate.toFixed(2) + '%'} title={t('sequences.replyRate')} />
            <SummaryCard icon={<MessageXCircleOutline  className="text-violet-600" fill="none"  />} loading={loading} tracking={bouncedRate.toFixed(2) + '%'} title={t('sequences.bounceRate')} />
        </div>
        <div className="h-[92px] flex-col justify-start items-start gap-3 w-full">
            <div className="w-[734.50px] justify-start items-start gap-2.5 inline-flex">
                <div className="flex-col justify-start items-start gap-2 inline-flex">
                    <div className="w-60 h-10 bg-[#fefefe] rounded-md shadow border border-gray-300 justify-start items-center inline-flex">
                        <div className="grow shrink basis-0 h-9 px-3 py-2 justify-start items-center gap-2 flex">
                        <div className="w-4 h-4 relative" />
                        <div className="grow shrink basis-0 text-gray-400 text-sm font-medium font-['Poppins'] leading-tight tracking-tight">Search by name</div>
                        </div>
                    </div>
                </div>
                <div className="justify-end items-start gap-6 flex">
                <div className="flex-col justify-start items-start gap-2 flex">
                    <div className="h-10 bg-[#fefefe] rounded-md shadow border border-gray-200 justify-start items-center inline-flex">
                    <div className="px-3 py-2 justify-start items-center gap-2 flex">
                        <div className="w-4 h-4 relative" />
                        <div className="text-gray-400 text-sm font-medium font-['Poppins'] leading-tight tracking-tight">Filter by email availability</div>
                        <div className="w-4 h-4 relative" />
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div className="self-stretch justify-between items-end inline-flex w-full">
                <SequenceTabHeader
                    ignored={info.ignored}
                    replied={info.replied}
                    scheduledAndSent={info.sent}
                    unscheduled={info.unscheduled}
                    tabChanged={setActiveTab} />
                <div className="justify-start items-start gap-8 flex">
                <button className="p-2.5 bg-[rgb(254,254,254)] rounded-md border border-red-500 justify-center items-center gap-1 flex">
                    <Trashcan className="w-5 h-5 relatives" fill='red'/>
                </button>
                <button className="pl-3.5 pr-3 text-[#fefefe] py-2.5 bg-[#f43d86] rounded-md justify-center items-center gap-2 flex">
                    <Send className="w-5 h-5 relative" fill="white"/>
                    <div className="text-center text-[#fefefe] text-sm font-medium font-['Poppins'] leading-normal tracking-tight">Schedule outreach emails</div>
                </button>
                </div>
            </div>
        </div>
        {
            activeTab === 'unscheduled' &&
                <div className="self-stretch grow shrink basis-0 flex-col justify-start items-start flex">
                <SequenceInfluencerTableUnscheduled
                    sequenceId={id}
                    items={data?.items || []}
                    page={page}
                    size={size}
                    totalPages={data?.totalPages || 1}
                    onPageChange={setPage}
                />
                </div>
        }
    </div>
}
