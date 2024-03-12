import type { FunnelStatusRequest } from 'pages/api/v2/threads/request';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'shadcn/components/ui/checkbox';
import { COLLAB_OPTIONS } from 'src/components/influencer/constants';

export default function ThreadListFilterFunnelStatus({
    status,
    onChange,
}: {
    status: FunnelStatusRequest[];
    onChange: (status: FunnelStatusRequest[]) => void;
}) {
    const { t } = useTranslation();

    const handleUpdateFunnelStatus = useCallback(
        (checkStatus: FunnelStatusRequest) => {
            if (!checkStatus) {
                onChange([]);
                return;
            }
            if (status.length === 0) {
                onChange([checkStatus]);
            } else {
                if (status.includes(checkStatus)) {
                    onChange(status.filter((s) => s !== checkStatus));
                } else {
                    onChange([...status, checkStatus]);
                }
            }
        },
        [status, onChange],
    );

    return (
        <div className="flex flex-col gap-3 overflow-y-auto">
            <p className="pb-2 text-xs font-medium text-gray-400">{t('inbox.filters.byCollabStatus')}</p>
            {Object.keys(COLLAB_OPTIONS).map((option, index) => (
                <div
                    key={option}
                    onClick={(e) => {
                        if ((e.target as HTMLInputElement).type !== 'checkbox') {
                            const checkbox = e.currentTarget.querySelector(
                                'input[type="checkbox"]',
                            ) as HTMLInputElement;
                            checkbox && checkbox.click();
                        }
                    }}
                >
                    <label
                        className={`flex items-center gap-2 py-2 ${index % 2 === 0 ? 'bg-gray-50' : ''} cursor-pointer`}
                    >
                        <Checkbox
                            className="border-gray-300"
                            checked={status.includes(option as FunnelStatusRequest)}
                            onCheckedChange={() => {
                                handleUpdateFunnelStatus(option as FunnelStatusRequest);
                            }}
                        />
                        <span
                            className={`${COLLAB_OPTIONS[option].style} flex items-center gap-2 rounded px-2 py-1 text-sm`}
                        >
                            {COLLAB_OPTIONS[option].icon}
                            {t(`manager.${option}`)}
                        </span>
                    </label>
                </div>
            ))}
        </div>
    );
};
