/* eslint-disable react-hooks/exhaustive-deps */
import { useState, type FC } from 'react';
import { BoostbotSelected, DotsHorizontal } from 'src/components/icons';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuTrigger,
} from 'shadcn/components/ui/dropdown-menu';
import { useTranslation } from 'react-i18next';

type SequenceStepItemProps = {
    title: string;
    description: string;
    onDelete: () => void;
};

export const SequenceStepItem: FC<SequenceStepItemProps> = ({ title, description, onDelete }) => {
    const { t } = useTranslation();
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    return (
        <div className="inline-flex h-[88px] w-[440px] items-start justify-start gap-1 rounded-xl border-2 border-gray-200 bg-white py-4 pl-4 pr-3">
            <div className="relative flex h-[52px] shrink grow basis-0 items-start justify-start gap-4">
                <div className="absolute right-1 top-1">
                    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                        <DropdownMenuTrigger role="button" data-testid="dropdown-dots">
                            <DotsHorizontal className="h-4 w-4 rotate-90 stroke-gray-300" />
                        </DropdownMenuTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuContent className="text-sm" align="end">
                                <DropdownMenuItem
                                    onSelect={() => {
                                        onDelete();
                                    }}
                                    className="flex text-sm"
                                    data-testid="delete-button"
                                >
                                    {t('outreaches.remove')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenuPortal>
                    </DropdownMenu>
                </div>
                <div className="inline-flex flex-col items-center justify-center gap-2.5 rounded-[28px] border-4 border-violet-50 bg-violet-100 p-2 mix-blend-multiply">
                    <BoostbotSelected className="h-4 w-4" strokeWidth={2} />
                </div>
                <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-2">
                    <div className="inline-flex items-start justify-start gap-1.5">
                        <div className="font-['Poppins'] text-sm font-medium leading-normal tracking-tight text-gray-700">
                            {title}
                        </div>
                    </div>
                    <div className="self-stretch font-['Poppins'] text-xs font-normal leading-tight tracking-tight text-gray-400">
                        {description?.substring(0, 100)} {description?.length > 100 && '...'}
                    </div>
                </div>
            </div>
        </div>
    );
};
