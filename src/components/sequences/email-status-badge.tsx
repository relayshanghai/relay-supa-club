import { useTranslation } from 'react-i18next';
import { Spinner } from '../icons';
import { EMAIL_STATUS_ICONS, EMAIL_STATUS_STYLES, type EmailStatus } from './constants';

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
