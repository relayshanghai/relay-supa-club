import { getAttachmentStyle } from 'pages/component-previews/inbox';
import { Tooltip } from 'src/components/library';
import { truncatedText } from 'src/utils/outreach/helpers';

type AttachmentFileItemProps = {
    file: string;
    onRemove: (file: string) => void;
};

export default function ThreadReplyAttachmentFileItem ({ file, onRemove }: AttachmentFileItemProps) {
    return (
        <Tooltip content={file} position="top-right">
            <span
                className={`flex w-fit gap-2 whitespace-nowrap px-2 py-1 text-xs font-semibold ${getAttachmentStyle(
                    file,
                )}`}
            >
                <span>{truncatedText(file, 10)}</span>
                <span className="cursor-pointer text-xs" onClick={() => onRemove(file)}>
                    x
                </span>
            </span>
        </Tooltip>
    );
};

