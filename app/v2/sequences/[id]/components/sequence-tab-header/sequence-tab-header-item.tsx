export interface SequenceTabHeaderItemProps {
    active?: boolean;
    title: string;
    badgeClassName?: string;
    badge?: string;
    onClick: () => void;
}

export default function SequenceTabHeaderItem({
    title,
    active,
    badge,
    badgeClassName,
    onClick,
}: SequenceTabHeaderItemProps) {
    return (
        <div className="inline-flex cursor-pointer flex-col items-start justify-center rounded-md" onClick={onClick}>
            <div className="inline-flex items-center justify-start gap-2 px-4 py-2">
                <div className="flex items-center justify-center gap-2">
                    <div
                        className={`${
                            active && 'text-violet-600'
                        } font-['Poppins'] text-sm font-medium leading-tight tracking-tight`}
                    >
                        {title}
                    </div>
                    {badge && (
                        <div className="flex items-start justify-start">
                            <div
                                className={`px-[3px] py-px  ${badgeClassName} flex items-center justify-start gap-px rounded-[999px]`}
                            >
                                <div className="flex items-center justify-start gap-[7px] px-[2.50px]">
                                    <div
                                        className={`font-['Inter'] text-[10px] font-medium leading-none tracking-tight`}
                                    >
                                        {badge}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {active && <div className="h-0.5 self-stretch bg-violet-600" />}
        </div>
    );
}