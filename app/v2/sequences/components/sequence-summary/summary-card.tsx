'use-client'
export interface SummaryCardProps {
    tracking: string;
    title: React.ReactNode;
    icon?: React.ReactNode;
    badge?: string;
    loading?: boolean;
}

export default function SummaryCard({
    tracking,
    title,
    loading,
    icon,
    badge
}: SummaryCardProps) {
    return <div className={`w-[312px] h-[113px] p-5 bg-[#fefefe] rounded-xl border border-gray-200 justify-start items-start gap-4 inline-flex ${loading && 'animate-pulse'}`}>
    {
      icon && <div className="p-3 bg-violet-100 rounded-3xl justify-start items-start gap-2.5 flex">
        <div className="w-6 h-6 relative" >
          {icon}
        </div>
      </div>
    }
    <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
      <div className="self-stretch justify-start items-start gap-0.5 inline-flex">
        <div className="text-gray-700 text-base font-medium font-['Poppins'] tracking-tight">{title}</div>
        <div className="w-3 h-3 relative" />
      </div>
      <div className="self-stretch justify-start items-start gap-1 inline-flex">
        <div className="text-violet-600 text-3xl font-medium font-['Poppins'] tracking-tight">{tracking}</div>
        {
          badge &&
          <div className="px-2 py-1 bg-green-50 rounded justify-start items-start gap-1 flex">
            <div className="w-3.5 h-3.5 relative" />
          </div>
        }
      </div>
    </div>
  </div>
}