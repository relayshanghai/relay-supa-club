import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import type { EmailAttachment } from 'src/backend/database/thread/email-entity';
import { Download } from 'src/components/icons';
import { Tooltip } from 'src/components/library';
import { clientLogger } from 'src/utils/logger-client';
import { truncatedText } from 'src/utils/outreach/helpers';

const fileExtensionRegex = /.[^.\\/]*$/;
export const getAttachmentStyle = (filename: string) => {
    const extension = filename?.match(fileExtensionRegex)?.[0].replace('.', '');
    switch (extension) {
        case 'pdf':
            return 'bg-red-100 hover:bg-red-50 text-red-400 stroke-red-400';
        case 'xls' || 'xlsx' || 'csv':
            return 'bg-green-100 hover:bg-green-50 text-green-400 stroke-green-400';
        case 'doc' || 'docx':
            return 'bg-blue-100 hover:bg-blue-50 text-blue-400 stroke-blue-400';
        case 'ppt' || 'pptx':
            return 'bg-yellow-100 hover:bg-yellow-50 text-yellow-400 stroke-yellow-400';
        case 'png' || 'jpeg' || 'jpg' || 'svg' || 'webp':
            return 'bg-violet-100 hover:bg-violet-50 text-violet-400 stroke-violet-400';
        default:
            return 'bg-gray-100 hover:bg-gray-50 text-gray-400 stroke-gray-400';
    }
};
export default function ThreadMessageListItemAttachment({ attachment }: { attachment: EmailAttachment }) {
    const { t } = useTranslation();

    const handleDownloadAttachment = useCallback(async () => {
        if (!attachment.id) return;
        const baseUrl = '/api/outreach/attachments';
        const downloadParams = new URLSearchParams({
            id: attachment.id,
            filename: attachment.filename,
        });

        const downloadFile = fetch(`${baseUrl}?${new URLSearchParams(downloadParams)}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = attachment.filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                return true;
            })
            .catch((error: any) => {
                clientLogger('Attachment download failed', error.message);
                return false;
            });

        toast.promise(downloadFile, {
            loading: t('inbox.attachments.loading'),
            success: t('inbox.attachments.success'),
            error: t('inbox.attachments.error'),
        });
    }, [attachment, t]);

    return (
        <Tooltip position="right" content={attachment.filename}>
            <button
                type="button"
                className={`flex cursor-pointer gap-2 rounded font-semibold ${getAttachmentStyle(
                    attachment.filename,
                )} px-2 py-1 text-xs`}
                onClick={handleDownloadAttachment}
            >
                <Download className="h-4 w-4" />
                {truncatedText(attachment.filename, 10)}
            </button>
        </Tooltip>
    );
}
