import { getAttachmentStyle } from 'pages/component-previews/inbox';
import { Tooltip } from 'src/components/library';
import type { AttachmentFile } from 'src/utils/outreach/types';

type AttachmentFileItemProps = {
    file: AttachmentFile;
    onRemove: (file: AttachmentFile) => void;
};

const AttachmentFileItem = ({ file, onRemove }: AttachmentFileItemProps) => {
    const truncatedText = (text: string, maxLength: number) => {
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };
    return (
        <Tooltip content={file.filename} position="top-right">
            <span
                className={`flex w-fit gap-2 whitespace-nowrap px-2 py-1 text-xs font-semibold ${getAttachmentStyle(
                    file.filename,
                )}`}
            >
                <span>{truncatedText(file.filename, 10)}</span>
                <span className="cursor-pointer text-xs" onClick={() => onRemove(file)}>
                    x
                </span>
            </span>
        </Tooltip>
    );
};

export default AttachmentFileItem;
