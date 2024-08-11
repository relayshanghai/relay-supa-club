'use client'
import { useTranslation } from "react-i18next";
import SummaryCard from "./components/summary-card/summary-card";
import { useSequences } from "src/hooks/v2/use-sequences";
import { useEffect } from "react";
import SequenceTable from "./components/sequence-table/sequence-table";
import { EmailOpenOutline, MessageDotsCircleOutline, MessageXCircleOutline, TeamOutline } from "src/components/icons";

export default function SequencePageV2() {
    const { t } = useTranslation();
    const { getAllSequences, loading, rateInfo, sequences, page, size, totalPages, setPage } = useSequences();
    const total = rateInfo.total;
    const bouncedRate = (rateInfo.bounced / rateInfo.sent || 0) * 100;
    const openRate = (rateInfo.open / rateInfo.sent || 0) * 100;
    const replyRate = (rateInfo.replied / (rateInfo.open) || 0) * 100;

    useEffect(() => {
        if (sequences.length === 0) {
            getAllSequences();
        }
    }, []);

    return <div className="px-8 pt-8 pb-4 flex-col justify-start items-start gap-8 inline-flex w-full">
    <div className="self-stretch grow shrink basis-0 flex-col justify-start items-start gap-8 flex">
      <div className="self-stretch flex-col justify-start items-start gap-8 flex">
        <div className="self-stretch flex-col justify-start items-start gap-3 flex">
          <div className="self-stretch flex-col justify-start items-start gap-2 flex">
            <div className="self-stretch justify-between items-center inline-flex">
              <div className="justify-start items-start flex">
                <div className="justify-start items-center gap-1 flex">
                  <div className="text-gray-600 text-3xl font-semibold font-['Poppins'] tracking-tight">{t('campaigns.index.title')}</div>
                </div>
                <div className="w-3 h-3 relative" />
              </div>
              <div className="px-5 py-2 bg-[#fefefe] rounded-md border border-violet-600 justify-start items-center gap-1 flex">
                <div className="w-5 h-5 relative" />
                <div className="text-center text-violet-600 text-sm font-medium font-['Poppins'] leading-normal tracking-tight">Template Library</div>
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch justify-start items-start gap-6 inline-flex">
          <SummaryCard icon={<TeamOutline />} loading={loading} tracking={total.toFixed() } title={t('sequences.totalInfluencers')} />
          <SummaryCard icon={<EmailOpenOutline />} loading={loading} tracking={openRate.toFixed(2) + '%'} title={t('sequences.openRate')} />
          <SummaryCard icon={<MessageDotsCircleOutline />} loading={loading} tracking={replyRate.toFixed(2) + '%'} title={t('sequences.replyRate')} />
          <SummaryCard icon={<MessageXCircleOutline />} loading={loading} tracking={bouncedRate.toFixed(2) + '%'} title={t('sequences.bounceRate')} />
        </div>
      </div>
      <div className="self-stretch grow shrink basis-0 flex-col justify-start items-start flex">
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
  </div>;
}
