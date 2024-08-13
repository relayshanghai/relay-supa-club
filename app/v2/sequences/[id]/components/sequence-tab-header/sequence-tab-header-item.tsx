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
    onClick
}: SequenceTabHeaderItemProps) {
    return <div className="rounded-md flex-col justify-center items-start inline-flex cursor-pointer" onClick={onClick}>
    <div className="px-4 py-2 justify-start items-center gap-2 inline-flex">
        <div className="justify-center items-center gap-2 flex">
            <div className={`${active && 'text-violet-600'} text-sm font-medium font-['Poppins'] leading-tight tracking-tight`}>{title}</div>
            {
                badge &&
                <div className="justify-start items-start flex">
                    <div className={`px-[3px] py-px  ${badgeClassName} rounded-[999px] justify-start items-center gap-px flex`}>
                        <div className="px-[2.50px] justify-start items-center gap-[7px] flex">
                        <div className={`text-[10px] font-medium font-['Inter'] leading-none tracking-tight`}>{badge}</div>
                        </div>
                    </div>
                </div>
            }
        </div>
    </div>
    {active && <div className="self-stretch h-0.5 bg-violet-600" /> }
</div>
}