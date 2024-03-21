import { ThreadStatusRequest } from 'pages/api/v2/threads/request';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'shadcn/components/ui/button';

const CounterStyles: {
    [key in ThreadStatusRequest]: string;
} = {
    unopened: 'bg-pink-100 text-pink-500',
    unreplied: 'bg-blue-100 text-blue-500',
    all: '',
};

type FilterStatusButtons = {
    label: string;
    status: ThreadStatusRequest;
    enabledCondition: (status?: ThreadStatusRequest) => boolean;
};

const buttons: FilterStatusButtons[] = [
    {
        label: 'Unread',
        status: ThreadStatusRequest.UNOPENED,
        enabledCondition: (status?: ThreadStatusRequest) => status === ThreadStatusRequest.UNOPENED,
    },
    {
        label: 'Unreplied',
        status: ThreadStatusRequest.UNREPLIED,
        enabledCondition: (status?: ThreadStatusRequest) => status === ThreadStatusRequest.UNREPLIED,
    },
    {
        label: 'All',
        status: ThreadStatusRequest.ALL, // No specific status for 'All'
        enabledCondition: (status?: ThreadStatusRequest) => !status,
    },
];

export default function ThreadListFilterStatus({
    status,
    onChange,
    messageCount,
}: {
    status: ThreadStatusRequest;
    onChange: (status: ThreadStatusRequest) => void;
    messageCount: {
        [key in ThreadStatusRequest]: number;
    };
}) {
    const { t } = useTranslation();

    const handleUpdateStatus = useCallback(
        (buttonStatus: ThreadStatusRequest) => {
            onChange(buttonStatus);
        },
        [onChange],
    );

    return (
        <div className="flex flex-col">
            <p className="pb-2 text-xs font-medium text-gray-400">{t('inbox.filters.byMessageStatus.title')}</p>
            {buttons.map((button, index) => (
                <Button
                    key={index}
                    onClick={() => handleUpdateStatus(button.status)}
                    className={`w-full cursor-pointer justify-between hover:bg-primary-50 ${
                        button.enabledCondition(status)
                            ? 'bg-primary-100 text-primary-600 hover:bg-primary-100'
                            : index % 2 === 0 && 'bg-gray-50'
                    }`}
                    variant="destructive"
                >
                    <span>{t(`inbox.filters.byMessageStatus.${button.label}`)}</span>
                    {button.status && (
                        <div className={`aspect-square h-5 w-5 rounded-full ${CounterStyles[button.status]}`}>
                            {messageCount[button.status]}
                        </div>
                    )}
                </Button>
            ))}
        </div>
    );
}
