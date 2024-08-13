'use-client';
export interface SummaryCardProps {
    tracking: string;
    title: React.ReactNode;
    icon?: React.ReactNode;
    badge?: string;
    loading?: boolean;
}

export default function SummaryCard({ tracking, title, loading, icon, badge }: SummaryCardProps) {
    return (
        <div
            className={`inline-flex h-[113px] w-[312px] items-start justify-start gap-4 rounded-xl border border-gray-200 bg-[#fefefe] p-5 ${
                loading && 'animate-pulse'
            }`}
        >
            {icon && (
                <div className="flex items-start justify-start gap-2.5 rounded-3xl bg-violet-100 p-3">
                    <div className="relative h-6 w-6">{icon}</div>
                </div>
            )}
            <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                <div className="inline-flex items-start justify-start gap-0.5 self-stretch">
                    <div className="font-['Poppins'] text-base font-medium tracking-tight text-gray-700">{title}</div>
                    <div className="relative h-3 w-3" />
                </div>
                <div className="inline-flex items-start justify-start gap-1 self-stretch">
                    <div className="font-['Poppins'] text-3xl font-medium tracking-tight text-violet-600">
                        {tracking}
                    </div>
                    {badge && (
                        <div className="flex items-start justify-start gap-1 rounded bg-green-50 px-2 py-1">
                            <div className="relative h-3.5 w-3.5" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
