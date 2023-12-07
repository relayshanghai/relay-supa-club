import { useTranslation } from 'react-i18next';
import {
    Spinner,
    CalendarCheck,
    CalendarSearch,
    ChatBubbleText,
    Drag,
    EmailCheck,
    EmailOpenOutline,
    ReturnArrowX,
    Send,
    SendX,
} from '../icons';
import { EMAIL_STATUS_STYLES, type EmailStatus } from './constants';

export const EMAIL_STATUS_ICONS: {
    [key in EmailStatus]: JSX.Element;
} = {
    Unscheduled: <CalendarSearch className="h-4 w-4 stroke-yellow-500" />,
    Scheduled: <CalendarCheck className="h-4 w-4 stroke-primary-500" />,
    Delivered: <EmailCheck className="h-4 w-4 stroke-blue-500" />,
    Opened: <EmailOpenOutline className="h-4 w-4 stroke-pink-500" />,
    'Link Clicked': <Drag className="h-4 w-4 stroke-cyan-500" />,
    Bounced: <ReturnArrowX className="h-4 w-4 stroke-red-500" />,
    Failed: <SendX className="h-4 w-4 stroke-orange-500" />,
    Replied: <ChatBubbleText className="h-4 w-4 stroke-green-500" />,
    Ignored: <Send className="h-4 w-4 stroke-gray-500" />,
};

export const EmailStatusBadge = ({ loading, status }: { loading: boolean; status: EmailStatus }) => {
    const { t } = useTranslation();
    return loading ? (
        <Spinner className="h-5 w-5 fill-primary-600 text-white" />
    ) : (
        <span
            className={`flex w-fit flex-row items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm ${EMAIL_STATUS_STYLES[status].style}`}
        >
            {EMAIL_STATUS_ICONS[status]}
            {t(`sequences.status.${status}`)}
        </span>
    );
};
