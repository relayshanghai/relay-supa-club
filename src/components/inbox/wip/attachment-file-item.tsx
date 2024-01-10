import type { AttachmentFile } from 'src/utils/outreach/types';

type AttachmentFileItemProps = {
    file: AttachmentFile;
    onRemove: (file: AttachmentFile) => void;
};

const AttachmentFileItem = ({ file, onRemove }: AttachmentFileItemProps) => {
    return (
        <>
            <span>{file.filename}</span>
            <button onClick={() => onRemove(file)}>Remove</button>
        </>
    );
};

export default AttachmentFileItem;
